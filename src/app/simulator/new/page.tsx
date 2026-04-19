
'use client';

import { useEffect, useRef, useState } from "react";
import { ArrayElement, ArrayElementAnimationState } from "@/app/simulator/array-list/components/types";
import { createArrayElement, createArrayElements } from "@/app/simulator/array-list/components/utils";
import ChallengeInstructions from "@/app/simulator/components/ChallengeInstructions";
import CodeEditorPanel from "@/app/simulator/components/CodeEditorPanel";
import VisualArrayContainer from "@/app/simulator/components/VisualArrayContainer";
import VisualArray from "@/app/simulator/array-list/components/VisualArray";

export default function SimulationArray() {
    const initialArraySeed: (string | number)[] = ["1", "2", "3", "4", "5"];

    const initialEditorCode = [
        "/*",
        "Array API Spec - These are array-specific methods for the coding challenge.",
        "",
        "Array {",
        "  get(index)                  - Returns the item at an index.",
        "  insertAt(index, value)      - Insert value at a specific index.",
        "  insertBack(value)           - Insert value at the end of the array.",
        "  insertFront(value)          - Insert value at the beginning of the array.",
        "  removeAt(index)             - Remove the item at a specific index and returns it.",
        "  removeBack()                - Remove the last item in the array and returns it.",
        "  removeFront()               - Remove the first item in the array and returns it.",
        "  setAt(index, value)         - Replace the value at a specific index.",
        "  size()                      - Return the current array size.",
        "  swap(indexA, indexB)        - Swap two items in the array.",
        "}",
        "",
        "io {",
        "  println(messageOrPromise)   - Write a value (or resolved Promise value) to the output panel.",
        "}",
        "",
        "Put challenge logic inside `Solution` Function.",
        "Note: use Array API methods only.",
        "*/",
        "",
        "function Solution(array) {",
        "   io.println(\"Hello World\");",
        "",
        "   let x = array.get(0);",
        "   io.println(\"array at index 0 is: \" + x);",
        "}",
        "",
        "",
        "",
    ].join("\n");

    const [array, setArray] = useState<ArrayElement[]>([]);
    const [editorCode, setEditorCode] = useState<string>(
        initialEditorCode
    );

    const MIN_LEFT_PANE_PERCENT = 45;
    const MAX_LEFT_PANE_PERCENT = 60;

    const [leftPaneWidth, setLeftPaneWidth] = useState<number>(50);
    const [isResizing, setIsResizing] = useState<boolean>(false);
    const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
    const [isCompleted, setIsCompleted] = useState<boolean>(false);
    const workspaceRef = useRef<HTMLDivElement | null>(null);
    const arrayRef = useRef<ArrayElement[]>([]);
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
        setArray(nextArray);
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

        const maxElements = 20;
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

        const maxElements = 20;
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
    //
    // *PUTA*
    // *PUTA*
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

        // remove the shit
        commitArray(newArray.slice(0, -1));
        setAnimatingState(false);
        return invisible.value;
    }


    // remove item from the front
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
        insertAt: (position, value) => enqueueChallengeAction(() => insertAt(position, value)),
        insertFront: (value) => enqueueChallengeAction(() => insertFront(value)),
        insertBack: (value) => enqueueChallengeAction(() => insertBack(value)),
        removeAt: (position) => enqueueChallengeAction(() => removeAt(position)),
        removeFront: () => enqueueChallengeAction(() => removeFront()),
        removeBack: () => enqueueChallengeAction(() => Promise.resolve(removeBack())),
        setAt: (position, newValue) => enqueueChallengeAction(() => setAt(position, newValue)),
        get: (position) => get(position),
        swap: (leftIndex, rightIndex) => enqueueChallengeAction(() => swap(leftIndex, rightIndex)),
        size: () => arrayRef.current.length,
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
        writeToConsole("Code editor reset to starter template.");
    };

    const resetArrayOnly = () => {
        resetStructureState();
        setIsCompleted(false);
        writeToConsole("Array reset to initial seed.");
    };

    const submitEditorCode = async () => {
        try {
            setConsoleOutput([]);
            challengeQueueRef.current = Promise.resolve();
            const runner = new Function("array", "io", `\n${editorCode}\n\nif (typeof Solution !== 'function') {\n  throw new Error('Solution(array) is required');\n}\nreturn Solution(array);`);
            const result = runner(challengeApi, challengeIoApi);
            if (result instanceof Promise) {
                await result;
            }
            await challengeQueueRef.current;
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unknown editor execution error";
            writeToConsole(`ERROR: ${message}`);
            writeToConsole("NOTICE: Execution stopped. Press Reset to restore a clean state.");
        }
    };

    return (
        <div className="h-full bg-gray-50 overflow-hidden">
            <main
                ref={workspaceRef}
                className={`flex flex-col lg:grid h-full max-w-[1500px] mx-auto bg-white ${isResizing ? "select-none" : ""}`}
                style={{ gridTemplateColumns: `${leftPaneWidth}fr 10px ${100 - leftPaneWidth}fr` }}
            >

                {/* Array display - Constrained height */}
                <div className="flex flex-col h-full overflow-hidden border-b lg:border-b-0 lg:border-r border-gray-200">
                    <ChallengeInstructions
                        title="Array Coding Challenge"
                        description="Build your solution in the editor, then observe how each operation changes the array in the visualizer."
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
                    onCodeChange={setEditorCode}
                    onReset={resetEditorCode}
                    onResetArray={resetArrayOnly}
                    onSubmit={submitEditorCode}
                    resetDisabled={isAnimating}
                    resetArrayDisabled={isAnimating}
                    submitDisabled={isAnimating}
                />

            </main >
        </div >
    );
};
