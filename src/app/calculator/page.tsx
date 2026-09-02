"use client";

import React, { useState } from "react";
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
import { Calculator, ShieldCheck, MapPin, MessageSquareText } from "lucide-react";
import Link from "next/link";

export default function CalculatorPage() {
  const [params, setParams] = useState<LoanParameters>({
    principal: 140000,
    annualInterestRate: 6.5,
    tenureYears: 5,
    moratoriumMonths: 6,
  });

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
            <h1 className="text-xl sm:text-2xl font-bold text-mosje-navy tracking-tight">
              Concessional Loan & Moratorium Calculator
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

      {/* Main 2-Column Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sliders & Controls */}
        <div className="lg:col-span-7 space-y-6">
          <LoanSliders params={params} onChange={setParams} />

          {/* Quick Action Navigation */}
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href="/assistant"
              className="flex-1 min-w-[200px] text-center bg-mosje-navy hover:bg-slate-800 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquareText className="h-4 w-4 text-amber-400" />
              <span>Consult Conversational Assistant</span>
            </Link>

            <Link
              href="/#locator"
              className="flex-1 min-w-[200px] text-center bg-mosje-saffron hover:bg-amber-600 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              <span>Locate Channel Partners</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Financial Summary Card */}
        <div className="lg:col-span-5 space-y-6">
          <FinancialSummaryCard result={result} />
        </div>
      </div>

      {/* Commercial Benchmark Comparison Card */}
      <div>
        <CommercialComparisonCard
          bank={result.comparisons.bank}
          nbfc={result.comparisons.nbfc}
          effectiveConcessionalEMI={result.effectiveMonthlyEMI}
        />
      </div>

      {/* Repayment Amortization Schedule Table */}
      <div>
        <AmortizationTable
          monthlySchedule={monthlySchedule}
          annualSummary={annualSummary}
        />
      </div>
    </div>
  );
}
