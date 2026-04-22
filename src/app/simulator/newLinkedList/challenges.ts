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

export const DEFAULT_RUNNER_PARAMETER_NAMES = ["list", "io"] as const;
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

const API_TEMPLATE = `/*
Linked List API Spec - Use the list and node helpers to traverse the structure.

list {
  getHead()                  - Returns the first node, or null when the list is empty.
  setHead(nodeOrNull)        - Updates the head pointer.
  getTail()                  - Returns the last node, or null when the list is empty.
  setTail(nodeOrNull)        - Updates the tail pointer.
  size()                     - Returns the current number of nodes.
  newNode(value)             - Creates a detached node and returns it.
}

node {
  getValue()                 - Returns the node value.
  setValue(value)            - Updates the node value.
  getNext()                  - Returns the next node, or null.
  setNext(nodeOrNull)        - Updates the next pointer.
}

io {
  println(value)              - Write a value to the output panel.
}

Put challenge logic inside \`Solution\` function.
*/`;

export const CHALLENGE_INTRO: ChallengeConfig = {
  id: "linked-list-1",
  title: "Linked List Sum",
  description: "Traverse the linked list from head to tail and return the sum of all node values. Example: [1, 2, 3, 4] => 10.",
  programStructure: {
    parameterNames: ["list", "io"],
  },
  initialEditorCode: `${API_TEMPLATE}

function Solution(list) {

}



`,
  testCases: [
    {
      name: "Test Case 1",
      input: [1, 2, 3, 4],
      expected: [1,3,2,3,4,5]
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
