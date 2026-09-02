import React from "react";
import { SchemeRule, CalculatedFunding } from "@/lib/schemes/types";
import { CheckCircle2, Percent, Calendar, IndianRupee, Layers } from "lucide-react";

interface SchemeCardProps {
  scheme: SchemeRule;
  isPrimaryMatch?: boolean;
  calculatedFunding?: CalculatedFunding;
}

export function SchemeCard({
  scheme,
  isPrimaryMatch = false,
  calculatedFunding,
}: SchemeCardProps) {
  const formatRupees = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div
      className={`rounded-xl border transition-all ${
        isPrimaryMatch
          ? "border-amber-500 bg-amber-50/20 shadow-md ring-1 ring-amber-500/30"
          : "border-slate-200 bg-white hover:border-slate-300 shadow-sm"
      } p-5 sm:p-6 flex flex-col justify-between`}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            {isPrimaryMatch && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-600 text-white mb-2">
                Optimal Match (Lowest Rate & High Subsidy)
              </span>
            )}
            <h3 className="text-lg font-bold text-mosje-navy leading-snug">
              {scheme.name}
            </h3>
            <span className="text-xs font-medium text-slate-700 uppercase tracking-wider">
              {scheme.code} • {scheme.category.replace(/_/g, " ")}
            </span>
          </div>

          <div className="flex flex-col items-end shrink-0">
            <div className="flex items-center space-x-1 bg-amber-100/70 text-amber-900 border border-amber-300/50 px-2.5 py-1 rounded-md text-xs font-bold">
              <Percent className="h-3.5 w-3.5 text-amber-700" />
              <span>
                {scheme.interestRateMin === scheme.interestRateMax
                  ? `${scheme.interestRateMin}% p.a.`
                  : `${scheme.interestRateMin}% - ${scheme.interestRateMax}% p.a.`}
              </span>
            </div>
            <span className="text-[10px] text-slate-700 mt-1">Concessional Rate</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 my-3 text-xs">
          <div className="flex items-center space-x-2 text-slate-600">
            <IndianRupee className="h-4 w-4 text-slate-500 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-600">Max Project Cost</p>
              <p className="font-semibold text-slate-800">
                {formatRupees(scheme.maxProjectCost)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-slate-600">
            <Calendar className="h-4 w-4 text-slate-500 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-600">Repayment & Moratorium</p>
              <p className="font-semibold text-slate-800">
                {scheme.repaymentTenureYears} yrs ({scheme.moratoriumMonths} mo. moratorium)
              </p>
            </div>
          </div>
        </div>

        {calculatedFunding && isPrimaryMatch && (
          <div className="mb-4 p-3 bg-white rounded-lg border border-amber-200">
            <p className="text-xs font-semibold text-slate-700 flex items-center gap-1 mb-2">
              <Layers className="h-3.5 w-3.5 text-amber-700" />
              Statutory Institutional Funding Breakdown
            </p>
            <div className="grid grid-cols-3 gap-2 text-[11px] text-center">
              <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
                <p className="text-slate-600 text-[10px]">NSFDC (90%)</p>
                <p className="font-bold text-slate-800">
                  {formatRupees(calculatedFunding.nsfdcAmount)}
                </p>
              </div>
              <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
                <p className="text-slate-600 text-[10px]">
                  Partner ({scheme.fundingBreakdown.channelPartnerSharePercent}%)
                </p>
                <p className="font-bold text-slate-800">
                  {formatRupees(calculatedFunding.channelPartnerAmount)}
                </p>
              </div>
              <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
                <p className="text-slate-600 text-[10px]">
                  Promoter ({scheme.fundingBreakdown.promoterContributionPercent}%)
                </p>
                <p className="font-bold text-slate-800">
                  {formatRupees(calculatedFunding.promoterAmount)}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-1.5 mt-2">
          <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
            Key Affirmative Benefits
          </p>
          <ul className="space-y-1 text-xs text-slate-700">
            {scheme.keyBenefits.map((benefit, idx) => (
              <li key={idx} className="flex items-start space-x-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
        <span>Income Limit: Rs. 5.00 Lakhs p.a.</span>
        <span className="font-medium text-amber-700 hover:text-amber-800 cursor-pointer">
          View Guidelines &rarr;
        </span>
      </div>
    </div>
  );
}
