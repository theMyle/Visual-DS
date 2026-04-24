import type { auth } from "@clerk/nextjs/server";
import { FetchWithAuth } from "../fetchWithAuth";

type GetTokenFn = Awaited<ReturnType<typeof auth>>["getToken"];

function normalizeAdminPath(pathOrEndpoint: string): string {
  const value = pathOrEndpoint.trim();

  if (value.startsWith("/api/admin/")) {
    return value;
  }

  if (value.startsWith("api/admin/")) {
    return `/${value}`;
  }

  const endpoint = value.replace(/^\/+/, "");
  return `/api/admin/${endpoint}`;
}

export async function fetchAdminApi<T>(
  pathOrEndpoint: string,
  getToken: GetTokenFn,
  init?: RequestInit,
): Promise<T> {
  return FetchWithAuth<T>(normalizeAdminPath(pathOrEndpoint), getToken, {
    method: init?.method ?? "GET",
    ...init,
  });
}
