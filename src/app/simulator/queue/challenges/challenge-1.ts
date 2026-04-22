import { ChallengeConfig, API_TEMPLATE } from "./runner";

export const CHALLENGE_1: ChallengeConfig = {
  id: "queue-remove-second",
  title: "The Second Choice",
  description:
    "Given a queue of n items (where n >= 0), remove the element at the 2nd position. All other elements must remain in their original relative order. Example: [10, 20, 30, 40] -> [10, 30, 40].",
  programStructure: {
    parameterNames: ["queue", "io"],
  },
  initialEditorCode: `${API_TEMPLATE}

function Solution(queue, io) {
  // Your logic goes here.

}



`,
  testCases: [
    {
      name: "Test Case 1",
      input: [10, 20, 30, 40],
      expected: [10, 30, 40],
    },
    {
      name: "Test Case 2",
      input: ["A", "B", "C"],
      expected: ["A", "C"],
    },
    {
      name: "Test Case 3",
      input: [5, 5],
      expected: [5],
    },
    {
      name: "Test Case 4",
      input: [],
      expected: [],
    },
  ],
  maxCapacity: {
    desktop: 40,
    mobile: 20,
  },
};