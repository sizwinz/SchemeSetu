"use client";

import React from "react";
import { CalculationResult } from "@/lib/calculator/types";
import { ShieldCheck, TrendingDown, Clock, IndianRupee } from "lucide-react";
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
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-md space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-amber-500/20 text-amber-300 rounded-xl border border-amber-500/30">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">Projected Monthly EMI</h3>
            <p className="text-xs text-slate-400">Concessional repayment after grace period</p>
          </div>
        </div>

        <Badge variant="sovereign" className="text-amber-300 bg-amber-500/20 border-amber-400/30">
          <TrendingDown className="h-3 w-3 mr-1" />
          Subsidized Rate
        </Badge>
      </div>

      {/* Primary Display Number with ReactBits CountUp */}
      <div className="space-y-1">
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono tracking-tight tabular-nums">
            <CountUp to={result.effectiveMonthlyEMI} prefix="₹" duration={1} />
          </span>
          <span className="text-xs sm:text-sm text-slate-400 font-medium">/ month</span>
        </div>

        {result.moratoriumMonths > 0 ? (
          <p className="text-xs text-amber-200/80 flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span>
              ₹0 principal payment for first {result.moratoriumMonths} months gestation
            </span>
          </p>
        ) : (
          <p className="text-xs text-slate-400">Immediate repayment without moratorium</p>
        )}
      </div>

      {/* Breakdown Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs font-mono tabular-nums">
        <div>
          <span className="text-[10px] text-slate-400 font-sans block">Sanctioned Principal</span>
          <span className="font-bold text-white">
            <CountUp to={result.principal} prefix="₹" duration={0.8} />
          </span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 font-sans block">Total Concessional Interest</span>
          <span className="font-bold text-amber-300">
            <CountUp to={result.totalConcessionalInterest} prefix="₹" duration={0.8} />
          </span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 font-sans block">Accrued Gestation Interest</span>
          <span className="font-bold text-slate-300">
            <CountUp to={result.accruedGestationInterest} prefix="₹" duration={0.8} />
          </span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 font-sans block">Total Loan Lifetime Cost</span>
          <span className="font-bold text-white">
            <CountUp to={result.totalPayable} prefix="₹" duration={0.8} />
          </span>
        </div>
      </div>

      {/* Visual Composition Stacked Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Cost Composition vs Commercial</span>
          <span className="font-mono text-emerald-400 font-bold">{savingsPct}% Savings</span>
        </div>

        <div className="h-3 rounded-full bg-slate-800 overflow-hidden flex">
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
            className="bg-emerald-500 h-full transition-all duration-500"
            title={`Lifetime Subsidy Savings: ${savingsPct}%`}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 font-mono">
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
            <span className="font-sans">Principal</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            <span className="font-sans">Concessional</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span className="font-sans">Subsidy</span>
          </div>
        </div>
      </div>
    </div>
  );
}
