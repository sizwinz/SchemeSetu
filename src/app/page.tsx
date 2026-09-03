import React from "react";
import { VoiceHero } from "@/components/home/VoiceHero";
import { PopularSchemesGrid } from "@/components/home/PopularSchemesGrid";
import { TrustBanner } from "@/components/home/TrustBanner";
import { EligibilityForm } from "@/components/schemes/EligibilityForm";
import { Sparkles, SlidersHorizontal } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Voice-First Central Hero matching mockup */}
      <VoiceHero />

      {/* Popular Schemes 4-Card Grid matching mockup */}
      <PopularSchemesGrid />

      {/* Trust & Verification Banner matching mockup */}
      <TrustBanner />

      {/* Interactive Scheme Pre-Screening & Evaluation Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        <details className="group bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs transition-all">
          <summary className="flex items-center justify-between cursor-pointer list-none">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-amber-500/10 text-amber-600 rounded-xl">
                <SlidersHorizontal className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Interactive Eligibility & Pre-Screening Engine
                </h3>
                <p className="text-xs text-slate-500">
                  Optional: Check customized loan limits and subsidies across all MoSJE programs
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-500 group-open:rotate-180 transition-transform duration-200">
              ▼
            </span>
          </summary>

          <div className="pt-5 mt-4 border-t border-slate-100">
            <EligibilityForm />
          </div>
        </details>
      </section>
    </div>
  );
}
