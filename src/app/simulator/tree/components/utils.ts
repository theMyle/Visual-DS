import { v4 as uuidv4 } from 'uuid';
import { TreeNode, TreeNodeAnimationState } from './types';

export const createNode = (value: string | number, level: number = 0): TreeNode => {
    return {
        id: uuidv4(),
        value: value,
        left: null,
        right: null,
        level: level,
        animationState: TreeNodeAnimationState.Default,
    };
};

// Create initial tree structure [1,2,3,4,5]
//        1
//       / \
//      2   3
//     / \
//    4   5
export const createTreeNodes = (): { nodes: TreeNode[], rootId: string } => {
    const node1 = createNode(1, 0);
    const node2 = createNode(2, 1);
    const node3 = createNode(3, 1);
    const node4 = createNode(4, 2);
    const node5 = createNode(5, 2);

    node1.left = node2.id;
    node1.right = node3.id;
    node2.left = node4.id;
    node2.right = node5.id;

    return {
        nodes: [node1, node2, node3, node4, node5],
        rootId: node1.id
    };
};

// Calculate node level (depth) in tree
export const calculateNodeLevel = (
    nodeId: string,
    nodes: TreeNode[],
    rootId: string
): number => {
    if (nodeId === rootId) return 0;

    const findLevel = (currentId: string | null, currentLevel: number): number => {
        if (!currentId) return -1;
        if (currentId === nodeId) return currentLevel;

        const current = nodes.find(n => n.id === currentId);
        if (!current) return -1;

        const leftLevel = findLevel(current.left, currentLevel + 1);
        if (leftLevel !== -1) return leftLevel;

        return findLevel(current.right, currentLevel + 1);
    };

    return findLevel(rootId, 0);
};
