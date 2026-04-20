export interface TestCase {
  name: string;
  input: (string | number)[];
  expected: (string | number)[];
}

export interface ChallengeConfig {
  id: string;
  title: string;
  description: string;
  initialEditorCode: string;
  testCases: TestCase[];
  maxCapacity: {
    desktop: number;
    mobile: number;
  };
}

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
  title: "Two Sum",
  description: "Add 69 at the front and back of list",
  initialEditorCode: `${API_TEMPLATE}

function Solution(array) {
  io.println("Hello World");

  let x = array.get(0);
  io.println("array at index 0 is: " + x);
}`,
  testCases: [
    {name: "", input:[1,2,3,4,5], expected: [69, 1,2,3,4,5, 69]},
    {name: "", input:[1,2,3], expected: [69, 1,2,3,69]},
    {name: "", input:[3], expected: [69,3,69]},
  ],
  maxCapacity: {
    desktop: 40,
    mobile: 20,
  },
};
