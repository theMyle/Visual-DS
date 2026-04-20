import { ArrayElement } from "@/app/simulator/array-list/components/types";
import { createArrayElements } from "@/app/simulator/array-list/components/utils";

export interface TestCase {
  name: string;
  input: (string | number)[];
  expected: (string | number)[];
}

export interface ChallengeConfig {
  id: string;
  title: string;
  description: string;
  initialArraySeed: (string | number)[];
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

// Challenge: Intro to Array (basic operations)
export const CHALLENGE_INTRO_ARRAY: ChallengeConfig = {
  id: "intro-array",
  title: "Introduction to Arrays",
  description:
    "Get familiar with basic array operations. Try reading elements, inserting values, and inspecting the array size.",
  initialArraySeed: ["1", "2", "3", "4", "5"],
  initialEditorCode: `${API_TEMPLATE}

function Solution(array) {
   io.println("Hello World");

   let x = array.get(0);
   io.println("array at index 0 is: " + x);
}`,
  testCases: [
    {
      name: "Read and inspect",
      input: [1, 2, 3, 4, 5],
      expected: [1, 2, 3, 4, 5], // No changes expected
    },
    {
      name: "Insert at end",
      input: [1, 2, 3],
      expected: [1, 2, 3, 99], // After insertBack(99)
    },
    {
      name: "Remove and swap",
      input: [1, 2, 3, 4],
      expected: [4, 2], // After removeAt(0), removeAt(2), swap(0,1)
    },
  ],
  maxCapacity: {
    desktop: 40,
    mobile: 20,
  },
};

// Challenge: Sorting (Sort array in ascending order)
export const CHALLENGE_SORT_ASC: ChallengeConfig = {
  id: "sort-ascending",
  title: "Sort Array Ascending",
  description:
    "Sort the given array in ascending order using insertion sort, bubble sort, or selection sort. You decide the algorithm!",
  initialArraySeed: [5, 2, 8, 1, 9],
  initialEditorCode: `${API_TEMPLATE}

function Solution(array) {
   // Implement your sorting algorithm here
   // Tip: Use array.swap(i, j) to swap elements
   // Tip: Use array.get(i) to read elements
   
   let n = array.size();
   for (let i = 0; i < n; i++) {
      // Your sorting logic
   }
}`,
  testCases: [
    {
      name: "Already sorted",
      input: [1, 2, 3, 4, 5],
      expected: [1, 2, 3, 4, 5],
    },
    {
      name: "Reverse sorted",
      input: [5, 4, 3, 2, 1],
      expected: [1, 2, 3, 4, 5],
    },
    {
      name: "Random order",
      input: [3, 1, 4, 1, 5, 9, 2, 6],
      expected: [1, 1, 2, 3, 4, 5, 6, 9],
    },
  ],
  maxCapacity: {
    desktop: 40,
    mobile: 20,
  },
};

// Challenge: Find Duplicates (Remove all duplicates)
export const CHALLENGE_REMOVE_DUPLICATES: ChallengeConfig = {
  id: "remove-duplicates",
  title: "Remove Duplicates",
  description:
    "Remove all duplicate elements from the array. Keep only the first occurrence of each value.",
  initialArraySeed: [1, 2, 2, 3, 3, 3, 4],
  initialEditorCode: `${API_TEMPLATE}

function Solution(array) {
   // Remove all duplicates from the array
   // Keep only the first occurrence of each element
   
   let i = 0;
   while (i < array.size()) {
      // Your deduplication logic
      i++;
   }
}`,
  testCases: [
    {
      name: "No duplicates",
      input: [1, 2, 3, 4, 5],
      expected: [1, 2, 3, 4, 5],
    },
    {
      name: "Some duplicates",
      input: [1, 2, 2, 3, 3, 3],
      expected: [1, 2, 3],
    },
    {
      name: "All same",
      input: [5, 5, 5, 5],
      expected: [5],
    },
  ],
  maxCapacity: {
    desktop: 40,
    mobile: 20,
  },
};

// Map all challenges for easy lookup
export const CHALLENGES: Record<string, ChallengeConfig> = {
  [CHALLENGE_INTRO_ARRAY.id]: CHALLENGE_INTRO_ARRAY,
  [CHALLENGE_SORT_ASC.id]: CHALLENGE_SORT_ASC,
  [CHALLENGE_REMOVE_DUPLICATES.id]: CHALLENGE_REMOVE_DUPLICATES,
};

// Default challenge
export const DEFAULT_CHALLENGE = CHALLENGE_INTRO_ARRAY;
