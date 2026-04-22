'use client';

import { useEffect, useRef, useState } from "react";
import { ArrayElement, ArrayElementAnimationState } from "@/app/simulator/components/array-list/types";
import { createArrayElement, createArrayElements } from "@/app/simulator/components/array-list/utils";
import ChallengeInstructions from "@/app/simulator/components/ChallengeInstructions";
import ChallengeCompletedModal from "@/app/simulator/components/ChallengeCompletedModal";
import CodeEditorPanel from "@/app/simulator/components/CodeEditorPanel";
import VisualArrayContainer from "@/app/simulator/components/VisualArrayContainer";
import VisualArray from "@/app/simulator/components/array-list/VisualArray";
import { useParams } from "next/navigation";
import { CHALLENGE_REGISTRY } from "../challenges/registry";
import { createChallengeRunner, DEFAULT_RUNNER_PARAMETER_NAMES, ChallengeConfig } from "../challenges/runner";

type ChallengeResultSummary = {
    name: string;
    input: string;
    expected: string;
    actual: string;
    passed: boolean | null;
    statusText: string;
};

export default function SimulationArrayChallenge() {
    const params = useParams<{ challengeId: string }>();
    const challengeId = params?.challengeId;
    const challenge = challengeId ? CHALLENGE_REGISTRY[challengeId] : undefined;

    if (!challenge) {
        return <div className="p-8 text-center text-gray-500">Challenge not found</div>;
    }

    return <SimulationArrayCore challenge={challenge} challengeId={challengeId} />;
}

