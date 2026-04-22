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
  runnerParameterNames?: readonly string[];
  testCases: TestCase[];
  maxCapacity: {
    desktop: number;
    mobile: number;
  };
}

export type ChallengeRunner = (...args: unknown[]) => unknown;

export const DEFAULT_RUNNER_PARAMETER_NAMES = ["stack", "io"] as const;

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

const API_TEMPLATE = `/*
Stack API Spec - These are stack-specific methods for the coding challenge.

Stack {
  push(value)               - Insert a value at the top of the stack.
  pop()                     - Remove and return the value at the top.
  peek()                    - Return the top value without removing it.
  size()                    - Return the current stack size.
}

io {
  println(messageOrPromise)  - Write a value (or resolved Promise value) to the output panel.
}

Put challenge logic inside \`Solution\` Function.
Note: use Stack API methods only.
*/`;

export const CHALLENGE_INTRO: ChallengeConfig = {
  id: "stack-1",
  title: "Even Minus Odd",
  description:
    "Pop all values from the stack and return the sum of even values minus the sum of odd values.",
  programStructure: {
    parameterNames: ["stack", "io"],
  },
  initialEditorCode: `${API_TEMPLATE}

function Solution(stack, io) {
  let evenSum = 0;
  let oddSum = 0;

  while (stack.size() > 0) {
    const value = stack.pop();

    if (typeof value !== "number") {
      continue;
    }

    if (value % 2 === 0) {
      evenSum += value;
    } else {
      oddSum += value;
    }
  }

  const result = evenSum - oddSum;
  io.println("Result: " + result);
  return result;
}

`,
  testCases: [
    {
      name: "Test Case 1",
      input: [12, 7, 19, 4, 33, 28, 5, 16, 41, 10],
      expectedReturn: -35,
    },
    {
      name: "Test Case 2",
      input: [45, 18, 2, 39, 24, 7, 31, 40, 13, 26],
      expectedReturn: -25,
    },
    {
      name: "Test Case 3",
      input: [9, 32, 15, 48, 23, 4, 11, 36, 27, 20],
      expectedReturn: 55,
    },
    {
      name: "Test Case 4",
      input: [],
      expectedReturn: 0,
    },
  ],
  maxCapacity: {
    desktop: 12,
    mobile: 10,
  },
};