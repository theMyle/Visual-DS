export type TestCaseByArrayOutput = {
  expected: (string | number | null)[] | Record<string, (string | number | null)[]>;
  expectedReturn?: never;
};

export type TestCaseByReturnValue = {
  expected?: never;
  expectedReturn: string | number;
};

export interface TestCaseBase {
  name: string;
  input?: (string | number | null)[];
  inputs?: Record<string, (string | number | null)[]>;
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

export const DEFAULT_RUNNER_PARAMETER_NAMES = ["tree", "io"] as const;
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

export const API_TEMPLATE = `/*
Tree API Spec - Use the tree and node helpers to traverse the structure.

tree {
  root()                     - Returns the root node, or null when the tree is empty.
  setRoot(nodeOrNull)        - Updates the root node.
  size()                     - Returns the current number of nodes.
  newNode(value)             - Creates a detached node and returns it.
}

node {
  value()                    - Returns the node value.
  setValue(value)            - Updates the node value.
  left()                     - Returns the left child node, or null.
  setLeft(nodeOrNull)        - Updates the left child pointer.
  right()                    - Returns the right child node, or null.
  setRight(nodeOrNull)       - Updates the right child pointer.
}

io {
  println(value)             - Write a value to the output panel.
}

Put challenge logic inside \`Solution\` function.
*/`;
