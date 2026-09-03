"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Landmark,
  User,
  MessageSquareText,
  BookOpen,
  Calculator,
  MapPin,
  FileCheck,
  Building2,
  Wifi,
} from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const [currentLang, setCurrentLang] = useState<"hi" | "en">("hi");

  const toggleLanguage = () => {
    setCurrentLang((prev) => (prev === "hi" ? "en" : "hi"));
  };

  return (
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

        {/* Right: Mockup Controls (Offline pill, Language toggle, Profile avatar) */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Offline Mode Pill */}
          <div className="hidden sm:flex items-center space-x-1.5 bg-slate-100/90 text-slate-600 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-medium">
            <span className="h-2 w-2 rounded-full bg-slate-400"></span>
            <span>Offline Mode Available</span>
          </div>

          {/* Language Toggle Pill */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-full border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Toggle between Hindi and English"
          >
            <span>{currentLang === "hi" ? "हिंदी / English" : "English / हिंदी"}</span>
          </button>

          {/* User Profile Avatar */}
          <Link
            href="/admin"
            className="w-8 h-8 rounded-full border border-slate-300 hover:border-slate-400 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors"
            title="User Profile & Admin"
          >
            <User className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
