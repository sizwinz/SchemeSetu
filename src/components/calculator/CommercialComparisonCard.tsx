"use client";

import React from "react";
import { CommercialComparison } from "@/lib/calculator/types";
import { Building2, Landmark, TrendingDown, ArrowUpRight } from "lucide-react";

interface CommercialComparisonCardProps {
  bank: CommercialComparison;
  nbfc: CommercialComparison;
  effectiveConcessionalEMI: number;
}

export function CommercialComparisonCard({
  bank,
  nbfc,
  effectiveConcessionalEMI,
}: CommercialComparisonCardProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-mosje-navy">
            Commercial Lending Comparison
          </h3>
          <p className="text-xs text-slate-500">
            Why MoSJE concessional finance protects marginalized borrowers from commercial debt burdens
          </p>
        </div>
        <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
          <TrendingDown className="h-3.5 w-3.5" />
          Statutory Savings
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Commercial Bank Card */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-blue-100 text-blue-700 rounded-md">
                <Landmark className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{bank.providerName}</h4>
                <p className="text-[10px] text-slate-500">Prime Lending Rate ({bank.annualRate}% p.a.)</p>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              Standard
            </span>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-200/60 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Commercial Monthly EMI:</span>
              <span className="font-semibold text-slate-800 font-mono tabular-nums">
                {formatCurrency(bank.monthlyEMI)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Total Interest Paid:</span>
              <span className="font-semibold text-slate-800 font-mono tabular-nums">
                {formatCurrency(bank.totalInterest)}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200/80 flex justify-between items-center text-emerald-800 font-semibold bg-emerald-50/80 p-2 rounded-lg">
              <span>Lifetime Interest Saved:</span>
              <span className="text-sm font-extrabold font-mono tabular-nums">
                {formatCurrency(bank.lifetimeSavings)}
              </span>
            </div>
          </div>
        </div>

        {/* NBFC-MFI Card */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-purple-100 text-purple-700 rounded-md">
                <Building2 className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{nbfc.providerName}</h4>
                <p className="text-[10px] text-slate-500">Informal / Micro-credit ({nbfc.annualRate}% p.a.)</p>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
              High-Risk
            </span>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-200/60 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">NBFC Monthly EMI:</span>
              <span className="font-semibold text-slate-800 font-mono tabular-nums">
                {formatCurrency(nbfc.monthlyEMI)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Total Interest Paid:</span>
              <span className="font-semibold text-slate-800 font-mono tabular-nums">
                {formatCurrency(nbfc.totalInterest)}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200/80 flex justify-between items-center text-purple-900 font-semibold bg-purple-50/80 p-2 rounded-lg">
              <span>Lifetime Interest Saved:</span>
              <span className="text-sm font-extrabold font-mono tabular-nums">
                {formatCurrency(nbfc.lifetimeSavings)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
