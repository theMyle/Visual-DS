import { ArrayElement, ArrayElementAnimationState } from "@/app/simulator/components/array-list/types";
import { v4 as randomUUID } from "uuid";

// create a single array element
// mainly for VisualArrayBox
export const createArrayElement = (
  value: string | number,
  animationState: ArrayElementAnimationState = ArrayElementAnimationState.Default
): ArrayElement => {
  return {
    id: randomUUID(),
    value,
    animationState
  }
};

// creates multiple array elements
export const createArrayElements = (...arr: (string | number)[]): ArrayElement[] => {
  return arr.map(value => createArrayElement(value));
};
