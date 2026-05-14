import { auth } from '@clerk/nextjs/server';
import { notFound } from "next/navigation";
import { LESSON_MAP } from "@/app/lib/lessons";
import { FetchWithAuth } from "@/app/lib/fetchWithAuth";
import { fetchAssessments } from "@/app/lib/assessments/api";
import LessonDetailClient from './LessonDetailClient';

interface ProgressItem {
    lesson_category: string;
    lesson_id: string;
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // 1. Fetch category and lessons from DB
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/lessons/${slug}`;
    let dbData: any = null;
    try {
        const response = await fetch(apiUrl, { cache: "no-store" });
        if (response.ok) {
            dbData = await response.json();
        }
    } catch (error) {
        console.error("Error fetching category lessons:", error);
    }

    // Fallback to static if DB fails
    const staticData = LESSON_MAP[slug];

    if (!dbData && !staticData) notFound();

    const title = dbData?.category?.title || staticData?.title || "";
    const description = dbData?.category?.description || staticData?.description || "";
    const challengeHref = staticData?.challengeHref || `/simulator/${slug}`; // Default or static

    // 2. Fetch Progress
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

    // 3. Combine Data and Sort
    let lessons: any[] = [];
    if (dbData?.lessons) {
        // Map and then sort based on staticData order if it exists
        lessons = dbData.lessons.map((l: any) => ({
            title: l.title,
            slug: l.slug, // Keep slug for sorting/comparison
            href: `/lesson/${slug}/${l.slug}`,
            completed: categoryProgress.some(p => p.lesson_id === `/lesson/${slug}/${l.slug}`),
        }));

        if (staticData?.lessons) {
            const staticOrder = staticData.lessons.map(l => l.href);
            lessons.sort((a, b) => {
                let indexA = staticOrder.indexOf(a.href);
                let indexB = staticOrder.indexOf(b.href);
                if (indexA === -1) indexA = 999;
                if (indexB === -1) indexB = 999;
                return indexA - indexB;
            });
        }
    } else if (staticData?.lessons) {
        lessons = staticData.lessons.map((staticLesson) => ({
            ...staticLesson,
            completed: categoryProgress.some(p => p.lesson_id === staticLesson.href),
        }));
    }

    // 4. Check for Assessment
    let assessmentHref: string | undefined = undefined;
    try {
        const availableAssessments = await fetchAssessments();
        
        const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
        const normalizedSlug = normalize(slug);

        // Try to find a matching assessment using various strategies:
        const matchingAssessment = availableAssessments.find(a => {
            const normalizedId = normalize(a.id);
            const normalizedCategory = normalize(a.category);
            const normalizedTitle = title ? normalize(title) : "";

            return (
                normalizedId === normalizedSlug ||
                normalizedCategory === normalizedSlug ||
                (normalizedTitle && normalizedCategory === normalizedTitle) ||
                normalizedId.startsWith(normalizedSlug)
            );
        });

        if (matchingAssessment) {
            assessmentHref = `/assessment/${matchingAssessment.id}`;
        }
    } catch (error) {
        console.error("Error fetching assessments for detail page:", error);
    }

    return (
        <LessonDetailClient
            title={title}
            description={description}
            challengeHref={challengeHref}
            assessmentHref={assessmentHref}
            lessons={lessons}
        />
    );
}