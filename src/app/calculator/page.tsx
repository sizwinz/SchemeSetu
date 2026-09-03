"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
import { Calculator, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SchemeConfig {
  key: string;
  name: string;
  code: string;
  rate: number;
  tenure: number;
  moratorium: number;
  maxPrincipal: number;
  defaultPrincipal: number;
  description: string;
}

const SCHEMES: SchemeConfig[] = [
  {
    key: "MSY",
    name: "Mahila Samriddhi",
    code: "MSY",
    rate: 4.0,
    tenure: 3,
    moratorium: 6,
    maxPrincipal: 140000,
    defaultPrincipal: 126000,
    description: "4.0% Subsidized rate for SC women micro-entrepreneurs covering up to 90% of costs.",
  },
  {
    key: "MCF",
    name: "Micro Credit Finance",
    code: "MCF",
    rate: 6.5,
    tenure: 3,
    moratorium: 3,
    maxPrincipal: 140000,
    defaultPrincipal: 126000,
    description: "6.5% Concessional rate for small kiosks, vendors, and micro-business units.",
  },
  {
    key: "TLS",
    name: "Term Loan Scheme",
    code: "TERM_LOAN",
    rate: 8.0,
    tenure: 5,
    moratorium: 6,
    maxPrincipal: 5000000,
    defaultPrincipal: 500000,
    description: "8.0% Rate for transport vehicles, machinery, and larger capital projects up to ₹50 Lakhs.",
  },
  {
    key: "ELS",
    name: "Education Loan",
    code: "ELS",
    rate: 6.5,
    tenure: 5,
    moratorium: 12,
    maxPrincipal: 4000000,
    defaultPrincipal: 800000,
    description: "6.5% Concessional rate with extended 12-month gestation moratorium for professional higher studies.",
  },
];

function CalculatorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const schemeParam = searchParams.get("scheme")?.toUpperCase() || "";
  const amountParam = searchParams.get("amount") || searchParams.get("cost");
  const rateParam = searchParams.get("rate");
  const tenureParam = searchParams.get("tenure");

  // Determine active scheme tab
  const matchedScheme = SCHEMES.find(
    (s) => s.key === schemeParam || s.code === schemeParam
  );

  const [activeTab, setActiveTab] = useState<string>(
    matchedScheme ? matchedScheme.key : "TLS"
  );

  const [params, setParams] = useState<LoanParameters>(() => {
    const base = matchedScheme || SCHEMES[2]; // Default to TLS
    const p: LoanParameters = {
      principal: base.defaultPrincipal,
      annualInterestRate: base.rate,
      tenureYears: base.tenure,
      moratoriumMonths: base.moratorium,
    };

    if (amountParam && !isNaN(Number(amountParam))) {
      p.principal = Number(amountParam);
    }
    if (rateParam && !isNaN(Number(rateParam))) {
      p.annualInterestRate = Number(rateParam);
    }
    if (tenureParam && !isNaN(Number(tenureParam))) {
      p.tenureYears = Number(tenureParam);
    }

    return p;
  });

  // Sync when URL params change
  useEffect(() => {
    if (matchedScheme) {
      setActiveTab(matchedScheme.key);
      setParams({
        principal: amountParam ? Number(amountParam) : matchedScheme.defaultPrincipal,
        annualInterestRate: rateParam ? Number(rateParam) : matchedScheme.rate,
        tenureYears: tenureParam ? Number(tenureParam) : matchedScheme.tenure,
        moratoriumMonths: matchedScheme.moratorium,
      });
    }
  }, [matchedScheme, amountParam, rateParam, tenureParam]);

  const handleTabSwitch = (scheme: SchemeConfig) => {
    setActiveTab(scheme.key);
    setParams({
      principal: Math.min(params.principal, scheme.maxPrincipal) || scheme.defaultPrincipal,
      annualInterestRate: scheme.rate,
      tenureYears: scheme.tenure,
      moratoriumMonths: scheme.moratorium,
    });
  };

  const currentConfig = SCHEMES.find((s) => s.key === activeTab) || SCHEMES[2];

  const result = calculateConcessionalLoan(params);
  const monthlySchedule = generateAmortizationSchedule(params);
  const annualSummary = generateAnnualSummary(monthlySchedule);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 px-4 sm:px-6 lg:px-8 pt-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-700 rounded-xl">
              <Calculator className="h-6 w-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Concessional Loan &amp; Moratorium Calculator
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Deliverable 2: Dynamic financial engine modeling concessional EMIs, 3 to 12 month gestation grace periods, and commercial savings.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <Badge variant="outline" className="text-xs py-1 px-3 text-emerald-800 bg-emerald-50 border-emerald-200 font-semibold">
            <ShieldCheck className="h-3.5 w-3.5 mr-1 text-emerald-600" />
            <span>NSFDC Subsidized Rates (4.0% - 8.0%)</span>
          </Badge>
        </div>
      </div>

      {/* Unified Scheme Selector Segmented Tab Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            Select MoSJE Statutory Scheme Preset
          </span>
          <span className="text-[11px] text-slate-400">
            Presets automatically calibrate statutory rate and grace period
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SCHEMES.map((scheme) => {
            const isSelected = activeTab === scheme.key;
            return (
              <button
                key={scheme.key}
                type="button"
                onClick={() => handleTabSwitch(scheme)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "border-amber-500 bg-amber-50/50 shadow-2xs"
                    : "border-slate-200 bg-slate-50/40 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    isSelected ? "text-amber-800" : "text-slate-400"
                  }`}>
                    {scheme.key}
                  </span>
                  <span className={`text-xs font-bold ${
                    isSelected ? "text-emerald-700" : "text-slate-600"
                  }`}>
                    {scheme.rate}% p.a.
                  </span>
                </div>
                <span className={`text-xs font-bold block leading-tight ${
                  isSelected ? "text-slate-900" : "text-slate-800"
                }`}>
                  {scheme.name}
                </span>
              </button>
            );
          })}
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <p className="text-[11px] leading-relaxed">
            <strong className="text-slate-900">{currentConfig.name}:</strong> {currentConfig.description}
          </p>
        </div>
      </div>

      {/* Main Simulation Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Loan Sliders */}
        <div className="lg:col-span-7">
          <LoanSliders params={params} onChange={setParams} />
        </div>

        {/* Right Column: Financial Summary Card */}
        <div className="lg:col-span-5">
          <FinancialSummaryCard result={result} />
        </div>
      </div>

      {/* Commercial Lending Comparison */}
      <CommercialComparisonCard
        bank={result.comparisons.bank}
        nbfc={result.comparisons.nbfc}
        effectiveConcessionalEMI={result.effectiveMonthlyEMI}
      />

      {/* Repayment Amortization Schedule Table */}
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
