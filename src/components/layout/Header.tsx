"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Landmark,
  ShieldCheck,
  MessageSquareText,
  BookOpen,
  Calculator,
  MapPin,
  FileCheck,
} from "lucide-react";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="w-full bg-mosje-navy text-white shadow-sm border-b border-slate-800 sticky top-0 z-40 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/" className="bg-mosje-saffron p-2 rounded-lg text-white block hover:bg-amber-600 transition-colors">
            <Landmark className="h-6 w-6" aria-hidden="true" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <Link href="/" className="font-bold text-lg tracking-tight text-white hover:text-amber-300 transition-colors">
                SchemeSetu
              </Link>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                MoSJE Concessional Finance
              </span>
            </div>
            <p className="text-xs text-slate-300 hidden sm:block">
              Ministry of Social Justice and Empowerment: Affirmative Action Credit Engine
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-2.5 text-xs">
          <Link
            href="/"
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              pathname === "/"
                ? "bg-slate-800 text-amber-300 font-semibold border border-slate-700"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Schemes</span>
          </Link>

          <Link
            href="/assistant"
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              pathname === "/assistant"
                ? "bg-slate-800 text-amber-300 font-semibold border border-slate-700"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <MessageSquareText className="h-4 w-4" />
            <span>Voice Assistant</span>
          </Link>

          <Link
            href="/calculator"
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              pathname === "/calculator"
                ? "bg-slate-800 text-amber-300 font-semibold border border-slate-700"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Calculator className="h-4 w-4" />
            <span>Calculator</span>
          </Link>

          <Link
            href="/locator"
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              pathname === "/locator"
                ? "bg-slate-800 text-amber-300 font-semibold border border-slate-700"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <MapPin className="h-4 w-4" />
            <span>Partner Locator</span>
          </Link>

          <Link
            href="/dossier"
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              pathname === "/dossier"
                ? "bg-slate-800 text-amber-300 font-semibold border border-slate-700"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <FileCheck className="h-4 w-4" />
            <span>Dossier</span>
          </Link>

          <div className="flex items-center space-x-1 bg-slate-800/80 px-2.5 py-1.5 rounded-full border border-slate-700 text-slate-300 ml-1.5">
            <ShieldCheck className="h-4 w-4 text-amber-400" />
            <span>NSFDC Verified</span>
          </div>
        </div>
      </div>
    </header>
  );
}
