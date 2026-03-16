
'use client';

import { useEffect, useState } from "react";
import { LinkedListNode, NodeAnimationState } from "@/app/simulator/linked-list/components/types";
import { createNode, createNodes } from "@/app/simulator/linked-list/components/utils";

import VisualLinkedList from "@/app/simulator/linked-list/components/VisualLinkedList";
import ActionButton from "@/app/simulator/linked-list/components/ActionButton";
import SimulatorHelp, { HelpSlide } from "@/app/simulator/components/SimulatorHelp";

enum OperationType {
    Insertion,
    Deletion,
    Traversal,
}

export default function SimulatorLinkedList() {
    const [nodes, setNodes] = useState<LinkedListNode[]>([]);
    const [head, setHead] = useState<string | null>(null);
    const [tail, setTail] = useState<string | null>(null);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);

    const [inputValue, setInputValue] = useState<string>("");
    const [index, setIndex] = useState<number>(0);

    const [operationType, setOperationType] = useState<OperationType>(OperationType.Insertion);

    const [showHelp, setShowHelp] = useState<boolean>(true);

    const helpSlides: HelpSlide[] = [
        {
            title: 'Linked List Simulator',
            description: 'Interact with a singly linked list in real time. The visual is draggable, pan it around freely to explore the node chain as it grows and changes.',
            items: [
                { label: 'Visual Area', detail: 'Each box is a node with a value and a pointer to the next node. Drag anywhere on the canvas to reposition the view.' },
                { label: 'Controls Panel', detail: 'Pick a category tab on the right, fill in inputs if needed, then press a button to animate the operation.' },
            ],
        },
        {
            title: 'Input Fields',
            description: 'Two fields let you control the value and index used by list operations.',
            items: [
                { label: 'Value', detail: 'The number to insert or search for. Leave it blank and a random value (0–99) will be used.' },
                { label: 'Index', detail: 'Zero-based position used by Insert At, Remove At, and Get At operations.' },
            ],
        },
        {
            title: 'Operation Tabs',
            description: 'Select a tab to switch operation categories. Each tab reveals a set of buttons that visualizes operations',
            items: [
                { label: 'Insertion', detail: 'Add nodes at the front, back, or a specific index.' },
                { label: 'Deletion', detail: 'Remove nodes from the front, back, or a specific index.' },
                { label: 'Traversal', detail: 'Traverse the list to search for a value or retrieve a node at a given index.' },
            ],
        },
    ];

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    const timing = {
        step: 180,
        pulse: 280,
        settle: 140,
        result: 550,
    };

    const cloneNodes = (list: LinkedListNode[]): LinkedListNode[] =>
        list.map(node => ({ ...node }));

    const resetAllNodeStates = (list: LinkedListNode[]): LinkedListNode[] =>
        list.map(node => ({ ...node, animationState: NodeAnimationState.Default }));

    const runAnimated = async (operation: () => Promise<void>) => {
        if (isAnimating) return;

        setIsAnimating(true);
        try {
            await operation();
        } finally {
            setIsAnimating(false);
        }
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
            setTail(initial[initial.length - 1].id);
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
        const maxElements = 10;
        if (getSize() >= maxElements) {
            alert(`Maximum ${maxElements} nodes reached!`);
            return;
        }

        await runAnimated(async () => {
            const working = cloneNodes(nodes);
            const newNode: LinkedListNode = {
                ...value,
                next: head,
                animationState: NodeAnimationState.NewInserted,
            };

            working.unshift(newNode);
            setNodes(working);
            setHead(newNode.id);
            if (!head) {
                setTail(newNode.id);
            }

            await sleep(timing.pulse);

            newNode.animationState = NodeAnimationState.Default;
            setNodes([...working]);
            await sleep(timing.settle);
        });

        setInputValue("");
    };

    // INSERT BACK (O(1) with tracked tail pointer)
    const insertBack = async (value: LinkedListNode) => {
        const maxElements = 10;
        if (getSize() >= maxElements) {
            alert(`Maximum ${maxElements} nodes reached!`);
            return;
        }

        if (!head || !tail) {
            await insertFront(value);
            return;
        }

        await runAnimated(async () => {
            const working = cloneNodes(nodes);
            const tailNode = working.find(n => n.id === tail);
            if (!tailNode) return;

            tailNode.animationState = NodeAnimationState.Traversing;
            setNodes([...working]);
            await sleep(timing.step);

            tailNode.animationState = NodeAnimationState.Default;
            const newNode: LinkedListNode = {
                ...value,
                next: null,
                animationState: NodeAnimationState.NewInserted,
            };
            tailNode.next = newNode.id;
            working.push(newNode);

            setNodes([...working]);
            setTail(newNode.id);
            await sleep(timing.pulse);

            newNode.animationState = NodeAnimationState.Default;
            setNodes([...working]);
            await sleep(timing.settle);
        });

        setInputValue("");
    };

    // INSERT AT INDEX
    const insertAt = async (value: LinkedListNode, targetIndex: number) => {
        const size = getSize();
        const maxElements = 10;

        if (size >= maxElements) {
            alert(`Maximum ${maxElements} nodes reached!`);
            return;
        }

        if (targetIndex < 0 || targetIndex > size) {
            alert(`Invalid index! Must be between 0 and ${size}`);
            return;
        }

        if (targetIndex === 0) {
            await insertFront(value);
            return;
        }

        // Appending at size can use O(1) tail update path
        if (targetIndex === size) {
            await insertBack(value);
            return;
        }

        await runAnimated(async () => {
            const working = cloneNodes(nodes);
            let currentId: string | null = head;
            let currentIndex = 0;

            while (currentId && currentIndex < targetIndex - 1) {
                const current = working.find(n => n.id === currentId);
                if (!current) return;

                current.animationState = NodeAnimationState.Traversing;
                setNodes([...working]);
                await sleep(timing.step);

                current.animationState = NodeAnimationState.Default;
                currentId = current.next;
                currentIndex++;
            }

            const previous = working.find(n => n.id === currentId);
            if (!previous) return;

            previous.animationState = NodeAnimationState.HighlightedOrange;
            setNodes([...working]);
            await sleep(timing.step);

            const newNode: LinkedListNode = {
                ...value,
                next: previous.next,
                animationState: NodeAnimationState.NewInserted,
            };
            previous.next = newNode.id;
            previous.animationState = NodeAnimationState.Default;
            working.push(newNode);
            setNodes([...working]);
            await sleep(timing.pulse);

            newNode.animationState = NodeAnimationState.Default;
            setNodes([...working]);
            await sleep(timing.settle);
        });

        setInputValue("");
    };

    // REMOVE FRONT
    const removeFront = async () => {
        if (!head) return;

        await runAnimated(async () => {
            const working = cloneNodes(nodes);
            const headNode = working.find(n => n.id === head);
            if (!headNode) return;

            headNode.animationState = NodeAnimationState.BeingRemoved;
            setNodes([...working]);
            await sleep(timing.pulse);

            const newHead = headNode.next;
            const filtered = working.filter(n => n.id !== headNode.id);

            setHead(newHead);
            if (!newHead) {
                setTail(null);
            }

            setNodes(filtered);
            await sleep(timing.settle);
        });
    };

    // REMOVE BACK
    const removeBack = async () => {
        if (isAnimating) return;
        const size = getSize();
        if (size === 0) return;

        await removeAt(size - 1);
    };

    // REMOVE AT INDEX
    const removeAt = async (targetIndex: number) => {
        const size = getSize();
        if (targetIndex < 0 || targetIndex >= size) {
            alert(`Invalid index! List has ${size} number of elements.`);
            return;
        }

        if (targetIndex === 0) {
            await removeFront();
            return;
        }

        await runAnimated(async () => {
            const working = cloneNodes(nodes);
            let currentId: string | null = head;
            let currentIndex = 0;

            while (currentId && currentIndex < targetIndex - 1) {
                const current = working.find(n => n.id === currentId);
                if (!current) return;

                current.animationState = NodeAnimationState.Traversing;
                setNodes([...working]);
                await sleep(timing.step);

                current.animationState = NodeAnimationState.Default;
                currentId = current.next;
                currentIndex++;
            }

            const previous = working.find(n => n.id === currentId);
            if (!previous || !previous.next) return;

            const toRemove = working.find(n => n.id === previous.next);
            if (!toRemove) return;

            previous.animationState = NodeAnimationState.HighlightedOrange;
            toRemove.animationState = NodeAnimationState.BeingRemoved;
            setNodes([...working]);
            await sleep(timing.pulse);

            previous.next = toRemove.next;
            previous.animationState = NodeAnimationState.Default;

            if (toRemove.id === tail) {
                setTail(previous.id);
            }

            const filtered = working.filter(n => n.id !== toRemove.id);
            setNodes(filtered);
            await sleep(timing.settle);
        });
    };

    // SEARCH
    const search = async (target: number) => {
        if (inputValue === "") {
            alert("Please enter a value to search");
            return;
        }

        await runAnimated(async () => {
            const working = cloneNodes(nodes);
            let currentId: string | null = head;
            let currentIndex = 0;
            let found = false;

            while (currentId) {
                const current = working.find(n => n.id === currentId);
                if (!current) break;

                current.animationState = NodeAnimationState.Traversing;
                setNodes([...working]);
                await sleep(timing.step);

                if (Number(current.value) === target) {
                    current.animationState = NodeAnimationState.HighlightedGreen;
                    setNodes([...working]);
                    found = true;
                    await sleep(timing.result);
                    alert(`✓ Value Found!\n\nValue: ${target}\nIndex: ${currentIndex}\nSteps: ${currentIndex + 1}`);
                    break;
                }

                current.animationState = NodeAnimationState.Default;
                currentId = current.next;
                currentIndex++;
            }

            if (!found) {
                await sleep(timing.settle);
                alert(`✗ Value Not in List\n`);
            }

            await sleep(timing.settle);
            setNodes(resetAllNodeStates(working));
        });
    };

    // GET BY INDEX (Traversal)
    const getByIndex = async (targetIndex: number) => {
        const size = getSize();
        if (targetIndex < 0 || targetIndex >= size) {
            alert(`Invalid index! Must be between 0 and ${size - 1}`);
            return;
        }

        await runAnimated(async () => {
            const working = cloneNodes(nodes);
            let currentId: string | null = head;
            let currentIndex = 0;

            while (currentId) {
                const current = working.find(n => n.id === currentId);
                if (!current) break;

                current.animationState = NodeAnimationState.Traversing;
                setNodes([...working]);
                await sleep(timing.step);

                if (currentIndex === targetIndex) {
                    current.animationState = NodeAnimationState.HighlightedOrange;
                    setNodes([...working]);
                    await sleep(timing.result);
                    break;
                }

                current.animationState = NodeAnimationState.Default;
                currentId = current.next;
                currentIndex++;
            }

            await sleep(timing.settle);
            setNodes(resetAllNodeStates(working));
        });
    };

    return (
        <div className="h-full bg-gray-50 overflow-hidden">
            {showHelp && (
                <SimulatorHelp slides={helpSlides} onClose={() => setShowHelp(false)} />
            )}
            <main className="flex flex-col lg:flex-row h-full max-w-7xl mx-auto bg-white">

                {/* Linked List display */}
                <div className="flex-1 lg:flex-[3] h-full overflow-hidden">
                    {/* Title */}
                    <div className="flex-shrink-0 mb-2 md:mb-4 pt-6 relative flex items-center justify-center px-4">
                        <h1 className="text-base md:text-xl font-semibold text-gray-600 text-center">
                            Singly Linked List
                        </h1>
                        <button
                            className="absolute right-4 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 text-sm font-bold transition-colors flex items-center justify-center"
                            onClick={() => setShowHelp(true)}
                            aria-label="Open simulator help"
                        >
                            ?
                        </button>
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
                                    <span className="text-blue-600 font-bold">{getSize()}/10</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="font-medium text-gray-700">Head:</span>
                                    <span className="text-green-600 font-bold truncate max-w-[60px]">
                                        {head ? nodes.find(n => n.id === head)?.value || 'None' : 'None'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="font-medium text-gray-700">Tail:</span>
                                    <span className="text-purple-600 font-bold truncate max-w-[60px]">
                                        {tail ? nodes.find(n => n.id === tail)?.value || 'None' : 'None'}
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
                                        info={{
                                            title: 'Insert Front',
                                            description: "Creates a new node and makes it the new head. The new node's pointer is set to the old head — no traversal needed.",
                                            timeComplexity: 'O(1)',
                                        }}
                                    />
                                    <ActionButton
                                        text="Insert Back"
                                        bgColor="#2A9D8F"
                                        shadowColor="#1F7A6B"
                                        onClick={() => insertBack(createNode(getValueOrRandom(inputValue)))}
                                        info={{
                                            title: 'Insert Back',
                                            description: "Appends a new node by updating the current tail's 'next' pointer and reassigning the tail reference.",
                                            timeComplexity: 'O(1)',
                                        }}
                                    />
                                    <ActionButton
                                        text="Insert At"
                                        bgColor="#2A9D8F"
                                        shadowColor="#1F7A6B"
                                        onClick={() => insertAt(createNode(getValueOrRandom(inputValue)), index)}
                                        info={{
                                            title: 'Insert At Index',
                                            description: 'Traverses to the node just before the target index, then splices the new node in by rewiring the next pointers.',
                                            timeComplexity: 'O(n)',
                                        }}
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
                                        info={{
                                            title: 'Remove Front',
                                            description: 'Removes the head node and promotes the next node as the new head. No traversal required.',
                                            timeComplexity: 'O(1)',
                                        }}
                                    />
                                    <ActionButton
                                        text="Remove Back"
                                        bgColor="#C7573B"
                                        shadowColor="#A0422E"
                                        onClick={() => removeBack()}
                                        info={{
                                            title: 'Remove Back',
                                            description: 'Traverses to the second-to-last node and sets its next pointer to null, detaching the tail.',
                                            timeComplexity: 'O(n)',
                                        }}
                                    />
                                    <ActionButton
                                        text="Remove At"
                                        bgColor="#C7573B"
                                        shadowColor="#A0422E"
                                        onClick={() => removeAt(index)}
                                        info={{
                                            title: 'Remove At Index',
                                            description: 'Traverses to the node just before the target index, then bypasses the target node by pointing directly to its successor.',
                                            timeComplexity: 'O(n)',
                                        }}
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
                                        info={{
                                            title: 'Search',
                                            description: "Walks the list from head to tail comparing each node's value to the target. Stops and highlights the match if found.",
                                            timeComplexity: 'O(n)',
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
                                        info={{
                                            title: 'Get At Index',
                                            description: 'Traverses the list step by step from the head until reaching the target index, then highlights that node.',
                                            timeComplexity: 'O(n)',
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