"use client";

import { useEffect, useRef, useState } from "react";
import { LinkedListNode, NodeAnimationState } from "@/app/simulator/components/linked-list/types";
import { createNode, createNodes } from "@/app/simulator/components/linked-list/utils";
import ChallengeInstructions from "@/app/simulator/components/ChallengeInstructions";
import ChallengeCompletedModal from "@/app/simulator/components/ChallengeCompletedModal";
import CodeEditorPanel from "@/app/simulator/components/CodeEditorPanel";
import VisualArrayContainer from "@/app/simulator/components/VisualArrayContainer";
import VisualLinkedList from "@/app/simulator/components/linked-list/VisualLinkedList";
import { useAuth } from "@clerk/nextjs";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { syncSimulatorProgress } from "../../../lib/simulatorProgress";
import { fetchSimulatorChallenge, SimulatorChallengeDTO } from "@/app/lib/simulators";
import { ChallengeConfig, createChallengeRunner, DEFAULT_RUNNER_PARAMETER_NAMES } from "../challenges/runner";
import SimulatorError from "../../components/SimulatorError";

type ChallengeResultSummary = {
    name: string;
    input: string;
    expected: string;
    actual: string;
    passed: boolean | null;
    statusText: string;
};

type LinkedListNodeHandle = {
    id: string;
    getValue: () => string | number | undefined;
    setValue: (value: string | number) => Promise<void>;
    getNext: () => LinkedListNodeHandle | null;
    setNext: (next: LinkedListNodeHandle | null) => LinkedListNodeHandle;
};

type ListData = {
    nodes: LinkedListNode[];
    head: string | null;
    tail: string | null;
};

export default function SimulationLinkedListChallenge() {
    const params = useParams<{ challengeId: string }>();
    const challengeId = params?.challengeId;
    const [challenge, setChallenge] = useState<SimulatorChallengeDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!challengeId) return;
        
        setLoading(true);
        fetchSimulatorChallenge("linked-list", challengeId)
            .then(setChallenge)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [challengeId]);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-medium text-slate-500">Loading challenge...</p>
                </div>
            </div>
        );
    }

    if (error || !challenge) {
        return (
            <SimulatorError 
                title={error ? "Failed to Load Challenge" : "Challenge Not Found"}
                message={error || "The requested challenge could not be found."}
                onRetry={() => window.location.reload()}
            />
        );
    }

    // Map DTO to ChallengeConfig format expected by core component
    const config: ChallengeConfig = {
        id: challenge.id,
        title: challenge.title,
        description: challenge.description,
        initialEditorCode: challenge.initial_code,
        programStructure: challenge.program_structure,
        testCases: challenge.test_cases,
        maxCapacity: challenge.capacity,
    };

    return <SimulationLinkedListCore challenge={config} challengeId={challengeId} nextChallengeSlug={challenge.next_challenge_slug} />;
}

