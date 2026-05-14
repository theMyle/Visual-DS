"use client"

import BackButton from "@/app/components/BackButton";
import SubLessonHeader from "@/app/components/SubLessonHeader";
import SubLessonItem from "@/app/components/SubLessonItem";

interface LessonWithStatus {
    title: string;
    href: string;
    completed: boolean;
}

interface Props {
    title: string;
    description: string;
    challengeHref?: string;
    assessmentHref?: string;
    lessons: LessonWithStatus[];
}

export default function LessonDetailClient({ title, description, challengeHref, assessmentHref, lessons }: Props) {
    return (
        <div className="w-full flex justify-center">
            <div className="flex flex-col gap-6 max-w-3xl md:min-w-3xl p-6 pb-10">
                <BackButton text="Back to Lessons" href="/lesson" />

                <SubLessonHeader
                    title={title}
                    description={description}
                />

                <div className="flex flex-col gap-4">
                    {lessons.map((lesson, index) => (
                        <SubLessonItem
                            key={lesson.href}
                            index={index + 1}
                            title={lesson.title}
                            href={lesson.href}
                            status={lesson.completed}
                        />
                    ))}

                    {assessmentHref && (
                        <SubLessonItem
                            index={lessons.length + 1}
                            title="Assessment"
                            href={assessmentHref}
                            status={false}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}