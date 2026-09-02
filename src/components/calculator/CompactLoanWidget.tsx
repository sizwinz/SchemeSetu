"use client";

import React, { useState } from "react";
import { calculateConcessionalLoan } from "@/lib/calculator/engine";
import { Calculator, ArrowRight, TrendingDown } from "lucide-react";
import Link from "next/link";

interface CompactLoanWidgetProps {
  initialPrincipal?: number;
  initialRate?: number;
  initialTenure?: number;
  initialMoratorium?: number;
}

export function CompactLoanWidget({
  initialPrincipal = 140000,
  initialRate = 6.5,
  initialTenure = 5,
  initialMoratorium = 6,
}: CompactLoanWidgetProps) {
  const [principal, setPrincipal] = useState<number>(initialPrincipal);
  const [moratorium, setMoratorium] = useState<number>(initialMoratorium);

  const result = calculateConcessionalLoan({
    principal,
    annualInterestRate: initialRate,
    tenureYears: initialTenure,
    moratoriumMonths: moratorium,
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="mt-3 p-3.5 bg-slate-900 text-white rounded-xl border border-slate-700 shadow-inner space-y-3 text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Calculator className="h-4 w-4 text-amber-400" />
          <span className="font-bold text-amber-300">Inline EMI Simulator</span>
        </div>
        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1 font-medium">
          <TrendingDown className="h-3 w-3" />
          {result.comparisons.bank.savingsPercentage}% Interest Saved
        </span>
      </div>

      {/* Quick Sliders */}
      <div className="space-y-2.5">
        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-slate-300">Loan Amount:</span>
            <span className="font-bold text-amber-400 font-mono">{formatCurrency(principal)}</span>
          </div>
          <input
            type="range"
            min="20000"
            max="1500000"
            step="10000"
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded appearance-none cursor-pointer accent-amber-500"
          />
        </div>

        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-slate-300">Gestation Moratorium:</span>
            <span className="font-bold text-amber-400 font-mono">{moratorium} Months</span>
          </div>
          <input
            type="range"
            min="0"
            max="12"
            step="1"
            value={moratorium}
            onChange={(e) => setMoratorium(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded appearance-none cursor-pointer accent-amber-500"
          />
        </div>
      </div>

      {/* Metric Breakdown */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
        <div className="bg-slate-800/80 p-2 rounded-lg">
          <span className="text-[9px] text-slate-400 uppercase block">Monthly EMI</span>
          <span className="text-sm font-extrabold text-white font-mono">
            {formatCurrency(result.effectiveMonthlyEMI)}
          </span>
        </div>

        <div className="bg-slate-800/80 p-2 rounded-lg">
          <span className="text-[9px] text-slate-400 uppercase block">Bank Savings</span>
          <span className="text-sm font-extrabold text-emerald-400 font-mono">
            {formatCurrency(result.comparisons.bank.lifetimeSavings)}
          </span>
        </div>
      </div>

      {/* Deep Link to Standalone Calculator */}
      <Link
        href="/calculator"
        className="block text-center w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-semibold rounded-lg border border-slate-700 transition-colors flex items-center justify-center gap-1"
      >
        <span>Open Full Amortization & Export</span>
        <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
