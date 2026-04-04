"use client"

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import LessonCategory from "../components/LessonItem";
import { LESSON_MAP } from "../lib/lessons";
import { FetchWithAuth } from "../lib/fetchWithAuth";

interface ProgressItem {
  lesson_category: string;
  lesson_id: string;
}

export default function LessonPage() {
  const { isLoaded, isSignedIn, getToken } = useAuth();

  const { data: progressData, isLoading } = useQuery({
    queryKey: ["progress"],
    queryFn: async () => {
      const data = await FetchWithAuth<ProgressItem[]>("/api/progress", getToken);
      const calculated: Record<string, number> = {};

      Object.entries(LESSON_MAP).forEach(([slug, category]) => {
        const completedCount = data.filter((item) => item.lesson_category === slug).length;
        const totalCount = category.lessons.length;
        calculated[slug] = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
      });

      return calculated;
    },
    enabled: isLoaded && isSignedIn,
  });

  return (
    <div className="flex w-full justify-center">
      <div className="flex flex-col gap-4 justify-center my-6 w-full px-4 max-w-3xl">
        <p className="font-bold text-gray-700">Lessons</p>

        {Object.entries(LESSON_MAP).map(([key, category]) => (
          <LessonCategory
            key={key}
            title={category.title}
            path={`/lesson/${key}`}
            progress={isLoading ? null : progressData?.[key] ?? 0}
          />
        ))}
      </div>
    </div>
  );
}