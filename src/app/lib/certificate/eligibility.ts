import { fetchAssessments, fetchAssessmentResultsForUser, buildScoreHistoryByQuizId, toPercent } from "../assessments/api";
import { fetchSimulatorCurriculum } from "../simulators";
import { FetchWithAuth } from "../fetchWithAuth";
import { GetTokenFn } from "../assessments/api";

export type EligibilityStatus = {
    eligible: boolean;
    userId: string;
    lessons: {
        total: number;
        completed: number;
    };
    simulators: {
        total: number;
        completed: number;
    };
    assessments: {
        total: number;
        passing: number;
    };
    userName: string;
};

export async function checkCertificateEligibility(getToken: GetTokenFn, userFullName: string): Promise<EligibilityStatus> {
    let userId = "";
    try {
        const userProfile: any = await FetchWithAuth("/api/users/me", getToken);
        userId = userProfile.user_id;
    } catch (e) {
        console.error("Error fetching user profile:", e);
    }

    // 1. Fetch Lessons Progress
    const categoriesUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/lessons`;
    let totalLessons = 0;
    let completedLessons = 0;

    try {
        const catRes = await fetch(categoriesUrl);
        const categories = await catRes.json();
        const validCategorySlugs = new Set(categories.map((c: any) => c.slug));
        totalLessons = categories.reduce((acc: number, cat: any) => acc + cat.lesson_count, 0);

        const progress: any[] = await FetchWithAuth("/api/progress", getToken);
        // Only count progress for categories that still exist
        const validProgress = progress.filter((p: any) => validCategorySlugs.has(p.lesson_category));
        
        // Use a Set of lesson IDs to avoid double counting if the same lesson is logged twice
        const completedLessonIds = new Set(validProgress.map((p: any) => p.lesson_id));
        completedLessons = completedLessonIds.size;
    } catch (e) {
        console.error("Error checking lesson eligibility:", e);
    }

    // 2. Fetch Simulator Progress
    let totalSimulators = 0;
    let completedSimulators = 0;
    try {
        const curriculum = await fetchSimulatorCurriculum();
        const validPaths = new Set<string>();
        curriculum.forEach(section => {
            section.challenges.forEach(challenge => {
                validPaths.add(challenge.path);
            });
        });
        totalSimulators = validPaths.size;

        const simProgress: any[] = await FetchWithAuth("/api/simulator-progress", getToken);
        // Only count completed challenges that are actually part of the current curriculum
        const completedPaths = new Set(
            simProgress
                .filter((p: any) => p.is_completed && validPaths.has(p.path))
                .map((p: any) => p.path)
        );
        completedSimulators = completedPaths.size;
    } catch (e) {
        console.error("Error checking simulator eligibility:", e);
    }

    // 3. Fetch Assessment Progress
    let totalAssessments = 0;
    let passingAssessments = 0;
    try {
        const assessments = await fetchAssessments();
        totalAssessments = assessments.length;

        const results = await fetchAssessmentResultsForUser(getToken);
        const scoreHistoryByQuizId = buildScoreHistoryByQuizId(results);

        assessments.forEach(a => {
            const history = scoreHistoryByQuizId[a.id] || [];
            const bestPct = history.length > 0 
                ? Math.max(...history.map(p => toPercent(p.score, p.totalItems)))
                : 0;
            if (bestPct >= 75) {
                passingAssessments++;
            }
        });
    } catch (e) {
        console.error("Error checking assessment eligibility:", e);
    }

    const eligible = 
        totalLessons > 0 && completedLessons >= totalLessons &&
        totalSimulators > 0 && completedSimulators >= totalSimulators &&
        totalAssessments > 0 && passingAssessments >= totalAssessments;

    return {
        eligible,
        userId,
        lessons: { total: totalLessons, completed: completedLessons },
        simulators: { total: totalSimulators, completed: completedSimulators },
        assessments: { total: totalAssessments, passing: passingAssessments },
        userName: userFullName
    };
}
