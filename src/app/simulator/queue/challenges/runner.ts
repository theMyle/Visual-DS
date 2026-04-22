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
  runnerParameterNames?: readonly string[];
  testCases: TestCase[];
  maxCapacity: {
    desktop: number;
    mobile: number;
  };
}

export type ChallengeRunner = (...args: unknown[]) => unknown;

export const DEFAULT_RUNNER_PARAMETER_NAMES = ["queue", "io"] as const;

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

export const API_TEMPLATE = `/*
Queue API Spec - These are queue-specific methods for the coding challenge.

Queue {
  enqueue(value)            - Insert a value at the rear of the queue.
  dequeue()                 - Remove and return the value at the front of the queue.
  peek()                    - Return the value at the front without removing it.
  size()                    - Return the current queue size.
}

io {
  println(messageOrPromise)  - Write a value (or resolved Promise value) to the output panel.
}

Put challenge logic inside \`Solution\` Function.
Note: use Queue API methods only.
*/`;
