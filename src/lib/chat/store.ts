import { ChatMessage, QuickPrompt, DialogState } from "./types";

export interface StoredChatState {
  messages: ChatMessage[];
  prompts: QuickPrompt[];
  dialogState: DialogState;
}

const STORAGE_KEY = "schemesetu_chat_state";

export function getStoredChatState(): StoredChatState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.messages) && parsed.messages.length > 0) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveStoredChatState(state: StoredChatState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save chat state to localStorage", e);
  }
}

export function clearStoredChatState(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
