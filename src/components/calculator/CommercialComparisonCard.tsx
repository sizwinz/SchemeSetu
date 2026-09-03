"use client";

import React from "react";
import { CommercialComparison } from "@/lib/calculator/types";
import { Building2, Landmark, TrendingDown } from "lucide-react";
import { CountUp } from "@/components/reactbits/CountUp";
import { Badge } from "@/components/ui/badge";

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
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            Commercial Lending Comparison
          </h3>
          <p className="text-xs text-slate-500">
            MoSJE concessional finance eliminates predatory high-interest debt traps
          </p>
        </div>
        <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200 text-xs font-semibold">
          <TrendingDown className="h-3 w-3 mr-1" />
          Statutory Relief
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Commercial Bank Card */}
        <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                <Landmark className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{bank.providerName}</h4>
                <p className="text-[10px] text-slate-500">Prime Lending Rate ({bank.annualRate}% p.a.)</p>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] text-blue-700 bg-blue-50/50">
              Commercial
            </Badge>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span className="text-[11px]">Commercial EMI:</span>
              <span className="font-bold text-slate-900 font-sans tabular-nums">{formatCurrency(bank.monthlyEMI)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span className="text-[11px]">Concessional EMI:</span>
              <span className="font-semibold text-emerald-700 font-sans tabular-nums">
                {formatCurrency(effectiveConcessionalEMI)}
              </span>
            </div>
            <div className="flex justify-between text-emerald-700 pt-1 border-t border-slate-200/60 font-bold">
              <span className="text-[11px]">Lifetime Relief:</span>
              <span className="font-sans tabular-nums">
                <CountUp to={bank.lifetimeSavings} prefix="₹" duration={0.8} />
              </span>
            </div>
          </div>
        </div>

        {/* Commercial NBFC / MFI Card */}
        <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-red-100 text-red-700 rounded-lg">
                <Building2 className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{nbfc.providerName}</h4>
                <p className="text-[10px] text-slate-500">Unregulated MFI Rate ({nbfc.annualRate}% p.a.)</p>
              </div>
            </div>
            <Badge variant="destructive" className="text-[10px]">
              High Risk
            </Badge>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span className="text-[11px]">NBFC / MFI EMI:</span>
              <span className="font-bold text-slate-900 font-sans tabular-nums">{formatCurrency(nbfc.monthlyEMI)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span className="text-[11px]">Concessional EMI:</span>
              <span className="font-semibold text-emerald-700 font-sans tabular-nums">
                {formatCurrency(effectiveConcessionalEMI)}
              </span>
            </div>
            <div className="flex justify-between text-emerald-700 pt-1 border-t border-slate-200/60 font-bold">
              <span className="text-[11px]">Lifetime Relief:</span>
              <span className="font-sans tabular-nums">
                <CountUp to={nbfc.lifetimeSavings} prefix="₹" duration={0.8} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
