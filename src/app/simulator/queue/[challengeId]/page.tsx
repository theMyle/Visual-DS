'use client';

import { useEffect, useRef, useState } from "react";
import { ArrayElement, ArrayElementAnimationState } from "@/app/simulator/components/array-list/types";
import { createArrayElement, createArrayElements } from "@/app/simulator/components/array-list/utils";
import ChallengeInstructions from "@/app/simulator/components/ChallengeInstructions";
import ChallengeCompletedModal from "@/app/simulator/components/ChallengeCompletedModal";
import CodeEditorPanel from "@/app/simulator/components/CodeEditorPanel";
import VisualArrayContainer from "@/app/simulator/components/VisualArrayContainer";
import VisualArray from "@/app/simulator/components/array-list/VisualArray";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { CHALLENGE_REGISTRY } from "../challenges/registry";
import { ChallengeConfig, createChallengeRunner, DEFAULT_RUNNER_PARAMETER_NAMES } from "../challenges/runner";

type ChallengeResultSummary = {
    name: string;
    input: string;
    expected: string;
    actual: string;
    passed: boolean | null;
    statusText: string;
};

export default function SimulationQueueChallenge() {
    const params = useParams<{ challengeId: string }>();
    const challengeId = params?.challengeId;
    const challenge = challengeId ? CHALLENGE_REGISTRY[challengeId] : undefined;

    if (!challenge) {
        return <div className="p-8 text-center text-gray-500">Challenge not found</div>;
    }

    return <SimulationQueueCore challenge={challenge} challengeId={challengeId} />;
}

