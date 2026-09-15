export interface StoredWizardState {
  selectedActivity: string;
  cost: number;
  income: number;
  demographic: "ALL_SC" | "SC_WOMEN";
}

const STORAGE_KEY = "schemesetu_wizard_state";

export const DEFAULT_WIZARD_STATE: StoredWizardState = {
  selectedActivity: "kirana",
  cost: 120000,
  income: 240000,
  demographic: "ALL_SC",
};

export function getStoredWizardState(): StoredWizardState {
  if (typeof window === "undefined") return DEFAULT_WIZARD_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_WIZARD_STATE;
    const parsed = JSON.parse(raw);
    return {
      selectedActivity: parsed.selectedActivity || DEFAULT_WIZARD_STATE.selectedActivity,
      cost: typeof parsed.cost === "number" ? parsed.cost : DEFAULT_WIZARD_STATE.cost,
      income: typeof parsed.income === "number" ? parsed.income : DEFAULT_WIZARD_STATE.income,
      demographic: parsed.demographic || DEFAULT_WIZARD_STATE.demographic,
    };
  } catch {
    return DEFAULT_WIZARD_STATE;
  }
}

export function saveStoredWizardState(state: StoredWizardState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save wizard state to localStorage", e);
  }
}

export function clearStoredWizardState(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
