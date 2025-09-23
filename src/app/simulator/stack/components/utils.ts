import { StackElement, StackElementAnimationState } from "@/app/simulator/stack/components/types";
import { v4 as randomUUID } from "uuid";

// create a single stack element
export const createStackElement = (
  value: string | number,
  animationState: StackElementAnimationState = StackElementAnimationState.Default
): StackElement => {
  return {
    id: randomUUID(),
    value,
    animationState
  }
};

// creates multiple stack elements
export const createStackElements = (...arr: (string | number)[]): StackElement[] => {
  return arr.map(value => createStackElement(value));
};