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
            choices: [
                { id: "a", text: "array.get(4)", is_correct: true },
                { id: "b", text: "array.get(5)", is_correct: false },
                { id: "c", text: "array.get(7)", is_correct: false },
                { id: "d", text: "array.get(5)", is_correct: false },
            ],
            feedback: { correct: "That's right! Number 5 is the fifth element of the array. Since array indices starts at Zero (0). Number 5 is at index 4.", incorrect: "Incorrect — arrays are zero-indexed, the 5th element is at index 4." },
        },

        {
            id: "q2",
            text: "Which expression retrieves the length of an array in JavaScript?",
            type: "multiple_choice",
            choices: [
                { id: "a", text: "array.length", is_correct: true },
                { id: "b", text: "length(array)", is_correct: false },
                { id: "c", text: "array.size", is_correct: false },
                { id: "d", text: "array.count()", is_correct: false },
            ],
            feedback:
            {
                correct: "Yes — use the .length property to get array length.", incorrect: "No — JavaScript arrays use the .length property."
            },
        },

        {
            id: "q3",
            text: "True or False: In JavaScript, arrays are a type of object.",
            type: "true_false",
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

        {
            id: "q4",
            text: "What is the result of array.indexOf(5) when 5 is not present?",
            type: "multiple_choice",
            choices: [
                { id: "a", text: "-1", is_correct: true },
                { id: "b", text: "0", is_correct: false },
                { id: "c", text: "undefined", is_correct: false },
                { id: "d", text: "null", is_correct: false },
            ],
            feedback:
            {
                correct: "Correct — indexOf returns -1 when the element is not found.", incorrect: "Incorrect — indexOf returns -1 when not found."
            },
        },
    ],
};
