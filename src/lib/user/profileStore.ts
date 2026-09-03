"use client";

export interface ApplicantProfileData {
  fullName: string;
  casteCategory: "Scheduled Caste (SC)" | "SC - Women Entrepreneur" | "SC - Safai Karamchari" | "SC - Student";
  casteCertificateNo: string;
  annualIncome: number;
  contactPhone: string;
  state: string;
  district: string;
  enterpriseActivity: string;
}

const STORAGE_KEY = "schemesetu_applicant_profile";

export const DEFAULT_PROFILE: ApplicantProfileData = {
  fullName: "Smt. Rekha Devi",
  casteCategory: "SC - Women Entrepreneur",
  casteCertificateNo: "UP-SC-2024-892182",
  annualIncome: 180000,
  contactPhone: "9876543210",
  state: "Uttar Pradesh",
  district: "Lucknow",
  enterpriseActivity: "Garment Tailoring & Micro-Fabrication Unit",
};

export function getStoredApplicantProfile(): ApplicantProfileData {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveStoredApplicantProfile(profile: ApplicantProfileData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error("Failed to save applicant profile to localStorage", e);
  }
}
