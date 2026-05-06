import { auth } from "@clerk/nextjs/server";
import { FetchWithAuth } from "../lib/fetchWithAuth";
import SimulatorMenuItem from "./components/SimulatorMenuItem";
import { redirect } from "next/navigation";

type Level = {
  id: number;
  title: string;
  path: string;
  next: string;
  isCompleted: boolean;
};

type SimulatorProgressResponse = {
  user_id: string;
  simulator_category: string;
  path: string;
  is_completed: boolean;
  updated_at: string | null;
};

import { fetchSimulatorCurriculum } from "../lib/simulators";

export default async function SimulatorPage() {
  const { userId, getToken } = await auth();

  if (!userId) {
    return null; // Handled by middleware
  }

  let progress: SimulatorProgressResponse[] = [];
  let curriculum: any[] = [];
  let curriculumError = false;

  try {
    curriculum = await fetchSimulatorCurriculum();
  } catch (error) {
    console.error("Failed to fetch simulator curriculum:", error);
    curriculumError = true;
  }

  if (userId) {
    try {
      progress = await FetchWithAuth<SimulatorProgressResponse[]>(
        "/api/simulator-progress",
        getToken,
      );
    } catch (error) {
      console.error("Failed to fetch simulator progress:", error);
    }
  }

  const completedPaths = new Set(
    progress
      .filter((item) => item.is_completed)
      .map((item) => item.path),
  );

  const sectionsWithProgress = curriculum.map((section) => ({
    title: section.name,
    levels: section.challenges.map((challenge: any, index: number) => ({
      id: index + 1,
      title: challenge.title,
      path: challenge.path,
      next: index < section.challenges.length - 1 ? section.challenges[index + 1].path : "/simulator",
      isCompleted: completedPaths.has(challenge.path),
    })),
  }));

  return (
    <div className="flex w-full justify-center">
      <div
        className={"flex flex-col gap-4 justify-center my-6 w-full px-4 max-w-3xl"}
      >

        <p className="font-bold text-gray-700">Simulator</p>
        {sectionsWithProgress.length > 0 ? (
          sectionsWithProgress.map((section) => (
            <SimulatorMenuItem
              key={section.title}
              title={section.title}
              levels={section.levels}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
            <p className="text-sm text-slate-500 font-medium">No simulators available yet.</p>
          </div>
        )}

      </div>
    </div>
  )
}
