import React from "react";
import { MOSJE_SCHEMES } from "@/lib/schemes/data";
import { SchemeCard } from "@/components/schemes/SchemeCard";
import { EligibilityForm } from "@/components/schemes/EligibilityForm";
import { Award, Layers, ShieldCheck, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <section className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8 relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 mb-4 border border-amber-300/40">
            <Sparkles className="h-3.5 w-3.5 text-amber-700" />
            <span>National Scheduled Castes Finance & Development Corporation</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-mosje-navy tracking-tight leading-tight">
            Affirmative Credit Matching for Marginalized Entrepreneurs
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Eliminating offline confusion and application bottlenecks. SchemeSetu deterministically connects Scheduled Caste (SC) entrepreneurs and students with tailored concessional credit programs covering up to 90% of project costs at 4.0% to 8.0% interest rates.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-700">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="h-4 w-4 text-amber-600" />
              <span>Income Ceiling: Rs. 5.00 Lakhs</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Award className="h-4 w-4 text-amber-600" />
              <span>Concessional 4.0% - 8.0% Rates</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Layers className="h-4 w-4 text-amber-600" />
              <span>Up to 90% NSFDC Funding</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Criteria Evaluation & Walking Skeleton Harness */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-mosje-navy tracking-tight">
            Interactive Scheme Pre-Screening & Evaluation
          </h2>
          <span className="text-xs text-slate-500">Instant Deterministic Engine</span>
        </div>
        <EligibilityForm />
      </section>

      {/* Pre-Seeded Statutory Catalog */}
      <section className="space-y-4 pt-4 border-t border-slate-200">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-mosje-navy tracking-tight">
            Official MoSJE / NSFDC Statutory Loan Catalog
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Pre-seeded programs available through accredited State Channelizing Agencies, Public Sector Banks, and Regional Rural Banks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {MOSJE_SCHEMES.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} isPrimaryMatch={false} />
          ))}
        </div>
      </section>
    </div>
  );
}
