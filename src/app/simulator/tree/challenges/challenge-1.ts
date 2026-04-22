import { ChallengeConfig, API_TEMPLATE } from "./runner";

export const CHALLENGE_1: ChallengeConfig = {
  id: "challenge-1",
  title: "Tree Node Sum",
  description: "Traverse the binary tree and return the sum of all node values. Example: [1, 2, 3] => 6.",
  programStructure: {
    parameterNames: ["tree", "io"],
  },
  initialEditorCode: `${API_TEMPLATE}

function Solution(tree) {
  // Code your solution here
  //
  // let root = tree.root()
  
}



`,
  testCases: [
    {
      name: "Test Case 1",
      input: [1, 2, 3, 4, 5, 6, 7], // 1+2+3+4+5+6+7 = 28
      expectedReturn: 28
    },
    {
      name: "Test Case 2",
      input: [10, 5, 15],
      expectedReturn: 30,
    },
    {
      name: "Test Case 3",
      input: [],
      expectedReturn: 0,
    }
  ],
  maxCapacity: {
    desktop: 15, // max depth 4
    mobile: 7,   // max depth 3
  }
};
