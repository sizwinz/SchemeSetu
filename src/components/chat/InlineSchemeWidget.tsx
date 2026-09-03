"use client";

import React, { useState } from "react";
import { EvaluationResult, UserProfile } from "@/lib/schemes/types";
import { evaluateEligibility } from "@/lib/schemes/engine";
import { SchemeCard } from "@/components/schemes/SchemeCard";
import { Sliders, ShieldCheck, MapPin, Calculator, AlertCircle } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
      <div className="bg-slate-50 text-slate-900 rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200/80">
          <span className="font-bold text-slate-800 flex items-center gap-1.5">
            <Sliders className="h-3.5 w-3.5 text-amber-600" />
            Adjust Scheme Criteria
          </span>
          <Badge variant="outline" className="text-[10px] text-slate-600">
            Reactive Rules
          </Badge>
        </div>

        <div className="space-y-4 text-xs">
          {/* Cost Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Project Cost:</span>
              <span className="font-bold text-slate-900 font-sans tabular-nums">{formatRupees(cost)}</span>
            </div>
            <Slider
              min={20000}
              max={5000000}
              step={10000}
              value={[cost]}
              onValueChange={([val]) => handleCostChange(val)}
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>₹20K</span>
              <span>₹1.4L (MCF)</span>
              <span>₹50L (Term Loan)</span>
            </div>
          </div>

          {/* Income Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Annual Family Income:</span>
              <span className={`font-bold font-sans tabular-nums ${income > 500000 ? "text-red-600" : "text-slate-900"}`}>
                {formatRupees(income)}
              </span>
            </div>
            <Slider
              min={50000}
              max={600000}
              step={10000}
              value={[income]}
              onValueChange={([val]) => handleIncomeChange(val)}
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>₹50K</span>
              <span className="text-amber-700 font-medium">₹5.00L Limit</span>
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
            <Button variant="default" size="sm" asChild className="flex-1 min-w-[140px] rounded-xl font-bold">
              <Link href="/locator">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                <span>Locate Channel Partners</span>
              </Link>
            </Button>

            <Button variant="outline" size="sm" asChild className="flex-1 min-w-[140px] rounded-xl font-bold">
              <Link href="/calculator">
                <Calculator className="h-3.5 w-3.5 mr-1" />
                <span>Explore EMI Amortization</span>
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-xs text-red-900 space-y-2">
          <div className="flex items-center space-x-2 font-bold">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span>Criteria Out of Current Concessional Bounds</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            {currentResult.rejectionReasons?.[0] ||
              "Your input parameters exceed current statutory subsidy ceilings. Try adjusting project cost or income declarations using the sliders above."}
          </p>
        </div>
      )}
    </div>
  );
}
