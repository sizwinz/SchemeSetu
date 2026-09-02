import { ChannelPartner } from "./types";

const STORAGE_KEY = "schemesetu_designated_partner";

export function getDesignatedPartner(): ChannelPartner | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setDesignatedPartner(partner: ChannelPartner): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(partner));
  } catch {
    // ignore quota/private browsing errors
  }
}

export function clearDesignatedPartner(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
