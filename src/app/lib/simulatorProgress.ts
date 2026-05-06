import { FetchWithAuth } from "./fetchWithAuth";

type GetTokenFn = () => Promise<string | null>;

type SyncSimulatorProgressParams = {
  category: string;
  path: string;
  challengeId?: string;
  isCompleted?: boolean;
  lastSubmittedCode?: string;
  isLoaded?: boolean;
  isSignedIn?: boolean;
  userId?: string | null;
  getToken: GetTokenFn;
};

export async function syncSimulatorProgress({
  category,
  path,
  challengeId,
  isCompleted = true,
  lastSubmittedCode,
  isLoaded,
  isSignedIn,
  userId,
  getToken,
}: SyncSimulatorProgressParams): Promise<void> {
  if (!isLoaded || !isSignedIn || !userId) {
    return;
  }

  const payload = {
    path,
    is_completed: isCompleted,
    last_submitted_code: lastSubmittedCode || "",
    challenge_id: challengeId || "",
  };

  try {
    await FetchWithAuth(
      `/api/simulator-progress/${category}`,
      getToken,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
    return;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (!message.includes("Request failed (404)")) {
      throw error;
    }
  }

  await FetchWithAuth(
    `/simulator-progress/${category}`,
    getToken,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

export type SimulatorProgressDTO = {
  user_id: string;
  simulator_category: string;
  path: string;
  is_completed: boolean;
  last_submitted_code: string;
  updated_at: string | null;
};

export async function fetchSimulatorProgress(
  category: string,
  path: string,
  getToken: GetTokenFn,
): Promise<SimulatorProgressDTO | null> {
  try {
    const data = await FetchWithAuth<SimulatorProgressDTO>(
      `/api/simulator-progress/${category}?path=${encodeURIComponent(path)}`,
      getToken,
    );
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("404")) {
      return null;
    }
    console.error("Error fetching simulator progress:", error);
    return null;
  }
}

export type SimulatorSubmissionDTO = {
  id: string;
  user_id: string;
  simulator_id: string;
  challenge_id: string;
  code: string;
  status: string;
  created_at: string;
};

export async function fetchSimulatorSubmissions(
  challengeId: string,
  getToken: GetTokenFn,
): Promise<SimulatorSubmissionDTO[]> {
  try {
    const data = await FetchWithAuth<SimulatorSubmissionDTO[]>(
      `/api/simulator-submissions/${challengeId}`,
      getToken,
    );
    return data || [];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("404")) {
      return [];
    }
    console.error("Error fetching simulator submissions:", error);
    return [];
  }
}
