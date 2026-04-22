"use client";

import { useEffect, useRef, useState } from "react";
import { LinkedListNode, NodeAnimationState } from "@/app/simulator/components/linked-list/types";
import { createNode, createNodes } from "@/app/simulator/components/linked-list/utils";
import ChallengeInstructions from "@/app/simulator/components/ChallengeInstructions";
import ChallengeCompletedModal from "@/app/simulator/components/ChallengeCompletedModal";
import CodeEditorPanel from "@/app/simulator/components/CodeEditorPanel";
import VisualArrayContainer from "@/app/simulator/components/VisualArrayContainer";
import VisualLinkedList from "@/app/simulator/components/linked-list/VisualLinkedList";
import { CHALLENGE_INTRO, createChallengeRunner, DEFAULT_RUNNER_PARAMETER_NAMES } from "./challenges";

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

export default function SimulationLinkedListChallenge() {
    const challenge = CHALLENGE_INTRO;
    const runnerParameterNames = challenge.programStructure?.parameterNames
        ?? challenge.runnerParameterNames
        ?? DEFAULT_RUNNER_PARAMETER_NAMES;
    const initialListSeed = challenge.testCases[0]?.input ?? [];
    const initialEditorCode = challenge.initialEditorCode;

    const [nodes, setNodes] = useState<LinkedListNode[]>([]);
    const [head, setHead] = useState<string | null>(null);
    const [tail, setTail] = useState<string | null>(null);
    const [editorCode, setEditorCode] = useState<string>(initialEditorCode);
    const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
    const [resultSummaries, setResultSummaries] = useState<ChallengeResultSummary[] | null>(null);
    const [isCompleted, setIsCompleted] = useState<boolean>(false);
    const [isChallengeCompletedModalOpen, setIsChallengeCompletedModalOpen] = useState<boolean>(false);
    const [showNextAction, setShowNextAction] = useState<boolean>(false);
    const [leftPaneWidth, setLeftPaneWidth] = useState<number>(50);
    const [isResizing, setIsResizing] = useState<boolean>(false);

    const workspaceRef = useRef<HTMLDivElement | null>(null);
    const nodesRef = useRef<LinkedListNode[]>([]);
    const headRef = useRef<string | null>(null);
    const tailRef = useRef<string | null>(null);
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

    const commitNodes = (nextNodes: LinkedListNode[]) => {
        const cloned = cloneNodes(nextNodes);
        const { nextHead, nextTail } = recomputeEndpoints(cloned);

        nodesRef.current = cloned;
        headRef.current = nextHead;
        tailRef.current = nextTail;
        setNodes(cloned);
        setHead(nextHead);
        setTail(nextTail);
    };

    const enqueueNodeAction = <T,>(action: () => Promise<T>): Promise<T> => {
        const next = nodeActionQueueRef.current.then(action, action);
        nodeActionQueueRef.current = next.then(() => undefined, () => undefined);
        return next;
    };

    const updateNodeAnimationState = (nodeId: string, animationState: NodeAnimationState) => {
        const nextNodes = cloneNodes(nodesRef.current);
        const target = nextNodes.find((node) => node.id === nodeId);
        if (!target) return;

        target.animationState = animationState;
        commitNodes(nextNodes);
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

    const createNodeHandle = (nodeId: string | null): LinkedListNodeHandle | null => {
        if (!nodeId) return null;

        const self: LinkedListNodeHandle = {
            id: nodeId,
            getValue: () => {
                const shadowValue = valueShadowRef.current.get(nodeId);
                const currentValue = shadowValue !== undefined
                    ? shadowValue
                    : nodesRef.current.find((node) => node.id === nodeId)?.value;

                enqueueNodeAction(async () => {
                    updateNodeAnimationState(nodeId, NodeAnimationState.HighlightedGreen);
                    await new Promise((resolve) => setTimeout(resolve, 220));
                    updateNodeAnimationState(nodeId, NodeAnimationState.Default);
                });

                return currentValue;
            },
            setValue: (value) => {
                valueShadowRef.current.set(nodeId, value);

                return enqueueNodeAction(async () => {
                    const nextNodes = cloneNodes(nodesRef.current);
                    const target = nextNodes.find((node) => node.id === nodeId);
                    if (!target) return;

                    updateNodeAnimationState(nodeId, NodeAnimationState.HighlightedOrange);
                    await sleep(180);

                    target.value = value;
                    commitNodes([...nextNodes]);

                    const shadowValue = valueShadowRef.current.get(nodeId);
                    if (shadowValue === value) {
                        valueShadowRef.current.delete(nodeId);
                    }

                    await sleep(120);

                    updateNodeAnimationState(nodeId, NodeAnimationState.Default);
                });
            },
            getNext: () => {
                const shadowNext = nextPointerShadowRef.current.get(nodeId);
                const resolvedNextId = shadowNext !== undefined
                    ? shadowNext
                    : (nodesRef.current.find((node) => node.id === nodeId)?.next ?? null);
                const nextHandle = createNodeHandle(resolvedNextId);

                enqueueNodeAction(async () => {
                    updateNodeAnimationState(nodeId, NodeAnimationState.Traversing);
                    await sleep(180);
                    updateNodeAnimationState(nodeId, NodeAnimationState.Default);
                });

                return nextHandle;
            },
            setNext: (next) => {
                const nextId = next ? next.id : null;
                nextPointerShadowRef.current.set(nodeId, nextId);

                void enqueueNodeAction(async () => {
                    const nextNodes = cloneNodes(nodesRef.current);
                    const target = nextNodes.find((node) => node.id === nodeId);
                    if (!target) return;

                    target.animationState = NodeAnimationState.HighlightedOrange;
                    commitNodes([...nextNodes]);
                    await sleep(140);

                    target.next = nextId;
                    commitNodes([...nextNodes]);

                    const shadowNext = nextPointerShadowRef.current.get(nodeId);
                    if (shadowNext === nextId) {
                        nextPointerShadowRef.current.delete(nodeId);
                    }

                    await sleep(100);

                    target.animationState = NodeAnimationState.Default;
                    commitNodes([...nextNodes]);
                });

                return self;
            },
        };

        return self;
    };

    const linkedListApi = {
        getHead: () => {
            const handle = createNodeHandle(headRef.current);
            if (!handle) return null;

            enqueueNodeAction(async () => {
                updateNodeAnimationState(handle.id, NodeAnimationState.HighlightedGreen);
                await sleep(180);
                updateNodeAnimationState(handle.id, NodeAnimationState.Default);
            });

            return handle;
        },
        setHead: (nextHead: LinkedListNodeHandle | null) => {
            return enqueueNodeAction(async () => {
                const nextNodes = cloneNodes(nodesRef.current);
                const nextHeadId = nextHead?.id ?? null;

                if (nextHeadId) {
                    const target = nextNodes.find((node) => node.id === nextHeadId);
                    if (target) {
                        target.animationState = NodeAnimationState.HighlightedOrange;
                        commitNodes([...nextNodes]);
                        await sleep(140);
                    }
                }

                headRef.current = nextHeadId;
                setHead(nextHeadId);

                if (nextHeadId) {
                    const target = nextNodes.find((node) => node.id === nextHeadId);
                    if (target) {
                        target.animationState = NodeAnimationState.Default;
                        commitNodes([...nextNodes]);
                    }
                }
            });
        },
        getTail: () => {
            const handle = createNodeHandle(tailRef.current);
            if (!handle) return null;

            enqueueNodeAction(async () => {
                updateNodeAnimationState(handle.id, NodeAnimationState.HighlightedGreen);
                await sleep(180);
                updateNodeAnimationState(handle.id, NodeAnimationState.Default);
            });

            return handle;
        },
        setTail: (nextTail: LinkedListNodeHandle | null) => {
            return enqueueNodeAction(async () => {
                const nextNodes = cloneNodes(nodesRef.current);
                const nextTailId = nextTail?.id ?? null;

                if (nextTailId) {
                    const target = nextNodes.find((node) => node.id === nextTailId);
                    if (target) {
                        target.animationState = NodeAnimationState.HighlightedOrange;
                        commitNodes([...nextNodes]);
                        await sleep(140);
                    }
                }

                tailRef.current = nextTailId;
                setTail(nextTailId);

                if (nextTailId) {
                    const target = nextNodes.find((node) => node.id === nextTailId);
                    if (target) {
                        target.animationState = NodeAnimationState.Default;
                        commitNodes([...nextNodes]);
                    }
                }
            });
        },
        size: () => nodesRef.current.length,
        newNode: (value: string | number) => {
            const newNode = createNode(value);
            const nextNodes = cloneNodes(nodesRef.current);
            if (!nextNodes.some((node) => node.id === newNode.id)) {
                newNode.animationState = NodeAnimationState.NewInserted;
                nextNodes.push(newNode);
                commitNodes(nextNodes);

                void enqueueNodeAction(async () => {
                    await sleep(220);
                    const settledNodes = cloneNodes(nodesRef.current);
                    const target = settledNodes.find((node) => node.id === newNode.id);
                    if (!target) return;

                    target.animationState = NodeAnimationState.Default;
                    commitNodes(settledNodes);
                });
            }

            return createNodeHandle(newNode.id);
        },
    };

    useEffect(() => {
        commitNodes(createNodes(...initialListSeed));
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

    const formatReturnValue = (value: unknown) => {
        if (value === undefined) return "undefined";
        if (value === null) return "null";
        if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
            return String(value);
        }

        try {
            return JSON.stringify(value);
        } catch {
            return String(value);
        }
    };

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

    const createCaseSummary = (
        caseIndex: number,
        input: (string | number)[],
        expected: (string | number)[] | undefined,
        actual: (string | number)[],
        caseName?: string,
        expectedReturn?: string | number,
        actualReturn?: unknown,
    ): ChallengeResultSummary => {
        if (expectedReturn !== undefined) {
            const passed = actualReturn === expectedReturn;
            return {
                name: caseName || `Test Case ${caseIndex + 1}`,
                input: formatArray(input),
                expected: formatReturnValue(expectedReturn),
                actual: formatReturnValue(actualReturn),
                passed,
                statusText: passed
                    ? "PASS: Returned value matches expected."
                    : "FAIL: Returned value does not match expected.",
            };
        }

        const normalizedExpected = expected ?? [];
        const passed = arraysEqual(actual, normalizedExpected);
        return {
            name: caseName || `Test Case ${caseIndex + 1}`,
            input: formatArray(input),
            expected: formatArray(normalizedExpected),
            actual: formatArray(actual),
            passed,
            statusText: passed
                ? "PASS: Challenge output matches expected."
                : "FAIL: Challenge output does not match expected.",
        };
    };

    const createHeadlessLinkedListApi = (seed: (string | number)[]) => {
        type HeadlessNode = {
            id: string;
            value: string | number;
            next: string | null;
        };

        const store = new Map<string, HeadlessNode>();
        let headId: string | null = null;
        let tailId: string | null = null;
        let idCounter = 0;

        const makeId = () => `n-${idCounter++}`;

        const seededIds = seed.map((value) => {
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

        const api = {
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

        return {
            api,
            getValues: () => materializeValues(),
        };
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
            const { api, getValues } = createHeadlessLinkedListApi(testCase.input);
            const silentIo = {
                println: (_message: unknown) => {
                },
            };

            try {
                const result = runner(...buildRunnerArgs({ list: api, io: silentIo }));
                let resolvedResult: unknown = result;
                if (result instanceof Promise) {
                    resolvedResult = await result;
                }

                summaries.push(
                    createCaseSummary(
                        caseIndex,
                        testCase.input,
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
                    input: formatArray(testCase.input),
                    expected: testCase.expectedReturn !== undefined
                        ? formatReturnValue(testCase.expectedReturn)
                        : formatArray(testCase.expected ?? []),
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
            const result = runner(...buildRunnerArgs({ list: linkedListApi, io: { println: writeToConsole } }));
            let resolvedResult: unknown = result;
            if (result instanceof Promise) {
                resolvedResult = await result;
            }

            await nodeActionQueueRef.current;
            await consoleWriteQueueRef.current;
            await new Promise((resolve) => setTimeout(resolve, 1200));

            const finalValues = nodesRef.current.map((node) => node.value);
            const primaryCase = challenge.testCases[0];

            if (!primaryCase) {
                setResultSummaries([
                    {
                        name: "Test Case 1",
                        input: "-",
                        expected: "-",
                        actual: formatArray(finalValues),
                        passed: null,
                        statusText: "No test case configured",
                    },
                ]);
                return;
            }

            const primarySummary = createCaseSummary(
                0,
                primaryCase.input,
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
                        setIsChallengeCompletedModalOpen(true);
                    }
                    return;
                }

                setResultSummaries(nextResults);

                if (nextResults.every((summary) => summary.passed === true)) {
                    setIsCompleted(true);
                    setShowNextAction(true);
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

    const resetEditorCode = () => {
        setEditorCode(initialEditorCode);
        setIsCompleted(false);
        setIsChallengeCompletedModalOpen(false);
        setShowNextAction(false);
        setResultSummaries(null);
        setConsoleOutput([]);
        nextPointerShadowRef.current.clear();
        valueShadowRef.current.clear();
    };

    const resetListOnly = () => {
        commitNodes(createNodes(...initialListSeed));
        setIsCompleted(false);
        setIsChallengeCompletedModalOpen(false);
        setShowNextAction(false);
        setConsoleOutput([]);
        setResultSummaries(null);
        nextPointerShadowRef.current.clear();
        valueShadowRef.current.clear();
    };

    return (
        <div className="h-full bg-gray-50 overflow-hidden">
            <ChallengeCompletedModal
                isOpen={isChallengeCompletedModalOpen}
                onClose={() => setIsChallengeCompletedModalOpen(false)}
                onMenu={() => setIsChallengeCompletedModalOpen(false)}
                onNext={() => setIsChallengeCompletedModalOpen(false)}
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

                    <VisualArrayContainer>
                        <div className="w-full h-full overflow-hidden">
                            <VisualLinkedList nodes={nodes} head={head} />
                        </div>
                    </VisualArrayContainer>
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
                    onResetArray={resetListOnly}
                    onSubmit={submitEditorCode}
                    onNext={() => setIsChallengeCompletedModalOpen(false)}
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
