import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SmartRecommenderWizard } from "@/components/home/SmartRecommenderWizard";
import { PopularSchemesGrid } from "@/components/home/PopularSchemesGrid";
import { ChannelFinanceExplainer } from "@/components/home/ChannelFinanceExplainer";
import { TrustBanner } from "@/components/home/TrustBanner";
import { Sparkles, ArrowUpRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 py-5 sm:py-8 space-y-6 sm:space-y-10 overflow-x-hidden max-w-full">
      {/* Sovereign Hero Header with Visual Banner and 4 Statutory Pillars */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white/85 backdrop-blur-xs shadow-xs p-5 sm:p-7 lg:p-9">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Column: Context, Heading, Pillars */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center space-x-1.5 sm:space-x-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-[11px] sm:text-xs font-semibold shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-amber-600 shrink-0" />
              <span>Problem Statement ID 26092 &bull; MoSJE &amp; NSFDC Affirmative Credit</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Concessional Credit Matching for Marginalized Entrepreneurs
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
              Connecting Scheduled Caste entrepreneurs with tailored NSFDC concessional schemes covering up to 90% of project costs at 4.0% to 8.0% interest rates through solvent, low-NPA Channel Partners.
            </p>

            {/* 4 Statutory Mandate Pillars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-left">
              <div className="bg-slate-50/80 border border-slate-200/90 p-3 rounded-xl shadow-2xs">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Income Ceiling</span>
                <span className="text-xs sm:text-sm font-bold text-slate-900">₹5.00 Lakhs / yr</span>
              </div>
              <div className="bg-slate-50/80 border border-slate-200/90 p-3 rounded-xl shadow-2xs">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Project Coverage</span>
                <span className="text-xs sm:text-sm font-bold text-slate-900">Up to 90% Costs</span>
              </div>
              <div className="bg-slate-50/80 border border-slate-200/90 p-3 rounded-xl shadow-2xs">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Subsidized Rates</span>
                <span className="text-xs sm:text-sm font-bold text-emerald-700">4.0% - 8.0% p.a.</span>
              </div>
              <div className="bg-slate-50/80 border border-slate-200/90 p-3 rounded-xl shadow-2xs">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Channel Routing</span>
                <span className="text-xs sm:text-sm font-bold text-slate-900">&lt;10% NPA Solvent</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 shadow-md">
              <Image
                src="/images/hero_entrepreneurs.jpg"
                alt="Marginalized Indian entrepreneurs supported by MoSJE and NSFDC affirmative schemes"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

              <div className="absolute top-3 left-3 flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-semibold text-white border border-white/20 flex items-center gap-1.5 shadow-2xs">
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                  <span>MoSJE Affirmative Mandate</span>
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-white space-y-1">
                <p className="text-xs sm:text-sm font-bold text-white drop-shadow-xs">
                  Empowering SC Artisans, Dairy Farmers &amp; Micro-Enterprises
                </p>
                <div className="flex items-center space-x-2 text-[11px] text-slate-200">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Direct Concessional Credit via Verified Channel Banks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deliverable 1: Front-and-Center Smart Scheme Recommender Wizard */}
      <SmartRecommenderWizard />

      {/* Deliverable 1 Schemes: 3 Statutory Enterprise Schemes Showcase */}
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

      {/* Trust & Pre-Screened Referral Slip Banner */}
      <TrustBanner />
    </div>
  );
}
