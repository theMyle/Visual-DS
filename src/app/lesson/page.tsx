"use client"

import { useEffect, useState } from "react";
import LessonCategory from "../components/LessonItem";
import { LocalStorage } from "../lib/localStorage";
import { LESSON_MAP } from "../lib/lessons";

export default function LessonPage() {
  const [allProgress, setAllProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    const progressUpdates: Record<string, number> = {};

    Object.entries(LESSON_MAP).forEach(([key, category]) => {
      LocalStorage.syncCategory(key, category.lessons);
      progressUpdates[key] = LocalStorage.getProgress(key);
    });

    setAllProgress(progressUpdates);
  }, [])

  return (
    <div className="flex w-full justify-center">
      <div
        className={"flex flex-col gap-4 justify-center my-6 w-full px-4 max-w-3xl"}
      >
        <p className="font-bold text-gray-700">Lessons</p>

        {Object.entries(LESSON_MAP).map(([key, category]) => (
          <LessonCategory
            key={key}
            title={category.title}
            path={`/lesson/${key}`}
            progress={allProgress[key] || 0}
          />
        ))}

      </div>
    </div>
  )
}
