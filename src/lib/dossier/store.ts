const STORAGE_KEY = "schemesetu_dossier_verified_docs";

export function getStoredVerifiedDocIds(): string[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveStoredVerifiedDocIds(docIds: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docIds));
  } catch (e) {
    console.error("Failed to save verified doc IDs to localStorage", e);
  }
}

export function clearStoredVerifiedDocIds(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
