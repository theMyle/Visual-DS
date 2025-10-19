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
            text: "How do you access the value (5) in this array? [0, 4, 2, 7, 5]",
            type: "multiple_choice",
            image_url: "/assessment/array-list/q1.png",
            choices: [
                { id: "a", text: "array.get(2)", is_correct: false },
                { id: "b", text: "array.get(3)", is_correct: false },
                { id: "c", text: "array.get(4)", is_correct: true },
                { id: "d", text: "array.get(5)", is_correct: false },
            ],
            feedback: { correct: "That's right! Number 5 is the fifth element of the array. Since array indices starts at Zero (0). Number 5 is at index 4.", incorrect: "Remember, arrays are zero-indexed, that's why the 5th element is at index 4." },
        },

        {
            id: "q2",
            text: "Given an ArrayList [10, 20, 30, 40], what is the value at index 2?",
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
            id: "",
            text: "",
            type: "multiple_choice",
            choices: [
                { id: "a", text: "True", is_correct: true },
                { id: "b", text: "False", is_correct: false },
                { id: "c", text: "Depends on context", is_correct: false },
                { id: "d", text: "Only in strict mode", is_correct: false },
            ],
            feedback:
            {
                correct: "Correct — arrays are objects in JavaScript.", incorrect: "Incorrect — arrays are implemented as objects in JavaScript."
            },
        },
    ],
};
