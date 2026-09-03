"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SchemeRule, CalculatedFunding } from "@/lib/schemes/types";
import {
  CheckCircle2,
  Percent,
  Calendar,
  IndianRupee,
  Layers,
  Sparkles,
  Calculator,
  MessageSquareText,
  X,
} from "lucide-react";

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
  const [showGuidelines, setShowGuidelines] = useState<boolean>(false);

  const formatRupees = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      <div
        className={`rounded-2xl border transition-all ${
          isPrimaryMatch
            ? "border-amber-500 bg-amber-50/20 shadow-md ring-1 ring-amber-500/30"
            : "border-slate-200 bg-white hover:border-slate-300 shadow-sm"
        } p-5 sm:p-6 flex flex-col justify-between`}
      >
        <div>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              {isPrimaryMatch && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-600 text-white mb-2">
                  <Sparkles className="h-3 w-3" />
                  <span>Optimal Affirmative Match</span>
                </span>
              )}
              <h3 className="text-lg font-bold text-mosje-navy leading-snug">
                {scheme.name}
              </h3>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {scheme.code} &bull; {scheme.category.replace(/_/g, " ")}
              </span>
            </div>

            <div className="flex flex-col items-end shrink-0">
              <div className="flex items-center space-x-1 bg-amber-100/80 text-amber-900 border border-amber-300/60 px-2.5 py-1 rounded-lg text-xs font-bold font-mono">
                <Percent className="h-3.5 w-3.5 text-amber-700" />
                <span>
                  {scheme.interestRateMin === scheme.interestRateMax
                    ? `${scheme.interestRateMin}% p.a.`
                    : `${scheme.interestRateMin}% - ${scheme.interestRateMax}% p.a.`}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 mt-1">Concessional Rate</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 my-3 text-xs font-mono tabular-nums">
            <div className="flex items-center space-x-2 text-slate-600">
              <IndianRupee className="h-4 w-4 text-slate-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-sans">Max Project Cost</p>
                <p className="font-bold text-slate-900">
                  {formatRupees(scheme.maxProjectCost)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-slate-600">
              <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-sans">Tenure &amp; Moratorium</p>
                <p className="font-bold text-slate-800">
                  {scheme.repaymentTenureYears} yrs ({scheme.moratoriumMonths}m grace)
                </p>
              </div>
            </div>
          </div>

          {calculatedFunding && isPrimaryMatch && (
            <div className="mb-4 p-3 bg-white rounded-xl border border-amber-200">
              <p className="text-xs font-semibold text-slate-700 flex items-center gap-1 mb-2">
                <Layers className="h-3.5 w-3.5 text-amber-700" />
                Statutory Institutional Funding Breakdown
              </p>
              <div className="grid grid-cols-3 gap-2 text-[11px] text-center font-mono tabular-nums">
                <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                  <p className="text-slate-500 text-[10px] font-sans">NSFDC (90%)</p>
                  <p className="font-bold text-slate-900">
                    {formatRupees(calculatedFunding.nsfdcAmount)}
                  </p>
                </div>
                <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                  <p className="text-slate-500 text-[10px] font-sans">
                    Partner ({scheme.fundingBreakdown.channelPartnerSharePercent}%)
                  </p>
                  <p className="font-bold text-slate-900">
                    {formatRupees(calculatedFunding.channelPartnerAmount)}
                  </p>
                </div>
                <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                  <p className="text-slate-500 text-[10px] font-sans">
                    Promoter ({scheme.fundingBreakdown.promoterContributionPercent}%)
                  </p>
                  <p className="font-bold text-slate-900">
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

        {/* Action CTAs */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Link
              href={`/calculator?scheme=${scheme.code}`}
              className="flex-1 py-2 px-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Calculator className="h-3.5 w-3.5 text-amber-600" />
              <span>Calculate EMI</span>
            </Link>

            <Link
              href={`/assistant?scheme=${scheme.code}`}
              className="flex-1 py-2 px-2.5 rounded-xl bg-mosje-navy hover:bg-slate-800 text-amber-300 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <MessageSquareText className="h-3.5 w-3.5" />
              <span>Apply in Chat</span>
            </Link>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>Income Limit: &le; ₹5.00 Lakhs p.a.</span>
            <button
              type="button"
              onClick={() => setShowGuidelines(true)}
              className="font-semibold text-amber-700 hover:text-amber-800 cursor-pointer"
            >
              Guidelines &amp; Criteria &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Guidelines Modal */}
      {showGuidelines && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-xl space-y-4 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setShowGuidelines(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 mb-1.5 inline-block">
                {scheme.code}
              </span>
              <h3 className="text-lg font-bold text-slate-900">{scheme.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Official Ministry of Social Justice &amp; Empowerment Concessional Guidelines
              </p>
            </div>

            <div className="space-y-3 text-xs text-slate-600 border-t border-slate-100 pt-3">
              <div>
                <strong className="text-slate-800 block mb-1">Target Beneficiary Demographic:</strong>
                <p className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  {scheme.targetGroup.replace(/_/g, " ")} &bull; SC households with annual family income &le; ₹5,00,000.
                </p>
              </div>

              <div>
                <strong className="text-slate-800 block mb-1">Permitted Enterprise Activities:</strong>
                <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                  {scheme.eligibleActivities.map((act, idx) => (
                    <li key={idx}>{act}</li>
                  ))}
                </ul>
              </div>

              <div>
                <strong className="text-slate-800 block mb-1">Statutory Funding Pattern:</strong>
                <ul className="list-disc list-inside space-y-0.5 text-slate-700 font-mono">
                  <li>NSFDC Share: {scheme.fundingBreakdown.nsfdcSharePercent}%</li>
                  <li>Channel Partner Share: {scheme.fundingBreakdown.channelPartnerSharePercent}%</li>
                  <li>Promoter Contribution: {scheme.fundingBreakdown.promoterContributionPercent}%</li>
                </ul>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-100">
              <Link
                href={`/locator?scheme=${scheme.code}`}
                className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
              >
                Locate Channel Branch
              </Link>
              <Link
                href={`/calculator?scheme=${scheme.code}`}
                className="px-4 py-2 rounded-xl bg-mosje-navy text-amber-300 text-xs font-bold hover:bg-slate-800 cursor-pointer"
              >
                Calculate EMI
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
