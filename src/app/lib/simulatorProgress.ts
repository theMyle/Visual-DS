import { FetchWithAuth } from "./fetchWithAuth";

type GetTokenFn = () => Promise<string | null>;

type SyncSimulatorProgressParams = {
  category: string;
  path: string;
  isCompleted?: boolean;
  isLoaded?: boolean;
  isSignedIn?: boolean;
  userId?: string | null;
  getToken: GetTokenFn;
};

export async function syncSimulatorProgress({
  category,
  path,
  isCompleted = true,
  isLoaded,
  isSignedIn,
  userId,
  getToken,
}: SyncSimulatorProgressParams): Promise<void> {
  if (!isCompleted || !isLoaded || !isSignedIn || !userId) {
    return;
  }

  const payload = {
    path,
    is_completed: isCompleted,
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
