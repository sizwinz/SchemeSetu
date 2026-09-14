"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChatContainer } from "@/components/chat/ChatContainer";
import {
  ShieldCheck,
  Sparkles,
  User,
  Building2,
  Mic,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ApplicantProfileData,
  getStoredApplicantProfile,
} from "@/lib/user/profileStore";

const STATUTORY_PROMPTS = [
  {
    title: "Mahila Samriddhi Yojana",
    query: "Tell me about Mahila Samriddhi Yojana eligibility and 4.0% interest rate for SC women.",
    badge: "4.0% p.a.",
    desc: "Up to ₹1.40L for women micro-entrepreneurs",
  },
  {
    title: "Micro Credit Finance",
    query: "How do I apply for Micro Credit Finance (MCF) for a small shop or kiosk?",
    badge: "6.5% p.a.",
    desc: "Up to ₹1.40L with zero margin money",
  },
  {
    title: "Term Loan Scheme",
    query: "What are the requirements for Term Loan Scheme covering up to ₹50.00 Lakhs?",
    badge: "8.0% p.a.",
    desc: "Commercial expansion and machinery projects",
  },
  {
    title: "Education Loan",
    query: "What are the terms for NSFDC Education Loans for professional degrees?",
    badge: "4.0% - 8.0%",
    desc: "Up to ₹20.00L in India and abroad",
  },
];

function AssistantContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialScheme = searchParams.get("scheme") || "";

  return <ChatContainer initialQuery={initialQuery} initialScheme={initialScheme} />;
}

export default function AssistantPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ApplicantProfileData | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    setProfile(getStoredApplicantProfile());

    const handleProfileUpdate = (e: any) => {
      setProfile(e.detail);
    };
    window.addEventListener("schemesetu_profile_updated", handleProfileUpdate);
    return () => {
      window.removeEventListener("schemesetu_profile_updated", handleProfileUpdate);
    };
  }, []);

  const handleTriggerPrompt = (query: string) => {
    router.push(`/assistant?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="h-[calc(100dvh-3.5rem)] lg:h-auto -mb-20 lg:mb-0 pb-[4.5rem] lg:pb-10 flex-1 flex flex-col max-w-[1600px] mx-auto w-full px-3 sm:px-6 lg:px-8 2xl:px-12 pt-2 sm:pt-4 min-h-0 overflow-hidden">
      {/* Title Bar: Compact on mobile, expansive sovereign banner on desktop */}
      <div className="flex items-center justify-between gap-3 pb-2.5 sm:pb-3.5 shrink-0 border-b border-slate-200/80 mb-2 sm:mb-3">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="p-1.5 sm:p-2 bg-amber-500/10 text-amber-700 rounded-xl shrink-0">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-2xl font-extrabold text-slate-900 tracking-tight truncate">
              AI Concessional Scheme Assistant
            </h1>
            <p className="hidden sm:block text-xs text-slate-500 mt-0.5">
              Bilingual conversational advisor modeling MoSJE eligibility, subsidized EMIs, and solvent branch matching.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <Badge variant="outline" className="text-slate-700 bg-white border-slate-200/90 text-[10px] sm:text-xs py-1 px-2.5 sm:px-3 font-semibold shadow-2xs">
            <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 text-emerald-600 shrink-0" />
            <span>NSFDC Statutory AI</span>
          </Badge>
          <Badge variant="sovereign" className="hidden md:inline-flex text-[10px] sm:text-xs py-1 px-2.5 font-semibold">
            <span>Voice &amp; Text</span>
          </Badge>
        </div>
      </div>

      {/* Main Responsive Grid Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-0 items-stretch">
        {/* Left Column (Main Chat Container): Fills space responsively */}
        <div className="lg:col-span-8 xl:col-span-8 2xl:col-span-9 flex flex-col min-h-0 h-full overflow-hidden">
          <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Assistant...</div>}>
            <AssistantContent />
          </Suspense>
        </div>

        {/* Right Column (Desktop Companion Rail): Hidden on mobile, sticky & rich on lg: */}
        <div className="hidden lg:flex lg:col-span-4 xl:col-span-4 2xl:col-span-3 flex-col gap-3.5 overflow-y-auto pr-1">
          {/* Active Applicant Context Snapshot */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-amber-600" />
                <span>Active Beneficiary Context</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Pre-Screened
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Category</span>
                <span className="font-bold text-slate-800">{profile?.casteCategory || "SC - Women"}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Annual Income</span>
                <span className="font-bold text-slate-800 font-sans tabular-nums">
                  ₹{((profile?.annualIncome || 240000) / 100000).toFixed(2)} Lakhs
                </span>
              </div>
              <div className="col-span-2 pt-1 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Target Jurisdiction</span>
                  <span className="font-semibold text-slate-700 text-[11px]">
                    {profile?.district || "Lucknow"}, {profile?.state || "Uttar Pradesh"}
                  </span>
                </div>
                <Link
                  href="/dossier"
                  className="text-[11px] font-bold text-amber-700 hover:text-amber-800 flex items-center gap-0.5"
                >
                  <span>View Slip</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Statutory Scheme Fast Prompts */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                <span>Statutory Scheme Inquiries</span>
              </span>
              <span className="text-[10px] text-slate-400">Click to ask</span>
            </div>

            <div className="space-y-1.5">
              {STATUTORY_PROMPTS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleTriggerPrompt(item.query)}
                  className="w-full text-left p-2.5 rounded-xl border border-slate-100 hover:border-amber-300 bg-slate-50/50 hover:bg-amber-50/40 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-xs font-bold text-slate-800 group-hover:text-amber-800 transition-colors">
                      {item.title}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md font-sans">
                      {item.badge}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 line-clamp-1">
                    {item.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Voice-First & Multilingual Instructions */}
          <div className="bg-amber-50/50 rounded-2xl border border-amber-200/80 p-3.5 space-y-2 text-xs shadow-2xs">
            <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs">
              <Mic className="h-4 w-4 text-amber-700 shrink-0" />
              <span>Voice &amp; Read Aloud Features</span>
            </div>
            <p className="text-[11px] text-amber-950/80 leading-relaxed">
              Click the microphone button in the input bar to speak your query naturally in Hindi or English. Responses are automatically spoken aloud with native accents.
            </p>
          </div>

          {/* Solvent Channel Routing Safeguard */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 space-y-2 text-xs shadow-2xs">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-xs">
              <Building2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Solvent Channel Protection</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              When recommending loans, SchemeSetu verifies partner financial health. Only branches with under 10% NPA and active credit quotas are assigned.
            </p>
            <Link
              href="/locator"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-800 pt-0.5"
            >
              <span>Explore Partner Network</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
