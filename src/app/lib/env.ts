function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

export const env = {
  apiBaseUrl: normalizeBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL ?? ""),
};

export function getApiUrl(path: string): string {
  if (!env.apiBaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_API_BASE_URL environment variable");
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${env.apiBaseUrl}${normalizedPath}`;
}
