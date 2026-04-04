"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { useParams, notFound } from "next/navigation";
import BackButton from "@/app/components/BackButton";
import SubLessonHeader from "@/app/components/SubLessonHeader";
import SubLessonItem from "@/app/components/SubLessonItem";
import { LESSON_MAP } from "@/app/lib/lessons";
import { FetchWithAuth } from "@/app/lib/fetchWithAuth";

interface ProgressItem {
    lesson_category: string;
    lesson_id: string;
}

export default function LessonDetail() {
    const { isLoaded, isSignedIn, getToken } = useAuth();
    const queryClient = useQueryClient();
    const { slug } = useParams() as { slug: string };

    const categoryData = LESSON_MAP[slug];
    if (!categoryData) notFound();

    const { data: lessons = [] } = useQuery({
        queryKey: ["progress", slug],
        queryFn: async () => {
            const allProgress = await FetchWithAuth<ProgressItem[]>("/api/progress", getToken);

            // Filter only the items for this category (slug)
            const categoryProgress = allProgress.filter(p => p.lesson_category === slug);

            return categoryData.lessons.map((staticLesson) => {
                // Using the full href as the ID for comparison as per your requirement
                const isCompleted = categoryProgress.some(p => p.lesson_id === staticLesson.href);

                return {
                    ...staticLesson,
                    completed: isCompleted,
                };
            });
        },
        enabled: !!(isLoaded && isSignedIn),
        // placeholderData shows the list immediately but DOES NOT block the background fetch
        placeholderData: categoryData.lessons.map(l => ({ ...l, completed: false })),
    });

    const toggleMutation = useMutation({
        mutationFn: async ({ lessonId, completed }: { lessonId: string; completed: boolean }) => {
            const method = completed ? "DELETE" : "POST";
            const encodedId = encodeURIComponent(lessonId);
            return FetchWithAuth(`/api/progress/${slug}/${encodedId}`, getToken, { method });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["progress"] });
        },
    });

    const handleToggle = (href: string, currentStatus: boolean) => {
        if (!isSignedIn) return;
        console.log("mutating")
        toggleMutation.mutate({ lessonId: href, completed: currentStatus });
    };

    if (!isLoaded) return null;

    return (
        <div className="w-full flex justify-center">
            <div className="flex flex-col gap-6 max-w-3xl md:min-w-3xl p-6 pb-10">
                <BackButton text="Back to Lessons" href="/lesson" />

                <SubLessonHeader
                    title={categoryData.title}
                    description={categoryData.description}
                />

                <div className="flex flex-col gap-4">
                    {lessons.map((lesson) => (
                        <SubLessonItem
                            key={lesson.href}
                            title={lesson.title}
                            href={lesson.href}
                            status={lesson.completed}
                            onToggle={() => handleToggle(lesson.href, lesson.completed)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}