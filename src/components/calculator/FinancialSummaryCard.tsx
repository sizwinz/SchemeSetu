"use client";

import React from "react";
import { CalculationResult } from "@/lib/calculator/types";
import { ShieldCheck, TrendingDown, Clock, ArrowDownRight } from "lucide-react";
import { CountUp } from "@/components/reactbits/CountUp";
import { Badge } from "@/components/ui/badge";

interface FinancialSummaryCardProps {
  result: CalculationResult;
}

export function FinancialSummaryCard({ result }: FinancialSummaryCardProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const principal = result.principal;
  const concessionalInterest = result.totalConcessionalInterest;
  const bankSavings = result.comparisons.bank.lifetimeSavings;
  const commercialTotal = principal + concessionalInterest + bankSavings;

  const principalPct = Math.round((principal / commercialTotal) * 100);
  const interestPct = Math.round((concessionalInterest / commercialTotal) * 100);
  const savingsPct = Math.max(0, 100 - principalPct - interestPct);

  return (
    <div className="bg-white text-slate-900 rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Projected Monthly EMI
            </h3>
            <p className="text-xs text-slate-500">
              Concessional repayment after grace period
            </p>
          </div>
        </div>

        <Badge variant="outline" className="text-emerald-700 bg-emerald-50/60 border-emerald-200 text-xs font-semibold">
          <TrendingDown className="h-3 w-3 mr-1" />
          Subsidized Rate
        </Badge>
      </div>

      {/* Primary Display Number */}
      <div className="space-y-1.5">
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight tabular-nums">
            <CountUp to={result.effectiveMonthlyEMI} prefix="₹" duration={0.8} />
          </span>
          <span className="text-xs sm:text-sm text-slate-500 font-normal">/ month</span>
        </div>

        {result.moratoriumMonths > 0 ? (
          <p className="text-xs text-slate-600 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-amber-600 shrink-0" />
            <span>
              ₹0 principal payment for first {result.moratoriumMonths} months gestation
            </span>
          </p>
        ) : (
          <p className="text-xs text-slate-500">Immediate repayment without moratorium</p>
        )}
      </div>

      {/* Clean Breakdown Metrics Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-[11px] text-slate-500 block mb-0.5">Sanctioned Principal</span>
          <span className="text-sm font-bold text-slate-900 tabular-nums">
            <CountUp to={result.principal} prefix="₹" duration={0.6} />
          </span>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-[11px] text-slate-500 block mb-0.5">Total Concessional Interest</span>
          <span className="text-sm font-bold text-slate-900 tabular-nums">
            <CountUp to={result.totalConcessionalInterest} prefix="₹" duration={0.6} />
          </span>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-[11px] text-slate-500 block mb-0.5">Accrued Gestation Interest</span>
          <span className="text-sm font-bold text-slate-700 tabular-nums">
            <CountUp to={result.accruedGestationInterest} prefix="₹" duration={0.6} />
          </span>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-[11px] text-slate-500 block mb-0.5">Total Loan Lifetime Cost</span>
          <span className="text-sm font-bold text-slate-900 tabular-nums">
            <CountUp to={result.totalPayable} prefix="₹" duration={0.6} />
          </span>
        </div>
      </div>

      {/* Visual Composition Stacked Bar */}
      <div className="space-y-2 pt-1 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Cost Composition vs Commercial</span>
          <span className="text-emerald-700 font-semibold">{savingsPct}% Savings</span>
        </div>

        <div className="h-2 rounded-full bg-slate-100 overflow-hidden flex">
          <div
            style={{ width: `${principalPct}%` }}
            className="bg-slate-400 h-full transition-all duration-500"
            title={`Principal: ${principalPct}%`}
          />
          <div
            style={{ width: `${interestPct}%` }}
            className="bg-amber-500 h-full transition-all duration-500"
            title={`Concessional Interest: ${interestPct}%`}
          />
          <div
            style={{ width: `${savingsPct}%` }}
            className="bg-emerald-600 h-full transition-all duration-500"
            title={`Lifetime Subsidy Savings: ${savingsPct}%`}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
            <span>Principal ({principalPct}%)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            <span>Concessional ({interestPct}%)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
            <span>Subsidy ({savingsPct}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
