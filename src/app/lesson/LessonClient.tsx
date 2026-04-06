"use client"

import LessonCategory from "../components/LessonItem";
import { LESSON_MAP } from "../lib/lessons";

export default function LessonClient({ initialProgress }: { initialProgress: Record<string, number> }) {
    return (
        <div className="flex w-full justify-center">
            <div className="flex flex-col gap-4 justify-center my-6 w-full px-4 max-w-3xl">
                <p className="font-bold text-gray-700">Lessons</p>

                {Object.entries(LESSON_MAP).map(([key, category]) => (
                    <LessonCategory
                        key={key}
                        title={category.title}
                        path={`/lesson/${key}`}
                        progress={initialProgress[key] ?? 0}
                    />
                ))}
            </div>
        </div>
    );
}