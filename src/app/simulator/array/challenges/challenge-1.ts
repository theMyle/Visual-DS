import { ChallengeConfig, API_TEMPLATE } from "./runner";

export const CHALLENGE_1: ChallengeConfig = {
  id: "array-1",
  title: "Even Sum - Odd Sum",
  description: "Given a list, return the difference of the sum of all even values minus the sum of all odd values. Example: [1, 2, 3, 4] => (2 + 4) - (1 + 3) = 2.",
  programStructure: {
    parameterNames: ["array", "io"],
  },
  initialEditorCode: `${API_TEMPLATE}

function Solution(array) {
  io.println("Hello World");
  let x = array.get(0);

  io.println(x);
  return x;
}
  

`,
  testCases: [
    {
      name: "Test Case 1",
      input: [12, 7, 19, 4, 33, 28, 5, 16, 41, 10, 22, 3, 8, 27, 14, 9, 30, 11, 6, 25],
      expectedReturn: -30,
    },
    {
      name: "Test Case 2",
      input: [45, 18, 2, 39, 24, 7, 31, 40, 13, 26, 50, 1, 34, 29, 6, 17, 8, 21, 14, 3],
      expectedReturn: 16,
    },
    {
      name: "Test Case 3",
      input: [9, 32, 15, 48, 23, 4, 11, 36, 27, 20, 5, 42, 14, 7, 30, 19, 2, 25, 38, 13],
      expectedReturn: 112,
    },
    {
      name: "Test Case 4",
      input: [],
      expectedReturn: 0,
    },
  ],
  maxCapacity: {
    desktop: 40,
    mobile: 20,
  },
};
