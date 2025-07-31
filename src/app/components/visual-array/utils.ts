import {ArrayElement, ArrayElementAnimationState} from "@/app/components/visual-array/types";

// create a single array element
// mainly for VisualArrayBox
export const createArrayElement = (
    value: string | number,
    animationState: ArrayElementAnimationState = ArrayElementAnimationState.Default
): ArrayElement => {
    return { id: crypto.randomUUID(), value, animationState}
};

// creates multiple array elements
export const createArrayElements = (...arr: (string | number)[]): ArrayElement[] => {
    return arr.map(value => createArrayElement(value));
};
