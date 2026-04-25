import { getApiUrl } from "./env";

export interface SimulatorChallengeDTO {
    id: string;
    simulator_id: string;
    slug: string;
    title: string;
    description: string;
    order_index: number;
    initial_code: string;
    program_structure: {
        parameterNames: string[];
    };
    test_cases: any[];
    capacity: {
        desktop: number;
        mobile: number;
    };
    next_challenge_slug?: string;
}

export async function fetchSimulatorChallenge(simulatorSlug: string, challengeSlug: string): Promise<SimulatorChallengeDTO> {
    const res = await fetch(getApiUrl(`/api/simulators/${simulatorSlug}/challenges/${challengeSlug}`), {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch challenge: ${res.statusText}`);
    }

    return res.json();
}

export interface CurriculumChallenge {
    id: string;
    slug: string;
    title: string;
    order_index: number;
    path: string;
    isCompleted?: boolean;
}

export interface SimulatorCurriculumDTO {
    id: string;
    slug: string;
    name: string;
    challenges: CurriculumChallenge[];
}

export async function fetchSimulatorCurriculum(): Promise<SimulatorCurriculumDTO[]> {
    const res = await fetch(getApiUrl("/api/simulators/curriculum"), {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch curriculum: ${res.statusText}`);
    }

    return res.json();
}
