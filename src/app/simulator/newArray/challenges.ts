type TestCaseByArrayOutput = {
  expected: (string | number)[];
  expectedReturn?: never;
};

type TestCaseByReturnValue = {
  expected?: never;
  expectedReturn: string | number;
};

export interface TestCaseBase {
  name: string;
  input: (string | number)[];
}

export type TestCase = TestCaseBase & (TestCaseByArrayOutput | TestCaseByReturnValue);

export interface ChallengeProgramStructure {
  parameterNames: readonly string[];
}

export interface ChallengeConfig {
  id: string;
  title: string;
  description: string;
  initialEditorCode: string;
  programStructure?: ChallengeProgramStructure;
  // Deprecated: use programStructure.parameterNames
  runnerParameterNames?: readonly string[];
  testCases: TestCase[];
  maxCapacity: {
    desktop: number;
    mobile: number;
  };
}

export type ChallengeRunner = (...args: unknown[]) => unknown;

export const DEFAULT_RUNNER_PARAMETER_NAMES = ["array", "io"] as const;
export const DEFAULT_PROGRAM_STRUCTURE: ChallengeProgramStructure = {
  parameterNames: DEFAULT_RUNNER_PARAMETER_NAMES,
};

const buildChallengeRunnerSource = (code: string, parameterNames: readonly string[]) => `
${code}

if (typeof Solution !== 'function') {
  throw new Error('Solution(...) is required');
}

return Solution(${parameterNames.join(", ")});`;

export const createChallengeRunner = (
  code: string,
  parameterNames: readonly string[] = DEFAULT_RUNNER_PARAMETER_NAMES,
) => {
  return new Function(...parameterNames, buildChallengeRunnerSource(code, parameterNames)) as ChallengeRunner;
};

// Template for editor code (reusable across challenges)
const API_TEMPLATE = `/*
Array API Spec - These are array-specific methods for the coding challenge.

Array {
  get(index)                  - Returns the item at an index.
  insertAt(index, value)      - Insert value at a specific index.
  insertBack(value)           - Insert value at the end of the array.
  insertFront(value)          - Insert value at the beginning of the array.
  removeAt(index)             - Remove the item at a specific index and returns it.
  removeBack()                - Remove the last item in the array and returns it.
  removeFront()               - Remove the first item in the array and returns it.
  setAt(index, value)         - Replace the value at a specific index.
  size()                      - Return the current array size.
  swap(indexA, indexB)        - Swap two items in the array.
}

io {
  println(messageOrPromise)   - Write a value (or resolved Promise value) to the output panel.
}

Put challenge logic inside \`Solution\` Function.
Note: use Array API methods only.
*/`;

// Simple intro challenge without test cases
export const CHALLENGE_INTRO: ChallengeConfig = {
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
