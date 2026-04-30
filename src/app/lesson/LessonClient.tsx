"use client"

import LessonCategory from "../components/LessonItem";
import { LESSON_MAP } from "../lib/lessons";

export default function LessonClient({ 
    initialProgress,
    categories 
}: { 
    initialProgress: Record<string, number>;
    categories?: any[];
}) {
    const categoryOrder = Object.keys(LESSON_MAP);
    
    // If dynamic categories are passed from DB, use them. Otherwise fallback to static LESSON_MAP
    const sortedDbCategories = categories && categories.length > 0 
        ? [...categories].sort((a, b) => {
            let indexA = categoryOrder.indexOf(a.slug);
            let indexB = categoryOrder.indexOf(b.slug);
            if (indexA === -1) indexA = 999;
            if (indexB === -1) indexB = 999;
            return indexA - indexB;
        })
        : [];

    const renderList = sortedDbCategories.length > 0 
        ? sortedDbCategories.map(c => ({ slug: c.slug, title: c.title }))
        : Object.entries(LESSON_MAP).map(([slug, category]) => ({ slug, title: category.title }));

    return (
        <div className="flex w-full justify-center">
            <div className="flex flex-col gap-4 justify-center my-6 w-full px-4 max-w-3xl">
                <p className="font-bold text-gray-700">Lessons</p>

                {renderList.map(({ slug, title }) => (
                    <LessonCategory
                        key={slug}
                        title={title}
                        path={`/lesson/${slug}`}
                        progress={initialProgress[slug] ?? 0}
                    />
                ))}
            </div>
        </div>
    );
}