function SimulationQueueCore({ challenge, challengeId }: { challenge: ChallengeConfig, challengeId: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const nextPath = searchParams.get("next");
    const orderedChallengeIds = Object.keys(CHALLENGE_REGISTRY).sort((a, b) => {
        const aNum = Number(a.split("-").at(-1));
        const bNum = Number(b.split("-").at(-1));
        return aNum - bNum;
    });
    const currentChallengeIndex = orderedChallengeIds.indexOf(challengeId);
    const inferredNextPath = currentChallengeIndex >= 0 && currentChallengeIndex < orderedChallengeIds.length - 1
        ? `/simulator/queue/${orderedChallengeIds[currentChallengeIndex + 1]}`
        : "/simulator";

    const runnerParameterNames = challenge.programStructure?.parameterNames
        ?? challenge.runnerParameterNames
        ?? DEFAULT_RUNNER_PARAMETER_NAMES;

    const initialInputs = challenge.testCases[0]?.inputs
        ?? { queue: challenge.testCases[0]?.input ?? [] };

    const getSeeds = () => {
        const seeds: Record<string, (string | number)[]> = {};
        for (const key of Object.keys(initialInputs)) {
            seeds[key] = [...initialInputs[key]];
        }
        return seeds;
    };

    const initialEditorCode = challenge.initialEditorCode;

    const syncChallengeResult = async (_passed: boolean) => {
    };

    const handleChallengeCompleted = () => {
    };

    const handleChallengeMenu = () => {
        setIsChallengeCompletedModalOpen(false);
        router.push("/simulator");
    };

    const handleChallengeNext = () => {
        setIsChallengeCompletedModalOpen(false);
        router.push(nextPath || inferredNextPath || "/simulator");
    };

    const [queues, setQueues] = useState<Record<string, ArrayElement[]>>({});
    const [editorCode, setEditorCode] = useState<string>(initialEditorCode);
    const [leftPaneWidth, setLeftPaneWidth] = useState<number>(50);
    const [isResizing, setIsResizing] = useState<boolean>(false);
    const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
    const [resultSummaries, setResultSummaries] = useState<ChallengeResultSummary[] | null>(null);
    const [isCompleted, setIsCompleted] = useState<boolean>(false);
    const [isChallengeCompletedModalOpen, setIsChallengeCompletedModalOpen] = useState<boolean>(false);
    const [showNextAction, setShowNextAction] = useState<boolean>(false);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);

    const workspaceRef = useRef<HTMLDivElement | null>(null);
    const queuesRef = useRef<Record<string, ArrayElement[]>>({});
    const logicalQueuesRef = useRef<Record<string, (string | number)[]>>({});
    const isAnimatingRef = useRef<boolean>(false);
    const challengeQueueRef = useRef(Promise.resolve());

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    const delay = {
        focus: 150,
        slide: 140,
        peek: 120,
    };

    const getMaxElements = () => {
        const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;
        return isDesktop ? challenge.maxCapacity.desktop : challenge.maxCapacity.mobile;
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

    const commitQueues = (nextQueues: Record<string, ArrayElement[]>) => {
        queuesRef.current = nextQueues;
        setQueues(nextQueues);
    };

    const commitQueue = (queueName: string, nextQueue: ArrayElement[]) => {
        commitQueues({ ...queuesRef.current, [queueName]: nextQueue });
    };

    const setAnimatingState = (nextIsAnimating: boolean) => {
        isAnimatingRef.current = nextIsAnimating;
        setIsAnimating(nextIsAnimating);
    };

    const isPromiseLike = (value: unknown): value is PromiseLike<unknown> => {
        if (typeof value !== "object" || value === null) {
            return false;
        }

        const maybeThenable = value as { then?: unknown };
        return typeof maybeThenable.then === "function";
    };

    useEffect(() => {
        const seeds = getSeeds();
        const initialQueues: Record<string, ArrayElement[]> = {};
        for (const key of Object.keys(seeds)) {
            initialQueues[key] = createArrayElements(...seeds[key]);
        }
        logicalQueuesRef.current = { ...seeds };
        commitQueues(initialQueues);
    }, []);

    useEffect(() => {
        queuesRef.current = queues;
    }, [queues]);

    useEffect(() => {
        isAnimatingRef.current = isAnimating;
    }, [isAnimating]);

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

    const resetStructureState = () => {
        const seeds = getSeeds();
        const initialQueues: Record<string, ArrayElement[]> = {};
        for (const key of Object.keys(seeds)) {
            initialQueues[key] = createArrayElements(...seeds[key]);
        }
        logicalQueuesRef.current = { ...seeds };
        commitQueues(initialQueues);
        setAnimatingState(false);
        setIsCompleted(false);
        setIsChallengeCompletedModalOpen(false);
        setShowNextAction(false);
        challengeQueueRef.current = Promise.resolve();
    };

    const enqueueChallengeAction = (action: () => Promise<void>) => {
        const next = challengeQueueRef.current.then(action, action);
        challengeQueueRef.current = next.then(() => undefined, () => undefined);
    };

    const enqueue = (queueName: string, value: string | number) => {
        if (logicalQueuesRef.current[queueName].length >= getMaxElements()) return;

        logicalQueuesRef.current[queueName] = [...logicalQueuesRef.current[queueName], value];

        enqueueChallengeAction(async () => {
            setAnimatingState(true);
            const currentQueue = queuesRef.current[queueName] || [];
            const inserted = createArrayElement(value, ArrayElementAnimationState.NewInserted);
            const nextQueue = [...currentQueue, inserted];
            commitQueue(queueName, nextQueue);
            await sleep(delay.focus + 80);
            inserted.animationState = ArrayElementAnimationState.Default;
            commitQueue(queueName, [...nextQueue]);
            setAnimatingState(false);
        });
    };

    const dequeue = (queueName: string): string | number | undefined => {
        const currentLogicalQueue = logicalQueuesRef.current[queueName] || [];
        if (currentLogicalQueue.length === 0) return;

        const returnValue = currentLogicalQueue[0];
        logicalQueuesRef.current[queueName] = currentLogicalQueue.slice(1);

        enqueueChallengeAction(async () => {
            setAnimatingState(true);
            const currentQueue = queuesRef.current[queueName] || [];
            if (currentQueue.length === 0) {
                setAnimatingState(false);
                return;
            }

            const nextQueue = [...currentQueue];
            const removed = nextQueue[0];
            removed.animationState = ArrayElementAnimationState.RemovedInvisible;
            commitQueue(queueName, nextQueue);
            await sleep(delay.slide);
            commitQueue(queueName, nextQueue.slice(1));
            setAnimatingState(false);
        });

        return returnValue;
    };

    const peek = (queueName: string): string | number | undefined => {
        const currentLogicalQueue = logicalQueuesRef.current[queueName] || [];
        if (currentLogicalQueue.length === 0) return;

        const returnValue = currentLogicalQueue[0];

        enqueueChallengeAction(async () => {
            setAnimatingState(true);
            const currentQueue = queuesRef.current[queueName] || [];
            if (currentQueue.length === 0) {
                setAnimatingState(false);
                return;
            }

            const nextQueue = [...currentQueue];
            nextQueue[0].animationState = ArrayElementAnimationState.HighlightedGreen;
            commitQueue(queueName, nextQueue);
            await sleep(delay.peek + 120);
            nextQueue[0].animationState = ArrayElementAnimationState.Default;
            commitQueue(queueName, [...nextQueue]);
            setAnimatingState(false);
        });

        return returnValue;
    };

    const size = (queueName: string) => logicalQueuesRef.current[queueName]?.length || 0;

    type ChallengeQueueApi = {
        enqueue: (value: string | number) => void;
        dequeue: () => string | number | undefined;
        peek: () => string | number | undefined;
        size: () => number;
    };

    type ChallengeIoApi = {
        println: (message: unknown) => void;
    };

    const createChallengeApi = (queueName: string): ChallengeQueueApi => ({
        enqueue: (value) => enqueue(queueName, value),
        dequeue: () => dequeue(queueName),
        peek: () => peek(queueName),
        size: () => size(queueName),
    });

    const challengeIoApi: ChallengeIoApi = {
        println: (message) => {
            if (!isPromiseLike(message)) {
                writeToConsole(message);
                return;
            }

            void enqueueChallengeAction(async () => {
                try {
                    const resolved = await message;
                    writeToConsole(resolved);
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    writeToConsole(`ERROR: io.println promise rejected (${errorMessage})`);
                }
            });
        },
    };

    const getEditorCode = () => editorCode;

    const setEditorCodeProgrammatically = (newCode: string) => {
        setEditorCode(newCode);
    };

    const resetEditorCode = () => {
        setEditorCodeProgrammatically(initialEditorCode);
        setIsCompleted(false);
        setIsChallengeCompletedModalOpen(false);
        setShowNextAction(false);
        setResultSummaries(null);
        writeToConsole("Code editor reset to starter template.");
    };

    const resetQueueOnly = () => {
        resetStructureState();
        setConsoleOutput([]);
        setResultSummaries(null);
    };

    const formatArray = (items: (string | number)[]) => `[${items.join(", ")}]`;

    const formatOutput = (out: unknown) => {
        if (out === undefined) return "undefined";
        if (out === null) return "null";
        if (Array.isArray(out)) return formatArray(out);
        if (typeof out === 'object' && out !== null) {
            const entries = Object.entries(out);
            if (entries.length === 1) {
                return formatArray(entries[0][1] as (string | number)[]);
            }
            return Object.entries(out).map(([k, v]) => `${k}: ${formatArray(v as any)}`).join(" | ");
        }
        return String(out);
    }

    const normalizeComparableValue = (value: unknown): unknown => {
        if (
            value !== null &&
            typeof value === 'object' &&
            !Array.isArray(value)
        ) {
            const entries = Object.entries(value as Record<string, unknown>);
            if (entries.length === 1) {
                return normalizeComparableValue(entries[0][1]);
            }
        }

        return value;
    };

    const valuesEqual = (left: unknown, right: unknown): boolean => {
        const normalizedLeft = normalizeComparableValue(left);
        const normalizedRight = normalizeComparableValue(right);

        if (Array.isArray(normalizedLeft) && Array.isArray(normalizedRight)) {
            if (normalizedLeft.length !== normalizedRight.length) {
                return false;
            }

            for (let i = 0; i < normalizedLeft.length; i++) {
                if (!valuesEqual(normalizedLeft[i], normalizedRight[i])) {
                    return false;
                }
            }

            return true;
        }

        if (
            typeof normalizedLeft === 'object' &&
            typeof normalizedRight === 'object' &&
            normalizedLeft !== null &&
            normalizedRight !== null
        ) {
            const leftKeys = Object.keys(normalizedLeft as Record<string, unknown>);
            const rightKeys = Object.keys(normalizedRight as Record<string, unknown>);
            if (leftKeys.length !== rightKeys.length) return false;

            for (const key of leftKeys) {
                if (!valuesEqual(
                    (normalizedLeft as Record<string, unknown>)[key],
                    (normalizedRight as Record<string, unknown>)[key],
                )) {
                    return false;
                }
            }

            return true;
        }

        return String(normalizedLeft) === String(normalizedRight);
    };

    const outputsEqual = (left: any, right: any) => valuesEqual(left, right);

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
        const maxElements = challenge.maxCapacity.desktop;
        const apis: Record<string, any> = {};
        const valuesMap: Record<string, (string | number)[]> = {};

        for (const [name, arr] of Object.entries(seedInputs)) {
            valuesMap[name] = [...arr];
            apis[name] = {
                enqueue: (value: string | number) => {
                    if (valuesMap[name].length >= maxElements) return;
                    valuesMap[name].push(value);
                },
                dequeue: (): string | number | undefined => {
                    if (valuesMap[name].length === 0) return undefined;
                    return valuesMap[name].shift();
                },
                peek: (): string | number | undefined => {
                    if (valuesMap[name].length === 0) return undefined;
                    return valuesMap[name][0];
                },
                size: () => valuesMap[name].length,
            };
        }

        return {
            apis,
            getValues: () => {
                const res: Record<string, (string | number)[]> = {};
                for (const [name, arr] of Object.entries(valuesMap)) {
                    res[name] = [...arr];
                }
                return res;
            },
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
            const caseInputs = testCase.inputs ?? { queue: testCase.input ?? [] };
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
            challengeQueueRef.current = Promise.resolve();

            const runner = createChallengeRunner(editorCode, runnerParameterNames);
            const context: Record<string, unknown> = { io: challengeIoApi };
            const queueNames = Object.keys(initialInputs);
            for (const name of queueNames) {
                context[name] = createChallengeApi(name);
            }

            const result = runner(...buildRunnerArgs(context));
            let resolvedResult: unknown = result;
            if (result instanceof Promise) {
                resolvedResult = await result;
            }

            await challengeQueueRef.current;
            await sleep(1000);

            const finalValues: Record<string, (string | number)[]> = {};
            for (const [name, arr] of Object.entries(logicalQueuesRef.current)) {
                finalValues[name] = [...arr];
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
            void syncChallengeResult(primarySummary.passed === true);

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

    const numQueues = Object.keys(queues).length;

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
                        {Object.entries(queues).map(([name, queueElements]) => (
                            <div key={name} className="flex-1 flex flex-col items-center border-b border-gray-100 last:border-b-0 min-h-[200px]">
                                {numQueues > 1 && (
                                    <div className="text-sm font-semibold text-gray-500 pt-2 pb-1 bg-gray-50 w-full text-center border-b border-gray-200 shadow-sm flex-shrink-0">
                                        {name}
                                    </div>
                                )}
                                <div className="flex-1 w-full relative min-h-0 flex flex-col">
                                    <VisualArrayContainer>
                                        <div className="flex flex-col justify-center px-4 md:px-9 py-4 h-full">
                                            <div className="flex w-full max-w-full min-w-0 items-stretch justify-center gap-2 md:gap-4 overflow-hidden">
                                                <div className="shrink-0 flex flex-col items-center justify-start gap-1 pt-1.5 md:pt-4">
                                                    <p className="text-xs md:text-sm font-semibold text-green-600">FRONT</p>
                                                    <p className="text-lg md:text-2xl text-green-600">←</p>
                                                </div>

                                                <div className="min-w-0 max-w-full relative flex flex-col">
                                                    <VisualArray array={queueElements} />
                                                </div>

                                                <div className="shrink-0 flex flex-col items-center justify-end gap-1 pb-1.5 md:pb-4">
                                                    <p className="text-xs md:text-sm font-semibold text-blue-600">REAR</p>
                                                    <p className="text-lg md:text-2xl text-blue-600">←</p>
                                                </div>
                                            </div>
                                        </div>
                                    </VisualArrayContainer>
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
                    onResetArray={resetQueueOnly}
                    onSubmit={submitEditorCode}
                    onNext={handleChallengeNext}
                    showNextButton={showNextAction}
                    resetDisabled={isAnimating}
                    resetArrayDisabled={isAnimating}
                    submitDisabled={isAnimating}
                    nextDisabled={isAnimating}
                />
            </main>
        </div>
    );
}
