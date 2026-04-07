"use client"

import BackButton from "@/app/components/BackButton";
import SubLessonHeader from "@/app/components/SubLessonHeader";
import SubLessonItem from "@/app/components/SubLessonItem";
import ChallengeLinkCard from "../components/ChallengeLinkCard";

interface LessonWithStatus {
    title: string;
    href: string;
    completed: boolean;
}

interface Props {
    title: string;
    description: string;
    challengeHref?: string;
    lessons: LessonWithStatus[];
}

export default function LessonDetailClient({ title, description, challengeHref, lessons }: Props) {
    return (
        <div className="w-full flex justify-center">
            <div className="flex flex-col gap-6 max-w-3xl md:min-w-3xl p-6 pb-10">
                <BackButton text="Back to Lessons" href="/lesson" />

                <SubLessonHeader
                    title={title}
                    description={description}
                />

                {challengeHref && (
                    <ChallengeLinkCard href={challengeHref} />
                )}

                <div className="flex flex-col gap-4">
                    {lessons.map((lesson) => (
                        <SubLessonItem
                            key={lesson.href}
                            title={lesson.title}
                            href={lesson.href}
                            status={lesson.completed}
                            // Toggle is removed, so we just pass a no-op or remove the prop
                            onToggle={() => { }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}