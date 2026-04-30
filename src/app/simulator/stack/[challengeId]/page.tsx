'use client';

import { useEffect, useRef, useState } from "react";
import { StackElement, StackElementAnimationState } from "@/app/simulator/components/stack/types";
import { createStackElement, createStackElements } from "@/app/simulator/components/stack/utils";
import ChallengeInstructions from "@/app/simulator/components/ChallengeInstructions";
import ChallengeCompletedModal from "@/app/simulator/components/ChallengeCompletedModal";
import CodeEditorPanel from "@/app/simulator/components/CodeEditorPanel";
import VisualStack from "@/app/simulator/components/stack/VisualStack";
import { useAuth } from "@clerk/nextjs";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { syncSimulatorProgress } from "../../../lib/simulatorProgress";
import { fetchSimulatorChallenge, SimulatorChallengeDTO } from "@/app/lib/simulators";
import { ChallengeConfig, createChallengeRunner, ChallengeRunner, DEFAULT_RUNNER_PARAMETER_NAMES } from "../challenges/runner";
import SimulatorError from "../../components/SimulatorError";

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
    const [challenge, setChallenge] = useState<SimulatorChallengeDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!challengeId) return;

        setLoading(true);
        fetchSimulatorChallenge("stack", challengeId)
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

    return <SimulationStackCore challenge={config} challengeId={challengeId} nextChallengeSlug={challenge.next_challenge_slug} />;
}

function SimulationStackCore({ challenge, challengeId, nextChallengeSlug }: { challenge: ChallengeConfig, challengeId: string, nextChallengeSlug?: string }) {
    const router = useRouter();
    const { isLoaded, isSignedIn, userId, getToken } = useAuth();
    const searchParams = useSearchParams();
    const nextPath = searchParams.get("next");

    const inferredNextPath = nextChallengeSlug
        ? `/simulator/stack/${nextChallengeSlug}`
        : "/simulator";

    const runnerParameterNames = challenge.programStructure?.parameterNames
        ?? challenge.runnerParameterNames
        ?? DEFAULT_RUNNER_PARAMETER_NAMES;

    const dsParam = runnerParameterNames[0] || 'stack';
    const firstCase = challenge.testCases[0];
    const initialInputs = firstCase?.inputs
        ? firstCase.inputs
        : (firstCase?.input && !Array.isArray(firstCase.input) && typeof firstCase.input === 'object')
            ? (firstCase.input as Record<string, any>)
            : { [dsParam]: firstCase?.input ?? [] };

    // The test case input has the top of the stack at the end (right-most element),
    // but our VisualStack expects the top of the stack to be at index 0 (start of the array).
    // So we reverse the seeds.
    const getReversedSeeds = () => {
        const reversed: Record<string, any> = {};
        for (const [key, value] of Object.entries(initialInputs)) {
            reversed[key] = Array.isArray(value) ? [...value].reverse() : value;
        }
        return reversed;
    };


    const initialEditorCode = challenge.initialEditorCode;

    const syncChallengeResult = async (passed: boolean) => {
        try {
            await syncSimulatorProgress({
                category: "stack",
                path: `/simulator/stack/${challengeId}`,
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
        for (const [key, value] of Object.entries(seeds)) {
            if (Array.isArray(value)) {
                initialStacks[key] = createStackElements(...value);
            }
        }
        commitStacks(initialStacks);
        logicalStacksRef.current = { ...seeds };
    }, []);

    const resetStructureState = () => {
        const seeds = getReversedSeeds();
        const initialStacks: Record<string, StackElement[]> = {};
        for (const [key, value] of Object.entries(seeds)) {
            if (Array.isArray(value)) {
                initialStacks[key] = createStackElements(...value);
            }
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
        await sleep(delay.focus + 150);

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
        await sleep(delay.focus + 150);

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

    const getSimulatorErrorLine = (error: unknown): number | null => {
        if (!(error instanceof Error) || !error.stack) return null;
        const match = error.stack.match(/simulator-solution\.js:(\d+)/) ||
            error.stack.match(/<anonymous>:(\d+):(\d+)/) ||
            error.stack.match(/Function:(\d+):(\d+)/);
        if (match) {
            const line = parseInt(match[1], 10);
            return Math.max(1, line - 2);
        }
        return null;
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
            const entries = Object.entries(out);
            if (entries.length === 1 && Array.isArray(entries[0][1])) {
                return formatArray(entries[0][1]);
            }
            return entries.map(([k, v]) => `${k}: ${Array.isArray(v) ? formatArray(v as any) : String(v)}`).join(" | ");
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
        inputs: any,
        expected: any,
        actual: any,
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

    const createHeadlessChallengeApi = (seedInputs: Record<string, any>) => {
        const valuesMap: Record<string, any> = {};
        const apis: Record<string, any> = {};
        const maxElements = challenge.maxCapacity.desktop;

        for (const [name, value] of Object.entries(seedInputs)) {
            if (!Array.isArray(value)) {
                apis[name] = value;
                valuesMap[name] = value;
                continue;
            }

            const arr = value;
            valuesMap[name] = [...arr].reverse();
            apis[name] = {
                push: (v: string | number) => {
                    if (valuesMap[name].length >= maxElements) return;
                    valuesMap[name].unshift(v);
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
                const res: Record<string, any> = {};
                for (const [name, value] of Object.entries(valuesMap)) {
                    if (Array.isArray(value)) {
                        res[name] = [...value].reverse();
                    }
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

        let runner: ChallengeRunner;
        try {
            runner = createChallengeRunner(code, runnerParameterNames);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Syntax Error";
            return additionalCases.map((testCase, i) => ({
                name: testCase.name || `Test Case ${i + 2}`,
                input: formatOutput(testCase.inputs ?? testCase.input ?? []),
                expected: testCase.expectedReturn !== undefined
                    ? formatOutput(testCase.expectedReturn)
                    : formatOutput(testCase.expected ?? []),
                actual: "Syntax Error",
                passed: false,
                statusText: `FAIL: ${message}`,
            }));
        }

        const summaries: ChallengeResultSummary[] = [];

        for (let i = 0; i < additionalCases.length; i++) {
            const testCase = additionalCases[i];
            const caseIndex = i + 1;
            const caseInputs = testCase.inputs
                ? testCase.inputs
                : (testCase.input && !Array.isArray(testCase.input) && typeof testCase.input === 'object')
                    ? (testCase.input as Record<string, any>)
                    : { [dsParam]: testCase.input ?? [] };
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
            for (const [name, value] of Object.entries(initialInputs)) {
                if (Array.isArray(value)) {
                    context[name] = createChallengeApi(name);
                } else {
                    context[name] = value;
                }
            }

            const result = runner(...buildRunnerArgs(context));
            let resolvedResult: unknown = result;
            if (result instanceof Promise) {
                resolvedResult = await result;
            }
            await challengeQueueRef.current;
            await sleep(500);

            const finalValues: Record<string, any> = {};
            for (const [name, value] of Object.entries(logicalStacksRef.current)) {
                if (Array.isArray(value)) {
                    finalValues[name] = [...value].reverse();
                }
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
            const line = getSimulatorErrorLine(error);
            setShowNextAction(false);
            writeToConsole(`ERROR${line ? ` (Line ${line})` : ""}: ${message}`);
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
