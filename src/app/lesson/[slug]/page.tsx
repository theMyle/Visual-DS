"use client"

import BackButton from "@/app/components/BackButton";
import SubLessonHeader from "@/app/components/SubLessonHeader";
import SubLessonItem from "@/app/components/SubLessonItem";
import { LESSON_MAP } from "@/app/lib/lessons";
import { LocalStorage, SubLesson } from "@/app/lib/localStorage";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function LessonDetail() {
    const params = useParams();
    const slug = params.slug as string

    const categoryData = LESSON_MAP[slug];
    if (!categoryData) {
        notFound();
    }

    const [lessons, setLessons] = useState<SubLesson[]>([]);

    useEffect(() => {
        const synced = LocalStorage.syncCategory(slug, categoryData.lessons);
        setLessons(synced);
    }, [])

    const handleToggle = (href: string) => {
        setLessons(prev => {
            const updated = prev.map(l =>
                l.href === href ? { ...l, completed: !l.completed } : l
            );

            LocalStorage.setCategory(slug, updated);
            return updated;
        });
    };

    return (
        <div className="w-full flex justify-center">
            <div className="flex flex-col gap-6 max-w-3xl md:min-w-3xl p-6 pb-10">

                {/* back button */}
                <BackButton text="Back to Lessons" href="/lesson" />

                {/* header card */}
                <SubLessonHeader
                    title={categoryData.title}
                    description={categoryData.description}
                />

                {/* sub lessons */}
                <div className="flex flex-col gap-4">
                    {lessons.map((lesson) => (
                        <SubLessonItem
                            key={lesson.href}
                            title={lesson.title}
                            href={lesson.href}
                            status={lesson.completed}
                            onToggle={() => handleToggle(lesson.href)}
                        />
                    ))}
                </div>

            </div>
        </div>
    );
}