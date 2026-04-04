import { Assessment } from "../types";

export const linkedListAssessment: Assessment = {
  id: "linked-list-1",
  title: "Linked List Fundamentals",
  description:
    "Assessment on node structure, memory allocation, and time complexity.",
  category: {
    id: "linked-list",
    name: "Linked List",
    description: "Linked list structure and operations",
  },
  questions: [
    {
      id: "q1",
      text: "Unlike arrays, which use contiguous memory, how are linked lists stored in memory?",
      type: "multiple_choice",
      choices: [
        {
          id: "a",
          text: "Non-contiguously in separate blocks called nodes",
          is_correct: true,
        },
        {
          id: "b",
          text: "In a single pre-allocated stack frame",
          is_correct: false,
        },
        {
          id: "c",
          text: "Using indexed hardware registers",
          is_correct: false,
        },
        {
          id: "d",
          text: "Sequentially in the data segment",
          is_correct: false,
        },
      ],
      feedback: {
        correct:
          "Correct! Linked lists consist of nodes scattered in memory (the Heap) that link to each other.",
        incorrect:
          "Not quite. The 'linked' nature refers to non-contiguous blocks of memory connected by pointers.",
      },
    },
    {
      id: "q2",
      text: "Which two parts typically make up a standard node in a singly linked list?",
      type: "multiple_choice",
      choices: [
        { id: "a", text: "Index and Value", is_correct: false },
        { id: "b", text: "Data and Next Pointer", is_correct: true },
        { id: "c", text: "Head and Tail", is_correct: false },
        { id: "d", text: "Previous and Next Pointer", is_correct: false },
      ],
      feedback: {
        correct:
          "That's right! Every node contains the actual value (Data) and a reference (Next) to the following node.",
        incorrect:
          "Remember, a node needs the information it holds and a way to find the next item in the sequence.",
      },
    },
    {
      id: "q3",
      text: "What is the primary function of the 'Head' property in a linked list?",
      type: "multiple_choice",
      choices: [
        {
          id: "a",
          text: "To keep track of the total number of elements",
          is_correct: false,
        },
        {
          id: "b",
          text: "To serve as the entry point for starting any traversal",
          is_correct: true,
        },
        {
          id: "c",
          text: "To point to the last node for quick appending",
          is_correct: false,
        },
        { id: "d", text: "To sort the data automatically", is_correct: false },
      ],
      feedback: {
        correct:
          "Exactly. Without the Head reference, you have no way to access the start of the chain.",
        incorrect:
          "The Head is the necessary starting point for any operation that needs to access the list.",
      },
    },
    {
      id: "q4",
      text: "What is the time complexity for accessing the 'Tail' if a tail reference is maintained?",
      type: "multiple_choice",
      choices: [
        { id: "a", text: "O(n)", is_correct: false },
        { id: "b", text: "O(log n)", is_correct: false },
        { id: "c", text: "O(1)", is_correct: true },
        { id: "d", text: "O(n²)", is_correct: false },
      ],
      feedback: {
        correct:
          "Correct! Direct references allow for constant time O(1) access regardless of list size.",
        incorrect:
          "If you have a direct pointer to an item, you don't need to walk through the list to find it.",
      },
    },
    {
      id: "q5",
      text: "Why is inserting an element at the very beginning of a linked list O(1)?",
      type: "multiple_choice",
      choices: [
        {
          id: "a",
          text: "Because linked lists are always sorted",
          is_correct: false,
        },
        {
          id: "b",
          text: "Because it only requires updating the head pointer and the new node's next pointer",
          is_correct: true,
        },
        {
          id: "c",
          text: "Because the computer reserves the first memory slot",
          is_correct: false,
        },
        {
          id: "d",
          text: "Because it utilizes index-based access",
          is_correct: false,
        },
      ],
      feedback: {
        correct:
          "Correct! Unlike arrays, you don't have to 'shift' any other elements to make room.",
        incorrect:
          "The efficiency comes from the fact that you only need to change two pointers to update the structure.",
      },
    },
    {
      id: "q6",
      text: "In a singly linked list, why is deleting the LAST item O(n) even with a Tail pointer?",
      type: "multiple_choice",
      choices: [
        {
          id: "a",
          text: "The memory must be cleared manually",
          is_correct: false,
        },
        {
          id: "b",
          text: "The Tail pointer is automatically deleted",
          is_correct: false,
        },
        {
          id: "c",
          text: "You must traverse to find the node BEFORE the tail to update its pointer",
          is_correct: true,
        },
        {
          id: "d",
          text: "The length must be recalculated from scratch",
          is_correct: false,
        },
      ],
      feedback: {
        correct:
          "Exactly. You need to tell the second-to-last node to point to 'null', which requires traversal.",
        incorrect:
          "In a singly linked list, there are no 'back' pointers, so you must start from the Head to find the predecessor.",
      },
    },
    {
      id: "q7",
      text: "What is the definition of 'Traversal' in a linked list?",
      type: "multiple_choice",
      choices: [
        { id: "a", text: "The act of deleting every node", is_correct: false },
        { id: "b", text: "The act of reversing the list", is_correct: false },
        {
          id: "c",
          text: "Visiting every node in the list exactly once",
          is_correct: true,
        },
        {
          id: "d",
          text: "Converting the list into an array",
          is_correct: false,
        },
      ],
      feedback: {
        correct:
          "Correct! Traversal is the foundation for searching, printing, or modifying the collection.",
        incorrect:
          "Traversal simply refers to the process of 'walking' through each node in the sequence.",
      },
    },
    {
      id: "q8",
      text: "Accessing a node in the 'middle' of a singly linked list has a time complexity of:",
      type: "multiple_choice",
      choices: [
        { id: "a", text: "O(1)", is_correct: false },
        { id: "b", text: "O(n)", is_correct: true },
        { id: "c", text: "O(log n)", is_correct: false },
        { id: "d", text: "O(1/2 n)", is_correct: false },
      ],
      feedback: {
        correct:
          "Right. Since there is no index-based access, you must follow pointers sequentially.",
        incorrect:
          "Linked lists lack random access; to reach the middle, you must pass every preceding node.",
      },
    },
    {
      id: "q9",
      text: "Which of the following is a key advantage of linked lists over arrays?",
      type: "multiple_choice",
      choices: [
        { id: "a", text: "Faster random access", is_correct: false },
        { id: "b", text: "Lower memory overhead", is_correct: false },
        {
          id: "c",
          text: "Efficient insertions/deletions without shifting elements",
          is_correct: true,
        },
        { id: "d", text: "Contiguous memory allocation", is_correct: false },
      ],
      feedback: {
        correct:
          "Correct! Linked lists shine when you need to add or remove items frequently from the ends.",
        incorrect:
          "Arrays require shifting all subsequent items during insertion; linked lists just swap pointers.",
      },
    },
    {
      id: "q10",
      text: "Is the 'Length' property required for a linked list to function?",
      type: "multiple_choice",
      choices: [
        {
          id: "a",
          text: "Yes, traversal is impossible without it",
          is_correct: false,
        },
        {
          id: "b",
          text: "No, length can be determined by traversing to the end",
          is_correct: true,
        },
        { id: "c", text: "Yes, it determines max capacity", is_correct: false },
        { id: "d", text: "No, linked lists are infinite", is_correct: false },
      ],
      feedback: {
        correct:
          "Exactly. While optional, it's often kept as a counter to make size checks O(1).",
        incorrect:
          "You can find the length by walking the list, so an explicit property is a convenience, not a requirement.",
      },
    },
  ],
};
