const STORAGE_KEY = "miruto:userExternalId";

export function getOrCreateUserExternalId(): string {
  if (typeof window === "undefined") {
    throw new Error("getOrCreateUserExternalId must be called on the client");
  }
  const existing = window.localStorage.getItem(STORAGE_KEY);
  if (existing) return existing;

  const generated = crypto.randomUUID();
  window.localStorage.setItem(STORAGE_KEY, generated);
  return generated;
}
