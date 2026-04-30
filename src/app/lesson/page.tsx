// src/app/lesson/page.tsx
import { auth } from '@clerk/nextjs/server';
import LessonClient from './LessonClient';
import { FetchWithAuth } from '../lib/fetchWithAuth';
import { LESSON_MAP } from "../lib/lessons";

interface ProgressItem {
    lesson_category: string;
    lesson_id: string;
}

export default async function Page() {
    const { userId, getToken } = await auth();

    // 1. Fetch Categories from DB
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/lessons`;
    let dbCategories: any[] = [];
    try {
        const response = await fetch(apiUrl, { next: { revalidate: 60 } });
        if (response.ok) {
            dbCategories = await response.json();
        }
    } catch (error) {
        console.error("Error fetching categories:", error);
    }

    if (!userId) {
        const initialProgress: Record<string, number> = {};
        if (dbCategories.length > 0) {
            dbCategories.forEach(c => {
                initialProgress[c.slug] = 0;
            });
        } else {
            Object.keys(LESSON_MAP).forEach(slug => {
                initialProgress[slug] = 0;
            });
        }
        return <LessonClient initialProgress={initialProgress} categories={dbCategories} />;
    }

    // 2. Fetch User Progress
    let progressData: ProgressItem[] = [];
    try {
        progressData = await FetchWithAuth(`/api/progress`, getToken);
    } catch (error) {
        console.error("Failed to fetch progress:", error);
    }

    // 3. Calculate Progress Percentages
    const calculated: Record<string, number> = {};

    if (dbCategories.length > 0) {
        dbCategories.forEach((category: any) => {
            const completedCount = progressData.filter((item: any) => item.lesson_category === category.slug).length;
            const totalCount = category.lesson_count;
            calculated[category.slug] = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
        });
    } else {
        // Fallback to static mapping
        Object.entries(LESSON_MAP).forEach(([slug, category]) => {
            const completedCount = progressData.filter((item: any) => item.lesson_category === slug).length;
            const totalCount = category.lessons.length;
            calculated[slug] = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
        });
    }

    return <LessonClient initialProgress={calculated} categories={dbCategories} />;
}