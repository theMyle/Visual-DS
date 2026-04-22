export type LinkedListNode = {
    id: string;
    value: string | number;
    next: string | null;
    animationState: NodeAnimationState;
};

export enum NodeAnimationState {
    Default,
    Invisible,
    NewInserted,
    BeingRemoved,
    Traversing,
    HighlightedGreen,
    HighlightedOrange,
}
