import { getApiUrl } from "../env";
import type { Assessment } from "../../assessment/types";

type GetTokenFn = () => Promise<string | null>;

export type BackendAssessment = {
    id: string;
    category: string;
};

export type BackendQuizResult = {
    id: string;
    user_id?: string;
    quiz_category: string;
    quiz_id: string;
    score: number;
    total_items: number;
    taken_at: string;
};

export type QuizResultPoint = {
    tryNumber: number;
    score: number;
    totalItems: number;
    takenAt: string;
    quizId: string;
    quizCategory: string;
};

const JSON_HEADERS = {
    "Content-Type": "application/json",
};

export async function fetchAssessments(): Promise<BackendAssessment[]> {
    const response = await fetch(getApiUrl("/assessments"), {
        method: "GET",
        headers: JSON_HEADERS,
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch assessments (${response.status})`);
    }

    return (await response.json()) as BackendAssessment[];
}

export async function fetchAssessmentResults(): Promise<BackendQuizResult[]> {
    const response = await fetch(getApiUrl("/api/assessments/results"), {
        method: "GET",
        headers: JSON_HEADERS,
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch assessment results (${response.status})`);
    }

    return (await response.json()) as BackendQuizResult[];
}

export async function fetchAssessmentResultsForUser(
    getToken: GetTokenFn,
): Promise<BackendQuizResult[]> {
    const token = await getToken();

    if (!token) {
        return [];
    }

    const headers = new Headers(JSON_HEADERS);
    headers.set("Authorization", `Bearer ${token}`);

    const response = await fetch(getApiUrl("/api/assessments/results"), {
        method: "GET",
        headers,
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch assessment results (${response.status})`);
    }

    return (await response.json()) as BackendQuizResult[];
}

export async function fetchAssessmentById(
    category: string,
    assessmentId: string,
): Promise<Assessment> {
    const response = await fetch(getApiUrl(`/assessments/${category}/${assessmentId}`), {
        method: "GET",
        headers: JSON_HEADERS,
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch assessment (${response.status})`);
    }

    return (await response.json()) as Assessment;
}

export function buildScoreHistoryByQuizId(
    results: BackendQuizResult[],
): Record<string, QuizResultPoint[]> {
    const sortedResults = [...results].sort((a, b) => {
        const aTime = Date.parse(a.taken_at);
        const bTime = Date.parse(b.taken_at);
        return aTime - bTime;
    });

    const historyMap: Record<string, QuizResultPoint[]> = {};

    sortedResults.forEach((result) => {
        const key = result.quiz_id;
        const existingPoints = historyMap[key] ?? [];
        const tryNumber = existingPoints.length + 1;

        existingPoints.push({
            tryNumber,
            score: result.score,
            totalItems: result.total_items,
            takenAt: result.taken_at,
            quizId: result.quiz_id,
            quizCategory: result.quiz_category,
        });

        historyMap[key] = existingPoints;
    });

    return historyMap;
}
