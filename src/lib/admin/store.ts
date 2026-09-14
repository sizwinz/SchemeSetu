import { BeneficiaryLead } from "./types";
import { PRESEEDED_LEADS } from "./data";

const LEADS_STORAGE_KEY = "schemesetu_admin_leads";
const QUOTA_STORAGE_KEY = "schemesetu_admin_quota";

export function getStoredAdminLeads(): BeneficiaryLead[] {
  if (typeof window === "undefined") return PRESEEDED_LEADS;
  try {
    const raw = localStorage.getItem(LEADS_STORAGE_KEY);
    if (!raw) return PRESEEDED_LEADS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : PRESEEDED_LEADS;
  } catch {
    return PRESEEDED_LEADS;
  }
}

export function saveStoredAdminLeads(leads: BeneficiaryLead[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
  } catch (e) {
    console.error("Failed to save admin leads to localStorage", e);
  }
}

export function getStoredBranchQuota(): number {
  if (typeof window === "undefined") return 85.0;
  try {
    const raw = localStorage.getItem(QUOTA_STORAGE_KEY);
    if (!raw) return 85.0;
    const val = Number(raw);
    return isNaN(val) ? 85.0 : val;
  } catch {
    return 85.0;
  }
}

export function saveStoredBranchQuota(quotaLakhs: number): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(QUOTA_STORAGE_KEY, quotaLakhs.toString());
  } catch (e) {
    console.error("Failed to save branch quota to localStorage", e);
  }
}

export function resetStoredAdminData(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(LEADS_STORAGE_KEY);
    localStorage.removeItem(QUOTA_STORAGE_KEY);
  } catch {
    // ignore
  }
}
