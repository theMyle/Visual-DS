import { ChallengeConfig, API_TEMPLATE } from "./runner";

export const CHALLENGE_1: ChallengeConfig = {
  id: "linked-list-1",
  title: "Linked List Sum",
  description: "Traverse the linked list from head to tail and return the sum of all node values. Example: [1, 2, 3, 4] => 10.",
  programStructure: {
    parameterNames: ["list", "io"],
  },
  initialEditorCode: `${API_TEMPLATE}

function Solution(list) {
  let current = list.getHead();
  io.println(current.getValue());
}



`,
  testCases: [
    {
      name: "Test Case 1",
      input: [1, 2, 3, 4, 5],
      expected: {
        list: [1, 2, 3, 4, 5]
      }
    },
    {
      name: "Test Case 2",
      input: [5, 5, 5],
      expectedReturn: 15,
    },
    {
      name: "Test Case 3",
      input: [10],
      expectedReturn: 10,
    },
    {
      name: "Test Case 4",
      input: [],
      expectedReturn: 0,
    },
  ],
  maxCapacity: {
    desktop: 24,
    mobile: 12,
  },
};
