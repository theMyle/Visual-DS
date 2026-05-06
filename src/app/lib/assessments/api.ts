import { getApiUrl } from "../env";
import type { Assessment } from "../../assessment/types";

export type GetTokenFn = () => Promise<string | null>;

export type BackendAssessment = {
    id: string;
    category: string;
    max_attempts: number | null;
};

export type AttemptStatus = {
    attempts_used: number;
    max_attempts: number | null;
    limit_reached: boolean;
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
    assessmentId: string,
    getToken?: GetTokenFn,
): Promise<Assessment> {
    const headers = new Headers(JSON_HEADERS);
    
    if (getToken) {
        const token = await getToken();
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
    }

    const response = await fetch(getApiUrl(`/assessments/${assessmentId}`), {
        method: "GET",
        headers,
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

export async function fetchAttemptStatus(
    assessmentId: string,
    getToken?: GetTokenFn,
): Promise<AttemptStatus> {
    const headers = new Headers(JSON_HEADERS);
    if (getToken) {
        const token = await getToken();
        if (token) headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(getApiUrl(`/assessments/${assessmentId}/attempt-status`), {
        method: "GET",
        headers,
        cache: "no-store",
    });

    if (!response.ok) {
        // If it fails, default to no limit so we don't block the user unexpectedly
        return { attempts_used: 0, max_attempts: null, limit_reached: false };
    }

    return (await response.json()) as AttemptStatus;
}

export function toPercent(score: number, total: number): number {
    if (total === 0) return 0;
    return (score / total) * 100;
}
