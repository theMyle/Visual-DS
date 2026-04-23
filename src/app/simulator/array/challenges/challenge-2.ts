import { API_TEMPLATE, ChallengeConfig } from "./runner";

export const CHALLENGE_2: ChallengeConfig = {
  id: "array-2",
  title: "Neighborhood Watch",
  description: "Find the index of the element whose neighbors have the highest combined sum. A neighbor is any element directly to the left or right. If an element is at the start or end, it only has one neighbor. \n\nExample: [0, 10, 9, 1]\nIndex 0: Neighbor is 10. Sum = 10\nIndex 1: Neighbors 0 and 9. Sum = 9\nIndex 2: Neighbors 10 and 1. Sum = 11\nIndex 3: Neighbor is 9. Sum = 9\nResult: 2\n\nReturn -1 if the array is empty. If there is a tie, return the first index found.",
  programStructure: {
    parameterNames: ["array", "io"],
  },
  initialEditorCode: `${API_TEMPLATE}

function Solution(array, io) {
  
}
`,
  testCases: [
    {
      name: "Test Case 1",
      input: [0, 10, 9, 1],
      expectedReturn: 2,
    },
    {
      name: "Test Case 2",
      input: [50, 10, 5, 2],
      expectedReturn: 1, 
    },
    {
      name: "Test Case 3",
      input: [1, 5, 1, 5, 1],
      expectedReturn: 2,
    },
    {
      name: "Test Case 4",
      input: [10, 20],
      expectedReturn: 0,
    },
    {
      name: "Test Case 5",
      input: [],
      expectedReturn: -1,
    },
  ],
  maxCapacity: {
    desktop: 40,
    mobile: 20,
  },
};