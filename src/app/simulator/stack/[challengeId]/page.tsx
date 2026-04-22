'use client';

import { useEffect, useRef, useState } from "react";
import { StackElement, StackElementAnimationState } from "@/app/simulator/components/stack/types";
import { createStackElement, createStackElements } from "@/app/simulator/components/stack/utils";
import ChallengeInstructions from "@/app/simulator/components/ChallengeInstructions";
import ChallengeCompletedModal from "@/app/simulator/components/ChallengeCompletedModal";
import CodeEditorPanel from "@/app/simulator/components/CodeEditorPanel";
import VisualStack from "@/app/simulator/components/stack/VisualStack";
import { CHALLENGE_REGISTRY } from "../challenges/registry";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ChallengeConfig, DEFAULT_RUNNER_PARAMETER_NAMES } from "../../array/challenges/runner";
import { createChallengeRunner } from "../challenges/runner";

type ChallengeResultSummary = {
    name: string;
    input: string;
    expected: string;
    actual: string;
    passed: boolean | null;
    statusText: string;
};

export default function SimulationStack() {
    const params = useParams<{ challengeId: string }>();
    const challengeId = params?.challengeId;
    const challenge = challengeId ? CHALLENGE_REGISTRY[challengeId] : undefined;

    if (!challenge) {
        return <div className="p-8 text-center text-gray-500">Challenge not found</div>;
    }

    return <SimulationStackCore challenge={challenge} challengeId={challengeId} />;
}

