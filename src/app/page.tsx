import React from "react";
import { OfficialMoSJEBanner } from "@/components/home/OfficialMoSJEBanner";
import { SmartRecommenderWizard } from "@/components/home/SmartRecommenderWizard";
import { PopularSchemesGrid } from "@/components/home/PopularSchemesGrid";
import { ChannelFinanceExplainer } from "@/components/home/ChannelFinanceExplainer";
import { TrustBanner } from "@/components/home/TrustBanner";

export default function HomePage() {
  return (
    <div className="space-y-8 pb-16">
      {/* Statutory MoSJE Banner establishing Problem Statement 26092 context */}
      <OfficialMoSJEBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Deliverable 1: Front-and-Center Smart Scheme Recommender Wizard */}
        <SmartRecommenderWizard />

        {/* Deliverable 1 Schemes: 4 Statutory Schemes (MCF, MSY, TLS, ELS) */}
        <div className="space-y-3">
          <div className="px-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Statutory MoSJE &amp; NSFDC Concessional Schemes
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Targeted affirmative credit products covering up to 90% of project costs at 4.0% to 8.0% interest rates.
            </p>
          </div>
          <PopularSchemesGrid />
        </div>

        {/* Deliverable 3 Context: Channel Finance Architecture & NPA Routing */}
        <ChannelFinanceExplainer />

        {/* Trust & Pre-Screened Verifiable Dossier Banner */}
        <TrustBanner />
      </div>
    </div>
  );
}
