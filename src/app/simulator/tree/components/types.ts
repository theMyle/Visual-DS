export type TreeNode = {
    id: string;
    value: string | number;
    left: string | null;
    right: string | null;
    level: number;
    animationState: TreeNodeAnimationState;
};

export enum TreeNodeAnimationState {
    Default,
    Invisible,
    NewInserted,
    BeingRemoved,
    Visiting,
    Visited,
    HighlightedGreen,
    HighlightedOrange,
}
