"use client";

import React, { useState } from "react";
import { EvaluationResult, UserProfile } from "@/lib/schemes/types";
import { evaluateEligibility } from "@/lib/schemes/engine";
import { SchemeCard } from "@/components/schemes/SchemeCard";
import { Sliders, ShieldCheck, MapPin, Calculator, AlertCircle } from "lucide-react";
import Link from "next/link";

interface InlineSchemeWidgetProps {
  initialResult: EvaluationResult;
  initialProfile: UserProfile;
}

export function InlineSchemeWidget({
  initialResult,
  initialProfile,
}: InlineSchemeWidgetProps) {
  const [cost, setCost] = useState<number>(initialProfile.estimatedCost || 140000);
  const [income, setIncome] = useState<number>(
    initialProfile.annualFamilyIncome || 240000
  );

  const [currentResult, setCurrentResult] = useState<EvaluationResult>(initialResult);

  const handleCostChange = (newCost: number) => {
    setCost(newCost);
    const updated = evaluateEligibility({
      ...initialProfile,
      estimatedCost: newCost,
      annualFamilyIncome: income,
    });
    setCurrentResult(updated);
  };

  const handleIncomeChange = (newIncome: number) => {
    setIncome(newIncome);
    const updated = evaluateEligibility({
      ...initialProfile,
      estimatedCost: cost,
      annualFamilyIncome: newIncome,
    });
    setCurrentResult(updated);
  };

  const formatRupees = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="mt-4 space-y-4 pt-3 border-t border-slate-700/60 text-slate-800">
      {/* Interactive Sliders Pane */}
      <div className="bg-slate-900/90 text-white rounded-xl p-3.5 border border-slate-700 shadow-inner">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-semibold text-amber-300 flex items-center gap-1.5">
            <Sliders className="h-3.5 w-3.5" />
            Live In-Chat Criteria Tuning
          </span>
          <span className="text-[10px] text-slate-400">Reactive Rules Engine</span>
        </div>

        <div className="space-y-3 text-xs">
          {/* Cost Slider */}
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-300">Project Cost:</span>
              <span className="font-bold text-amber-400">{formatRupees(cost)}</span>
            </div>
            <input
              type="range"
              min="20000"
              max="5000000"
              step="10000"
              value={cost}
              onChange={(e) => handleCostChange(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[9px] text-slate-400 mt-0.5">
              <span>₹20K (Micro)</span>
              <span>₹1.4L (MCF Cap)</span>
              <span>₹50L (Term Loan)</span>
            </div>
          </div>

          {/* Income Slider */}
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-300">Annual Family Income:</span>
              <span className={`font-bold ${income > 500000 ? "text-red-400" : "text-amber-400"}`}>
                {formatRupees(income)}
              </span>
            </div>
            <input
              type="range"
              min="50000"
              max="600000"
              step="10000"
              value={income}
              onChange={(e) => handleIncomeChange(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[9px] text-slate-400 mt-0.5">
              <span>₹50K</span>
              <span className="text-amber-300 font-medium">₹5.00L (Statutory Limit)</span>
              <span>₹6.00L</span>
            </div>
          </div>
        </div>
      </div>

      {/* Evaluation Results Card */}
      {currentResult.isEligible && currentResult.primaryScheme ? (
        <div>
          <SchemeCard
            scheme={currentResult.primaryScheme}
            isPrimaryMatch={true}
            calculatedFunding={currentResult.calculatedFunding}
          />

          {/* Action CTAs */}
          <div className="mt-3 flex flex-wrap items-center gap-2 pt-1">
            <Link
              href="/locator"
              className="flex-1 min-w-[140px] text-center bg-mosje-saffron hover:bg-amber-600 text-white text-xs font-semibold py-2 px-3 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <MapPin className="h-3.5 w-3.5" />
              <span>Locate Channel Partners</span>
            </Link>

            <Link
              href="/calculator"
              className="flex-1 min-w-[140px] text-center bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2 px-3 rounded-lg border border-slate-700 shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Calculator className="h-3.5 w-3.5" />
              <span>Explore EMI Amortization</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs text-red-900">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Outside Statutory Eligibility Limits</p>
              <ul className="mt-1 space-y-1 text-[11px] text-red-800">
                {currentResult.rejectionReasons.map((reason, idx) => (
                  <li key={idx}>• {reason}</li>
                ))}
              </ul>
              <p className="mt-2 text-[11px] text-slate-600">
                Slide your income back under ₹5,00,000 to re-qualify for MoSJE concessional support.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
