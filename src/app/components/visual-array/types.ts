
/*
* need to assign unique ID for tracking each array
* element to animate with framer motion
* */
export type ArrayElement = {
    id: string,
    value: string | number,
    animationState: ArrayElementAnimationState
}

export enum ArrayElementAnimationState {
    Default,
    Invisible,
    RemovedInvisible,
}
