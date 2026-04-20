"use client";

import { useEffect, useRef, useState } from "react";
import { LinkedListNode, NodeAnimationState } from "@/app/simulator/linked-list/components/types";
import { createNode, createNodes } from "@/app/simulator/linked-list/components/utils";
import ChallengeInstructions from "@/app/simulator/components/ChallengeInstructions";
import ChallengeCompletedModal from "@/app/simulator/components/ChallengeCompletedModal";
import CodeEditorPanel from "@/app/simulator/components/CodeEditorPanel";
import VisualArrayContainer from "@/app/simulator/components/VisualArrayContainer";
import VisualLinkedList from "@/app/simulator/linked-list/components/VisualLinkedList";
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
    setValue: (value: string | number) => void;
    getNext: () => LinkedListNodeHandle | null;
    setNext: (next: LinkedListNodeHandle | null) => void;
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

    const enqueueNodeAction = (action: () => Promise<void>) => {
        const next = nodeActionQueueRef.current.then(action, action);
        nodeActionQueueRef.current = next.then(() => undefined, () => undefined);
    };

    const updateNodeAnimationState = (nodeId: string, animationState: NodeAnimationState) => {
        const nextNodes = cloneNodes(nodesRef.current);
        const target = nextNodes.find((node) => node.id === nodeId);
        if (!target) return;

        target.animationState = animationState;
        commitNodes(nextNodes);
    };

    const writeToConsole = (message: unknown) => {
        const nextLine =
            typeof message === "string"
                ? message
                : message instanceof Error
                    ? message.message
                    : String(message);
        setConsoleOutput((prev) => [...prev, nextLine]);
    };

    const createNodeHandle = (nodeId: string | null): LinkedListNodeHandle | null => {
        if (!nodeId) return null;

        return {
            id: nodeId,
            getValue: () => {
                const currentValue = nodesRef.current.find((node) => node.id === nodeId)?.value;

                enqueueNodeAction(async () => {
                    updateNodeAnimationState(nodeId, NodeAnimationState.HighlightedGreen);
                    await new Promise((resolve) => setTimeout(resolve, 220));
                    updateNodeAnimationState(nodeId, NodeAnimationState.Default);
                });

                return currentValue;
            },
            setValue: (value) => {
                const nextNodes = cloneNodes(nodesRef.current);
                const target = nextNodes.find((node) => node.id === nodeId);
                if (!target) return;

                target.value = value;
                commitNodes(nextNodes);

                enqueueNodeAction(async () => {
                    updateNodeAnimationState(nodeId, NodeAnimationState.HighlightedOrange);
                    await new Promise((resolve) => setTimeout(resolve, 240));
                    updateNodeAnimationState(nodeId, NodeAnimationState.Default);
                });
            },
            getNext: () => createNodeHandle(nodesRef.current.find((node) => node.id === nodeId)?.next ?? null),
            setNext: (next) => {
                const nextNodes = cloneNodes(nodesRef.current);
                const target = nextNodes.find((node) => node.id === nodeId);
                if (!target) return;

                target.next = next ? next.id : null;
                commitNodes(nextNodes);
            },
        };
    };

    const linkedListApi = {
        getHead: () => createNodeHandle(headRef.current),
        getTail: () => createNodeHandle(tailRef.current),
        size: () => nodesRef.current.length,
        insertFront: (value: string | number) => {
            const newNode = createNode(value);
            const nextNodes = cloneNodes(nodesRef.current);
            newNode.next = headRef.current;
            nextNodes.unshift(newNode);
            commitNodes(nextNodes);
        },
        insertBack: (value: string | number) => {
            const newNode = createNode(value);
            const nextNodes = cloneNodes(nodesRef.current);

            if (nextNodes.length === 0) {
                nextNodes.push(newNode);
                commitNodes(nextNodes);
                return;
            }

            const currentTail = nextNodes.find((node) => node.id === tailRef.current);
            if (currentTail) {
                currentTail.next = newNode.id;
            }

            nextNodes.push(newNode);
            commitNodes(nextNodes);
        },
        removeFront: () => {
            const currentHead = headRef.current;
            if (!currentHead) return undefined;

            const nextNodes = cloneNodes(nodesRef.current);
            const removed = nextNodes.find((node) => node.id === currentHead);
            const filtered = nextNodes.filter((node) => node.id !== currentHead);
            commitNodes(filtered);

            if (removed) {
                enqueueNodeAction(async () => {
                    updateNodeAnimationState(removed.id, NodeAnimationState.BeingRemoved);
                    await new Promise((resolve) => setTimeout(resolve, 240));
                    updateNodeAnimationState(removed.id, NodeAnimationState.Invisible);
                });
            }

            return removed?.value;
        },
        removeBack: () => {
            const currentHead = headRef.current;
            if (!currentHead) return undefined;

            if (headRef.current === tailRef.current) {
                return linkedListApi.removeFront();
            }

            const nextNodes = cloneNodes(nodesRef.current);
            let previous: LinkedListNode | undefined;
            let currentId: string | null = currentHead;

            while (currentId) {
                const current = nextNodes.find((node) => node.id === currentId);
                if (!current) break;

                if (!current.next) {
                    const removedValue = current.value;
                    if (previous) {
                        previous.next = null;
                    }

                    const filtered = nextNodes.filter((node) => node.id !== current.id);
                    commitNodes(filtered);

                    enqueueNodeAction(async () => {
                        updateNodeAnimationState(current.id, NodeAnimationState.BeingRemoved);
                        await new Promise((resolve) => setTimeout(resolve, 240));
                        updateNodeAnimationState(current.id, NodeAnimationState.Invisible);
                    });

                    return removedValue;
                }

                previous = current;
                currentId = current.next;
            }

            return undefined;
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
        const values = [...seed];

        const createHandle = (index: number): LinkedListNodeHandle | null => {
            if (index < 0 || index >= values.length) return null;

            return {
                id: String(index),
                getValue: () => values[index],
                setValue: (value) => {
                    values[index] = value;
                },
                getNext: () => createHandle(index + 1),
                setNext: () => {
                },
            };
        };

        const api = {
            getHead: () => createHandle(0),
            getTail: () => createHandle(values.length - 1),
            size: () => values.length,
            insertFront: (value: string | number) => {
                values.unshift(value);
            },
            insertBack: (value: string | number) => {
                values.push(value);
            },
            removeFront: () => values.shift(),
            removeBack: () => values.pop(),
        };

        return {
            api,
            getValues: () => [...values],
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

            const runner = createChallengeRunner(editorCode, runnerParameterNames);
            const result = runner(...buildRunnerArgs({ list: linkedListApi, io: { println: writeToConsole } }));
            let resolvedResult: unknown = result;
            if (result instanceof Promise) {
                resolvedResult = await result;
            }

            await nodeActionQueueRef.current;
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
    };

    const resetListOnly = () => {
        commitNodes(createNodes(...initialListSeed));
        setIsCompleted(false);
        setIsChallengeCompletedModalOpen(false);
        setShowNextAction(false);
        setConsoleOutput([]);
        setResultSummaries(null);
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
                        <div className="w-full h-full flex items-center justify-center px-4 md:px-9 py-4 overflow-hidden">
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
