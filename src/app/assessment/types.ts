// - Choice: Individual answer option with correctness flag
// - Feedback: Contains correct and incorrect response messages
// - Question: Has 4 choices and 2 feedback messages
// - Assessment: Complete assessment with category, questions, 

export interface Choice {
    id: string;
    text: string;
    is_correct: boolean;
}

export interface Question {
    id: string;
    text: string;
    image_url?: string;
    type: 'multiple_choice' | 'true_false';
    choices: Choice[];
    feedback: {
        correct: string;
        incorrect: string;
    };
}

export interface Assessment {
    id: string;           // e.g., 'array-list-1'
    category: string;     // e.g., 'array-list'
    questions: Question[];
}