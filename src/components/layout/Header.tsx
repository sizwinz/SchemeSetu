"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Landmark,
  User,
  X,
  CheckCircle2,
  Building2,
  ShieldCheck,
  Save,
  Radio,
} from "lucide-react";
import {
  ApplicantProfileData,
  getStoredApplicantProfile,
  saveStoredApplicantProfile,
  DEFAULT_PROFILE,
} from "@/lib/user/profileStore";

export function Header() {
  const pathname = usePathname();
  const [currentLang, setCurrentLang] = useState<"hi" | "en">("hi");
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [profile, setProfile] = useState<ApplicantProfileData>(DEFAULT_PROFILE);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine);
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      const savedLang = localStorage.getItem("schemesetu_language");
      if (savedLang === "en" || savedLang === "hi") {
        setCurrentLang(savedLang);
      }

      setProfile(getStoredApplicantProfile());

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  const toggleLanguage = () => {
    const nextLang = currentLang === "hi" ? "en" : "hi";
    setCurrentLang(nextLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("schemesetu_language", nextLang);
      window.dispatchEvent(new CustomEvent("schemesetu_language_changed", { detail: nextLang }));
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredApplicantProfile(profile);
    setSaveSuccess(true);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("schemesetu_profile_updated", { detail: profile }));
    }
    setTimeout(() => {
      setSaveSuccess(false);
      setShowProfileModal(false);
    }, 900);
  };

  return (
    <>
      <header className="w-full bg-white text-slate-900 shadow-2xs border-b border-slate-200/80 sticky top-0 z-40 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Brand Identity */}
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="flex items-center space-x-2 text-slate-900 hover:text-amber-700 transition-colors"
            >
              <Landmark className="h-6 w-6 text-slate-900" aria-hidden="true" />
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                SchemeSetu
              </span>
            </Link>
          </div>

          {/* Center: Sleek Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 text-xs font-semibold text-slate-600">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname === "/"
                  ? "bg-slate-100 text-slate-900 font-bold"
                  : "hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              Schemes
            </Link>

            <Link
              href="/assistant"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname === "/assistant"
                  ? "bg-slate-100 text-slate-900 font-bold"
                  : "hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              Voice Assistant
            </Link>

            <Link
              href="/calculator"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname === "/calculator"
                  ? "bg-slate-100 text-slate-900 font-bold"
                  : "hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              Calculator
            </Link>

            <Link
              href="/locator"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname === "/locator"
                  ? "bg-slate-100 text-slate-900 font-bold"
                  : "hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              Locator
            </Link>

            <Link
              href="/dossier"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname === "/dossier"
                  ? "bg-slate-100 text-slate-900 font-bold"
                  : "hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              Dossier
            </Link>

            <Link
              href="/admin"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname === "/admin"
                  ? "bg-slate-100 text-slate-900 font-bold"
                  : "hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              Admin
            </Link>
          </nav>

          {/* Right: Mockup Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Live Online / Offline State Indicator */}
            <div
              className={`hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
                isOnline
                  ? "bg-slate-100/90 text-slate-600 border-slate-200"
                  : "bg-amber-50 text-amber-800 border-amber-300"
              }`}
              title={isOnline ? "Network active with local offline fallback" : "Operating in offline cached mode"}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  isOnline ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                }`}
              />
              <span>{isOnline ? "Offline Mode Available" : "Offline Mode Active"}</span>
            </div>

            {/* Interactive Language Toggle Pill */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-full border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Toggle between Hindi and English interface language"
            >
              <span>{currentLang === "hi" ? "हिंदी / English" : "English / हिंदी"}</span>
            </button>

            {/* Applicant Profile Modal Trigger */}
            <button
              type="button"
              onClick={() => {
                setProfile(getStoredApplicantProfile());
                setShowProfileModal(true);
              }}
              className="w-8 h-8 rounded-full border border-slate-300 hover:border-slate-400 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              title="View & Edit Beneficiary Applicant Profile"
            >
              <User className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Interactive Beneficiary Profile Drawer / Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-xl space-y-4 relative animate-in fade-in zoom-in-95 duration-200 my-8">
            <button
              type="button"
              onClick={() => setShowProfileModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-amber-500/10 text-amber-600 rounded-xl">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Beneficiary Applicant Profile
                </h3>
                <p className="text-xs text-slate-500">
                  Data auto-populates your pre-screened application dossier and matching criteria
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  required
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Caste Category
                  </label>
                  <select
                    value={profile.casteCategory}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        casteCategory: e.target.value as ApplicantProfileData["casteCategory"],
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="Scheduled Caste (SC)">Scheduled Caste (SC)</option>
                    <option value="SC - Women Entrepreneur">SC - Women Entrepreneur</option>
                    <option value="SC - Safai Karamchari">SC - Safai Karamchari</option>
                    <option value="SC - Student">SC - Student</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Certified Annual Income (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={1500000}
                    value={profile.annualIncome}
                    onChange={(e) =>
                      setProfile({ ...profile, annualIncome: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Caste Certificate No.
                  </label>
                  <input
                    type="text"
                    value={profile.casteCertificateNo}
                    onChange={(e) =>
                      setProfile({ ...profile, casteCertificateNo: e.target.value })
                    }
                    placeholder="e.g. UP-SC-2024-892182"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={profile.contactPhone}
                    onChange={(e) => setProfile({ ...profile, contactPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={profile.state}
                    onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    District
                  </label>
                  <input
                    type="text"
                    value={profile.district}
                    onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Proposed Enterprise / Trade Activity
                </label>
                <input
                  type="text"
                  value={profile.enterpriseActivity}
                  onChange={(e) =>
                    setProfile({ ...profile, enterpriseActivity: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-slate-100">
                <span className="text-[11px] text-emerald-700 font-semibold">
                  {saveSuccess && "Profile saved and synced successfully"}
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowProfileModal(false)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-mosje-navy hover:bg-slate-800 text-amber-300 font-bold flex items-center space-x-1.5 shadow-xs cursor-pointer"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>Save Profile</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
