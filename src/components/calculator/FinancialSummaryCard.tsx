"use client";

import React from "react";
import { CalculationResult } from "@/lib/calculator/types";
import { ShieldCheck, TrendingDown, Clock, IndianRupee } from "lucide-react";

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

  // Stacked Bar Calculation:
  // Base is total commercial payable (or principal + concessional interest + savings)
  const principal = result.principal;
  const concessionalInterest = result.totalConcessionalInterest;
  const bankSavings = result.comparisons.bank.lifetimeSavings;
  const commercialTotal = principal + concessionalInterest + bankSavings;

  const principalPct = Math.round((principal / commercialTotal) * 100);
  const interestPct = Math.round((concessionalInterest / commercialTotal) * 100);
  const savingsPct = Math.max(0, 100 - principalPct - interestPct);

  return (
    <div className="bg-mosje-navy text-white rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-md space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-amber-500/20 text-amber-300 rounded-lg border border-amber-500/30">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">Projected Monthly EMI</h3>
            <p className="text-xs text-slate-300">Concessional repayment after gestation</p>
          </div>
        </div>

        <span className="text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
          <TrendingDown className="h-3.5 w-3.5" />
          Subsidized Rate
        </span>
      </div>

      {/* Primary Display Number */}
      <div className="space-y-1">
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono tracking-tight tabular-nums">
            {formatCurrency(result.effectiveMonthlyEMI)}
          </span>
          <span className="text-xs sm:text-sm text-slate-300 font-medium">/ month</span>
        </div>

        {result.moratoriumMonths > 0 ? (
          <p className="text-xs text-slate-300 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span>
              Includes {result.moratoriumMonths}-mo gestation simple interest ({formatCurrency(result.monthlyMoratoriumSurcharge)}/mo)
            </span>
          </p>
        ) : (
          <p className="text-xs text-slate-300">
            Standard reducing balance monthly installment without moratorium delay.
          </p>
        )}
      </div>

      {/* Stacked Visual Ratio Bar */}
      <div className="space-y-2 pt-1">
        <div className="flex justify-between text-[11px] text-slate-300">
          <span className="font-semibold text-slate-200">Total Repayment vs Market Cost:</span>
          <span className="text-emerald-300 font-medium">
            {savingsPct}% Saved vs Bank
          </span>
        </div>

        <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden flex border border-slate-700">
          <div
            style={{ width: `${principalPct}%` }}
            className="bg-slate-400 h-full transition-all"
            title={`Principal: ${formatCurrency(principal)} (${principalPct}%)`}
          />
          <div
            style={{ width: `${interestPct}%` }}
            className="bg-amber-500 h-full transition-all"
            title={`Concessional Interest: ${formatCurrency(concessionalInterest)} (${interestPct}%)`}
          />
          <div
            style={{ width: `${savingsPct}%` }}
            className="bg-emerald-500 h-full transition-all"
            title={`Government Concessional Savings: ${formatCurrency(bankSavings)} (${savingsPct}%)`}
          />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 text-[11px] text-slate-300 pt-1">
          <div className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-400 shrink-0" />
            <span>Principal ({principalPct}%)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shrink-0" />
            <span>Concessional Interest ({interestPct}%)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0" />
            <span>Government Subsidy Savings ({savingsPct}%)</span>
          </div>
        </div>
      </div>

      {/* Financial Details Grid */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800 text-xs">
        <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
          <span className="text-[10px] text-slate-300 uppercase tracking-wider block mb-0.5">
            Gestation Interest Accrual
          </span>
          <span className="text-sm font-bold text-amber-300 font-mono tabular-nums">
            {formatCurrency(result.accruedGestationInterest)}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">No compound penalties</span>
        </div>

        <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
          <span className="text-[10px] text-slate-300 uppercase tracking-wider block mb-0.5">
            Total Concessional Interest
          </span>
          <span className="text-sm font-bold text-amber-300 font-mono tabular-nums">
            {formatCurrency(result.totalConcessionalInterest)}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Over {result.tenureYears} years</span>
        </div>

        <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 col-span-2 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-300 uppercase tracking-wider block mb-0.5">
              Total Repayment (Principal + Interest)
            </span>
            <span className="text-base font-extrabold text-white font-mono tabular-nums">
              {formatCurrency(result.totalPayable)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-emerald-300 font-semibold block">
              Government Advantage
            </span>
            <span className="text-xs text-slate-300">
              {formatCurrency(result.comparisons.bank.lifetimeSavings)} saved
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
