"use client";

import { useEffect, useState } from "react";
import AssessmentMenuItem from "../components/AssessmentMenuItem";
import { ASSESSMENT_LIST } from "../lib/assessments";
import { LocalStorage } from "../lib/localStorage";

type ScoreMap = Record<
    string,
    {
        lastCorrectCount?: number;
        highestCorrectCount?: number;
        totalQuestions?: number;
    }
>;

export default function LessonPage() {
    const [scoreMap, setScoreMap] = useState<ScoreMap>({});

    useEffect(() => {
        const updates: ScoreMap = {};

        ASSESSMENT_LIST.forEach((assessment) => {
            const result = LocalStorage.getAssessmentScore(assessment.id);
            updates[assessment.id] = {
                lastCorrectCount: result?.lastCorrectCount,
                highestCorrectCount: result?.highestCorrectCount,
                totalQuestions: result?.totalQuestions,
            };
        });

        setScoreMap(updates);
    }, []);

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