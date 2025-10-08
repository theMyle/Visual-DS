// - Choice: Individual answer option with correctness flag
// - Feedback: Contains correct and incorrect response messages
// - Question: Has 4 choices and 2 feedback messages
// - Assessment: Complete assessment with category, questions, and MongoDB fields

export interface Choice {
    id: string;
    text: string;
    is_correct: boolean;
}

export interface Feedback {
    correct: string;
    incorrect: string;
}

export interface Question {
    id: string;
    text: string;
    image_url?: string;
    type: 'multiple_choice' | 'true_false' | 'short_answer';
    choices: [Choice, Choice, Choice, Choice];
    feedback: Feedback;
}

export interface Assessment {
    _id?: string;
    id: string;
    title: string;
    description: string;
    category: {
        id: string;
        name: string;
        description: string;
    };
    questions: Question[];
    created_at?: Date;
    updated_at?: Date;
}
