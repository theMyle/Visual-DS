import { Assessment } from "../types";

export const arrayListAssessment: Assessment = {
    id: "array-list-1",
    title: "Array List Basics",
    description: "Short assessment on accessing and indexing arrays",
    category: {
        id: "data-structures",
        name: "Data Structures",
        description: "Core data structures concepts",
    },
    questions: [
        {
            id: "q1",
            text: "How do you access the value (5) in this array?",
            type: "multiple_choice",
            image_url: "/assessment/array-list/q1.png",
            choices: [
                { id: "a", text: "array.get(2)", is_correct: false },
                { id: "b", text: "array.get(3)", is_correct: false },
                { id: "c", text: "array.get(4)", is_correct: true },
                { id: "d", text: "array.get(5)", is_correct: false },
            ],
            feedback: {
                correct: "That's right! Number 5 is the fifth element of the array. Since array indices starts at Zero (0). Number 5 is at index 4.",
                incorrect: "Not quite. Arrays start counting from 0, so the fifth element is actually at index 4."
            },
        },

        {
            id: "q2",
            text: "Given an Array [10, 20, 30, 40], what is the value at index 2?",
            type: "multiple_choice",
            choices: [
                { id: "a", text: "40", is_correct: false },
                { id: "b", text: "30", is_correct: true },
                { id: "c", text: "20", is_correct: false },
                { id: "d", text: "10", is_correct: false },
            ],
            feedback:
            {
                correct: "That's right! Indices start at 0, so index 2 refers to the third element (30).",
                incorrect: "Remember that ArrayLists are zero-indexed. The first element is at index 0."
            },
        },

        {
            id: "q3",
            text: "Which operation is generally the slowest in an array?",
            type: "multiple_choice",
            choices: [
                { id: "a", text: "Insert at the back", is_correct: false },
                { id: "b", text: "Insert at the front", is_correct: true },
                { id: "c", text: "Insert in the middle", is_correct: false },
                { id: "d", text: "Get the first element", is_correct: false },
            ],
            feedback: {
                correct:
                    "Correct! Inserting at the front is slow because all other elements must be shifted one position to make space.",
                incorrect:
                    "Not quite. Inserting at the front is the slowest because it requires shifting all existing elements to the right.",
            },
        },


        {
            id: "q4",
            text: "Why are arrays efficient for accessing elements by index?",
            type: "multiple_choice",
            choices: [
                { id: "a", text: "Because elements are stored in random locations", is_correct: false },
                { id: "b", text: "Because each element is linked to the next", is_correct: false },
                { id: "c", text: "Because elements are stored in contiguous memory", is_correct: true },
                { id: "d", text: "Because the array automatically searches for values", is_correct: false },
            ],
            feedback: {
                correct:
                    "That's right! Arrays store elements in contiguous memory, so the computer can calculate an element’s position directly from its index.",
                incorrect:
                    "Remember, arrays are stored in contiguous memory, allowing instant access when you know the index.",
            },
        },

        {
            id: "q5",
            text: "What happens if you try to access an array index that doesn't exist?",
            type: "multiple_choice",
            choices: [
                { id: "a", text: "The array automatically creates a new element", is_correct: false },
                { id: "b", text: "You get an out-of-bounds or undefined error", is_correct: true },
                { id: "c", text: "The array returns the last element instead", is_correct: false },
                { id: "d", text: "Nothing happens; it just skips that index", is_correct: false },
            ],
            feedback: {
                correct:
                    "Correct! Accessing an index outside the array’s range causes an out-of-bounds or undefined error, depending on the language.",
                incorrect:
                    "Arrays have fixed bounds. Accessing an invalid index results in an error, not a new element or a skipped index.",
            },
        },

        {
            id: "q6",
            text: "Why is inserting in the middle of an array slower than adding at the end?",
            type: "multiple_choice",
            choices: [
                { id: "a", text: "Because arrays only allow insertions at the start or end", is_correct: false },
                { id: "b", text: "Because elements after the insertion point must be shifted", is_correct: true },
                { id: "c", text: "Because the array needs to reallocate memory each time", is_correct: false },
                { id: "d", text: "Because middle elements are locked in place", is_correct: false },
            ],
            feedback: {
                correct:
                    "Exactly! When you insert in the middle, every element after that position must be shifted to make space.",
                incorrect:
                    "Not quite. Inserting in the middle is slower because it requires shifting all elements that come after the insertion point.",
            },
        },

        {
            id: "q7",
            text: "How does an ArrayList handle adding elements when it runs out of space?",
            type: "multiple_choice",
            choices: [
                { id: "a", text: "It deletes old elements to make space", is_correct: false },
                { id: "b", text: "It allocates a larger array and copies the old elements", is_correct: true },
                { id: "c", text: "It prevents further insertions", is_correct: false },
                { id: "d", text: "It stores new elements in a separate list", is_correct: false },
            ],
            feedback: {
                correct:
                    "Right! When an ArrayList grows, it creates a larger array and copies the old elements into it.",
                incorrect:
                    "Remember, ArrayLists grow by allocating a larger array and copying the existing elements over — they don’t delete or split them.",
            },
        },

        {
            id: "q8",
            text: "Given this array [2, 4, 6, 8, 10], how do you access the last element?",
            type: "multiple_choice",
            choices: [
                { id: "a", text: "array.get(4)", is_correct: true },
                { id: "b", text: "array.get(5)", is_correct: false },
                { id: "c", text: "array.get(10)", is_correct: false },
                { id: "d", text: "array.get(3)", is_correct: false },
            ],
            feedback: {
                correct:
                    "Correct! The array’s last element is at index 4 because indexing starts at 0. The indices are 0→2, 1→4, 2→6, 3→8, 4→10.",
                incorrect:
                    "Not quite. Since arrays start at index 0, the last element (10) is at index 4, not 5. The valid indices are 0 to 4.",
            },
        },


        {
            id: "q9",
            text: "What does the index in an array represent?",
            type: "multiple_choice",
            choices: [
                { id: "a", text: "The position of an element in the array", is_correct: true },
                { id: "b", text: "The actual value stored in the element", is_correct: false },
                { id: "c", text: "The number of times the value appears", is_correct: false },
                { id: "d", text: "The total size of the array", is_correct: false },
            ],
            feedback: {
                correct:
                    "That's right! The index represents an element’s position, starting from 0 for the first element.",
                incorrect:
                    "Remember, the index refers to where an element is positioned in the array, not its value or count.",
            },
        },

        {
            id: "q10",
            text: "Which operation requires shifting elements in an array?",
            type: "multiple_choice",
            choices: [
                { id: "a", text: "Accessing an element by index", is_correct: false },
                { id: "b", text: "Updating an existing element", is_correct: false },
                { id: "c", text: "Inserting or removing an element at the front", is_correct: true },
                { id: "d", text: "Reading all elements in order", is_correct: false },
            ],
            feedback: {
                correct:
                    "Exactly! Inserting or removing at the front requires shifting all other elements to keep the array contiguous.",
                incorrect:
                    "Remember, shifting only happens when inserting or removing elements — not when accessing or updating them.",
            },
        },

        {
            id: "q11",
            text: "Given this array [1, 2, 3, 4, 5], what happens after array.removeAt(2)?",
            type: "multiple_choice",
            choices: [
                { id: "a", text: "[1, 2, 3, 4, 5]", is_correct: false },
                { id: "b", text: "[1, 2, 4, 5]", is_correct: true },
                { id: "c", text: "[1, 3, 4, 5]", is_correct: false },
                { id: "d", text: "[1, 2, 3, 5]", is_correct: false },
            ],
            feedback: {
                correct:
                    "Correct! The element at index 2 (which is 3) is removed, and later elements shift left.",
                incorrect:
                    "Remember, removeAt(2) deletes the element at index 2 (the 3). The new array becomes [1, 2, 4, 5].",
            },
        },


    ],
};
