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

export const DEFAULT_RUNNER_PARAMETER_NAMES = ["stack", "io"] as const;
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
Stack API Spec - These are stack-specific methods for the coding challenge.

Stack {
  push(value)                 - Push a value to the top of the stack.
  pop()                       - Remove and return the top element of the stack.
  peek()                      - Return the top element without removing it.
  size()                      - Return the current number of elements in the stack.
  isEmpty()                   - Return true if the stack is empty, false otherwise.
  clear()                     - Remove all elements from the stack.
}

io {
  println(messageOrPromise)   - Write a value (or resolved Promise value) to the output panel.
}

Put challenge logic inside \`Solution\` Function.
Note: use Stack API methods only.
*/`;
