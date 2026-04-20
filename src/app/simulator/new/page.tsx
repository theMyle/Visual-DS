
'use client';

import { useEffect, useRef, useState } from "react";
import { ArrayElement, ArrayElementAnimationState } from "@/app/simulator/array-list/components/types";
import { createArrayElement, createArrayElements } from "@/app/simulator/array-list/components/utils";
import ChallengeInstructions from "@/app/simulator/components/ChallengeInstructions";
import ChallengeCompletedModal from "@/app/simulator/components/ChallengeCompletedModal";
import CodeEditorPanel from "@/app/simulator/components/CodeEditorPanel";
import VisualArrayContainer from "@/app/simulator/components/VisualArrayContainer";
import VisualArray from "@/app/simulator/array-list/components/VisualArray";
import { CHALLENGE_INTRO } from "./challenges";

type ChallengeResultSummary = {
    name: string;
    input: string;
    expected: string;
    actual: string;
    passed: boolean | null;
    statusText: string;
};

export default function SimulationArray() {
    const challenge = CHALLENGE_INTRO;
    const initialArraySeed = challenge.testCases[0]?.input ?? [];
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

    const [array, setArray] = useState<ArrayElement[]>([]);
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
    const arrayRef = useRef<ArrayElement[]>([]);
    const arraySizeRef = useRef<number>(initialArraySeed.length);
    const isAnimatingRef = useRef<boolean>(false);

    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>("");
    const [index, setIndex] = useState<number>(0);

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    const delay = {
        interval: 150,
        focus: 150,
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

    const writeIndexError = (operation: string, index: number, size: number) => {
        writeToConsole(`ERROR: ${operation} index out of bounds (index=${index}, size=${size}).`);
    };

    const commitArray = (nextArray: ArrayElement[]) => {
        arrayRef.current = nextArray;
        arraySizeRef.current = nextArray.length;
        setArray(nextArray);
    };

    const updateLogicalSize = (delta: number) => {
        arraySizeRef.current = Math.max(0, arraySizeRef.current + delta);
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
        const initial = createArrayElements(...initialArraySeed)
        commitArray(initial);
    }, []);

    const resetStructureState = () => {
        const seededArray = createArrayElements(...initialArraySeed);
        commitArray(seededArray);
        setInputValue("");
        setIndex(0);
        setAnimatingState(false);
        setIsCompleted(false);
        setIsChallengeCompletedModalOpen(false);
        setShowNextAction(false);
        challengeQueueRef.current = Promise.resolve();
    };

    useEffect(() => {
        arrayRef.current = array;
    }, [array]);

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
    const insertAt = async (index: number, value: string | number) => {
        if (isAnimatingRef.current) return;

        const maxElements = getMaxElements();
        const currentArray = arrayRef.current;
        if (currentArray.length >= maxElements) return;

        // prolly need to add check if index is invalid
        // better checking needed + frontend information feedback
        if (index < 0 || index > currentArray.length) {
            writeIndexError("insertAt", index, currentArray.length);
            return;
        }

        setAnimatingState(true);

        const invisible = createArrayElement(value, ArrayElementAnimationState.Invisible);

        // allocate space
        let newArray = [...currentArray, invisible];

        commitArray([...newArray]);
        await sleep(delay.interval);

        // move the invisible item to the desired index
        for (let i = newArray.length - 1; i > index; i--) {
            const temp = [...newArray];
            temp[i] = temp[i - 1];
            temp[i - 1] = invisible;
            commitArray(temp);
            await sleep(delay.interval);
            newArray = temp;
        };

        // show/insert the new item into the array
        invisible.animationState = ArrayElementAnimationState.NewInserted;
        commitArray([...newArray]);

        await sleep(delay.focus + 200);

        invisible.animationState = ArrayElementAnimationState.Default;
        commitArray([...newArray]);

        setAnimatingState(false);
    }


    // Insert item at start of the array
    const insertFront = async (value: string | number) => {
        await insertAt(0, value);
    };


    // Insert at the end of the array 
    const insertBack = async (value: string | number) => {
        if (isAnimatingRef.current) return;

        const maxElements = getMaxElements();
        const currentArray = arrayRef.current;
        if (currentArray.length >= maxElements) return;

        if (currentArray.length == 0) {
            await insertFront(value);
            return;
        }

        setAnimatingState(true);

        const inserted = createArrayElement(value, ArrayElementAnimationState.NewInserted);
        const nextArray = [...currentArray, inserted];
        commitArray(nextArray);

        // Give the insertion highlight a moment to resolve before returning to default.
        await sleep(delay.focus + 80);

        inserted.animationState = ArrayElementAnimationState.Default;
        commitArray([...nextArray]);

        setAnimatingState(false);
    }


    // remove item at specific index
    // shift the rest of the items forward / to the left
    const removeAt = async (index: number): Promise<string | number | undefined> => {
        // make the front invisible but keep space
        // show shifting of items
        // once invisible item is at the end, remove it

        if (isAnimatingRef.current) return;
        const currentArray = arrayRef.current;
        if (index < 0 || index > currentArray.length - 1) {
            writeIndexError("removeAt", index, currentArray.length);
            return;
        }
        setAnimatingState(true);

        let newArray = [...currentArray]
        const invisible = newArray[index];

        // animate removal
        invisible.animationState = ArrayElementAnimationState.RemovedInvisible;
        commitArray(newArray);
        await sleep(delay.focus + 300);

        invisible.animationState = ArrayElementAnimationState.Invisible;

        for (let i = index + 1; i < newArray.length; i++) {
            const temp = [...newArray];
            temp[i - 1] = temp[i];
            temp[i] = invisible;
            commitArray(temp);
            await sleep(delay.interval);
            newArray = [...temp];
        }

        // remove the item from the end
        commitArray(newArray.slice(0, -1));
        setAnimatingState(false);
        return invisible.value;
    }
    const removeFront = async (): Promise<string | number | undefined> => {
        return await removeAt(0);
    }


    // remove last item
    const removeBack = (): string | number | undefined => {
        if (isAnimatingRef.current) return;
        const new_array = [...arrayRef.current];
        const removed = new_array.pop();
        commitArray(new_array);

        if (arrayRef.current.length > 0 && index === arrayRef.current.length) {
            setIndex(current => current - 1);
        }

        return removed?.value;
    }


    // set value at specific index
    const setAt = async (index: number, newValue: number | string) => {
        if (isAnimatingRef.current) return;

        // TODO - validate idx
        const currentArray = arrayRef.current;
        if (index < 0 || index >= currentArray.length) {
            writeIndexError("setAt", index, currentArray.length);
            return;
        }

        setAnimatingState(true);
        const newArray = [...currentArray];

        newArray[index].animationState = ArrayElementAnimationState.HighlightedOrange;
        commitArray(newArray);
        await sleep(delay.focus + 180);

        newArray[index].value = newValue;
        commitArray([...newArray]);
        await sleep(delay.focus + 120);

        newArray[index].animationState = ArrayElementAnimationState.Default;
        commitArray([...newArray]);

        setInputValue("");
        setAnimatingState(false);
    }

    // swap two items in the array
    const swap = async (leftIndex: number, rightIndex: number) => {
        if (isAnimatingRef.current) return;

        const currentArray = arrayRef.current;
        if (leftIndex < 0 || rightIndex < 0 || leftIndex >= currentArray.length || rightIndex >= currentArray.length) {
            if (leftIndex < 0 || leftIndex >= currentArray.length) {
                writeIndexError("swap", leftIndex, currentArray.length);
            }
            if (rightIndex < 0 || rightIndex >= currentArray.length) {
                writeIndexError("swap", rightIndex, currentArray.length);
            }
            return;
        }

        if (leftIndex === rightIndex) {
            return;
        }

        setAnimatingState(true);

        try {
            const newArray = [...currentArray];

            // Step 1: mark both targets before the movement.
            newArray[leftIndex].animationState = ArrayElementAnimationState.HighlightedOrange;
            newArray[rightIndex].animationState = ArrayElementAnimationState.HighlightedOrange;
            commitArray([...newArray]);
            await sleep(delay.focus + 90);

            // Step 2: swap positions and keep orange highlight while layout animates.
            const temp = newArray[leftIndex];
            newArray[leftIndex] = newArray[rightIndex];
            newArray[rightIndex] = temp;

            newArray[leftIndex].animationState = ArrayElementAnimationState.HighlightedOrange;
            newArray[rightIndex].animationState = ArrayElementAnimationState.HighlightedOrange;
            commitArray([...newArray]);
            await sleep(delay.focus + 140);

            // Step 3: settle back to default.
            newArray[leftIndex].animationState = ArrayElementAnimationState.Default;
            newArray[rightIndex].animationState = ArrayElementAnimationState.Default;
            commitArray([...newArray]);
        } finally {
            setAnimatingState(false);
        }
    }

    const animateGet = async (index: number): Promise<void> => {
        if (isAnimatingRef.current) return;

        const currentArray = arrayRef.current;
        if (index < 0 || index >= currentArray.length) {
            return;
        }

        setAnimatingState(true);

        const newArray = [...currentArray];

        newArray[index].animationState = ArrayElementAnimationState.HighlightedGreen;
        commitArray([...newArray]);

        await sleep(delay.focus + 200);

        newArray[index].animationState = ArrayElementAnimationState.Default;
        commitArray([...newArray]);

        setAnimatingState(false);
    }

    // get item at specific idx (synchronous raw value for challenge logic)
    const get = (index: number): string | number | undefined => {
        const currentArray = arrayRef.current;
        if (index < 0 || index >= currentArray.length) {
            writeIndexError("get", index, currentArray.length);
            return;
        }

        const value = currentArray[index]?.value;
        void enqueueChallengeAction(() => animateGet(index));
        return value;
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

    const challengeApi: ChallengeArrayApi = {
        insertAt: (position, value) => {
            const currentSize = arraySizeRef.current;
            if (currentSize < getMaxElements() && position >= 0 && position <= currentSize) {
                updateLogicalSize(1);
            }

            return enqueueChallengeAction(() => insertAt(position, value));
        },
        insertFront: (value) => {
            if (arraySizeRef.current < getMaxElements()) {
                updateLogicalSize(1);
            }

            return enqueueChallengeAction(() => insertFront(value));
        },
        insertBack: (value) => {
            if (arraySizeRef.current < getMaxElements()) {
                updateLogicalSize(1);
            }

            return enqueueChallengeAction(() => Promise.resolve(insertBack(value)));
        },
        removeAt: (position) => {
            if (position >= 0 && position < arraySizeRef.current) {
                updateLogicalSize(-1);
            }

            return enqueueChallengeAction(() => removeAt(position));
        },
        removeFront: () => {
            if (arraySizeRef.current > 0) {
                updateLogicalSize(-1);
            }

            return enqueueChallengeAction(() => removeFront());
        },
        removeBack: () => {
            if (arraySizeRef.current > 0) {
                updateLogicalSize(-1);
            }

            return enqueueChallengeAction(() => Promise.resolve(removeBack()));
        },
        setAt: (position, newValue) => enqueueChallengeAction(() => setAt(position, newValue)),
        get: (position) => get(position),
        swap: (leftIndex, rightIndex) => enqueueChallengeAction(() => swap(leftIndex, rightIndex)),
        size: () => arraySizeRef.current,
    };

    const challengeIoApi: ChallengeIoApi = {
        println: (message) => {
            if (!isPromiseLike(message)) {
                writeToConsole(message);
                return;
            }

            // Keep promise-based prints sequenced with other challenge operations.
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

    // Programmatic getter for editor content.
    const getEditorCode = () => editorCode;

    // Programmatic setter for editor content.
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
        expected: (string | number)[],
        actual: (string | number)[],
        caseName?: string,
    ): ChallengeResultSummary => {
        const passed = arraysEqual(actual, expected);
        return {
            name: caseName || `Test Case ${caseIndex + 1}`,
            input: formatArray(input),
            expected: formatArray(expected),
            actual: formatArray(actual),
            passed,
            statusText: passed
                ? "PASS: Challenge output matches expected."
                : "FAIL: Challenge output does not match expected.",
        };
    };

    const createHeadlessChallengeApi = (seed: (string | number)[]) => {
        const values = [...seed];
        const maxElements = challenge.maxCapacity.desktop;

        const api = {
            insertAt: async (position: number, value: string | number) => {
                if (position < 0 || position > values.length) return;
                if (values.length >= maxElements) return;
                values.splice(position, 0, value);
            },
            insertFront: async (value: string | number) => {
                if (values.length >= maxElements) return;
                values.unshift(value);
            },
            insertBack: async (value: string | number) => {
                if (values.length >= maxElements) return;
                values.push(value);
            },
            removeAt: async (position: number): Promise<string | number | undefined> => {
                if (position < 0 || position >= values.length) return undefined;
                const removed = values.splice(position, 1);
                return removed[0];
            },
            removeFront: async (): Promise<string | number | undefined> => {
                if (values.length === 0) return undefined;
                return values.shift();
            },
            removeBack: async (): Promise<string | number | undefined> => {
                if (values.length === 0) return undefined;
                return values.pop();
            },
            setAt: async (position: number, value: string | number) => {
                if (position < 0 || position >= values.length) return;
                values[position] = value;
            },
            get: (position: number): string | number | undefined => {
                if (position < 0 || position >= values.length) return undefined;
                return values[position];
            },
            swap: async (leftIndex: number, rightIndex: number) => {
                if (leftIndex < 0 || rightIndex < 0 || leftIndex >= values.length || rightIndex >= values.length) {
                    return;
                }
                if (leftIndex === rightIndex) return;

                const temp = values[leftIndex];
                values[leftIndex] = values[rightIndex];
                values[rightIndex] = temp;
            },
            size: () => values.length,
        };

        return {
            api,
            getValues: () => [...values],
        };
    };

    const runBackgroundTestCases = async (code: string): Promise<ChallengeResultSummary[]> => {
        const additionalCases = challenge.testCases.slice(1);
        if (additionalCases.length === 0) return [];

        const runner = new Function("array", "io", `\n${code}\n\nif (typeof Solution !== 'function') {\n  throw new Error('Solution(array) is required');\n}\nreturn Solution(array);`);
        const summaries: ChallengeResultSummary[] = [];

        for (let i = 0; i < additionalCases.length; i++) {
            const testCase = additionalCases[i];
            const caseIndex = i + 1;
            const { api, getValues } = createHeadlessChallengeApi(testCase.input);
            const silentIo = {
                println: (_message: unknown) => {
                },
            };

            try {
                const result = runner(api, silentIo);
                if (result instanceof Promise) {
                    await result;
                }

                summaries.push(
                    createCaseSummary(
                        caseIndex,
                        testCase.input,
                        testCase.expected,
                        getValues(),
                        testCase.name || `Test Case ${caseIndex + 1}`,
                    ),
                );
            } catch {
                summaries.push({
                    name: testCase.name || `Test Case ${caseIndex + 1}`,
                    input: formatArray(testCase.input),
                    expected: formatArray(testCase.expected),
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
            const runner = new Function("array", "io", `\n${editorCode}\n\nif (typeof Solution !== 'function') {\n  throw new Error('Solution(array) is required');\n}\nreturn Solution(array);`);
            const result = runner(challengeApi, challengeIoApi);
            if (result instanceof Promise) {
                await result;
            }
            await challengeQueueRef.current;
            await sleep(1000);

            const finalValues = arrayRef.current.map((element) => element.value);
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

                    <VisualArrayContainer>
                        <VisualArray array={array} />
                    </VisualArrayContainer>
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
