import type { auth } from "@clerk/nextjs/server";
import { FetchWithAuth } from "../fetchWithAuth";

type GetTokenFn = Awaited<ReturnType<typeof auth>>["getToken"];

export async function fetchAdminApi<T>(
  path: string,
  getToken: GetTokenFn,
  init?: RequestInit,
): Promise<T> {
  return FetchWithAuth<T>(path, getToken, {
    method: init?.method ?? "GET",
    ...init,
  });
}

export async function fetchAdminAssessments(
  getToken: GetTokenFn,
): Promise<unknown> {
  return fetchAdminApi<unknown>("/api/admin/assessments", getToken);
}
