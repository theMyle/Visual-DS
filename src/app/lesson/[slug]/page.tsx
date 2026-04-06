import { auth } from '@clerk/nextjs/server';
import { notFound } from "next/navigation";
import { LESSON_MAP } from "@/app/lib/lessons";
import { FetchWithAuth } from "@/app/lib/fetchWithAuth";
import LessonDetailClient from './LessonDetailClient';

interface ProgressItem {
    lesson_category: string;
    lesson_id: string;
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const categoryData = LESSON_MAP[slug];

    if (!categoryData) notFound();

    const { userId, getToken } = await auth();
    let allProgress: ProgressItem[] = [];

    if (userId) {
        try {
            allProgress = await FetchWithAuth(
                `/api/progress`,
                getToken
            );
        } catch (error) {
            console.error("Error fetching detail progress:", error);
        }
    }

    const categoryProgress = allProgress.filter(p => p.lesson_category === slug);

    const lessonsWithStatus = categoryData.lessons.map((staticLesson) => ({
        ...staticLesson,
        completed: categoryProgress.some(p => p.lesson_id === staticLesson.href),
    }));

    return (
        <LessonDetailClient
            title={categoryData.title}
            description={categoryData.description!}
            lessons={lessonsWithStatus}
        />
    );
}