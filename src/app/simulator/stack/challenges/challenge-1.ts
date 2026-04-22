import { ChallengeConfig, API_TEMPLATE } from "./runner";

export const CHALLENGE_1: ChallengeConfig = {
  id: "stack-1",
  title: "Move Stack",
  description: "Move all elements from stackA to stackB. The elements in stackB should end up in reverse order. Note: the right-most element in the test case input is the top of the stack.",
  programStructure: {
    parameterNames: ["stackA", "stackB", "io"],
  },
  initialEditorCode: `${API_TEMPLATE}

function Solution(stackA, stackB) {
  // Your code here
  
}
`,
  testCases: [
    {
      name: "Test Case 1",
      inputs: {
        stackA: [10, 20, 30],
        stackB: [],
      },
      expected: {
        stackA: [],
        stackB: [30, 20, 10],
      },
    },
    {
      name: "Test Case 2",
      inputs: {
        stackA: [1, 2, 3, 4, 5],
        stackB: [],
      },
      expected: {
        stackA: [],
        stackB: [5, 4, 3, 2, 1],
      },
    },
    {
      name: "Test Case 3",
      inputs: {
        stackA: [-5, 15],
        stackB: [0],
      },
      expected: {
        stackA: [],
        stackB: [0, 15, -5],
      },
    },
  ],
  maxCapacity: {
    desktop: 12,
    mobile: 10,
  },
};
