export type TestCaseByArrayOutput = {
  expected: (string | number)[];
  expectedReturn?: never;
};

export type TestCaseByReturnValue = {
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

const API_TEMPLATE = `/*
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

export const CHALLENGE_INTRO: ChallengeConfig = {
  id: "queue-1",
  title: "Queue Rotation",
  description:
    "Given a queue, rotate it left by one position using queue operations and return the new front. Example: [1, 2, 3] => 2.",
  programStructure: {
    parameterNames: ["queue", "io"],
  },
  initialEditorCode: `${API_TEMPLATE}

function Solution(queue, io) {
  if (queue.size() === 0) {
    io.println("Queue is empty");
    return 0;
  }

  const front = queue.dequeue();
  queue.enqueue(front);

  io.println("Rotated front: " + front);
  return queue.peek();
}

`,
  testCases: [
    {
      name: "Test Case 1",
      input: [1, 2, 3],
      expectedReturn: 2,
    },
    {
      name: "Test Case 2",
      input: [4, 5, 6, 7],
      expectedReturn: 5,
    },
    {
      name: "Test Case 3",
      input: [9],
      expectedReturn: 9,
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