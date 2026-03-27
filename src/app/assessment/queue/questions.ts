import { Assessment } from "../types";

export const queueBasicsAssessment: Assessment = {
  id: "queue-1",
  title: "Queue Logic & Structural Analysis",
  description:
    "An assessment focused on data flow, pointer behavior, and structural comparisons.",
  category: {
    id: "data-structures",
    name: "Data Structures",
    description: "Core data structures concepts",
  },
  questions: [
    {
      id: "q1",
      text: "If you enqueue 'A', then 'B', then 'C', which item is currently at the Front of the queue?",
      type: "multiple_choice",
      choices: [
        { id: "a", text: "Item A", is_correct: true },
        { id: "b", text: "Item B", is_correct: false },
        { id: "c", text: "Item C", is_correct: false },
        { id: "d", text: "The queue is empty", is_correct: false },
      ],
      feedback: {
        correct:
          "Correct! In a queue, the first item to enter stays at the front until it is specifically dequeued.",
        incorrect:
          "Think about a physical line. If 'A' was the first person to arrive, do they move to the back when 'B' and 'C' show up?",
      },
    },
    {
      id: "q2",
      text: "Why does a standard array-based queue suffer from performance issues during removal (dequeue)?",
      type: "multiple_choice",
      choices: [
        {
          id: "a",
          text: "The array becomes too large to read",
          is_correct: false,
        },
        {
          id: "b",
          text: "Every remaining element must shift forward",
          is_correct: true,
        },
        {
          id: "c",
          text: "The Rear pointer cannot be found",
          is_correct: false,
        },
        { id: "d", text: "Arrays cannot store linear data", is_correct: false },
      ],
      feedback: {
        correct:
          "Precisely. Moving every item to fill the gap at index 0 is what slows the system down.",
        incorrect:
          "If you remove the first item in a simple list, what happens to the 'empty hole' at the start? How does the computer fix it?",
      },
    },
    {
      id: "q3",
      text: "What is the primary structural difference between a Queue and a Stack?",
      type: "multiple_choice",
      choices: [
        { id: "a", text: "Queues follow LIFO logic", is_correct: false },
        {
          id: "b",
          text: "Queues have two points of interaction (Front/Rear)",
          is_correct: true,
        },
        { id: "c", text: "Stacks follow FIFO logic", is_correct: false },
        {
          id: "d",
          text: "Stacks use both Front and Rear pointers",
          is_correct: false,
        },
      ],
      feedback: {
        correct:
          "Exactly. A Stack is restricted to a single 'Top' point, while a Queue operates at both ends.",
        incorrect:
          "Consider how data enters and leaves. If a Stack is like a 'top-only' container, how does a Queue's 'open-ended' line differ?",
      },
    },
    {
      id: "q4",
      text: "Which implementation is best for a system where the total number of items is unknown and changes constantly?",
      type: "multiple_choice",
      choices: [
        { id: "a", text: "A fixed-size Circular Buffer", is_correct: false },
        { id: "b", text: "A standard static Array", is_correct: false },
        { id: "c", text: "A Linked List", is_correct: true },
        { id: "d", text: "A LIFO Stack", is_correct: false },
      ],
      feedback: {
        correct:
          "Exactly. Linked lists add nodes as needed, making them highly dynamic.",
        incorrect:
          "If you don't know how big the line will get, do you want a pre-allocated block of memory or one that grows as needed?",
      },
    },
    {
      id: "q5",
      text: "What is the logical result of the following sequence: Enqueue(X), Enqueue(Y), Dequeue(), Peek()?",
      type: "multiple_choice",
      choices: [
        { id: "a", text: "X", is_correct: false },
        { id: "b", text: "Y", is_correct: true },
        { id: "c", text: "The queue is empty", is_correct: false },
        { id: "d", text: "Error", is_correct: false },
      ],
      feedback: {
        correct: "Correct! Once X is dequeued, Y becomes the new Front.",
        incorrect:
          "Trace the steps: X enters, then Y. If you remove the first one (X), who is left at the front for you to peek at?",
      },
    },
    {
      id: "q6",
      text: "How does a Circular Queue maintain efficiency without shifting elements?",
      type: "multiple_choice",
      choices: [
        {
          id: "a",
          text: "It deletes all previous data automatically",
          is_correct: false,
        },
        {
          id: "b",
          text: "It uses pointers that wrap around the array",
          is_correct: true,
        },
        {
          id: "c",
          text: "It converts the array into a stack",
          is_correct: false,
        },
        {
          id: "d",
          text: "It only allows one item at a time",
          is_correct: false,
        },
      ],
      feedback: {
        correct:
          "Right. By 'wrapping' pointers back to the start, we reuse empty slots without moving data.",
        incorrect:
          "Think about a circular track. When the 'Tail' hits the end of the array, where can it go next if there is empty space?",
      },
    },
    {
      id: "q7",
      text: "In a Linked List queue implementation, why do we maintain a 'Tail' reference?",
      type: "multiple_choice",
      choices: [
        {
          id: "a",
          text: "To make the Dequeue operation faster",
          is_correct: false,
        },
        {
          id: "b",
          text: "To enable Enqueue in constant time",
          is_correct: true,
        },
        { id: "c", text: "To check if the queue is empty", is_correct: false },
        { id: "d", text: "To reverse the order of items", is_correct: false },
      ],
      feedback: {
        correct:
          "Exactly. Without a Tail pointer, you'd have to traverse the whole list to find the back.",
        incorrect:
          "If you want to add something to the very end of a chain immediately, do you want to start from the first link or have a direct handle on the last one?",
      },
    },
    {
      id: "q8",
      text: "Which property is most vital for ensuring 'Fairness' in task processing?",
      type: "multiple_choice",
      choices: [
        { id: "a", text: "LIFO (Last-In, First-Out)", is_correct: false },
        { id: "b", text: "Dynamic Resizing", is_correct: false },
        { id: "c", text: "FIFO (First-In, First-Out)", is_correct: true },
        { id: "d", text: "Random Access", is_correct: false },
      ],
      feedback: {
        correct:
          "Correct. FIFO ensures that wait time is respected and the oldest request is served first.",
        incorrect:
          "If you were waiting for a task to finish, would you prefer the most recent request to jump ahead of you?",
      },
    },
  ],
};
