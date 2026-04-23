import { getApiUrl } from "../../lib/env";
import type { Assessment } from "../types";

export async function fetchAssessment(
    category: string,
    assessmentId: string,
): Promise<Assessment> {
    const requestInit: RequestInit = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        cache: "no-store",
    };

    try {
        const primaryResponse = await fetch(
            getApiUrl(`/assessments/${category}/${assessmentId}`),
            requestInit,
        );

        if (!primaryResponse.ok) {
            throw new Error(`Request failed (${primaryResponse.status})`);
        }

        return (await primaryResponse.json()) as Assessment;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);

        if (!message.includes("Request failed (404)")) {
            throw error;
        }
    }

    const fallbackResponse = await fetch(
        getApiUrl(`/assessments/${category}/${assessmentId}`),
        requestInit,
    );

    if (!fallbackResponse.ok) {
        throw new Error(`Failed to fetch assessment (${fallbackResponse.status})`);
    }

    return (await fallbackResponse.json()) as Assessment;
}
