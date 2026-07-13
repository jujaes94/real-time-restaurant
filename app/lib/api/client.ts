export interface ApiOptions extends RequestInit {
  json?: unknown;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function getBaseUrl(): string {
  if (typeof window !== "undefined") return "";
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
}

export async function apiFetch<T>(
  path: string,
  { json, headers, ...init }: ApiOptions = {},
): Promise<T> {
  const url = `${getBaseUrl()}${path}`;
  const requestHeaders = new Headers(headers);
  let body: BodyInit | undefined;

  if (json !== undefined) {
    requestHeaders.set("Content-Type", "application/json");
    body = JSON.stringify(json);
  }

  const response = await fetch(url, { ...init, headers: requestHeaders, body });

  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new ApiError(message || response.statusText, response.status);
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await response.json()) as T;
  }
  return (await response.text()) as unknown as T;
}