function SimulationLinkedListCore({ challenge, challengeId, nextChallengeSlug }: { challenge: ChallengeConfig, challengeId: string, nextChallengeSlug?: string }) {
    const router = useRouter();
    const { isLoaded, isSignedIn, userId, getToken } = useAuth();
    const searchParams = useSearchParams();
    const nextPath = searchParams.get("next");
    
    const inferredNextPath = nextChallengeSlug 
        ? `/simulator/linked-list/${nextChallengeSlug}`
        : "/simulator";

    const runnerParameterNames = challenge.programStructure?.parameterNames
        ?? challenge.runnerParameterNames
        ?? DEFAULT_RUNNER_PARAMETER_NAMES;

    const initialInputs = challenge.testCases[0]?.inputs
        ?? { list: challenge.testCases[0]?.input ?? [] };

    const initialEditorCode = challenge.initialEditorCode;

    const syncChallengeResult = async (passed: boolean) => {
        try {
            await syncSimulatorProgress({
                category: "linked-list",
                path: `/simulator/linked-list/${challengeId}`,
                isCompleted: passed,
                isLoaded,
                isSignedIn,
                userId,
                getToken,
            });
        } catch (error) {
            console.error("Failed to sync simulator progress", error);
        }
    };

    const handleChallengeCompleted = () => {
        void syncChallengeResult(true);
    };

    const [lists, setLists] = useState<Record<string, ListData>>({});
    const [editorCode, setEditorCode] = useState<string>(initialEditorCode);
    const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
    const [resultSummaries, setResultSummaries] = useState<ChallengeResultSummary[] | null>(null);
    const [isCompleted, setIsCompleted] = useState<boolean>(false);
    const [isChallengeCompletedModalOpen, setIsChallengeCompletedModalOpen] = useState<boolean>(false);
    const [showNextAction, setShowNextAction] = useState<boolean>(false);
    const [leftPaneWidth, setLeftPaneWidth] = useState<number>(50);
    const [isResizing, setIsResizing] = useState<boolean>(false);

    const workspaceRef = useRef<HTMLDivElement | null>(null);
    const listsRef = useRef<Record<string, ListData>>({});
    const nodeActionQueueRef = useRef(Promise.resolve());
    const consoleWriteQueueRef = useRef(Promise.resolve());
    const nextPointerShadowRef = useRef<Map<string, string | null>>(new Map());
    const valueShadowRef = useRef<Map<string, string | number>>(new Map());
    const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

    const cloneNodes = (list: LinkedListNode[]) => list.map((node) => ({ ...node }));

    const recomputeEndpoints = (list: LinkedListNode[]) => {
        if (list.length === 0) {
            return { nextHead: null, nextTail: null };
        }

        const referenced = new Set<string>();
        for (const node of list) {
            if (node.next) {
                referenced.add(node.next);
            }
        }

        const nextHead = list.find((node) => !referenced.has(node.id))?.id ?? list[0].id;

        let nextTail: string | null = null;
        let currentId: string | null = nextHead;
        const visited = new Set<string>();

        while (currentId && !visited.has(currentId)) {
            visited.add(currentId);
            const current = list.find((node) => node.id === currentId);
            if (!current) break;

            nextTail = current.id;
            currentId = current.next;
        }

        return { nextHead, nextTail };
    };

    const commitLists = (nextLists: Record<string, ListData>) => {
        listsRef.current = nextLists;
        setLists(nextLists);
    };

    const commitList = (listName: string, nextNodes: LinkedListNode[], forceHead?: string | null, forceTail?: string | null) => {
        const cloned = cloneNodes(nextNodes);
        let nextHead = forceHead;
        let nextTail = forceTail;

        if (nextHead === undefined || nextTail === undefined) {
            const endpoints = recomputeEndpoints(cloned);
            if (nextHead === undefined) nextHead = endpoints.nextHead;
            if (nextTail === undefined) nextTail = endpoints.nextTail;
        }

        const newListData: ListData = {
            nodes: cloned,
            head: nextHead ?? null,
            tail: nextTail ?? null,
        };

        commitLists({ ...listsRef.current, [listName]: newListData });
    };

    const enqueueNodeAction = <T,>(action: () => Promise<T>): Promise<T> => {
        const next = nodeActionQueueRef.current.then(action, action);
        nodeActionQueueRef.current = next.then(() => undefined, () => undefined);
        return next;
    };

    const updateNodeAnimationState = (listName: string, nodeId: string, animationState: NodeAnimationState) => {
        const currentData = listsRef.current[listName];
        if (!currentData) return;

        const nextNodes = cloneNodes(currentData.nodes);
        const target = nextNodes.find((node) => node.id === nodeId);
        if (!target) return;

        target.animationState = animationState;
        commitList(listName, nextNodes, currentData.head, currentData.tail);
    };

    const writeToConsole = (message: unknown) => {
        const nextWrite = consoleWriteQueueRef.current.then(async () => {
            const resolvedMessage = await Promise.resolve(message);
            const nextLine =
                typeof resolvedMessage === "string"
                    ? resolvedMessage
                    : resolvedMessage instanceof Error
                        ? resolvedMessage.message
                        : String(resolvedMessage);
            setConsoleOutput((prev) => [...prev, nextLine]);
        });

        consoleWriteQueueRef.current = nextWrite.then(() => undefined, () => undefined);
        return nextWrite;
    };

    const createNodeHandle = (listName: string, nodeId: string | null): LinkedListNodeHandle | null => {
        if (!nodeId) return null;

        const self: LinkedListNodeHandle = {
            id: nodeId,
            getValue: () => {
                const shadowValue = valueShadowRef.current.get(nodeId);
                const currentData = listsRef.current[listName];
                const currentValue = shadowValue !== undefined
                    ? shadowValue
                    : currentData?.nodes.find((node) => node.id === nodeId)?.value;

                enqueueNodeAction(async () => {
                    updateNodeAnimationState(listName, nodeId, NodeAnimationState.HighlightedGreen);
                    await new Promise((resolve) => setTimeout(resolve, 220));
                    updateNodeAnimationState(listName, nodeId, NodeAnimationState.Default);
                });

                return currentValue;
            },
            setValue: (value) => {
                valueShadowRef.current.set(nodeId, value);

                return enqueueNodeAction(async () => {
                    const currentData = listsRef.current[listName];
                    if (!currentData) return;

                    const nextNodes = cloneNodes(currentData.nodes);
                    const target = nextNodes.find((node) => node.id === nodeId);
                    if (!target) return;

                    updateNodeAnimationState(listName, nodeId, NodeAnimationState.HighlightedOrange);
                    await sleep(180);

                    target.value = value;
                    commitList(listName, nextNodes, currentData.head, currentData.tail);

                    const shadowValue = valueShadowRef.current.get(nodeId);
                    if (shadowValue === value) {
                        valueShadowRef.current.delete(nodeId);
                    }

                    await sleep(120);

                    updateNodeAnimationState(listName, nodeId, NodeAnimationState.Default);
                });
            },
            getNext: () => {
                const shadowNext = nextPointerShadowRef.current.get(nodeId);
                const currentData = listsRef.current[listName];
                const resolvedNextId = shadowNext !== undefined
                    ? shadowNext
                    : (currentData?.nodes.find((node) => node.id === nodeId)?.next ?? null);

                // We assume pointers stay within the same list for simplicity
                const nextHandle = createNodeHandle(listName, resolvedNextId);

                enqueueNodeAction(async () => {
                    updateNodeAnimationState(listName, nodeId, NodeAnimationState.Traversing);
                    await sleep(180);
                    updateNodeAnimationState(listName, nodeId, NodeAnimationState.Default);
                });

                return nextHandle;
            },
            setNext: (next) => {
                const nextId = next ? next.id : null;
                nextPointerShadowRef.current.set(nodeId, nextId);

                void enqueueNodeAction(async () => {
                    const currentData = listsRef.current[listName];
                    if (!currentData) return;

                    const nextNodes = cloneNodes(currentData.nodes);
                    const target = nextNodes.find((node) => node.id === nodeId);
                    if (!target) return;

                    target.animationState = NodeAnimationState.HighlightedOrange;
                    commitList(listName, nextNodes, currentData.head, currentData.tail);
                    await sleep(140);

                    target.next = nextId;
                    commitList(listName, nextNodes, currentData.head, currentData.tail);

                    const shadowNext = nextPointerShadowRef.current.get(nodeId);
                    if (shadowNext === nextId) {
                        nextPointerShadowRef.current.delete(nodeId);
                    }

                    await sleep(100);

                    target.animationState = NodeAnimationState.Default;
                    commitList(listName, nextNodes, currentData.head, currentData.tail);
                });

                return self;
            },
        };

        return self;
    };

    const createChallengeApi = (listName: string) => ({
        getHead: () => {
            const currentData = listsRef.current[listName];
            const handle = createNodeHandle(listName, currentData?.head ?? null);
            if (!handle) return null;

            enqueueNodeAction(async () => {
                updateNodeAnimationState(listName, handle.id, NodeAnimationState.HighlightedGreen);
                await sleep(180);
                updateNodeAnimationState(listName, handle.id, NodeAnimationState.Default);
            });

            return handle;
        },
        setHead: (nextHead: LinkedListNodeHandle | null) => {
            return enqueueNodeAction(async () => {
                const currentData = listsRef.current[listName];
                if (!currentData) return;

                const nextNodes = cloneNodes(currentData.nodes);
                const nextHeadId = nextHead?.id ?? null;

                if (nextHeadId) {
                    const target = nextNodes.find((node) => node.id === nextHeadId);
                    if (target) {
                        target.animationState = NodeAnimationState.HighlightedOrange;
                        commitList(listName, nextNodes, currentData.head, currentData.tail);
                        await sleep(140);
                    }
                }

                if (nextHeadId) {
                    // Recompute tail based on the new head
                    let nextTailId: string | null = null;
                    let currentId: string | null = nextHeadId;
                    const visited = new Set<string>();

                    while (currentId && !visited.has(currentId)) {
                        visited.add(currentId);
                        const current = nextNodes.find((node) => node.id === currentId);
                        if (!current) break;

                        nextTailId = current.id;
                        currentId = current.next;
                    }

                    commitList(listName, nextNodes, nextHeadId, nextTailId);

                    const target = nextNodes.find((node) => node.id === nextHeadId);
                    if (target) {
                        target.animationState = NodeAnimationState.Default;
                        commitList(listName, nextNodes, nextHeadId, nextTailId);
                    }
                } else {
                    commitList(listName, nextNodes, null, null);
                }
            });
        },
        getTail: () => {
            const currentData = listsRef.current[listName];
            const handle = createNodeHandle(listName, currentData?.tail ?? null);
            if (!handle) return null;

            enqueueNodeAction(async () => {
                updateNodeAnimationState(listName, handle.id, NodeAnimationState.HighlightedGreen);
                await sleep(180);
                updateNodeAnimationState(listName, handle.id, NodeAnimationState.Default);
            });

            return handle;
        },
        setTail: (nextTail: LinkedListNodeHandle | null) => {
            return enqueueNodeAction(async () => {
                const currentData = listsRef.current[listName];
                if (!currentData) return;

                const nextNodes = cloneNodes(currentData.nodes);
                const nextTailId = nextTail?.id ?? null;

                if (nextTailId) {
                    const target = nextNodes.find((node) => node.id === nextTailId);
                    if (target) {
                        target.animationState = NodeAnimationState.HighlightedOrange;
                        commitList(listName, nextNodes, currentData.head, currentData.tail);
                        await sleep(140);
                    }
                }

                commitList(listName, nextNodes, currentData.head, nextTailId);

                if (nextTailId) {
                    const target = nextNodes.find((node) => node.id === nextTailId);
                    if (target) {
                        target.animationState = NodeAnimationState.Default;
                        commitList(listName, nextNodes, currentData.head, nextTailId);
                    }
                }
            });
        },
        size: () => {
            const currentData = listsRef.current[listName];
            return currentData?.nodes.length || 0;
        },
        newNode: (value: string | number) => {
            const newNode = createNode(value);
            const currentData = listsRef.current[listName];
            if (!currentData) return null;

            const nextNodes = cloneNodes(currentData.nodes);

            if (!nextNodes.some((node) => node.id === newNode.id)) {
                newNode.animationState = NodeAnimationState.NewInserted;
                nextNodes.push(newNode);
                commitList(listName, nextNodes, currentData.head, currentData.tail);

                void enqueueNodeAction(async () => {
                    await sleep(220);
                    const settledData = listsRef.current[listName];
                    const settledNodes = cloneNodes(settledData.nodes);
                    const target = settledNodes.find((node) => node.id === newNode.id);
                    if (!target) return;

                    target.animationState = NodeAnimationState.Default;
                    commitList(listName, settledNodes, settledData.head, settledData.tail);
                });
            }

            return createNodeHandle(listName, newNode.id);
        },
    });

    useEffect(() => {
        const initialLists: Record<string, ListData> = {};
        for (const [key, arr] of Object.entries(initialInputs)) {
            const nodes = createNodes(...arr);
            let head = null;
            let tail = null;
            if (nodes.length > 0) {
                head = nodes[0].id;
                tail = nodes[nodes.length - 1].id;
            }
            initialLists[key] = { nodes, head, tail };
        }
        commitLists(initialLists);
    }, []);

    useEffect(() => {
        if (!isResizing) return;

        const onMouseMove = (event: MouseEvent) => {
            if (!workspaceRef.current) return;

            const bounds = workspaceRef.current.getBoundingClientRect();
            const nextPercent = ((event.clientX - bounds.left) / bounds.width) * 100;
            const clampedPercent = Math.max(45, Math.min(60, nextPercent));
            setLeftPaneWidth(clampedPercent);
        };

        const onMouseUp = () => setIsResizing(false);

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, [isResizing]);

    const formatArray = (items: (string | number)[]) => `[${items.join(", ")}]`;

    const formatOutput = (out: unknown) => {
        if (out === undefined) return "undefined";
        if (out === null) return "null";
        if (Array.isArray(out)) return formatArray(out);
        if (typeof out === 'object' && out !== null) {
            return Object.entries(out).map(([k, v]) => `${k}: ${formatArray(v as any)}`).join(" | ");
        }
        return String(out);
    }

    const arraysEqual = (left: (string | number)[], right: (string | number)[]) => {
        if (left.length !== right.length) {
            return false;
        }
        for (let i = 0; i < left.length; i++) {
            if (left[i] !== right[i]) {
                return false;
            }
        }
        return true;
    };

    const outputsEqual = (left: any, right: any) => {
        if (Array.isArray(left) && Array.isArray(right)) return arraysEqual(left, right);
        if (typeof left === 'object' && typeof right === 'object' && left !== null && right !== null) {
            const leftKeys = Object.keys(left);
            const rightKeys = Object.keys(right);
            if (leftKeys.length !== rightKeys.length) return false;
            for (const key of leftKeys) {
                if (!arraysEqual(left[key], right[key])) return false;
            }
            return true;
        }
        return left === right;
    };

    const createCaseSummary = (
        caseIndex: number,
        inputs: Record<string, (string | number)[]> | (string | number)[],
        expected: Record<string, (string | number)[]> | (string | number)[] | undefined,
        actual: Record<string, (string | number)[]> | (string | number)[],
        caseName?: string,
        expectedReturn?: string | number,
        actualReturn?: unknown,
    ): ChallengeResultSummary => {
        if (expectedReturn !== undefined) {
            const passed = actualReturn === expectedReturn;
            return {
                name: caseName || `Test Case ${caseIndex + 1}`,
                input: formatOutput(inputs),
                expected: formatOutput(expectedReturn),
                actual: formatOutput(actualReturn),
                passed,
                statusText: passed
                    ? "PASS: Returned value matches expected."
                    : "FAIL: Returned value does not match expected.",
            };
        }

        const normalizedExpected = expected ?? [];
        const passed = outputsEqual(actual, normalizedExpected);
        return {
            name: caseName || `Test Case ${caseIndex + 1}`,
            input: formatOutput(inputs),
            expected: formatOutput(normalizedExpected),
            actual: formatOutput(actual),
            passed,
            statusText: passed
                ? "PASS: Challenge output matches expected."
                : "FAIL: Challenge output does not match expected.",
        };
    };

    const createHeadlessChallengeApi = (seedInputs: Record<string, (string | number)[]>) => {
        type HeadlessNode = { id: string; value: string | number; next: string | null; };

        const apis: Record<string, any> = {};
        const getValuesMap: Record<string, () => (string | number)[]> = {};

        for (const [name, seedArr] of Object.entries(seedInputs)) {
            const store = new Map<string, HeadlessNode>();
            let headId: string | null = null;
            let tailId: string | null = null;
            let idCounter = 0;

            const makeId = () => `${name}-n-${idCounter++}`;

            const seededIds = seedArr.map((value) => {
                const id = makeId();
                store.set(id, { id, value, next: null });
                return id;
            });

            for (let i = 0; i < seededIds.length - 1; i++) {
                const node = store.get(seededIds[i]);
                if (node) {
                    node.next = seededIds[i + 1];
                }
            }

            if (seededIds.length > 0) {
                headId = seededIds[0];
                tailId = seededIds[seededIds.length - 1];
            }

            const materializeValues = () => {
                const out: (string | number)[] = [];
                const visited = new Set<string>();
                let currentId = headId;

                while (currentId && !visited.has(currentId)) {
                    visited.add(currentId);
                    const current = store.get(currentId);
                    if (!current) break;

                    out.push(current.value);
                    currentId = current.next;
                }

                return out;
            };

            const recomputeTail = () => {
                const visited = new Set<string>();
                let currentId = headId;
                let last: string | null = null;

                while (currentId && !visited.has(currentId)) {
                    visited.add(currentId);
                    const current = store.get(currentId);
                    if (!current) break;

                    last = current.id;
                    currentId = current.next;
                }

                tailId = last;
            };

            const createHandle = (nodeId: string | null): LinkedListNodeHandle | null => {
                if (!nodeId) return null;
                if (!store.has(nodeId)) return null;

                return {
                    id: nodeId,
                    getValue: () => store.get(nodeId)?.value,
                    setValue: async (value) => {
                        const target = store.get(nodeId);
                        if (!target) return;
                        target.value = value;
                    },
                    getNext: () => createHandle(store.get(nodeId)?.next ?? null),
                    setNext: (next) => {
                        const target = store.get(nodeId);
                        if (!target) return createHandle(nodeId)!;
                        target.next = next?.id ?? null;
                        recomputeTail();
                        return createHandle(nodeId)!;
                    },
                };
            };

            apis[name] = {
                getHead: () => createHandle(headId),
                setHead: async (nextHead: LinkedListNodeHandle | null) => {
                    headId = nextHead?.id ?? null;
                    recomputeTail();
                },
                getTail: () => createHandle(tailId),
                setTail: async (nextTail: LinkedListNodeHandle | null) => {
                    tailId = nextTail?.id ?? null;
                },
                size: () => materializeValues().length,
                newNode: (value: string | number) => {
                    const id = makeId();
                    store.set(id, { id, value, next: null });
                    return createHandle(id);
                },
            };

            getValuesMap[name] = materializeValues;
        }

        return {
            apis,
            getValues: () => {
                const res: Record<string, (string | number)[]> = {};
                for (const [name, fn] of Object.entries(getValuesMap)) {
                    res[name] = fn();
                }
                return res;
            },
        };
    };

    const materializeVisualList = (listName: string) => {
        const out: (string | number)[] = [];
        const visited = new Set<string>();
        const currentData = listsRef.current[listName];
        if (!currentData) return out;

        let currentId = currentData.head;
        const list = currentData.nodes;

        while (currentId && !visited.has(currentId)) {
            visited.add(currentId);
            const current = list.find((node) => node.id === currentId);
            if (!current) break;

            out.push(current.value);
            currentId = current.next;
        }

        return out;
    };

    const buildRunnerArgs = (runtimeContext: Record<string, unknown>) => {
        return runnerParameterNames.map((parameterName) => runtimeContext[parameterName]);
    };

    const runBackgroundTestCases = async (code: string): Promise<ChallengeResultSummary[]> => {
        const additionalCases = challenge.testCases.slice(1);
        if (additionalCases.length === 0) return [];

        const runner = createChallengeRunner(code, runnerParameterNames);
        const summaries: ChallengeResultSummary[] = [];

        for (let i = 0; i < additionalCases.length; i++) {
            const testCase = additionalCases[i];
            const caseIndex = i + 1;
            const caseInputs = testCase.inputs ?? { list: testCase.input ?? [] };
            const { apis, getValues } = createHeadlessChallengeApi(caseInputs);
            const silentIo = {
                println: (_message: unknown) => {
                },
            };

            const context: Record<string, unknown> = { io: silentIo };
            for (const [name, api] of Object.entries(apis)) {
                context[name] = api;
            }

            try {
                const result = runner(...buildRunnerArgs(context));
                let resolvedResult: unknown = result;
                if (result instanceof Promise) {
                    resolvedResult = await result;
                }

                summaries.push(
                    createCaseSummary(
                        caseIndex,
                        testCase.inputs ?? testCase.input ?? [],
                        testCase.expected,
                        getValues(),
                        testCase.name || `Test Case ${caseIndex + 1}`,
                        testCase.expectedReturn,
                        resolvedResult,
                    ),
                );
            } catch {
                summaries.push({
                    name: testCase.name || `Test Case ${caseIndex + 1}`,
                    input: formatOutput(testCase.inputs ?? testCase.input ?? []),
                    expected: testCase.expectedReturn !== undefined
                        ? formatOutput(testCase.expectedReturn)
                        : formatOutput(testCase.expected ?? []),
                    actual: "Execution Error",
                    passed: false,
                    statusText: "FAIL: Runtime error while evaluating this test case.",
                });
            }
        }

        return summaries;
    };

    const submitEditorCode = async () => {
        try {
            setConsoleOutput([]);
            setResultSummaries(null);
            setIsCompleted(false);
            setIsChallengeCompletedModalOpen(false);
            setShowNextAction(false);
            nodeActionQueueRef.current = Promise.resolve();
            consoleWriteQueueRef.current = Promise.resolve();
            nextPointerShadowRef.current.clear();
            valueShadowRef.current.clear();

            const runner = createChallengeRunner(editorCode, runnerParameterNames);
            const context: Record<string, unknown> = { io: { println: writeToConsole } };
            const listNames = Object.keys(initialInputs);
            for (const name of listNames) {
                context[name] = createChallengeApi(name);
            }

            const result = runner(...buildRunnerArgs(context));
            let resolvedResult: unknown = result;
            if (result instanceof Promise) {
                resolvedResult = await result;
            }

            await nodeActionQueueRef.current;
            await consoleWriteQueueRef.current;
            await new Promise((resolve) => setTimeout(resolve, 1200));

            const finalValues: Record<string, (string | number)[]> = {};
            for (const name of Object.keys(listsRef.current)) {
                finalValues[name] = materializeVisualList(name);
            }

            const primaryCase = challenge.testCases[0];

            if (!primaryCase) {
                setResultSummaries([
                    {
                        name: "Test Case 1",
                        input: "-",
                        expected: "-",
                        actual: formatOutput(finalValues),
                        passed: null,
                        statusText: "No test case configured",
                    },
                ]);
                return;
            }

            const primarySummary = createCaseSummary(
                0,
                primaryCase.inputs ?? primaryCase.input ?? [],
                primaryCase.expected,
                finalValues,
                primaryCase.name || "Test Case 1",
                primaryCase.expectedReturn,
                resolvedResult,
            );

            setResultSummaries([primarySummary]);

            void runBackgroundTestCases(editorCode).then((backgroundSummaries) => {
                const nextResults = [primarySummary, ...backgroundSummaries];

                if (backgroundSummaries.length === 0) {
                    if (nextResults.every((summary) => summary.passed === true)) {
                        setIsCompleted(true);
                        setShowNextAction(true);
                        handleChallengeCompleted();
                        setIsChallengeCompletedModalOpen(true);
                    }
                    return;
                }

                setResultSummaries(nextResults);

                if (nextResults.every((summary) => summary.passed === true)) {
                    setIsCompleted(true);
                    setShowNextAction(true);
                    handleChallengeCompleted();
                    setIsChallengeCompletedModalOpen(true);
                }
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unknown editor execution error";
            setShowNextAction(false);
            writeToConsole(`ERROR: ${message}`);
            writeToConsole("NOTICE: Execution stopped. Press Reset to restore a clean state.");
        }
    };

    const handleChallengeMenu = () => {
        setIsChallengeCompletedModalOpen(false);
        router.push("/simulator");
    };

    const handleChallengeNext = () => {
        setIsChallengeCompletedModalOpen(false);
        router.push(nextPath || inferredNextPath || "/simulator");
    };

    const resetEditorCode = () => {
        setEditorCode(initialEditorCode);
        setIsCompleted(false);
        setIsChallengeCompletedModalOpen(false);
        setShowNextAction(false);
        setResultSummaries(null);
        setConsoleOutput([]);
        nextPointerShadowRef.current.clear();
        valueShadowRef.current.clear();
        resetListsOnly();
    };

    const resetListsOnly = () => {
        const initialLists: Record<string, ListData> = {};
        for (const [key, arr] of Object.entries(initialInputs)) {
            const nodes = createNodes(...arr);
            let head = null;
            let tail = null;
            if (nodes.length > 0) {
                head = nodes[0].id;
                tail = nodes[nodes.length - 1].id;
            }
            initialLists[key] = { nodes, head, tail };
        }
        commitLists(initialLists);
        setIsCompleted(false);
        setIsChallengeCompletedModalOpen(false);
        setShowNextAction(false);
        setConsoleOutput([]);
        setResultSummaries(null);
        nextPointerShadowRef.current.clear();
        valueShadowRef.current.clear();
    };

    const numLists = Object.keys(lists).length;

    return (
        <div className="h-full bg-gray-50 overflow-hidden">
            <ChallengeCompletedModal
                isOpen={isChallengeCompletedModalOpen}
                onClose={() => setIsChallengeCompletedModalOpen(false)}
                onMenu={handleChallengeMenu}
                onNext={handleChallengeNext}
                testCaseLabels={challenge.testCases.map((_, index) => `Test Case ${index + 1}`)}
            />

            <main
                ref={workspaceRef}
                className={`flex flex-col lg:grid h-full max-w-[1500px] mx-auto bg-white ${isResizing ? "select-none" : ""}`}
                style={{ gridTemplateColumns: `${leftPaneWidth}fr 10px ${100 - leftPaneWidth}fr` }}
            >
                <div className="flex flex-col h-[40vh] lg:h-full overflow-hidden border-b lg:border-b-0 lg:border-r border-gray-200">
                    <ChallengeInstructions
                        title={challenge.title}
                        description={challenge.description}
                        completed={isCompleted}
                    />

                    <div className="flex-1 overflow-y-auto relative flex flex-col min-h-0">
                        {Object.entries(lists).map(([name, listData]) => (
                            <div key={name} className="flex-1 flex flex-col items-center border-b border-gray-100 last:border-b-0 min-h-[200px]">
                                {numLists > 1 && (
                                    <div className="text-sm font-semibold text-gray-500 pt-2 pb-1 bg-gray-50 w-full text-center border-b border-gray-200 shadow-sm flex-shrink-0">
                                        {name}
                                    </div>
                                )}
                                <div className="flex-1 w-full relative min-h-0 flex flex-col">
                                    <VisualLinkedList nodes={listData.nodes} head={listData.head} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div
                    className="hidden lg:flex items-center justify-center cursor-col-resize bg-gray-200 hover:bg-blue-200 transition-colors"
                    onMouseDown={() => setIsResizing(true)}
                    role="separator"
                    aria-orientation="vertical"
                    aria-label="Resize panels"
                >
                    <div className="h-14 w-1 rounded bg-gray-500" />
                </div>

                <CodeEditorPanel
                    code={editorCode}
                    output={consoleOutput}
                    resultSummaries={resultSummaries}
                    onCodeChange={setEditorCode}
                    onReset={resetEditorCode}
                    onResetArray={resetListsOnly}
                    onSubmit={submitEditorCode}
                    onNext={handleChallengeNext}
                    showNextButton={showNextAction}
                    resetDisabled={false}
                    resetArrayDisabled={false}
                    submitDisabled={false}
                    nextDisabled={false}
                />
            </main>
        </div>
    );
}
