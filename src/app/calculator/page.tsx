"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LoanParameters } from "@/lib/calculator/types";
import {
  calculateConcessionalLoan,
  generateAmortizationSchedule,
  generateAnnualSummary,
} from "@/lib/calculator/engine";
import { LoanSliders } from "@/components/calculator/LoanSliders";
import { FinancialSummaryCard } from "@/components/calculator/FinancialSummaryCard";
import { CommercialComparisonCard } from "@/components/calculator/CommercialComparisonCard";
import { AmortizationTable } from "@/components/calculator/AmortizationTable";
import { Calculator, ShieldCheck, MapPin, MessageSquareText, Sparkles } from "lucide-react";
import Link from "next/link";

const SCHEME_PRESETS: Record<string, { name: string; params: LoanParameters; note: string }> = {
  MSY: {
    name: "Mahila Samriddhi Yojana (MSY)",
    params: {
      principal: 126000,
      annualInterestRate: 4.0,
      tenureYears: 3,
      moratoriumMonths: 6,
    },
    note: "4.0% Subsidized Interest Rate for Women Entrepreneurs (90% NSFDC Funding)",
  },
  MCF: {
    name: "Micro Credit Finance (MCF)",
    params: {
      principal: 126000,
      annualInterestRate: 6.5,
      tenureYears: 3,
      moratoriumMonths: 3,
    },
    note: "6.5% Concessional Rate for Micro-Enterprises and Small Vendors",
  },
  TERM_LOAN: {
    name: "Term Loan Scheme (TLS)",
    params: {
      principal: 500000,
      annualInterestRate: 8.0,
      tenureYears: 5,
      moratoriumMonths: 6,
    },
    note: "8.0% Rate for Medium Enterprises, Transport Vehicles, and Machinery",
  },
  ELS: {
    name: "Education Loan Scheme (ELS)",
    params: {
      principal: 400000,
      annualInterestRate: 6.5,
      tenureYears: 5,
      moratoriumMonths: 12,
    },
    note: "6.5% Rate with extended 12-Month Gestation Moratorium for Higher Studies",
  },
};

function CalculatorContent() {
  const searchParams = useSearchParams();
  const schemeCode = searchParams.get("scheme")?.toUpperCase() || "";
  const costParam = searchParams.get("cost");

  const [params, setParams] = useState<LoanParameters>(() => {
    if (schemeCode && SCHEME_PRESETS[schemeCode]) {
      const preset = SCHEME_PRESETS[schemeCode].params;
      if (costParam && !isNaN(Number(costParam))) {
        return { ...preset, principal: Math.round(Number(costParam) * 0.9) };
      }
      return preset;
    }
    return {
      principal: 140000,
      annualInterestRate: 6.5,
      tenureYears: 5,
      moratoriumMonths: 6,
    };
  });

  useEffect(() => {
    if (schemeCode && SCHEME_PRESETS[schemeCode]) {
      const preset = SCHEME_PRESETS[schemeCode].params;
      if (costParam && !isNaN(Number(costParam))) {
        setParams({ ...preset, principal: Math.round(Number(costParam) * 0.9) });
      } else {
        setParams(preset);
      }
    }
  }, [schemeCode, costParam]);

  const activePreset = schemeCode && SCHEME_PRESETS[schemeCode] ? SCHEME_PRESETS[schemeCode] : null;

  const result = calculateConcessionalLoan(params);
  const monthlySchedule = generateAmortizationSchedule(params);
  const annualSummary = generateAnnualSummary(monthlySchedule);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-amber-500/10 text-amber-600 rounded-lg">
              <Calculator className="h-6 w-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Concessional Loan &amp; Moratorium Calculator
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Simulate monthly EMIs, 3 to 12 month gestation periods, and total interest savings under MoSJE affirmative credit programs.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <div className="flex items-center space-x-1.5 text-xs text-slate-700 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span className="font-semibold">NSFDC Subsidized Rates (4% - 8%)</span>
          </div>
        </div>
      </div>

      {/* Preset Indicator Banner */}
      {activePreset && (
        <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-3.5 px-4 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-amber-700 shrink-0" />
            <div>
              <span className="font-bold text-slate-900 block">{activePreset.name}</span>
              <span className="text-slate-600">{activePreset.note}</span>
            </div>
          </div>
          <Link
            href="/calculator"
            className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 underline shrink-0"
          >
            Reset to Custom
          </Link>
        </div>
      )}

      {/* Main 2-Column Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sliders & Controls */}
        <div className="lg:col-span-7 space-y-6">
          <LoanSliders params={params} onChange={setParams} />

          {/* Direct Actions to Next Steps */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Next Steps for Beneficiary
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href={`/locator?amount=${params.principal}`}
                className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-xs text-slate-800 flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-amber-600" />
                  <div>
                    <span className="font-bold block">Find Solvent Branch</span>
                    <span className="text-[10px] text-slate-400">Route to nearby low-NPA partner</span>
                  </div>
                </div>
                <span className="text-slate-400 group-hover:text-slate-700 font-bold">&rarr;</span>
              </Link>

              <Link
                href={`/assistant?q=${encodeURIComponent(`I want to apply for a ${params.principal} loan at ${params.annualInterestRate}% interest`)}`}
                className="p-3 rounded-xl bg-mosje-navy hover:bg-slate-800 text-xs text-amber-300 flex items-center justify-between transition-colors shadow-xs group"
              >
                <div className="flex items-center space-x-2">
                  <MessageSquareText className="h-4 w-4" />
                  <div>
                    <span className="font-bold text-white block">Pre-Screen in Chat</span>
                    <span className="text-[10px] text-amber-200/80">Voice-guided application</span>
                  </div>
                </div>
                <span className="text-amber-300 font-bold">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Financial Summaries & Comparison */}
        <div className="lg:col-span-5 space-y-6">
          <FinancialSummaryCard result={result} />
          <CommercialComparisonCard
            bank={result.comparisons.bank}
            nbfc={result.comparisons.nbfc}
            effectiveConcessionalEMI={result.effectiveMonthlyEMI}
          />
        </div>
      </div>

      {/* Full-Width Amortization Schedule Table */}
      <AmortizationTable
        monthlySchedule={monthlySchedule}
        annualSummary={annualSummary}
      />
    </div>
  );
}

export default function CalculatorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Calculator...</div>}>
      <CalculatorContent />
    </Suspense>
  );
}
