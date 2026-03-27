import { Assessment } from "../types";

export const stackAssessment: Assessment = {
  id: "stack-1",
  title: "Stack Data Structure Basics",
  description:
    "A comprehensive assessment on LIFO logic, operation sequences, and error prevention.",
  category: {
    id: "data-structures",
    name: "Data Structures",
    description: "Core data structures concepts",
  },
  questions: [
    {
      id: "q1",
      text: "Which principle best describes how a Stack manages data?",
      type: "multiple_choice",
      choices: [
        { id: "a", text: "First-In, First-Out (FIFO)", is_correct: false },
        { id: "b", text: "Last-In, First-Out (LIFO)", is_correct: true },
        { id: "c", text: "Random Access", is_correct: false },
        { id: "d", text: "Priority-Based Access", is_correct: false },
      ],
      feedback: {
        correct:
          "Correct! The most recently added item is always the first one out.",
        incorrect:
          "Not quite. Think of a physical stack of heavy plates; which plate is the only one you can safely grab first?",
      },
    },
    {
      id: "q2",
      text: "What is the Big O time complexity for 'Push' and 'Pop' operations?",
      type: "multiple_choice",
      choices: [
        { id: "a", text: "O(n)", is_correct: false },
        { id: "b", text: "O(1)", is_correct: true },
        { id: "c", text: "O(log n)", is_correct: false },
        { id: "d", text: "O(n²)", is_correct: false },
      ],
      feedback: {
        correct:
          "Exactly. Since you only touch the 'top,' the operation time remains constant regardless of stack size.",
        incorrect:
          "Consider this: Does adding an item to the top require you to look at or move any of the other items below it?",
      },
    },
    {
      id: "q3",
      text: "Which method is used to view the top element without removing it from the stack?",
      type: "multiple_choice",
      choices: [
        { id: "a", text: "Pop()", is_correct: false },
        { id: "b", text: "Peek()", is_correct: true },
        { id: "c", text: "IsEmpty()", is_correct: false },
        { id: "d", text: "Push()", is_correct: false },
      ],
      feedback: {
        correct:
          "Yes! Peek (or Top) returns the value without modifying the stack.",
        incorrect:
          "One of these choices removes the item permanently, while the other just 'looks' at it. Which one sounds like just a glance?",
      },
    },
    {
      id: "q4",
      text: "To avoid a runtime error (like Underflow), which check should a developer perform before calling Pop()?",
      type: "multiple_choice",
      choices: [
        { id: "a", text: "Check if the stack is full", is_correct: false },
        { id: "b", text: "Check if the stack isEmpty()", is_correct: true },
        { id: "c", text: "Check the size of the array", is_correct: false },
        { id: "d", text: "Perform a Peek() first", is_correct: false },
      ],
      feedback: {
        correct:
          "Correct. Always ensure there is at least one item in the stack before trying to remove something.",
        incorrect:
          "Underflow happens when you try to take something from nothing. What state should you check for to prevent that?",
      },
    },
    {
      id: "q5",
      text: "If a stack has 5 items and you need to access the very first item added (the bottom), what must happen?",
      type: "multiple_choice",
      choices: [
        {
          id: "a",
          text: "Use an index to access stack[0].",
          is_correct: false,
        },
        {
          id: "b",
          text: "Perform 4 'Pop' operations first.",
          is_correct: true,
        },
        {
          id: "c",
          text: "Use the 'Peek' operation with an offset.",
          is_correct: false,
        },
        {
          id: "d",
          text: "Stacks allow direct access to any item.",
          is_correct: false,
        },
      ],
      feedback: {
        correct:
          "Correct. Stacks do not allow random access; you must clear the 'top' to reach the 'bottom'.",
        incorrect:
          "Remember that a stack is a restricted structure. Can you 'legally' reach through the top items to get to the bottom?",
      },
    },
    {
      id: "q6",
      text: "What is the main advantage of using a Linked List to implement a stack?",
      type: "multiple_choice",
      choices: [
        {
          id: "a",
          text: "It uses less memory than an array.",
          is_correct: false,
        },
        {
          id: "b",
          text: "It allows for random access of elements.",
          is_correct: false,
        },
        {
          id: "c",
          text: "It provides dynamic scaling without 'resize' pauses.",
          is_correct: true,
        },
        { id: "d", text: "It is automatically sorted.", is_correct: false },
      ],
      feedback: {
        correct:
          "Exactly. Linked lists grow node-by-node, so they never need to stop and copy data to a larger array.",
        incorrect:
          "Think about what happens to an array when it runs out of pre-allocated space. Does a Linked List have that same limitation?",
      },
    },
    {
      id: "q7",
      text: "Which of these scenarios is the best use case for a Stack?",
      type: "multiple_choice",
      choices: [
        {
          id: "a",
          text: "A 'First-Come, First-Served' waiting list",
          is_correct: false,
        },
        {
          id: "b",
          text: "An 'Undo' button in a photo editor",
          is_correct: true,
        },
        {
          id: "c",
          text: "A digital directory for looking up names",
          is_correct: false,
        },
        {
          id: "d",
          text: "Streaming video data in real-time",
          is_correct: false,
        },
      ],
      feedback: {
        correct:
          "Spot on! Since 'Undo' reverses the most recent action, LIFO is the perfect fit.",
        incorrect:
          "Which of these needs to retrieve the 'most recent' thing that happened rather than the 'oldest' thing?",
      },
    },
    {
      id: "q8",
      text: "When using an array-based stack with a fixed size, what is a 'Stack Overflow'?",
      type: "multiple_choice",
      choices: [
        {
          id: "a",
          text: "Trying to Pop from an empty stack.",
          is_correct: false,
        },
        {
          id: "b",
          text: "Trying to Push to a stack that is already full.",
          is_correct: true,
        },
        {
          id: "c",
          text: "The stack's memory address being too high.",
          is_correct: false,
        },
        {
          id: "d",
          text: "When the Peek operation returns a null value.",
          is_correct: false,
        },
      ],
      feedback: {
        correct:
          "Yes. When there is no more room in the underlying array, you cannot add more items.",
        incorrect:
          "The word 'Overflow' implies that the container can no longer hold what you are trying to put into it.",
      },
    },
    {
      id: "q9",
      text: "What is the primary trade-off when choosing a Linked List implementation over an Array?",
      type: "multiple_choice",
      choices: [
        {
          id: "a",
          text: "Linked lists are slower for Pushing.",
          is_correct: false,
        },
        {
          id: "b",
          text: "Linked lists use more memory because of pointers.",
          is_correct: true,
        },
        {
          id: "c",
          text: "Linked lists have a fixed capacity.",
          is_correct: false,
        },
        {
          id: "d",
          text: "Linked lists cannot perform the Peek operation.",
          is_correct: false,
        },
      ],
      feedback: {
        correct:
          "Correct! Every node needs extra space to store the address of the next item.",
        incorrect:
          "Think about the 'nodes' in a Linked List. Besides the data itself, what else must each node store to stay connected?",
      },
    },
    {
      id: "q10",
      text: "If you perform these operations: Push(A), Push(B), Pop(), Push(C); what is now at the top of the stack?",
      type: "multiple_choice",
      choices: [
        { id: "a", text: "A", is_correct: false },
        { id: "b", text: "B", is_correct: false },
        { id: "c", text: "C", is_correct: true },
        { id: "d", text: "The stack is empty", is_correct: false },
      ],
      feedback: {
        correct:
          "Well done! B was removed by the Pop(), leaving A at the bottom and C as the new Top.",
        incorrect:
          "Try sketching it out: add A, add B, remove the top-most item, then add C. What is the last thing you added?",
      },
    },
  ],
};
