'use client';

import { useEffect, useState } from "react";
import { TreeNode, TreeNodeAnimationState } from "@/app/simulator/components/tree/types";
import { createNode, createTreeNodes } from "@/app/simulator/components/tree/utils";

import VisualTree from "@/app/simulator/components/tree/VisualTree";
import ActionButton, { OperationInfo } from "@/app/simulator/components/tree/ActionButton";
import SimulatorHelp, { HelpSlide } from "@/app/simulator/components/SimulatorHelp";

// ─── Operation info definitions (edit descriptions/complexities here) ───────
const TREE_OPERATION_INFOS: Record<string, OperationInfo> = {
    insertLeft: {
        title: "Insert Left",
        description: "Inserts a new node as the left child of the selected node. Select a parent node first by clicking it in the tree.",
        timeComplexity: "O(1)",
        spaceComplexity: "O(1)",
    },
    insertRight: {
        title: "Insert Right",
        description: "Inserts a new node as the right child of the selected node. Select a parent node first by clicking it in the tree.",
        timeComplexity: "O(1)",
        spaceComplexity: "O(1)",
    },
    reset: {
        title: "Reset",
        description: "Resets the tree back to the initial state with the default sample nodes.",
        timeComplexity: "O(1)",
        spaceComplexity: "O(n)",
    },
    deleteLeaf: {
        title: "Delete Leaf",
        description: "Removes a leaf node (a node with no children). Enter a value or select a node in the tree. Non-leaf nodes must use Delete Node instead.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
    },
    deleteNode: {
        title: "Delete Node",
        description: "Removes any node from the tree. If the node has children, it is replaced by the deepest rightmost node to maintain tree structure.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
    },
    findValue: {
        title: "Find Value",
        description: "Searches for a node with the given value using level-order (BFS) traversal, highlighting each visited node along the way.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
    },
    preorder: {
        title: "Pre-order Traversal",
        description: "Visits nodes in Root → Left → Right order. Useful for creating a copy of the tree or prefix expression evaluation.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(h)",
    },
    inorder: {
        title: "In-order Traversal",
        description: "Visits nodes in Left → Root → Right order. For a Binary Search Tree, this produces values in sorted (ascending) order.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(h)",
    },
    postorder: {
        title: "Post-order Traversal",
        description: "Visits nodes in Left → Right → Root order. Useful for deleting the tree or evaluating postfix expressions.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(h)",
    },
    levelorder: {
        title: "Level-order Traversal (BFS)",
        description: "Visits nodes level by level from top to bottom, left to right. Uses a queue internally. Also known as Breadth-First Search.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
    },
};
// ────────────────────────────────────────────────────────────────────────────

enum OperationType {
    Insertion,
    Deletion,
    Search,
    Traversal,
}

const helpSlides: HelpSlide[] = [
    {
        title: 'Binary Tree Simulator',
        description: 'Explore binary tree operations visually with real-time updates to structure and node states.',
        items: [
            { label: 'Visual Area', detail: 'You can pinch to zoom and drag the tree around. Click a node to select it, click it again to deselect, and use selected nodes for operations that need a target parent or node.' },
            { label: 'Controls Panel', detail: 'On desktop, controls are on the right; on mobile, they move below the tree. Tabs group operations by purpose.' },
        ],
    },
    {
        title: 'Operation Tabs',
        description: 'Use the tabs to switch between different operation categories as you explore tree behavior.',
        items: [
            { label: 'Category-Based Workflow', detail: 'Each tab groups related actions, so controls stay focused on your current goal rather than showing everything at once.' },
            { label: 'Input and Selection', detail: 'Depending on the active category, actions may rely on the Value field, a selected node, or both.' },
            { label: 'Animation Feedback', detail: 'When an action runs, node colors and motion communicate the current step so state changes are easier to follow.' },
        ],
    },
    {
        title: 'Selection and Limits',
        description: 'A few constraints keep the visualization readable and consistent across devices.',
        items: [
            { label: 'Node Selection', detail: 'Click a node to select it as insertion parent; click it again (or Clear) to deselect.' },
            { label: 'Depth Limit', detail: 'Maximum insertion depth is responsive, with stricter limits on smaller screens to keep the tree readable.' },
            { label: 'Result Panels', detail: 'Context panels in the controls area summarize useful state, such as selected node and traversal visit order.' },
        ],
    },
];

