/*
* Stack element type for tracking each stack
* element to animate with framer motion
*/
export type StackElement = {
    id: string,
    value: string | number,
    animationState: StackElementAnimationState
}

export enum StackElementAnimationState {
    Default,
    Invisible,
    RemovedInvisible,
    NewPushed,
    HighlightedOrange,
    HighlightedGreen,
    Popping,
    PeekReturn,
}