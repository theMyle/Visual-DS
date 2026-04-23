"use client"
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import AssessmentMenuItem from "../components/AssessmentMenuItem";
import { ASSESSMENT_LIST } from "../lib/assessments";
import { FetchWithAuth } from "../lib/fetchWithAuth";

type ScoreMap = Record<
    string,
    {
        lastCorrectCount?: number;
        highestCorrectCount?: number;
        totalQuestions?: number;
    }
>;

type QuizResultSnapshot = {
    score: number;
};

type QuizResultSummaryResponse = {
    quiz_category: string;
    quiz_id: string;
    highest: QuizResultSnapshot;
    most_recent: QuizResultSnapshot;
};

const QUESTION_TOTAL_BY_ASSESSMENT_ID: Record<string, number> = {
    "array-list-1": 10,
    "linked-list-1": 10,
    "stack-1": 10,
    "queue-1": 10,
};

export default function LessonPage() {
    const { isLoaded, isSignedIn, getToken } = useAuth();

    const { data: scoreMap = {} } = useQuery({
        queryKey: ["quiz-summary"],
        enabled: isLoaded && isSignedIn,
        queryFn: async () => {
            const summaries = await FetchWithAuth<QuizResultSummaryResponse[]>(
                "/api/quizzes",
                getToken,
            );

            const updates: ScoreMap = {};

            summaries.forEach((summary) => {
                const totalQuestions = QUESTION_TOTAL_BY_ASSESSMENT_ID[summary.quiz_id];
                if (!totalQuestions) {
                    return;
                }

                updates[summary.quiz_id] = {
                    lastCorrectCount: summary.most_recent?.score,
                    highestCorrectCount: summary.highest?.score,
                    totalQuestions,
                };
            });

            return updates;
        },
    });

    return (
        <div className="flex w-full justify-center">
            <div
                className={"flex flex-col gap-4 justify-center my-6 w-full px-4 max-w-3xl"}
            >
                <p className="font-bold text-gray-700">Assessment</p>

                {ASSESSMENT_LIST.map((assessment) => (
                    <AssessmentMenuItem
                        key={assessment.id}
                        title={assessment.title}
                        path={assessment.path}
                        lastCorrectCount={scoreMap[assessment.id]?.lastCorrectCount}
                        highestCorrectCount={scoreMap[assessment.id]?.highestCorrectCount}
                        totalQuestions={scoreMap[assessment.id]?.totalQuestions}
                    />
                ))}

                {/* <Link href={"/assessment/stack"}>Stack</Link>
            <Link href={"/assessment/queue"}>Queue</Link>
            <Link href={"/assessment/test"}>Test</Link> */}
            </div>
        </div>
    );
}