function SimulationArrayCore({ challenge, challengeId }: { challenge: ChallengeConfig, challengeId: string }) {
    const runnerParameterNames = challenge.programStructure?.parameterNames
        ?? challenge.runnerParameterNames
        ?? DEFAULT_RUNNER_PARAMETER_NAMES;

    const initialInputs = challenge.testCases[0]?.inputs
        ?? { array: challenge.testCases[0]?.input ?? [] };

    const getSeeds = () => {
        const seeds: Record<string, (string | number)[]> = {};
        for (const key of Object.keys(initialInputs)) {
            seeds[key] = [...initialInputs[key]];
        }
        return seeds;
    };

    const initialEditorCode = challenge.initialEditorCode;

    // Placeholder for future DB sync.
    const syncChallengeResult = async (_passed: boolean) => {
    };

    const handleChallengeCompleted = () => {
    };

    const handleChallengeMenu = () => {
        alert("Handle Back To Menu Todo")
        setIsChallengeCompletedModalOpen(false);
    };

    const handleChallengeNext = () => {
        alert("Handle Next TODO")
        setIsChallengeCompletedModalOpen(false);
    };

    const [arrays, setArrays] = useState<Record<string, ArrayElement[]>>({});
    const [editorCode, setEditorCode] = useState<string>(
        initialEditorCode
    );

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
    const arraysRef = useRef<Record<string, ArrayElement[]>>({});
    const arraysSizeRef = useRef<Record<string, number>>({});
    const logicalArraysRef = useRef<Record<string, (string | number)[]>>({});
    const isAnimatingRef = useRef<boolean>(false);

    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>("");
    const [index, setIndex] = useState<number>(0);

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    const delay = {
        interval: 150,
        focus: 150,
        get: 50,
        scan: 50, // Faster scanning for selection sort (lower = faster)
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

    const writeIndexError = (arrayName: string, operation: string, index: number, size: number) => {
        writeToConsole(`ERROR: ${arrayName}.${operation} index out of bounds (index=${index}, size=${size}).`);
    };

    const commitArrays = (nextArrays: Record<string, ArrayElement[]>) => {
        arraysRef.current = nextArrays;
        setArrays(nextArrays);
    };

    const commitArray = (arrayName: string, nextArray: ArrayElement[]) => {
        commitArrays({ ...arraysRef.current, [arrayName]: nextArray });
    };

    const updateLogicalSize = (arrayName: string, delta: number) => {
        arraysSizeRef.current[arrayName] = Math.max(0, (arraysSizeRef.current[arrayName] || 0) + delta);
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

    // Seed Array
    useEffect(() => {
        const seeds = getSeeds();
        const initialArrays: Record<string, ArrayElement[]> = {};
        for (const key of Object.keys(seeds)) {
            initialArrays[key] = createArrayElements(...seeds[key]);
            arraysSizeRef.current[key] = seeds[key].length;
        }
        commitArrays(initialArrays);
        logicalArraysRef.current = { ...seeds };
    }, []);

    const resetStructureState = () => {
        const seeds = getSeeds();
        const initialArrays: Record<string, ArrayElement[]> = {};
        for (const key of Object.keys(seeds)) {
            initialArrays[key] = createArrayElements(...seeds[key]);
            arraysSizeRef.current[key] = seeds[key].length;
        }
        commitArrays(initialArrays);
        logicalArraysRef.current = { ...seeds };
        setInputValue("");
        setIndex(0);
        setAnimatingState(false);
        setIsCompleted(false);
        setIsChallengeCompletedModalOpen(false);
        setShowNextAction(false);
        challengeQueueRef.current = Promise.resolve();
    };

    useEffect(() => {
        arraysRef.current = arrays;
    }, [arrays]);

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

    // Insert an item at a specific index
    const animateInsertAt = async (arrayName: string, index: number, value: string | number) => {
        if (isAnimatingRef.current) return;
        setAnimatingState(true);

        const currentArray = arraysRef.current[arrayName] || [];
        const invisible = createArrayElement(value, ArrayElementAnimationState.Invisible);
        let newArray = [...currentArray, invisible];
        commitArray(arrayName, newArray);
        await sleep(delay.interval);

        for (let i = newArray.length - 1; i > index; i--) {
            const temp = [...newArray];
            temp[i] = temp[i - 1];
            temp[i - 1] = invisible;
            commitArray(arrayName, temp);
            await sleep(delay.interval);
            newArray = temp;
        }

        invisible.animationState = ArrayElementAnimationState.NewInserted;
        commitArray(arrayName, [...newArray]);
        await sleep(delay.get);

        invisible.animationState = ArrayElementAnimationState.Default;
        commitArray(arrayName, [...newArray]);
        setAnimatingState(false);
    }

    const animateInsertBack = async (arrayName: string, value: string | number) => {
        if (isAnimatingRef.current) return;
        setAnimatingState(true);

        const inserted = createArrayElement(value, ArrayElementAnimationState.NewInserted);
        const currentArray = arraysRef.current[arrayName] || [];
        const nextArray = [...currentArray, inserted];
        commitArray(arrayName, nextArray);

        await sleep(delay.focus + 80);

        inserted.animationState = ArrayElementAnimationState.Default;
        commitArray(arrayName, [...nextArray]);
        setAnimatingState(false);
    }

    const animateRemoveAt = async (arrayName: string, index: number) => {
        if (isAnimatingRef.current) return;
        setAnimatingState(true);

        const currentArray = arraysRef.current[arrayName] || [];
        let newArray = [...currentArray];
        const invisible = newArray[index];

        invisible.animationState = ArrayElementAnimationState.RemovedInvisible;
        commitArray(arrayName, newArray);
        await sleep(delay.focus + 300);

        invisible.animationState = ArrayElementAnimationState.Invisible;

        for (let i = index + 1; i < newArray.length; i++) {
            const temp = [...newArray];
            temp[i - 1] = temp[i];
            temp[i] = invisible;
            commitArray(arrayName, temp);
            await sleep(delay.interval);
            newArray = [...temp];
        }

        commitArray(arrayName, newArray.slice(0, -1));
        setAnimatingState(false);
    }

    const animateRemoveBack = async (arrayName: string) => {
        if (isAnimatingRef.current) return;
        const new_array = [...(arraysRef.current[arrayName] || [])];
        new_array.pop();
        commitArray(arrayName, new_array);

        // This is array-specific logic from original page
        // it updates the `index` state used by the manual controls on the left.
        // It's mostly irrelevant for the challenge runner but we keep it safe.
        if ((arraysRef.current[arrayName] || []).length > 0 && index === (arraysRef.current[arrayName] || []).length) {
            setIndex(current => current - 1);
        }
    }

    const animateSetAt = async (arrayName: string, index: number, newValue: number | string) => {
        if (isAnimatingRef.current) return;
        setAnimatingState(true);

        const newArray = [...(arraysRef.current[arrayName] || [])];
        newArray[index].animationState = ArrayElementAnimationState.HighlightedOrange;
        commitArray(arrayName, newArray);
        await sleep(delay.focus + 180);

        newArray[index].value = newValue;
        commitArray(arrayName, [...newArray]);
        await sleep(delay.focus + 120);

        newArray[index].animationState = ArrayElementAnimationState.Default;
        commitArray(arrayName, [...newArray]);

        setInputValue("");
        setAnimatingState(false);
    }

    const animateSwap = async (arrayName: string, leftIndex: number, rightIndex: number) => {
        if (isAnimatingRef.current) return;
        setAnimatingState(true);

        try {
            const newArray = [...(arraysRef.current[arrayName] || [])];

            newArray[leftIndex].animationState = ArrayElementAnimationState.HighlightedOrange;
            newArray[rightIndex].animationState = ArrayElementAnimationState.HighlightedOrange;
            commitArray(arrayName, [...newArray]);
            await sleep(delay.focus + 90);

            const temp = newArray[leftIndex];
            newArray[leftIndex] = newArray[rightIndex];
            newArray[rightIndex] = temp;

            newArray[leftIndex].animationState = ArrayElementAnimationState.HighlightedOrange;
            newArray[rightIndex].animationState = ArrayElementAnimationState.HighlightedOrange;
            commitArray(arrayName, [...newArray]);
            await sleep(delay.focus + 140);

            newArray[leftIndex].animationState = ArrayElementAnimationState.Default;
            newArray[rightIndex].animationState = ArrayElementAnimationState.Default;
            commitArray(arrayName, [...newArray]);
        } finally {
            setAnimatingState(false);
        }
    }

    const animateGet = async (arrayName: string, index: number): Promise<void> => {
        if (isAnimatingRef.current) return;
        setAnimatingState(true);

        const newArray = [...(arraysRef.current[arrayName] || [])];
        newArray[index].animationState = ArrayElementAnimationState.HighlightedGreen;
        commitArray(arrayName, [...newArray]);
        await sleep(delay.focus + 200);

        newArray[index].animationState = ArrayElementAnimationState.Default;
        commitArray(arrayName, [...newArray]);
        setAnimatingState(false);
    }

    type ChallengeArrayApi = {
        insertAt: (index: number, value: string | number) => Promise<void>;
        insertFront: (value: string | number) => Promise<void>;
        insertBack: (value: string | number) => Promise<void>;
        removeAt: (index: number) => Promise<string | number | undefined>;
        removeFront: () => Promise<string | number | undefined>;
        removeBack: () => Promise<string | number | undefined>;
        setAt: (index: number, newValue: number | string) => Promise<void>;
        get: (index: number) => string | number | undefined;
        swap: (leftIndex: number, rightIndex: number) => Promise<void>;
        size: () => number;
    };

    type ChallengeIoApi = {
        println: (message: unknown) => void;
    };

    const createChallengeApi = (arrayName: string): ChallengeArrayApi => ({
        insertAt: (position, value) => {
            const currentSize = arraysSizeRef.current[arrayName] || 0;
            if (currentSize < getMaxElements() && position >= 0 && position <= currentSize) {
                updateLogicalSize(arrayName, 1);
                logicalArraysRef.current[arrayName].splice(position, 0, value);
            } else {
                if (position < 0 || position > currentSize) {
                    writeIndexError(arrayName, "insertAt", position, currentSize);
                }
                return Promise.resolve();
            }
            return enqueueChallengeAction(() => animateInsertAt(arrayName, position, value));
        },
        insertFront: (value) => {
            if ((arraysSizeRef.current[arrayName] || 0) < getMaxElements()) {
                updateLogicalSize(arrayName, 1);
                logicalArraysRef.current[arrayName].unshift(value);
            } else {
                return Promise.resolve();
            }
            return enqueueChallengeAction(() => animateInsertAt(arrayName, 0, value));
        },
        insertBack: (value) => {
            const currentSize = arraysSizeRef.current[arrayName] || 0;
            if (currentSize < getMaxElements()) {
                updateLogicalSize(arrayName, 1);
                logicalArraysRef.current[arrayName].push(value);
                if (currentSize === 0) {
                    return enqueueChallengeAction(() => animateInsertAt(arrayName, 0, value));
                } else {
                    return enqueueChallengeAction(() => animateInsertBack(arrayName, value));
                }
            }
            return Promise.resolve();
        },
        removeAt: (position) => {
            const currentSize = arraysSizeRef.current[arrayName] || 0;
            let val: string | number | undefined = undefined;
            if (position >= 0 && position < currentSize) {
                updateLogicalSize(arrayName, -1);
                val = logicalArraysRef.current[arrayName].splice(position, 1)[0];
                return enqueueChallengeAction(() => animateRemoveAt(arrayName, position).then(() => val));
            } else {
                writeIndexError(arrayName, "removeAt", position, currentSize);
                return Promise.resolve(undefined);
            }
        },
        removeFront: () => {
            if ((arraysSizeRef.current[arrayName] || 0) > 0) {
                updateLogicalSize(arrayName, -1);
                const val = logicalArraysRef.current[arrayName].shift();
                return enqueueChallengeAction(() => animateRemoveAt(arrayName, 0).then(() => val));
            }
            return Promise.resolve(undefined);
        },
        removeBack: () => {
            if ((arraysSizeRef.current[arrayName] || 0) > 0) {
                updateLogicalSize(arrayName, -1);
                const val = logicalArraysRef.current[arrayName].pop();
                return enqueueChallengeAction(() => animateRemoveBack(arrayName).then(() => val));
            }
            return Promise.resolve(undefined);
        },
        setAt: (position, newValue) => {
            const currentSize = arraysSizeRef.current[arrayName] || 0;
            if (position >= 0 && position < currentSize) {
                logicalArraysRef.current[arrayName][position] = newValue;
                return enqueueChallengeAction(() => animateSetAt(arrayName, position, newValue));
            } else {
                writeIndexError(arrayName, "setAt", position, currentSize);
                return Promise.resolve();
            }
        },
        get: (position) => {
            const currentSize = arraysSizeRef.current[arrayName] || 0;
            if (position < 0 || position >= currentSize) {
                writeIndexError(arrayName, "get", position, currentSize);
                return undefined;
            }
            const value = logicalArraysRef.current[arrayName][position];
            void enqueueChallengeAction(() => animateGet(arrayName, position));
            return value;
        },
        swap: (leftIndex, rightIndex) => {
            const currentSize = arraysSizeRef.current[arrayName] || 0;
            if (leftIndex < 0 || rightIndex < 0 || leftIndex >= currentSize || rightIndex >= currentSize) {
                if (leftIndex < 0 || leftIndex >= currentSize) {
                    writeIndexError(arrayName, "swap", leftIndex, currentSize);
                }
                if (rightIndex < 0 || rightIndex >= currentSize) {
                    writeIndexError(arrayName, "swap", rightIndex, currentSize);
                }
                return Promise.resolve();
            }
            if (leftIndex === rightIndex) return Promise.resolve();

            const temp = logicalArraysRef.current[arrayName][leftIndex];
            logicalArraysRef.current[arrayName][leftIndex] = logicalArraysRef.current[arrayName][rightIndex];
            logicalArraysRef.current[arrayName][rightIndex] = temp;

            return enqueueChallengeAction(() => animateSwap(arrayName, leftIndex, rightIndex));
        },
        size: () => arraysSizeRef.current[arrayName] || 0,
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

    const resetArrayOnly = () => {
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
        const apis: Record<string, any> = {};
        const maxElements = challenge.maxCapacity.desktop;

        for (const [name, arr] of Object.entries(seedInputs)) {
            valuesMap[name] = [...arr];
            apis[name] = {
                insertAt: async (position: number, value: string | number) => {
                    if (position < 0 || position > valuesMap[name].length) return;
                    if (valuesMap[name].length >= maxElements) return;
                    valuesMap[name].splice(position, 0, value);
                },
                insertFront: async (value: string | number) => {
                    if (valuesMap[name].length >= maxElements) return;
                    valuesMap[name].unshift(value);
                },
                insertBack: async (value: string | number) => {
                    if (valuesMap[name].length >= maxElements) return;
                    valuesMap[name].push(value);
                },
                removeAt: async (position: number): Promise<string | number | undefined> => {
                    if (position < 0 || position >= valuesMap[name].length) return undefined;
                    const removed = valuesMap[name].splice(position, 1);
                    return removed[0];
                },
                removeFront: async (): Promise<string | number | undefined> => {
                    if (valuesMap[name].length === 0) return undefined;
                    return valuesMap[name].shift();
                },
                removeBack: async (): Promise<string | number | undefined> => {
                    if (valuesMap[name].length === 0) return undefined;
                    return valuesMap[name].pop();
                },
                setAt: async (position: number, value: string | number) => {
                    if (position < 0 || position >= valuesMap[name].length) return;
                    valuesMap[name][position] = value;
                },
                get: (position: number): string | number | undefined => {
                    if (position < 0 || position >= valuesMap[name].length) return undefined;
                    return valuesMap[name][position];
                },
                swap: async (leftIndex: number, rightIndex: number) => {
                    if (leftIndex < 0 || rightIndex < 0 || leftIndex >= valuesMap[name].length || rightIndex >= valuesMap[name].length) {
                        return;
                    }
                    if (leftIndex === rightIndex) return;

                    const temp = valuesMap[name][leftIndex];
                    valuesMap[name][leftIndex] = valuesMap[name][rightIndex];
                    valuesMap[name][rightIndex] = temp;
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
            const caseInputs = testCase.inputs ?? { array: testCase.input ?? [] };
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
            const arrayNames = Object.keys(initialInputs);
            for (const name of arrayNames) {
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
            for (const [name, arr] of Object.entries(logicalArraysRef.current)) {
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

    const numArrays = Object.keys(arrays).length;

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

                {/* Array display - Constrained height */}
                <div className="flex flex-col h-[40vh] lg:h-full overflow-hidden border-b lg:border-b-0 lg:border-r border-gray-200">
                    <ChallengeInstructions
                        title={challenge.title}
                        description={challenge.description}
                        completed={isCompleted}
                    />

                    <div className="flex-1 overflow-y-auto relative flex flex-col min-h-0">
                        {Object.entries(arrays).map(([name, arrayElements]) => (
                            <div key={name} className="flex-1 flex flex-col items-center border-b border-gray-100 last:border-b-0 min-h-[200px]">
                                {numArrays > 1 && (
                                    <div className="text-sm font-semibold text-gray-500 pt-2 pb-1 bg-gray-50 w-full text-center border-b border-gray-200 shadow-sm flex-shrink-0">
                                        {name}
                                    </div>
                                )}
                                <div className="flex-1 w-full relative min-h-0 flex flex-col">
                                    <VisualArrayContainer>
                                        <VisualArray array={arrayElements} />
                                    </VisualArrayContainer>
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
                    onResetArray={resetArrayOnly}
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
};
