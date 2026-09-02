"use client";

import React, { useState } from "react";
import { UserProfile, EvaluationResult } from "@/lib/schemes/types";
import { evaluateEligibility } from "@/lib/schemes/engine";
import { SchemeCard } from "./SchemeCard";
import { AlertCircle, CheckCircle, HelpCircle, RefreshCcw } from "lucide-react";

export function EligibilityForm() {
  const [income, setIncome] = useState<number>(240000);
  const [cost, setCost] = useState<number>(120000);
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "OTHER">("FEMALE");
  const [isStudent, setIsStudent] = useState<boolean>(false);

  const [result, setResult] = useState<EvaluationResult | null>(() => {
    return evaluateEligibility({
      annualFamilyIncome: 240000,
      estimatedCost: 120000,
      gender: "FEMALE",
    });
  });

  const handleEvaluate = (e: React.FormEvent) => {
    e.preventDefault();
    const profile: UserProfile = {
      annualFamilyIncome: Number(income),
      estimatedCost: Number(cost),
      gender: gender,
      targetGroup: isStudent ? "SC_STUDENTS" : undefined,
      educationLevel: isStudent ? "GRADUATE" : undefined,
    };
    const evalResult = evaluateEligibility(profile);
    setResult(evalResult);
  };

  const handleReset = () => {
    setIncome(240000);
    setCost(120000);
    setGender("FEMALE");
    setIsStudent(false);
    setResult(
      evaluateEligibility({
        annualFamilyIncome: 240000,
        estimatedCost: 120000,
        gender: "FEMALE",
      })
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-mosje-navy">
              Concessional Credit Pre-Screening Engine
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter your family income and required enterprise funding to evaluate statutory MoSJE eligibility.
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-700 px-2 py-1 rounded hover:bg-slate-50"
            title="Reset to sample values"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

        <form onSubmit={handleEvaluate} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Annual Family Income (INR)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  max="10000000"
                  step="10000"
                  value={income}
                  onChange={(e) => setIncome(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <HelpCircle className="h-3 w-3" />
                Statutory limit: Rs. 5,00,000 per annum
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Estimated Project or Education Cost (INR)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  max="10000000"
                  step="10000"
                  value={cost}
                  onChange={(e) => setCost(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Micro loans up to Rs. 1.40L, Term loans up to Rs. 50L
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Beneficiary Gender
              </label>
              <div className="flex space-x-3">
                {(["FEMALE", "MALE", "OTHER"] as const).map((g) => (
                  <label
                    key={g}
                    className={`flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium rounded-lg border cursor-pointer transition-all ${
                      gender === g
                        ? "border-amber-600 bg-amber-50 text-amber-900 font-semibold shadow-xs"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={gender === g}
                      onChange={() => setGender(g)}
                      className="sr-only"
                    />
                    {g === "FEMALE" ? "Female (MSY 4%)" : g === "MALE" ? "Male" : "Other"}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Applicant Category
              </label>
              <div className="flex items-center space-x-3 h-10">
                <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isStudent}
                    onChange={(e) => setIsStudent(e.target.checked)}
                    className="h-4 w-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
                  />
                  <span>Higher Education Student (Eligible for ELS)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-mosje-saffron hover:bg-amber-600 text-white font-semibold py-2.5 px-4 rounded-lg shadow-sm text-sm transition-colors flex items-center justify-center space-x-2"
            >
              <span>Evaluate Scheme Eligibility</span>
            </button>
          </div>
        </form>
      </div>

      {result && (
        <div className="space-y-4">
          {result.isEligible ? (
            <div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4 flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-900">
                    Statutory Criteria Satisfied
                  </h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Your income and project parameters qualify for {result.eligibleSchemes.length}{" "}
                    statutory concessional loan scheme(s). The optimal match is ranked below.
                  </p>
                </div>
              </div>

              {result.primaryScheme && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
                    Recommended Primary Scheme
                  </h3>
                  <SchemeCard
                    scheme={result.primaryScheme}
                    isPrimaryMatch={true}
                    calculatedFunding={result.calculatedFunding}
                  />
                </div>
              )}

              {result.suggestedAlternatives.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">
                    Alternative Qualified Concessional Schemes ({result.suggestedAlternatives.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.suggestedAlternatives.map((alt) => (
                      <SchemeCard key={alt.id} scheme={alt} isPrimaryMatch={false} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-5">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-red-900">
                    No Schemes Match These Criteria
                  </h4>
                  <ul className="mt-2 space-y-1 text-xs text-red-800">
                    {result.rejectionReasons.map((reason, idx) => (
                      <li key={idx}>• {reason}</li>
                    ))}
                  </ul>
                  <p className="text-xs text-slate-600 mt-3">
                    Adjust your project cost or annual income parameters to view alternative concessional programs.
                  </p>
                </div>
              </div>

              {result.suggestedAlternatives.length > 0 && (
                <div className="mt-5 pt-4 border-t border-red-100">
                  <h5 className="text-xs font-semibold text-slate-700 mb-2">
                    Recommended Alternative Programs to Explore:
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {result.suggestedAlternatives.map((alt) => (
                      <SchemeCard key={alt.id} scheme={alt} isPrimaryMatch={false} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