export default function SimulatorTree() {
    const [nodes, setNodes] = useState<TreeNode[]>([]);
    const [rootId, setRootId] = useState<string | null>(null);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);

    const [inputValue, setInputValue] = useState<string>("");
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [visitOrder, setVisitOrder] = useState<(string | number)[]>([]);

    const [operationType, setOperationType] = useState<OperationType>(OperationType.Insertion);
    const [showHelp, setShowHelp] = useState<boolean>(true);

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    const delay = {
        interval: 400,
        focus: 600,
    };

    // Responsive max depth: mobile (<=768px) = 3 (height 4), desktop = 4 (height 5)
    const [maxDepth, setMaxDepth] = useState<number>(4);

    useEffect(() => {
        const handleResize = () => {
            setMaxDepth(window.innerWidth <= 768 ? 3 : 4);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Helper function to get value or generate random
    const getValueOrRandom = (value: string): string => {
        if (!value || value.trim() === '') {
            return Math.floor(Math.random() * 100).toString();
        }
        return value;
    };

    // Initialize with [1, 2, 3, 4, 5]
    useEffect(() => {
        const { nodes: initial, rootId: root } = createTreeNodes();
        setNodes(initial);
        setRootId(root);
    }, []);

    // Helper to find node by value
    const findNodeByValue = (value: string | number): TreeNode | null => {
        return nodes.find(n => n.value.toString() === value.toString()) || null;
    };

    // Helper to get selected node
    const getSelectedNode = (): TreeNode | null => {
        if (!selectedNodeId) return null;
        return nodes.find(n => n.id === selectedNodeId) || null;
    };

    // Handle node click for selection
    const handleNodeClick = (nodeId: string) => {
        if (isAnimating) return;

        // If clicking the same node, deselect it
        if (selectedNodeId === nodeId) {
            setSelectedNodeId(null);
            // Remove highlight
            setNodes(prev => prev.map(n =>
                n.id === nodeId && n.animationState === TreeNodeAnimationState.HighlightedOrange
                    ? { ...n, animationState: TreeNodeAnimationState.Default }
                    : n
            ));
        } else {
            // Clear previous selection highlight
            setNodes(prev => prev.map(n =>
                n.animationState === TreeNodeAnimationState.HighlightedOrange
                    ? { ...n, animationState: TreeNodeAnimationState.Default }
                    : n
            ));

            // Set new selection
            setSelectedNodeId(nodeId);
            setNodes(prev => prev.map(n =>
                n.id === nodeId
                    ? { ...n, animationState: TreeNodeAnimationState.HighlightedOrange }
                    : n
            ));
        }
    };

    // Helper to calculate tree height
    const calculateHeight = (nodeId: string | null): number => {
        if (!nodeId) return 0;

        const node = nodes.find(n => n.id === nodeId);
        if (!node) return 0;

        const leftHeight = calculateHeight(node.left);
        const rightHeight = calculateHeight(node.right);

        return 1 + Math.max(leftHeight, rightHeight);
    };

    // Helper to count leaf nodes
    const countLeaves = (): number => {
        return nodes.filter(n => !n.left && !n.right).length;
    };

    // INSERT NODE
    const insertNode = async (value: TreeNode, position: 'left' | 'right') => {
        if (isAnimating) return;

        // If tree is empty, insert as root
        if (!rootId || nodes.length === 0) {
            setIsAnimating(true);

            value.level = 0;
            value.animationState = TreeNodeAnimationState.NewInserted;

            setNodes([value]);
            setRootId(value.id);

            await sleep(delay.focus);

            value.animationState = TreeNodeAnimationState.Default;
            setNodes([value]);

            setInputValue("");
            setIsAnimating(false);
            return;
        }

        // Get selected parent node
        const parent = getSelectedNode();
        if (!parent) {
            alert("Please select a parent node first by clicking on it in the tree.");
            return;
        }

        // Check if position is already occupied
        if (position === 'left' && parent.left) {
            alert(`Left child of node with value "${parent.value}" already exists`);
            return;
        }
        if (position === 'right' && parent.right) {
            alert(`Right child of node with value "${parent.value}" already exists`);
            return;
        }

        // Check depth limit (parent level must be < maxDepth)
        if (parent.level >= maxDepth) {
            alert(`Cannot insert at depth ${maxDepth + 1}. Maximum depth is ${maxDepth}.`);
            return;
        }

        setIsAnimating(true);

        // Highlight parent
        parent.animationState = TreeNodeAnimationState.HighlightedOrange;
        setNodes([...nodes]);
        await sleep(delay.focus);

        // Set the new node's level
        value.level = parent.level + 1;
        value.animationState = TreeNodeAnimationState.NewInserted;

        // Connect to parent
        if (position === 'left') {
            parent.left = value.id;
        } else {
            parent.right = value.id;
        }

        // Add new node and reset parent state
        parent.animationState = TreeNodeAnimationState.Default;
        setNodes(prev => [...prev, value]);

        await sleep(delay.focus);

        // Reset new node to default
        value.animationState = TreeNodeAnimationState.Default;
        setNodes(prev => [...prev]);

        setInputValue("");
        setIsAnimating(false);
    };

    // DELETE LEAF NODE
    const deleteLeaf = async (value: string) => {
        if (isAnimating) return;

        let targetNode: TreeNode | null = null;

        // If value is empty, use selected node
        if (!value || value.trim() === '') {
            if (!selectedNodeId) {
                alert('Please enter a value or select a node to delete');
                return;
            }
            targetNode = getSelectedNode();
            if (!targetNode) {
                alert('No selected node'); // or no selected node
                return;
            }
        } else {
            // Find leaf node with matching value (prioritize leaves)
            targetNode = nodes.find(n =>
                n.value.toString() === value.toString() && !n.left && !n.right
            ) || null;

            if (!targetNode) {
                // Check if any node with this value exists
                const anyNode = findNodeByValue(value);
                if (anyNode) {
                    alert(`Node "${value}" is not a leaf node. Use "Delete Node" instead.`);
                } else {
                    alert(`Node with value "${value}" does not exist`);
                }
                return;
            }
        }

        // Check if selected/found node is a leaf
        if (targetNode.left || targetNode.right) {
            alert(`Node "${targetNode.value}" is not a leaf node. Use "Delete Node" instead.`);
            return;
        }

        setIsAnimating(true);

        // Highlight node to be removed
        targetNode.animationState = TreeNodeAnimationState.BeingRemoved;
        setNodes([...nodes]);
        await sleep(delay.focus + 300);

        // Find parent and disconnect
        const parent = nodes.find(n => n.left === targetNode.id || n.right === targetNode.id);
        if (parent) {
            if (parent.left === targetNode.id) parent.left = null;
            if (parent.right === targetNode.id) parent.right = null;
        } else if (targetNode.id === rootId) {
            // Deleting root (also handles case when it's the only node)
            setRootId(null);
        }

        // Remove node
        setNodes(prev => prev.filter(n => n.id !== targetNode.id));

        setInputValue("");
        setIsAnimating(false);
    };

    // DELETE NODE (with replacement strategy)
    const deleteNode = async (value: string) => {
        if (isAnimating) return;

        let targetNode: TreeNode | null = null;

        // If value is empty, use selected node
        if (!value || value.trim() === '') {
            if (!selectedNodeId) {
                alert('Please enter a value or select a node to delete');
                return;
            }
            targetNode = getSelectedNode();
            if (!targetNode) {
                alert('Selected node not found');
                return;
            }
        } else {
            targetNode = findNodeByValue(value);
            if (!targetNode) {
                alert(`Node with value "${value}" does not exist`);
                return;
            }
        }

        setIsAnimating(true);

        // Highlight target
        targetNode.animationState = TreeNodeAnimationState.BeingRemoved;
        setNodes([...nodes]);
        await sleep(delay.focus);

        // Check if target is a leaf node
        const isLeaf = !targetNode.left && !targetNode.right;

        if (isLeaf) {
            // If it's a leaf, just remove it directly
            const parent = nodes.find(n => n.left === targetNode.id || n.right === targetNode.id);
            if (parent) {
                if (parent.left === targetNode.id) parent.left = null;
                if (parent.right === targetNode.id) parent.right = null;
            } else if (targetNode.id === rootId) {
                setRootId(null);
            }

            setNodes(prev => prev.filter(n => n.id !== targetNode.id));
            setInputValue("");
            setIsAnimating(false);
            return;
        }

        // Find deepest rightmost node using level-order traversal
        const findDeepestRightmost = (): TreeNode | null => {
            if (!rootId) return null;

            let deepest: TreeNode | null = null;
            const queue: string[] = [rootId];

            while (queue.length > 0) {
                const currentId = queue.shift()!;
                const current = nodes.find(n => n.id === currentId);
                if (current) {
                    deepest = current;
                    if (current.left) queue.push(current.left);
                    if (current.right) queue.push(current.right);
                }
            }

            return deepest;
        };

        const deepestNode = findDeepestRightmost();

        if (!deepestNode || deepestNode.id === targetNode.id) {
            // Only one node or target is deepest - just remove it
            const parent = nodes.find(n => n.left === targetNode.id || n.right === targetNode.id);
            if (parent) {
                if (parent.left === targetNode.id) parent.left = null;
                if (parent.right === targetNode.id) parent.right = null;
            } else if (targetNode.id === rootId) {
                setRootId(null);
            }

            setNodes(prev => prev.filter(n => n.id !== targetNode.id));
        } else {
            // Highlight deepest node
            deepestNode.animationState = TreeNodeAnimationState.HighlightedGreen;
            setNodes([...nodes]);
            await sleep(delay.focus);

            // Swap values
            targetNode.value = deepestNode.value;
            targetNode.animationState = TreeNodeAnimationState.Default;
            setNodes([...nodes]);
            await sleep(delay.focus);

            // Remove deepest node
            const deepestParent = nodes.find(n => n.left === deepestNode.id || n.right === deepestNode.id);
            if (deepestParent) {
                if (deepestParent.left === deepestNode.id) deepestParent.left = null;
                if (deepestParent.right === deepestNode.id) deepestParent.right = null;
            }

            setNodes(prev => prev.filter(n => n.id !== deepestNode.id));
        }

        setInputValue("");
        setIsAnimating(false);
    };

    // FIND/SEARCH NODE
    const findNode = async (targetValue: string) => {
        if (isAnimating) return;
        if (!rootId) return;

        if (!targetValue || targetValue.trim() === '') {
            alert("Please enter a value to search");
            return;
        }

        setIsAnimating(true);
        setVisitOrder([]);

        let found = false;
        const queue: string[] = [rootId];

        while (queue.length > 0) {
            const currentId = queue.shift()!;
            const current = nodes.find(n => n.id === currentId);
            if (!current) continue;

            // Highlight as visiting
            current.animationState = TreeNodeAnimationState.Visiting;
            setNodes([...nodes]);
            await sleep(delay.interval);

            // Check if found
            if (current.value.toString() === targetValue.toString()) {
                current.animationState = TreeNodeAnimationState.HighlightedGreen;
                setNodes([...nodes]);
                found = true;
                await sleep(delay.focus);
                alert(`✓ Value Found!\n\nValue: ${targetValue}`);
                break;
            }

            // Mark as visited
            current.animationState = TreeNodeAnimationState.Visited;
            setNodes([...nodes]);

            // Add children to queue
            if (current.left) queue.push(current.left);
            if (current.right) queue.push(current.right);
        }

        if (!found) {
            await sleep(300);
            alert(`✗ Value "${targetValue}" not found in tree`);
        }

        // Reset all states
        setTimeout(() => {
            const resetNodes = nodes.map(node => ({
                ...node,
                animationState: TreeNodeAnimationState.Default
            }));
            setNodes(resetNodes);
            setIsAnimating(false);
        }, 500);
    };

    // PRE-ORDER TRAVERSAL (Root -> Left -> Right)
    const preorderTraversal = async (nodeId: string | null = rootId, order: (string | number)[] = []): Promise<(string | number)[]> => {
        if (!nodeId) return order;

        const node = nodes.find(n => n.id === nodeId);
        if (!node) return order;

        // Visit root
        node.animationState = TreeNodeAnimationState.Visiting;
        order.push(node.value);
        setVisitOrder([...order]);
        setNodes([...nodes]);
        await sleep(delay.focus);

        node.animationState = TreeNodeAnimationState.Visited;
        setNodes([...nodes]);
        await sleep(200);

        // Traverse left
        await preorderTraversal(node.left, order);

        // Traverse right
        await preorderTraversal(node.right, order);

        return order;
    };

    // IN-ORDER TRAVERSAL (Left -> Root -> Right)
    const inorderTraversal = async (nodeId: string | null = rootId, order: (string | number)[] = []): Promise<(string | number)[]> => {
        if (!nodeId) return order;

        const node = nodes.find(n => n.id === nodeId);
        if (!node) return order;

        // Traverse left first
        await inorderTraversal(node.left, order);

        // Visit root
        node.animationState = TreeNodeAnimationState.Visiting;
        order.push(node.value);
        setVisitOrder([...order]);
        setNodes([...nodes]);
        await sleep(delay.focus);

        node.animationState = TreeNodeAnimationState.Visited;
        setNodes([...nodes]);
        await sleep(200);

        // Traverse right
        await inorderTraversal(node.right, order);

        return order;
    };

    // POST-ORDER TRAVERSAL (Left -> Right -> Root)
    const postorderTraversal = async (nodeId: string | null = rootId, order: (string | number)[] = []): Promise<(string | number)[]> => {
        if (!nodeId) return order;

        const node = nodes.find(n => n.id === nodeId);
        if (!node) return order;

        // Traverse left
        await postorderTraversal(node.left, order);

        // Traverse right
        await postorderTraversal(node.right, order);

        // Visit root
        node.animationState = TreeNodeAnimationState.Visiting;
        order.push(node.value);
        setVisitOrder([...order]);
        setNodes([...nodes]);
        await sleep(delay.focus);

        node.animationState = TreeNodeAnimationState.Visited;
        setNodes([...nodes]);
        await sleep(200);

        return order;
    };

    // LEVEL-ORDER TRAVERSAL (BFS)
    const levelorderTraversal = async () => {
        if (isAnimating) return;
        if (!rootId) return;

        setIsAnimating(true);
        setVisitOrder([]);

        const queue: string[] = [rootId];
        const order: (string | number)[] = [];

        while (queue.length > 0) {
            const currentId = queue.shift()!;
            const current = nodes.find(n => n.id === currentId);
            if (!current) continue;

            // Visit current
            current.animationState = TreeNodeAnimationState.Visiting;
            order.push(current.value);
            setVisitOrder([...order]);
            setNodes([...nodes]);
            await sleep(delay.focus);

            current.animationState = TreeNodeAnimationState.Visited;
            setNodes([...nodes]);
            await sleep(200);

            // Enqueue children
            if (current.left) queue.push(current.left);
            if (current.right) queue.push(current.right);
        }

        // Reset all states
        setTimeout(() => {
            const resetNodes = nodes.map(node => ({
                ...node,
                animationState: TreeNodeAnimationState.Default
            }));
            setNodes(resetNodes);
            setIsAnimating(false);
        }, 1000);
    };

    // Wrapper functions for traversals
    const runPreorder = async () => {
        if (isAnimating) return;
        if (!rootId) return;

        setIsAnimating(true);
        setVisitOrder([]);
        await preorderTraversal(rootId, []);

        setTimeout(() => {
            const resetNodes = nodes.map(node => ({
                ...node,
                animationState: TreeNodeAnimationState.Default
            }));
            setNodes(resetNodes);
            setIsAnimating(false);
        }, 1000);
    };

    const runInorder = async () => {
        if (isAnimating) return;
        if (!rootId) return;

        setIsAnimating(true);
        setVisitOrder([]);
        await inorderTraversal(rootId, []);

        setTimeout(() => {
            const resetNodes = nodes.map(node => ({
                ...node,
                animationState: TreeNodeAnimationState.Default
            }));
            setNodes(resetNodes);
            setIsAnimating(false);
        }, 1000);
    };

    const runPostorder = async () => {
        if (isAnimating) return;
        if (!rootId) return;

        setIsAnimating(true);
        setVisitOrder([]);
        await postorderTraversal(rootId, []);

        setTimeout(() => {
            const resetNodes = nodes.map(node => ({
                ...node,
                animationState: TreeNodeAnimationState.Default
            }));
            setNodes(resetNodes);
            setIsAnimating(false);
        }, 1000);
    };

    // CLEAR TREE
    const clearTree = () => {
        if (isAnimating) return;
        setNodes([]);
        setRootId(null);
        setVisitOrder([]);
        setInputValue("");
        setSelectedNodeId(null);
    };

    // RESET TO INITIAL [1,2,3,4,5]
    const resetTree = () => {
        if (isAnimating) return;
        const { nodes: initial, rootId: root } = createTreeNodes();
        setNodes(initial);
        setRootId(root);
        setVisitOrder([]);
        setInputValue("");
        setSelectedNodeId(null);
    };

    // Check if insert button should be disabled
    const isInsertDisabled = (position: 'left' | 'right') => {
        const parent = getSelectedNode();
        if (!parent) return true;
        if (parent.level >= maxDepth) return true;
        if (position === 'left' && parent.left) return true;
        if (position === 'right' && parent.right) return true;
        return false;
    };

    return (
        <div className="h-full bg-gray-50 overflow-hidden">
            {showHelp && (
                <SimulatorHelp slides={helpSlides} onClose={() => setShowHelp(false)} />
            )}
            <main className="flex flex-col lg:flex-row h-full max-w-7xl mx-auto bg-white">

                {/* Tree display */}
                <div className="flex-1 lg:flex-[3] h-full overflow-hidden relative">
                    <button
                        className="absolute right-4 top-4 z-10 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 text-sm font-bold transition-colors flex items-center justify-center"
                        onClick={() => setShowHelp(true)}
                        aria-label="Open simulator help"
                    >
                        ?
                    </button>

                    {/* Title */}
                    <div className="flex-shrink-0 mb-2 md:mb-4 pt-6">
                        <h1 className="text-base md:text-xl font-semibold text-gray-600 text-center">
                            Binary Tree
                        </h1>
                    </div>

                    <div className="flex items-center justify-center px-4 md:px-9 py-4 h-full">
                        <VisualTree nodes={nodes} rootId={rootId} onNodeClick={handleNodeClick} />
                    </div>
                </div>

                {/* Controls section */}
                <div className="flex-1 lg:flex-[2] flex flex-col border-t lg:border-t-0 lg:border-l border-gray-200 h-full overflow-hidden">
                    {/* Operation type selector */}
                    <div className="flex border-b border-gray-200 flex-shrink-0">
                        {[
                            { type: OperationType.Insertion, label: 'Insertion', bgActive: 'bg-green-100' },
                            { type: OperationType.Deletion, label: 'Deletion', bgActive: 'bg-red-100' },
                            { type: OperationType.Search, label: 'Search', bgActive: 'bg-blue-100' },
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
                            {(operationType === OperationType.Insertion || operationType === OperationType.Search || operationType === OperationType.Deletion) && (
                                <div className="flex gap-2 md:gap-3 items-center">
                                    <label className="text-xs md:text-sm font-medium text-gray-700 min-w-[50px] md:min-w-[60px]">Value:</label>
                                    <input
                                        type="number"
                                        className="bg-white border border-gray-200 rounded-lg text-center flex-1 text-sm md:text-lg py-1.5 md:py-2 focus:border-blue-300 focus:outline-none transition-colors"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="Enter value"
                                    />
                                </div>
                            )}
                            {operationType === OperationType.Insertion && (
                                <div className="bg-blue-50 border border-blue-200 p-2 md:p-2.5 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs md:text-sm font-medium text-gray-700">Selected Node:</span>
                                            <span className="text-sm md:text-base font-bold text-blue-600">
                                                {selectedNodeId ? getSelectedNode()?.value : 'None'}
                                            </span>
                                        </div>
                                        {selectedNodeId && (
                                            <button
                                                onClick={() => handleNodeClick(selectedNodeId)}
                                                className="text-xs text-blue-600 hover:text-blue-800 underline"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Tree info */}
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 p-2 md:p-3 rounded-lg flex-shrink-0">
                            <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
                                <div className="flex items-center gap-1">
                                    <span className="font-medium text-gray-700">Height:</span>
                                    <span className="text-blue-600 font-bold">{calculateHeight(rootId)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="font-medium text-gray-700">Nodes:</span>
                                    <span className="text-blue-600 font-bold">{nodes.length}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="font-medium text-gray-700">Leaves:</span>
                                    <span className="text-green-600 font-bold">{countLeaves()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="font-medium text-gray-700">Root:</span>
                                    <span className="text-green-600 font-bold truncate max-w-[60px]">
                                        {rootId ? nodes.find(n => n.id === rootId)?.value || 'None' : 'None'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Visit Order Display */}
                        {operationType === OperationType.Traversal && visitOrder.length > 0 && (
                            <div className="bg-blue-50 border border-blue-200 p-2 md:p-3 rounded-lg flex-shrink-0">
                                <div className="text-xs md:text-sm">
                                    <span className="font-medium text-gray-700">Visit Order: </span>
                                    <span className="text-blue-600 font-bold">
                                        {visitOrder.join(' → ')}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex flex-col gap-2.5 md:gap-2 w-full flex-shrink-0">

                            {/* INSERTION */}
                            {operationType === OperationType.Insertion && (
                                <>
                                    <ActionButton
                                        text="Insert Left"
                                        bgColor="#2A9D8F"
                                        shadowColor="#1F7A6B"
                                        onClick={() => insertNode(createNode(getValueOrRandom(inputValue)), 'left')}
                                        info={TREE_OPERATION_INFOS.insertLeft}
                                    />
                                    <ActionButton
                                        text="Insert Right"
                                        bgColor="#2A9D8F"
                                        shadowColor="#1F7A6B"
                                        onClick={() => insertNode(createNode(getValueOrRandom(inputValue)), 'right')}
                                        info={TREE_OPERATION_INFOS.insertRight}
                                    />
                                    <ActionButton
                                        text="Reset"
                                        bgColor="#2A9D8F"
                                        shadowColor="#1F7A6B"
                                        onClick={resetTree}
                                        info={TREE_OPERATION_INFOS.reset}
                                    />
                                </>
                            )}

                            {/* DELETION */}
                            {operationType === OperationType.Deletion && (
                                <>
                                    <ActionButton
                                        text="Delete Leaf"
                                        bgColor="#C7573B"
                                        shadowColor="#A0422E"
                                        onClick={() => deleteLeaf(inputValue)}
                                        info={TREE_OPERATION_INFOS.deleteLeaf}
                                    />
                                    <ActionButton
                                        text="Delete Node"
                                        bgColor="#C7573B"
                                        shadowColor="#A0422E"
                                        onClick={() => deleteNode(inputValue)}
                                        info={TREE_OPERATION_INFOS.deleteNode}
                                    />
                                </>
                            )}

                            {/* SEARCH */}
                            {operationType === OperationType.Search && (
                                <>
                                    <ActionButton
                                        text="Find Value"
                                        bgColor="#3B82F6"
                                        shadowColor="#1E40AF"
                                        onClick={() => findNode(inputValue)}
                                        info={TREE_OPERATION_INFOS.findValue}
                                    />
                                </>
                            )}

                            {/* TRAVERSAL */}
                            {operationType === OperationType.Traversal && (
                                <>
                                    <ActionButton
                                        text="Pre-order (Root-L-R)"
                                        bgColor="#7C3AED"
                                        shadowColor="#5B21B6"
                                        onClick={runPreorder}
                                        info={TREE_OPERATION_INFOS.preorder}
                                    />
                                    <ActionButton
                                        text="In-order (L-Root-R)"
                                        bgColor="#7C3AED"
                                        shadowColor="#5B21B6"
                                        onClick={runInorder}
                                        info={TREE_OPERATION_INFOS.inorder}
                                    />
                                    <ActionButton
                                        text="Post-order (L-R-Root)"
                                        bgColor="#7C3AED"
                                        shadowColor="#5B21B6"
                                        onClick={runPostorder}
                                        info={TREE_OPERATION_INFOS.postorder}
                                    />
                                    <ActionButton
                                        text="Level-order (BFS)"
                                        bgColor="#7C3AED"
                                        shadowColor="#5B21B6"
                                        onClick={levelorderTraversal}
                                        info={TREE_OPERATION_INFOS.levelorder}
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
