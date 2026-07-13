const GATE_STORAGE_KEY = "miruto:aiChatUnlocked";
const listeners = new Set<() => void>();

export function subscribeToGate(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function getGateSnapshot(): boolean {
  return window.localStorage.getItem(GATE_STORAGE_KEY) === "true";
}

export function getGateServerSnapshot(): boolean {
  return false;
}

export function unlockGate(): void {
  window.localStorage.setItem(GATE_STORAGE_KEY, "true");
  listeners.forEach((listener) => listener());
}
