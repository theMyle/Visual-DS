import { auth } from "@clerk/nextjs/server";
import AssessmentMenuItem from "../components/AssessmentMenuItem";
import {
    buildScoreHistoryByQuizId,
    type BackendQuizResult,
    fetchAssessmentResultsForUser,
    fetchAssessments,
    type QuizResultPoint,
} from "../lib/assessments/api";

type AssessmentListItem = {
    id: string;
    title: string;
    path: string;
    scoreHistory?: QuizResultPoint[];
};

function toTitleFromCategory(category: string): string {
    return category
        .split("-")
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

async function fetchAssessmentMenuData(): Promise<AssessmentListItem[]> {
    try {
        const assessments = await fetchAssessments();
        const { userId, getToken } = await auth();

        let results: BackendQuizResult[] = [];
        if (userId) {
            try {
                results = await fetchAssessmentResultsForUser(getToken);
            } catch {
                results = [];
            }
        }

        const scoreHistoryByQuizId = buildScoreHistoryByQuizId(results);

        return assessments.map((assessment, index): AssessmentListItem => ({
            id: assessment.id || `unknown-${index}`,
            title:
                toTitleFromCategory((assessment.category || "").trim()) ||
                toTitleFromCategory((assessment.id || "").trim()) ||
                "Assessment",
            path: (assessment.category || "").trim()
                ? `/assessment/${assessment.category.trim()}`
                : "/assessment",
            scoreHistory: scoreHistoryByQuizId[assessment.id] ?? [],
        }));
    } catch {
        return [];
    }
}

export default async function LessonPage() {
    const assessments = await fetchAssessmentMenuData();

    const sanitizedAssessments = assessments.filter(
        (assessment) => Boolean(assessment.id) && Boolean(assessment.path),
    );

    return (
        <div className="flex w-full justify-center">
            <div
                className={"flex flex-col gap-4 justify-center my-6 w-full px-4 max-w-3xl"}
            >
                <p className="font-bold text-gray-700">Assessment</p>

                {sanitizedAssessments.map((assessment) => (
                    <AssessmentMenuItem
                        key={assessment.id}
                        title={assessment.title}
                        path={assessment.path}
                        scoreHistory={assessment.scoreHistory}
                    />
                ))}

                {/* <Link href={"/assessment/stack"}>Stack</Link>
            <Link href={"/assessment/queue"}>Queue</Link>
            <Link href={"/assessment/test"}>Test</Link> */}
            </div>
        </div>
    );
}