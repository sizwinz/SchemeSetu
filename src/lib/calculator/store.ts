import { LoanParameters } from "./types";

export interface StoredCalculatorState {
  activeTab: string;
  params: LoanParameters;
}

const STORAGE_KEY = "schemesetu_calculator_state";

export const DEFAULT_CALCULATOR_STATE: StoredCalculatorState = {
  activeTab: "TLS",
  params: {
    principal: 500000,
    annualInterestRate: 8.0,
    tenureYears: 5,
    moratoriumMonths: 6,
  },
};

export function getStoredCalculatorState(): StoredCalculatorState {
  if (typeof window === "undefined") return DEFAULT_CALCULATOR_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CALCULATOR_STATE;
    const parsed = JSON.parse(raw);
    return {
      activeTab: parsed.activeTab || DEFAULT_CALCULATOR_STATE.activeTab,
      params: { ...DEFAULT_CALCULATOR_STATE.params, ...parsed.params },
    };
  } catch {
    return DEFAULT_CALCULATOR_STATE;
  }
}

export function saveStoredCalculatorState(state: StoredCalculatorState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save calculator state to localStorage", e);
  }
}

export function clearStoredCalculatorState(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
