import { getApiUrl } from "./env";

type GetTokenFn = () => Promise<string | null>;

export async function FetchWithAuth<T>(
  path: string,
  getToken: GetTokenFn,
  init?: RequestInit,
): Promise<T> {
  const token = await getToken();

  if (!token) {
    throw new Error("Authentication token is missing");
  }

  const headers = new Headers(init?.headers);
  headers.set("Authorization", `Bearer ${token}`);

  if (!headers.has("Content-Type") && init?.body) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(getApiUrl(path), {
    ...init,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Request failed (${response.status}): ${errorText}`);
  }

  return (await response.json()) as T;
}
