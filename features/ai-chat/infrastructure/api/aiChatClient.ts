const BASE_URL =
  process.env.NEXT_PUBLIC_AI_CHAT_API_BASE_URL ??
  "https://ai-chat.shota-yanachi.workers.dev";

export async function aiChatFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T | null> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message =
      body && typeof body === "object" && "message" in body
        ? String((body as { message: unknown }).message)
        : `Request failed: ${res.status}`;
    throw new Error(message);
  }
  return res.status === 204 ? null : ((await res.json()) as T);
}
