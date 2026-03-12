import { Assessment } from "../types";

export const arrayListAssessment: Assessment = {
  id: "array-list-1",
  title: "Array List Basics",
  description: "Assessment on indexing, memory calculation, and performance.",
  category: {
    id: "data-structures",
    name: "Data Structures",
    description: "Core data structures concepts",
  },
  questions: [
    {
      id: "q1",
      text: "How do you access the value (5) in this array nums?",
      type: "multiple_choice",
      image_url: "/assessment/array-list/q1.png",
      choices: [
        { id: "a", text: "nums[2]", is_correct: false },
        { id: "b", text: "nums[3]", is_correct: false },
        { id: "c", text: "nums[4]", is_correct: true },
        { id: "d", text: "nums[5]", is_correct: false },
      ],
      feedback: {
        correct:
          "That's right! Since array indices start at 0, the fifth element (the value 5) is at index 4.",
        incorrect:
          "Not quite. Arrays start counting from 0, so the fifth element is actually at index 4.",
      },
    },
    {
      id: "q2",
      text: 'For items = ["Sword", "Shield", "Potion"], how do you access the very first element?',
      type: "multiple_choice",
      choices: [
        { id: "a", text: "items[1]", is_correct: false },
        { id: "b", text: "items[0]", is_correct: true },
        { id: "c", text: "items{0}", is_correct: false },
        { id: "d", text: "items{1}", is_correct: false },
      ],
      feedback: {
        correct:
          "Correct! In almost all programming languages, arrays are 0-indexed. The first element is always at index 0.",
        incorrect:
          "Careful! Computer scientists start counting at 0. If you use [1], you’ll actually grab the second item (Shield)!",
      },
    },
    {
      id: "q3",
      text: "In a Dynamic Array, what happens behind the scenes when you add an element but the capacity is full?",
      type: "multiple_choice",
      choices: [
        {
          id: "a",
          text: "The array expands into the next available byte.",
          is_correct: false,
        },
        {
          id: "b",
          text: "The computer allocates a larger block and copies all elements over.",
          is_correct: true,
        },
        {
          id: "c",
          text: "The array becomes a Linked List automatically.",
          is_correct: false,
        },
        {
          id: "d",
          text: "The new element is stored in an 'overflow' variable.",
          is_correct: false,
        },
      ],
      feedback: {
        correct:
          'Correct! This is why "pushing" to a dynamic array is usually O(1), but occasionally becomes O(n) during a resize.',
        incorrect:
          'A dynamic array is still just a basic array under the hood. Since a basic array is a fixed block of slots, it can\'t just "grow" if the spots next to it are taken. It must find a brand-new, larger space and move everything there.',
      },
    },
    {
      id: "q4",
      text: "Which operation is faster: accessing Index 0 or accessing a random middle element (Index 547)?",
      type: "multiple_choice",
      choices: [
        { id: "a", text: "Index 0 is faster", is_correct: false },
        { id: "b", text: "Index 547 is slower", is_correct: false },
        {
          id: "c",
          text: "Both take the exact same amount of time",
          is_correct: true,
        },
        { id: "d", text: "It depends on the stored value", is_correct: false },
      ],
      feedback: {
        correct:
          "Correct! This is the power of the Address Calculation Formula. Whether the index is 0 or 547, the computer performs the same single math operation to find the address instantly (O(1)).",
        incorrect:
          "It’s a trick! Remember the formula: Address = Base + (Index * Size). The computer does the same amount of 'work' regardless of how big the index is.",
      },
    },
    {
      id: "q5",
      text: "Which of the following operations is the most efficient (fastest) in a standard array?",
      type: "multiple_choice",
      choices: [
        { id: "a", text: "Inserting at the beginning", is_correct: false },
        { id: "b", text: "Searching in an unsorted array", is_correct: false },
        {
          id: "c",
          text: "Accessing an item at a specific index",
          is_correct: true,
        },
        { id: "d", text: "Deleting from the middle", is_correct: false },
      ],
      feedback: {
        correct:
          "Excellent! Accessing by index is O(1) constant time. It takes the same amount of time whether you have 10 elements or 10 million.",
        incorrect:
          "Think about which operation lets the computer jump directly to the answer. Most of these require looking at or shifting every item in the list.",
      },
    },
    {
      id: "q6",
      text: "Why is inserting in the middle of an array slower than adding at the end?",
      type: "multiple_choice",
      choices: [
        {
          id: "a",
          text: "Arrays only allow insertions at the start/end",
          is_correct: false,
        },
        {
          id: "b",
          text: "Elements after the insertion point must be shifted",
          is_correct: true,
        },
        {
          id: "c",
          text: "The array must reallocate memory every time",
          is_correct: false,
        },
        {
          id: "d",
          text: "Middle elements are locked in place",
          is_correct: false,
        },
      ],
      feedback: {
        correct:
          "Exactly! To maintain the order, every element after the new item must be 'scooted over' to make room.",
        incorrect:
          "Not quite. Think about the slots. If you put something in slot 5, what has to happen to the items already in slots 5, 6, and 7?",
      },
    },
    {
      id: "q7",
      text: "Worst-case search time for a specific username in an unsorted array of 1,000,000 elements?",
      type: "multiple_choice",
      choices: [
        { id: "a", text: "O(1)", is_correct: false },
        { id: "b", text: "O(n)", is_correct: true },
        { id: "c", text: "O(n²)", is_correct: false },
        { id: "d", text: "O(log n)", is_correct: false },
      ],
      feedback: {
        correct:
          "Correct! Because it's unsorted, you might have to check every single element. This is Linear Search (O(n)).",
        incorrect:
          "If the computer doesn't know where the value is, it has to check one-by-one. If the item is at the very end, how many steps does that take?",
      },
    },
    {
      id: "q8",
      text: "Given a character array starting at base address 1024 where each character occupies 1 byte, what is the memory location of the character at index 7?",
      type: "multiple_choice",
      choices: [
        { id: "a", text: "1030", is_correct: false },
        { id: "b", text: "1031", is_correct: true },
        { id: "c", text: "1032", is_correct: false },
        { id: "d", text: "1033", is_correct: false },
      ],
      feedback: {
        correct:
          "Correct! Each index increases the address by 1 byte: 1024 + 7 = 1031.",
        incorrect:
          "Careful with the 'off-by-one' error. If index 0 is 1024, count 7 steps forward. (1024 + 7).",
      },
    },
    {
      id: "q9",
      text: "What does the index in an array represent?",
      type: "multiple_choice",
      choices: [
        {
          id: "a",
          text: "The position (offset) of an element",
          is_correct: true,
        },
        { id: "b", text: "The actual value stored inside", is_correct: false },
        { id: "c", text: "The frequency of the value", is_correct: false },
        { id: "d", text: "The total size of the array", is_correct: false },
      ],
      feedback: {
        correct:
          "That's right! The index is the offset from the start of the array.",
        incorrect:
          "The index is like a mailbox number. It tells you *where* to look, not *what* is inside the box.",
      },
    },
    {
      id: "q10",
      text: "Given an array of integers starting at base address 2000 where each integer occupies 4 bytes, what is the memory location of the element at index 5?",
      type: "multiple_choice",
      choices: [
        { id: "a", text: "2005", is_correct: false },
        { id: "b", text: "2016", is_correct: false },
        { id: "c", text: "2020", is_correct: true },
        { id: "d", text: "2024", is_correct: false },
      ],
      feedback: {
        correct: "Correct! Using Base + (Index * Size): 2000 + (5 * 4) = 2020.",
        incorrect:
          "Use the Address Calculation formula: Address = Base + (Index * Size). You need to skip five 4-byte elements from the starting address of 2000.",
      },
    },
  ],
};
