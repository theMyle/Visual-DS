export type TestCaseByArrayOutput = {
  expected: (string | number)[] | Record<string, (string | number)[]>;
  expectedReturn?: never;
};

export type TestCaseByReturnValue = {
  expected?: never;
  expectedReturn: string | number;
};

export interface TestCaseBase {
  name: string;
  input?: (string | number)[];
  inputs?: Record<string, (string | number)[]>;
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
export const API_TEMPLATE = `/*
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
