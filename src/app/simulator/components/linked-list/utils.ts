import { v4 as uuidv4 } from 'uuid';
import { LinkedListNode, NodeAnimationState } from './types';

export const createNode = (value: string | number): LinkedListNode => {
    return {
        id: uuidv4(),
        value: value,
        next: null,
        animationState: NodeAnimationState.Default,
    };
};

export const createNodes = (...values: (string | number)[]): LinkedListNode[] => {
    const nodes: LinkedListNode[] = values.map(value => createNode(value));

    // Link nodes together
    for (let i = 0; i < nodes.length - 1; i++) {
        nodes[i].next = nodes[i + 1].id;
    }

    return nodes;
};
