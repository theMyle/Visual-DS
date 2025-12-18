
'use client';

import { useEffect, useState } from "react";
import { LinkedListNode, NodeAnimationState } from "@/app/simulator/linked-list/components/types";
import { createNode, createNodes } from "@/app/simulator/linked-list/components/utils";

import VisualLinkedList from "@/app/simulator/linked-list/components/VisualLinkedList";
import ActionButton from "@/app/simulator/linked-list/components/ActionButton";

enum OperationType {
    Insertion,
    Deletion,
    Traversal,
}

export default function SimulatorLinkedList() {
    const [nodes, setNodes] = useState<LinkedListNode[]>([]);
    const [head, setHead] = useState<string | null>(null);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);

    const [inputValue, setInputValue] = useState<string>("");
    const [index, setIndex] = useState<number>(0);

    const [operationType, setOperationType] = useState<OperationType>(OperationType.Insertion);

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    const delay = {
        interval: 150,
        focus: 150,
    };

    // Helper function to get value or generate random
    const getValueOrRandom = (value: string): string => {
        if (!value || value.trim() === '') {
            return Math.floor(Math.random() * 100).toString();
        }
        return value;
    };

    // Initialize with [1, 2, 3, 4, 5]
    useEffect(() => {
        const initial = createNodes(1, 2, 3, 4, 5);
        setNodes(initial);
        if (initial.length > 0) {
            setHead(initial[0].id);
        }
    }, []);

    // Helper to find node by index (0-based)
    // const getNodeAtIndex = (targetIndex: number): LinkedListNode | null => {
    //     if (targetIndex < 0 || !head) return null;

    //     let current = nodes.find(n => n.id === head);
    //     let currentIndex = 0;

    //     while (current && currentIndex < targetIndex) {
    //         if (!current.next) return null;
    //         current = nodes.find(n => n.id === current!.next);
    //         currentIndex++;
    //     }

    //     return current || null;
    // };

    // Helper to get list size
    const getSize = (): number => {
        if (!head) return 0;

        let count = 0;
        let currentId: string | null = head;

        while (currentId) {
            count++;
            const node = nodes.find(n => n.id === currentId);
            currentId = node?.next || null;
        }

        return count;
    };

    // INSERT FRONT
    const insertFront = async (value: LinkedListNode) => {
        if (isAnimating) return;

        const maxElements = 10;
        if (getSize() >= maxElements) {
            // alert(`Maximum ${maxElements} nodes reached!`);
            return;
        }

        setIsAnimating(true);

        value.animationState = NodeAnimationState.NewInserted;
        value.next = head;

        setNodes(prev => [value, ...prev]);
        setHead(value.id);

        await sleep(delay.focus + 200);

        value.animationState = NodeAnimationState.Default;
        setNodes(prev => [...prev]);

        setInputValue("");
        setIsAnimating(false);
    };

    // INSERT BACK (instant, no traversal animation)
    const insertBack = async (value: LinkedListNode) => {
        if (isAnimating) return;

        const maxElements = 10;
        if (getSize() >= maxElements) {
            // alert(`Maximum ${maxElements} nodes reached!`);
            return;
        }

        if (!head) {
            insertFront(value);
            return;
        }

        setIsAnimating(true);

        // Find tail instantly (no animation)
        let currentId: string | null = head;
        let tail: LinkedListNode | null = null;
        while (currentId) {
            const current = nodes.find(n => n.id === currentId);
            if (!current) break;
            if (!current.next) {
                tail = current;
                break;
            }
            currentId = current.next;
        }

        // Append new node at tail
        value.animationState = NodeAnimationState.NewInserted;
        if (tail) tail.next = value.id;
        setNodes(prev => [...prev, value]);

        await sleep(delay.focus + 200);

        value.animationState = NodeAnimationState.Default;
        setNodes(prev => [...prev]);

        setInputValue("");
        setIsAnimating(false);
    };

    // INSERT AT INDEX
    const insertAt = async (value: LinkedListNode, targetIndex: number) => {
        if (isAnimating) return;

        const size = getSize();
        const maxElements = 10;

        if (size >= maxElements) {
            // alert(`Maximum ${maxElements} nodes reached!`);
            return;
        }

        if (targetIndex < 0 || targetIndex > size) {
            // alert(`Invalid index! Must be between 0 and ${size}`);
            return;
        }

        if (targetIndex === 0) {
            insertFront(value);
            return;
        }

        setIsAnimating(true);

        // Traverse to index - 1
        let currentId: string | null = head;
        let currentIndex = 0;

        while (currentId && currentIndex <= targetIndex - 1) {
            const current = nodes.find(n => n.id === currentId);
            if (!current) break;

            current.animationState = NodeAnimationState.Traversing;
            setNodes([...nodes]);
            await sleep(delay.interval);

            if (currentIndex === targetIndex - 1) {
                // Found the node before target index
                break;
            }

            current.animationState = NodeAnimationState.Default;
            currentId = current.next;
            currentIndex++;
        }

        // Insert after current
        const current = nodes.find(n => n.id === currentId);
        if (current) {
            value.next = current.next;
            current.next = value.id;
            current.animationState = NodeAnimationState.Default;

            value.animationState = NodeAnimationState.NewInserted;
            setNodes(prev => [...prev, value]);

            await sleep(delay.focus + 200);

            value.animationState = NodeAnimationState.Default;
            setNodes(prev => [...prev]);
        }

        setInputValue("");
        setIsAnimating(false);
    };

    // REMOVE FRONT
    const removeFront = async () => {
        if (isAnimating) return;
        if (!head) return;

        setIsAnimating(true);

        const headNode = nodes.find(n => n.id === head);
        if (!headNode) {
            setIsAnimating(false);
            return;
        }

        headNode.animationState = NodeAnimationState.BeingRemoved;
        setNodes([...nodes]);
        await sleep(delay.focus + 300);

        const newHead = headNode.next;
        setHead(newHead);
        setNodes(prev => prev.filter(n => n.id !== headNode.id));

        setIsAnimating(false);
    };

    // REMOVE BACK
    const removeBack = async () => {
        if (isAnimating) return;
        if (!head) return;

        setIsAnimating(true);

        // Find tail node (instant - we track tail in data structure)
        let tailNode: LinkedListNode | null = null;
        let secondLast: LinkedListNode | null = null;

        // If only one node
        const headNode = nodes.find(n => n.id === head);
        if (headNode && !headNode.next) {
            headNode.animationState = NodeAnimationState.BeingRemoved;
            setNodes([...nodes]);
            await sleep(delay.focus + 300);

            setHead(null);
            setNodes([]);
            setIsAnimating(false);
            return;
        }

        // Find tail and second-to-last without animation
        let currentId: string | null = head;
        while (currentId) {
            const current = nodes.find(n => n.id === currentId);
            if (!current) break;

            if (!current.next) {
                tailNode = current;
                break;
            }

            const nextNode = nodes.find(n => n.id === current.next);
            if (nextNode && !nextNode.next) {
                secondLast = current;
            }

            currentId = current.next;
        }

        // Remove tail node
        if (tailNode && secondLast) {
            tailNode.animationState = NodeAnimationState.BeingRemoved;
            setNodes([...nodes]);
            await sleep(delay.focus + 300);

            secondLast.next = null;
            setNodes(prev => prev.filter(n => n.id !== tailNode!.id));
        }

        setIsAnimating(false);
    };

    // REMOVE AT INDEX
    const removeAt = async (targetIndex: number) => {
        if (isAnimating) return;

        const size = getSize();
        if (targetIndex < 0 || targetIndex >= size) {
            alert(`Invalid index! List has ${size} number of elements.`);
            return;
        }

        if (targetIndex === 0) {
            removeFront();
            return;
        }

        setIsAnimating(true);

        // Traverse to index - 1
        let currentId: string | null = head;
        let currentIndex = 0;

        while (currentId && currentIndex <= targetIndex - 1) {
            const current = nodes.find(n => n.id === currentId);
            if (!current) break;

            current.animationState = NodeAnimationState.Traversing;
            setNodes([...nodes]);
            await sleep(delay.interval);

            if (currentIndex === targetIndex - 1) {
                // Found the node before target index
                break;
            }

            current.animationState = NodeAnimationState.Default;
            currentId = current.next;
            currentIndex++;
        }

        // Remove node after current
        const current = nodes.find(n => n.id === currentId);
        if (current && current.next) {
            const toRemove = nodes.find(n => n.id === current.next);
            if (toRemove) {
                toRemove.animationState = NodeAnimationState.BeingRemoved;
                current.animationState = NodeAnimationState.Default;
                setNodes([...nodes]);
                await sleep(delay.focus + 300);

                current.next = toRemove.next;
                setNodes(prev => prev.filter(n => n.id !== toRemove.id));
            }
        }

        setIsAnimating(false);
    };

    // SEARCH
    const search = async (target: number) => {
        if (isAnimating) return;

        if (inputValue === "") {
            alert("Please enter a value to search");
            return;
        }

        setIsAnimating(true);

        let currentId: string | null = head;
        let currentIndex = 0;
        let found = false;

        while (currentId) {
            const current = nodes.find(n => n.id === currentId);
            if (!current) break;

            current.animationState = NodeAnimationState.Traversing;
            setNodes([...nodes]);
            await sleep(delay.focus + 100);

            if (Number(current.value) === target) {
                current.animationState = NodeAnimationState.HighlightedGreen;
                setNodes([...nodes]);
                found = true;
                await sleep(500);
                alert(`✓ Value Found!\n\nValue: ${target}\nIndex: ${currentIndex}\nSteps: ${currentIndex + 1}`);
                break;
            }

            current.animationState = NodeAnimationState.Default;
            currentId = current.next;
            currentIndex++;
        }

        if (!found) {
            await sleep(500);
            alert(`✗ Value Not in List\n`);
        }

        // Reset all to default
        setTimeout(() => {
            const resetNodes = nodes.map(node => ({
                ...node,
                animationState: NodeAnimationState.Default
            }));
            setNodes(resetNodes);
            setIsAnimating(false);
        }, 500);
    };

    // GET BY INDEX (Traversal)
    const getByIndex = async (targetIndex: number) => {
        if (isAnimating) return;

        const size = getSize();
        if (targetIndex < 0 || targetIndex >= size) {
            alert(`Invalid index! Must be between 0 and ${size - 1}`);
            return;
        }

        setIsAnimating(true);

        let currentId: string | null = head;
        let currentIndex = 0;
        while (currentId) {
            const current = nodes.find(n => n.id === currentId);
            if (!current) break;

            current.animationState = NodeAnimationState.Traversing;
            setNodes([...nodes]);
            await sleep(delay.focus + 100);

            if (currentIndex === targetIndex) {
                current.animationState = NodeAnimationState.HighlightedOrange;
                setNodes([...nodes]);
                await sleep(400);
                // alert(`Index ${targetIndex} -> Value: ${current.value}`);
                break;
            }

            current.animationState = NodeAnimationState.Default;
            currentId = current.next;
            currentIndex++;
        }

        // Reset states
        setTimeout(() => {
            const resetNodes = nodes.map(node => ({
                ...node,
                animationState: NodeAnimationState.Default,
            }));
            setNodes(resetNodes);
            setIsAnimating(false);
        }, 500);
    };

    return (
        <div className="h-full bg-gray-50 overflow-hidden">
            <main className="flex flex-col lg:flex-row h-full max-w-7xl mx-auto bg-white">

                {/* Linked List display */}
                <div className="flex-1 lg:flex-[3] h-full overflow-hidden">
                    {/* Title */}
                    <div className="flex-shrink-0 mb-2 md:mb-4 pt-6">
                        <h1 className="text-base md:text-xl font-semibold text-gray-600 text-center">
                            Singly Linked List
                        </h1>
                    </div>

                    <div className="flex items-center justify-center px-4 md:px-9 py-4 h-full">
                        <VisualLinkedList nodes={nodes} head={head} />
                    </div>
                </div>

                {/* Controls section */}
                <div className="flex-1 lg:flex-[2] flex flex-col border-t lg:border-t-0 lg:border-l border-gray-200 h-full overflow-hidden">
                    {/* Operation type selector */}
                    <div className="flex border-b border-gray-200 flex-shrink-0">
                        {[
                            { type: OperationType.Insertion, label: 'Insertion', bgActive: 'bg-green-100' },
                            { type: OperationType.Deletion, label: 'Deletion', bgActive: 'bg-red-100' },
                            { type: OperationType.Traversal, label: 'Traversal', bgActive: 'bg-purple-100' },
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
                        {/* Input fields */}
                        <div className="flex flex-col gap-2 md:gap-3 flex-shrink-0">
                            <div className="flex gap-2 md:gap-3 items-center">
                                <label className="text-xs md:text-sm font-medium text-gray-700 min-w-[40px] md:min-w-[50px]">Value:</label>
                                <input
                                    type="number"
                                    className="bg-white border border-gray-200 rounded-lg text-center flex-1 text-sm md:text-lg py-1.5 md:py-2 focus:border-blue-300 focus:outline-none transition-colors"
                                    value={inputValue}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
                                            setInputValue(value);
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            insertBack(createNode(getValueOrRandom(inputValue)));
                                        }
                                    }}
                                    placeholder="Enter number"
                                />
                            </div>
                            <div className="flex gap-2 md:gap-3 items-center">
                                <label className="text-xs md:text-sm font-medium text-gray-700 min-w-[40px] md:min-w-[50px]">Index:</label>
                                <input
                                    type="number"
                                    className="bg-white border border-gray-200 rounded-lg text-center flex-1 text-sm md:text-lg py-1.5 md:py-2 focus:border-blue-300 focus:outline-none transition-colors"
                                    value={index}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        const size = getSize();
                                        if (value >= size) {
                                            setIndex(size > 0 ? size - 1 : 0);
                                        } else if (value < 0) {
                                            setIndex(0);
                                        } else {
                                            setIndex(value);
                                        }
                                    }}
                                    min={0}
                                    max={getSize()}
                                    placeholder="Index"
                                />
                            </div>
                        </div>

                        {/* List info */}
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 p-2 md:p-3 rounded-lg flex-shrink-0">
                            <div className="flex justify-between gap-1 text-xs md:text-sm">
                                <div className="flex items-center gap-1">
                                    <span className="font-medium text-gray-700">Size:</span>
                                    <span className="text-blue-600 font-bold">{getSize()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="font-medium text-gray-700">Head:</span>
                                    <span className="text-green-600 font-bold truncate max-w-[60px]">
                                        {head ? nodes.find(n => n.id === head)?.value || 'None' : 'None'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col gap-2.5 md:gap-2 w-full flex-shrink-0">

                            {/* INSERTION */}
                            {operationType === OperationType.Insertion && (
                                <>
                                    <ActionButton
                                        text="Insert Front"
                                        bgColor="#2A9D8F"
                                        shadowColor="#1F7A6B"
                                        onClick={() => insertFront(createNode(getValueOrRandom(inputValue)))}
                                    />
                                    <ActionButton
                                        text="Insert Back"
                                        bgColor="#2A9D8F"
                                        shadowColor="#1F7A6B"
                                        onClick={() => insertBack(createNode(getValueOrRandom(inputValue)))}
                                    />
                                    <ActionButton
                                        text="Insert At"
                                        bgColor="#2A9D8F"
                                        shadowColor="#1F7A6B"
                                        onClick={() => insertAt(createNode(getValueOrRandom(inputValue)), index)}
                                    />
                                </>
                            )}

                            {/* DELETION */}
                            {operationType === OperationType.Deletion && (
                                <>
                                    <ActionButton
                                        text="Remove Front"
                                        bgColor="#C7573B"
                                        shadowColor="#A0422E"
                                        onClick={() => removeFront()}
                                    />
                                    <ActionButton
                                        text="Remove Back"
                                        bgColor="#C7573B"
                                        shadowColor="#A0422E"
                                        onClick={() => removeBack()}
                                    />
                                    <ActionButton
                                        text="Remove At"
                                        bgColor="#C7573B"
                                        shadowColor="#A0422E"
                                        onClick={() => removeAt(index)}
                                    />
                                </>
                            )}

                            {/* TRAVERSAL */}
                            {operationType === OperationType.Traversal && (
                                <>
                                    <ActionButton
                                        text="Search"
                                        bgColor="#6C757D"
                                        shadowColor="#495057"
                                        onClick={() => {
                                            const target = Number(inputValue);
                                            search(target);
                                        }}
                                    />

                                    <ActionButton
                                        text="Get At"
                                        bgColor="#6C757D"
                                        shadowColor="#495057"
                                        onClick={() => {
                                            const target = Number(index);
                                            getByIndex(target);
                                        }}
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