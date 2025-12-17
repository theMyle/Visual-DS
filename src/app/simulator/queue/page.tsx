
'use client';

import { useEffect, useState } from "react";
import { ArrayElement, ArrayElementAnimationState } from "@/app/simulator/array-list/components/types";
import { createArrayElement, createArrayElements } from "@/app/simulator/array-list/components/utils";

import VisualArray from "@/app/simulator/array-list/components/VisualArray";
import ActionButton from "@/app/simulator/array-list/components/ActionButton";

enum OperationType {
    Basic,
    Advanced,
}

export default function SimulationQueue() {
    const [queue, setQueue] = useState<ArrayElement[]>([]);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);

    const [inputValue, setInputValue] = useState<string>("");
    const [operationType, setOperationType] = useState<OperationType>(OperationType.Basic);

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    const delay = {
        interval: 150,
        focus: 150,
    };

    useEffect(() => {
        // Initialize with some sample data
        const initial = createArrayElements(...["1", "2", "3", "4", "5"]);
        setQueue(initial);
    }, []);

    // Helper function to get value or generate random
    const getValueOrRandom = (value: string): string => {
        if (!value || value.trim() === '') {
            return Math.floor(Math.random() * 100).toString();
        }
        return value;
    };

    // QUEUE OPERATIONS

    // Enqueue: Add an element to the rear of the queue
    const enqueue = async (value: ArrayElement) => {

        const maxElements = 20;
        if (queue.length >= maxElements) return;

        setIsAnimating(true);

        value.animationState = ArrayElementAnimationState.NewInserted;
        setQueue(prev => [...prev, value]); // Add to the end (rear)

        // Reset to default after animation
        await sleep(delay.focus + 200);
        value.animationState = ArrayElementAnimationState.Default;
        setQueue(prev => [...prev]);

        setInputValue("");
        setIsAnimating(false);
    };

    // Dequeue: Remove an element from the front of the queue
    const dequeue = async () => {
        if (queue.length === 0 || isAnimating) return;

        setIsAnimating(true);

        // Highlight the element being removed
        const newQueue = [...queue];
        newQueue[0].animationState = ArrayElementAnimationState.RemovedInvisible;
        setQueue(newQueue);

        await sleep(delay.focus);

        // Remove the first element (front of queue)
        setQueue(prev => prev.slice(1));
        setIsAnimating(false);
    };

    // Peek: View the front element without removing it
    const peek = async () => {
        if (queue.length === 0 || isAnimating) return;
        setIsAnimating(true);

        const newQueue = [...queue];

        // Highlight the front element (first element in array)
        newQueue[0].animationState = ArrayElementAnimationState.HighlightedGreen;
        setQueue(newQueue);

        await sleep(delay.focus + 500);

        newQueue[0].animationState = ArrayElementAnimationState.Default;
        setQueue([...newQueue]);
        setIsAnimating(false);
    };

    // Get queue size
    const size = async () => {
        if (isAnimating) return;
        setIsAnimating(true);

        // Highlight all elements to show the size
        if (queue.length > 0) {
            const newQueue = queue.map(element => ({
                ...element,
                animationState: ArrayElementAnimationState.HighlightedGreen
            }));
            setQueue(newQueue);

            await sleep(delay.focus + 500);

            // Return to default state
            const defaultQueue = newQueue.map(element => ({
                ...element,
                animationState: ArrayElementAnimationState.Default
            }));
            setQueue(defaultQueue);
        }

        setIsAnimating(false);
    };

    // Clear the entire queue
    const clear = async () => {
        if (isAnimating) return;
        setQueue([]);
    };

    return (
        <div className="h-full bg-gray-50 overflow-hidden">
            <main className="flex flex-col lg:flex-row h-full max-w-7xl mx-auto bg-white">

                {/* Queue display - Constrained height */}
                <div className="flex-1 lg:flex-[3] h-full overflow-hidden">

                    {/* Title */}
                    <div className="flex-shrink-0 mb-2 md:mb-4 pt-6">
                        <h1 className="text-base md:text-xl font-semibold text-gray-600 text-center">
                            Queue Data Structure
                        </h1>
                    </div>

                    <div className="flex items-center justify-center px-4 md:px-9 py-4 h-full">
                        <VisualArray array={queue} />
                    </div>

                </div>

                {/* Controls section */}
                <div className="flex-1 lg:flex-[2] flex flex-col border-t lg:border-t-0 lg:border-l border-gray-200 h-full overflow-hidden">
                    {/* Operation type selector */}
                    <div className="flex border-b border-gray-200 flex-shrink-0">
                        {[
                            { type: OperationType.Basic, label: 'Basic', bgActive: 'bg-blue-100' },
                            { type: OperationType.Advanced, label: 'Others', bgActive: 'bg-purple-100' },
                        ].map(({ type, label, bgActive }) => (
                            <button
                                key={type}
                                onClick={() => setOperationType(type)}
                                className={`flex-1 py-2 text-center text-xs md:text-sm font-medium transition-colors duration-150 ease-in-out
                        ${operationType === type ? bgActive + ' text-gray-800' : 'bg-white hover:bg-gray-50 text-gray-600'}
                        focus:outline-none`}
                                aria-pressed={operationType === type}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Input Fields and Info */}
                    <div className="flex-1 p-2 md:p-4 flex flex-col gap-2 md:gap-3 overflow-y-auto min-h-0 max-h-full">
                        {/* Input field for value - compact on mobile */}
                        <div className="flex gap-2 md:gap-3 items-center flex-shrink-0">
                            <label className="text-xs md:text-sm font-medium text-gray-700 min-w-[40px] md:min-w-[50px]">Value:</label>
                            <input
                                type="text"
                                className="bg-white border border-gray-200 rounded-lg text-center flex-1 text-sm md:text-lg py-1.5 md:py-2 focus:border-blue-300 focus:outline-none transition-colors"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        enqueue(createArrayElement(getValueOrRandom(inputValue)));
                                    }
                                }}
                                placeholder="Enter value"
                            />
                        </div>

                        {/* Queue info - more compact for mobile */}
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 p-2 md:p-3 rounded-lg flex-shrink-0">
                            <div className="flex justify-between gap-1 text-xs md:text-sm">
                                <div className="flex items-center gap-1">
                                    <span className="font-medium text-gray-700">Size:</span>
                                    <span className="text-blue-600 font-bold">{queue.length}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="font-medium text-gray-700">Front:</span>
                                    <span className="text-green-600 font-bold truncate max-w-[60px]">
                                        {queue.length > 0 ? queue[0].value : 'None'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="font-medium text-gray-700">Empty:</span>
                                    <span className="text-red-600 font-bold">
                                        {queue.length === 0 ? 'Yes' : 'No'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Buttons - more compact */}
                        <div className="flex flex-col gap-3 md:gap-2 w-full flex-shrink-0">

                            {/* BASIC OPERATIONS */}
                            {operationType === OperationType.Basic && (
                                <>
                                    <ActionButton
                                        text="Enqueue"
                                        bgColor="#2A9D8F"
                                        shadowColor="#1F7A6B"
                                        onClick={() => enqueue(createArrayElement(getValueOrRandom(inputValue)))}
                                    />
                                    <ActionButton
                                        text="Dequeue"
                                        bgColor="#C7573B"
                                        shadowColor="#A0422E"
                                        onClick={() => dequeue()}
                                    />
                                    <ActionButton
                                        text="Peek"
                                        bgColor="#6C757D"
                                        shadowColor="#495057"
                                        onClick={() => peek()}
                                    />
                                </>
                            )}

                            {/* ADVANCED OPERATIONS */}
                            {operationType === OperationType.Advanced && (
                                <>
                                    <ActionButton
                                        text="Size"
                                        bgColor="#6C757D"
                                        shadowColor="#495057"
                                        onClick={() => size()}
                                    />
                                    <ActionButton
                                        text="Clear All"
                                        bgColor="#C7573B"
                                        shadowColor="#A0422E"
                                        onClick={() => clear()}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
