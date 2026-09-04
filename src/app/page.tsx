import React from "react";
import Link from "next/link";
import { SmartRecommenderWizard } from "@/components/home/SmartRecommenderWizard";
import { PopularSchemesGrid } from "@/components/home/PopularSchemesGrid";
import { ChannelFinanceExplainer } from "@/components/home/ChannelFinanceExplainer";
import { TrustBanner } from "@/components/home/TrustBanner";
import { Sparkles, ArrowUpRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6 sm:space-y-10">
      {/* Sovereign Hero Header with 4 Statutory Pillars */}
      <section className="text-center max-w-3xl mx-auto space-y-3.5">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-semibold shadow-2xs">
          <Sparkles className="h-3.5 w-3.5 text-amber-600" />
          <span>Problem Statement ID 26092 • MoSJE &amp; NSFDC Affirmative Credit</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Concessional Credit Matching for Marginalized Entrepreneurs
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Connecting Scheduled Caste entrepreneurs and students with tailored NSFDC concessional schemes covering up to 90% of project costs at 4.0% to 8.0% interest rates through solvent, low-NPA Channel Partners.
        </p>

        {/* 4 Statutory Mandate Pillars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1.5 max-w-2xl mx-auto text-left">
          <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Income Ceiling</span>
            <span className="text-xs sm:text-sm font-bold text-slate-900">₹5.00 Lakhs / yr</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Project Coverage</span>
            <span className="text-xs sm:text-sm font-bold text-slate-900">Up to 90% Costs</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Subsidized Rates</span>
            <span className="text-xs sm:text-sm font-bold text-emerald-700">4.0% - 8.0% p.a.</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Channel Routing</span>
            <span className="text-xs sm:text-sm font-bold text-slate-900">&lt;10% NPA Solvent</span>
          </div>
        </div>
      </section>

      {/* Deliverable 1: Front-and-Center Smart Scheme Recommender Wizard */}
      <SmartRecommenderWizard />

      {/* Deliverable 1 Schemes: 4 Statutory Schemes Showcase */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-100">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Statutory MoSJE &amp; NSFDC Concessional Schemes
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Targeted affirmative credit windows covering up to 90% of project costs at 4.0% to 8.0% interest rates.
            </p>
          </div>
          <Link
            href="/calculator"
            className="text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors flex items-center gap-1 shrink-0 self-start sm:self-auto px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 shadow-2xs"
          >
            <span>Compare All in Calculator</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <PopularSchemesGrid />
      </section>

      {/* Deliverable 3 Context: Channel Finance Architecture & NPA Routing */}
      <ChannelFinanceExplainer />

      {/* Trust & Pre-Screened Verifiable Dossier Banner */}
      <TrustBanner />
    </div>
  );
}
