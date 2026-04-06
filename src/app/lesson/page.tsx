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

  if (!userId) {
    return <LessonClient initialProgress={{}} />;
  }

  let data: ProgressItem[] = [];
  try {
    data = await FetchWithAuth(`/api/progress`, getToken);
  } catch (error) {
    console.error("Failed to fetch progress:", error);
  }

  const calculated: Record<string, number> = {};
  Object.entries(LESSON_MAP).forEach(([slug, category]) => {
    const completedCount = data.filter((item: any) => item.lesson_category === slug).length;
    const totalCount = category.lessons.length;
    calculated[slug] = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  });

  return <LessonClient initialProgress={calculated} />;
}