function SimulationStackCore({ challenge, challengeId }: { challenge: ChallengeConfig, challengeId: string }) {
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
        ? `/simulator/stack/${orderedChallengeIds[currentChallengeIndex + 1]}`
        : "/simulator";

    const runnerParameterNames = challenge.programStructure?.parameterNames
        ?? challenge.runnerParameterNames
        ?? DEFAULT_RUNNER_PARAMETER_NAMES;

    const initialInputs = challenge.testCases[0]?.inputs
        ?? { stack: challenge.testCases[0]?.input ?? [] };

    // The test case input has the top of the stack at the end (right-most element),
    // but our VisualStack expects the top of the stack to be at index 0 (start of the array).
    // So we reverse the seeds.
    const getReversedSeeds = () => {
        const reversed: Record<string, (string | number)[]> = {};
        for (const key of Object.keys(initialInputs)) {
            reversed[key] = [...initialInputs[key]].reverse();
        }
        return reversed;
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

    const [stacks, setStacks] = useState<Record<string, StackElement[]>>({});
    const [editorCode, setEditorCode] = useState<string>(initialEditorCode);

    const MIN_LEFT_PANE_PERCENT = 45;
    const MAX_LEFT_PANE_PERCENT = 60;

    const [leftPaneWidth, setLeftPaneWidth] = useState<number>(50);
    const [isResizing, setIsResizing] = useState<boolean>(false);
    const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
    const [resultSummaries, setResultSummaries] = useState<ChallengeResultSummary[] | null>(null);
    const [isCompleted, setIsCompleted] = useState<boolean>(false);
    const [isChallengeCompletedModalOpen, setIsChallengeCompletedModalOpen] = useState<boolean>(false);
    const [showNextAction, setShowNextAction] = useState<boolean>(false);

    const workspaceRef = useRef<HTMLDivElement | null>(null);
    const stacksRef = useRef<Record<string, StackElement[]>>({});
    const logicalStacksRef = useRef<Record<string, (string | number)[]>>({});
    const isAnimatingRef = useRef<boolean>(false);

    const [isAnimating, setIsAnimating] = useState<boolean>(false);

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    const delay = {
        interval: 150,
        focus: 150,
    }

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

    const commitStacks = (nextStacks: Record<string, StackElement[]>) => {
        stacksRef.current = nextStacks;
        setStacks(nextStacks);
    };

    const commitStack = (stackName: string, nextStack: StackElement[]) => {
        commitStacks({ ...stacksRef.current, [stackName]: nextStack });
    };

    const setAnimatingState = (nextIsAnimating: boolean) => {
        isAnimatingRef.current = nextIsAnimating;
        setIsAnimating(nextIsAnimating);
    };

    const challengeQueueRef = useRef(Promise.resolve());

    const enqueueChallengeAction = <T,>(action: () => Promise<T>): Promise<T> => {
        const next = challengeQueueRef.current.then(action, action);
        challengeQueueRef.current = next.then(() => undefined, () => undefined);
        return next;
    };

    const isPromiseLike = (value: unknown): value is PromiseLike<unknown> => {
        if (typeof value !== "object" || value === null) {
            return false;
        }

        const maybeThenable = value as { then?: unknown };
        return typeof maybeThenable.then === "function";
    };

    useEffect(() => {
        const seeds = getReversedSeeds();
        const initialStacks: Record<string, StackElement[]> = {};
        for (const key of Object.keys(seeds)) {
            initialStacks[key] = createStackElements(...seeds[key]);
        }
        commitStacks(initialStacks);
        logicalStacksRef.current = { ...seeds };
    }, []);

    const resetStructureState = () => {
        const seeds = getReversedSeeds();
        const initialStacks: Record<string, StackElement[]> = {};
        for (const key of Object.keys(seeds)) {
            initialStacks[key] = createStackElements(...seeds[key]);
        }
        commitStacks(initialStacks);
        logicalStacksRef.current = { ...seeds };
        setAnimatingState(false);
        setIsCompleted(false);
        setIsChallengeCompletedModalOpen(false);
        setShowNextAction(false);
        challengeQueueRef.current = Promise.resolve();
    };

    useEffect(() => {
        stacksRef.current = stacks;
    }, [stacks]);

    useEffect(() => {
        isAnimatingRef.current = isAnimating;
    }, [isAnimating]);

    useEffect(() => {
        if (!isResizing) return;

        const onMouseMove = (event: MouseEvent) => {
            if (!workspaceRef.current) return;

            const bounds = workspaceRef.current.getBoundingClientRect();
            const nextPercent = ((event.clientX - bounds.left) / bounds.width) * 100;
            const clampedPercent = Math.max(MIN_LEFT_PANE_PERCENT, Math.min(MAX_LEFT_PANE_PERCENT, nextPercent));
            setLeftPaneWidth(clampedPercent);
        };

        const onMouseUp = () => setIsResizing(false);

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, [isResizing, MAX_LEFT_PANE_PERCENT, MIN_LEFT_PANE_PERCENT]);

    const animatePush = async (stackName: string, value: string | number) => {
        setAnimatingState(true);
        const newElement = createStackElement(value, StackElementAnimationState.NewPushed);
        const currentStack = stacksRef.current[stackName] || [];
        const nextStack = [newElement, ...currentStack];
        commitStack(stackName, nextStack);
        await sleep(delay.focus + 150);

        newElement.animationState = StackElementAnimationState.Default;
        commitStack(stackName, [...nextStack]);
        setAnimatingState(false);
    };

    const animatePop = async (stackName: string) => {
        const currentStack = stacksRef.current[stackName] || [];
        if (currentStack.length === 0) return;

        setAnimatingState(true);
        const newStack = [...currentStack];
        newStack[0].animationState = StackElementAnimationState.Popping;
        commitStack(stackName, newStack);
        await sleep(delay.focus + 300);

        commitStack(stackName, (stacksRef.current[stackName] || []).slice(1));
        setAnimatingState(false);
    };

    const animatePeek = async (stackName: string) => {
        const currentStack = stacksRef.current[stackName] || [];
        if (currentStack.length === 0) return;

        setAnimatingState(true);
        const newStack = [...currentStack];
        newStack[0].animationState = StackElementAnimationState.HighlightedGreen;
        commitStack(stackName, newStack);
        await sleep(delay.focus + 200);

        newStack[0].animationState = StackElementAnimationState.Default;
        commitStack(stackName, [...newStack]);
        setAnimatingState(false);
    };

    const animateClear = async (stackName: string) => {
        setAnimatingState(true);
        commitStack(stackName, []);
        await sleep(delay.focus);
        setAnimatingState(false);
    };

    type ChallengeStackApi = {
        push: (value: string | number) => void;
        pop: () => string | number | undefined;
        peek: () => string | number | undefined;
        size: () => number;
        isEmpty: () => boolean;
        clear: () => void;
    };

    type ChallengeIoApi = {
        println: (message: unknown) => void;
    };

    const createChallengeApi = (stackName: string): ChallengeStackApi => ({
        push: (value) => {
            if (logicalStacksRef.current[stackName].length < getMaxElements()) {
                logicalStacksRef.current[stackName].unshift(value);
                void enqueueChallengeAction(() => animatePush(stackName, value));
            } else {
                writeToConsole(`ERROR: Stack ${stackName} overflow!`);
            }
        },
        pop: () => {
            if (logicalStacksRef.current[stackName].length > 0) {
                const val = logicalStacksRef.current[stackName].shift();
                void enqueueChallengeAction(() => animatePop(stackName));
                return val;
            }
            writeToConsole(`ERROR: Stack ${stackName} underflow!`);
            return undefined;
        },
        peek: () => {
            if (logicalStacksRef.current[stackName].length > 0) {
                const val = logicalStacksRef.current[stackName][0];
                void enqueueChallengeAction(() => animatePeek(stackName));
                return val;
            }
            return undefined;
        },
        size: () => logicalStacksRef.current[stackName].length,
        isEmpty: () => logicalStacksRef.current[stackName].length === 0,
        clear: () => {
            logicalStacksRef.current[stackName] = [];
            void enqueueChallengeAction(() => animateClear(stackName));
        },
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

    const resetStackOnly = () => {
        resetStructureState();
        setIsCompleted(false);
        setConsoleOutput([]);
        setResultSummaries(null);
    };

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
        const valuesMap: Record<string, (string | number)[]> = {};
        const apis: Record<string, ChallengeStackApi> = {};
        const maxElements = challenge.maxCapacity.desktop;

        for (const [name, arr] of Object.entries(seedInputs)) {
            valuesMap[name] = [...arr].reverse();
            apis[name] = {
                push: (value: string | number) => {
                    if (valuesMap[name].length >= maxElements) return;
                    valuesMap[name].unshift(value);
                },
                pop: (): string | number | undefined => {
                    if (valuesMap[name].length === 0) return undefined;
                    return valuesMap[name].shift();
                },
                peek: (): string | number | undefined => {
                    if (valuesMap[name].length === 0) return undefined;
                    return valuesMap[name][0];
                },
                size: () => valuesMap[name].length,
                isEmpty: () => valuesMap[name].length === 0,
                clear: () => {
                    valuesMap[name].length = 0;
                }
            };
        }

        return {
            apis,
            getValues: () => {
                const res: Record<string, (string | number)[]> = {};
                for (const [name, arr] of Object.entries(valuesMap)) {
                    res[name] = [...arr].reverse();
                }
                return res;
            }
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
            const caseInputs = testCase.inputs ?? { stack: testCase.input ?? [] };
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
            const stackNames = Object.keys(initialInputs);
            for (const name of stackNames) {
                context[name] = createChallengeApi(name);
            }

            const result = runner(...buildRunnerArgs(context));
            let resolvedResult: unknown = result;
            if (result instanceof Promise) {
                resolvedResult = await result;
            }
            await challengeQueueRef.current;
            await sleep(500);

            const finalValues: Record<string, (string | number)[]> = {};
            for (const [name, arr] of Object.entries(logicalStacksRef.current)) {
                finalValues[name] = [...arr].reverse();
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

            // Run remaining test cases silently without visual animation.
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

    const numStacks = Object.keys(stacks).length;

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

                {/* Stacks display */}
                <div className="flex flex-col h-[40vh] lg:h-full overflow-hidden border-b lg:border-b-0 lg:border-r border-gray-200">
                    <ChallengeInstructions
                        title={challenge.title}
                        description={challenge.description}
                        completed={isCompleted}
                    />

                    <div className={`flex-1 overflow-hidden relative flex ${numStacks > 1 ? 'flex-row' : 'flex-col'}`}>
                        {Object.entries(stacks).map(([name, stackElements]) => (
                            <div key={name} className="flex-1 flex flex-col items-center border-r border-gray-100 last:border-r-0">
                                {numStacks > 1 && (
                                    <div className="text-sm font-semibold text-gray-500 pt-2 pb-1 bg-gray-50 w-full text-center border-b border-gray-200 shadow-sm">
                                        {name}
                                    </div>
                                )}
                                <div className="flex-1 w-full relative">
                                    <VisualStack stack={stackElements} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div >

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
                    onResetArray={resetStackOnly}
                    onSubmit={submitEditorCode}
                    onNext={handleChallengeNext}
                    showNextButton={showNextAction}
                    resetDisabled={isAnimating}
                    resetArrayDisabled={isAnimating}
                    submitDisabled={isAnimating}
                    nextDisabled={isAnimating}
                />

            </main >
        </div >
    );
}
