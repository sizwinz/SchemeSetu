"use client";

import React, { useState, useId } from "react";
import Link from "next/link";
import { UserProfile, SchemeRule } from "@/lib/schemes/types";
import { evaluateEligibility, calculateFundingBreakdown } from "@/lib/schemes/engine";
import { useSpeechRecognition } from "@/lib/audio/speechRecognition";
import {
  Sparkles,
  Store,
  Scissors,
  Milk,
  Truck,
  GraduationCap,
  Building2,
  Mic,
  Calculator,
  MapPin,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ActivityOption {
  id: string;
  label: string;
  icon: React.ElementType;
  defaultCost: number;
  category: "business" | "women" | "education";
  description: string;
}

const ACTIVITIES: ActivityOption[] = [
  {
    id: "kirana",
    label: "Retail & Grocery Kiosk",
    icon: Store,
    defaultCost: 120000,
    category: "business",
    description: "Small shop, inventory, or retail stall",
  },
  {
    id: "tailoring",
    label: "Tailoring & Apparel",
    icon: Scissors,
    defaultCost: 140000,
    category: "women",
    description: "Garment fabrication and sewing units",
  },
  {
    id: "dairy",
    label: "Dairy & Livestock",
    icon: Milk,
    defaultCost: 140000,
    category: "business",
    description: "Cattle rearing, milk production & poultry",
  },
  {
    id: "transport",
    label: "Commercial Transport",
    icon: Truck,
    defaultCost: 500000,
    category: "business",
    description: "Cargo auto, e-rickshaw, or commercial vehicle",
  },
  {
    id: "manufacturing",
    label: "Small Workshop / Machinery",
    icon: Building2,
    defaultCost: 1500000,
    category: "business",
    description: "Fabrication tools, equipment, processing",
  },
  {
    id: "education",
    label: "Higher Education / Degree",
    icon: GraduationCap,
    defaultCost: 800000,
    category: "education",
    description: "Professional, medical, engineering & abroad",
  },
];

export function SmartRecommenderWizard() {
  const [selectedActivity, setSelectedActivity] = useState<string>("kirana");
  const [cost, setCost] = useState<number>(120000);
  const [income, setIncome] = useState<number>(240000);
  const [demographic, setDemographic] = useState<"ALL_SC" | "SC_WOMEN" | "SC_STUDENTS">("ALL_SC");

  const costSliderId = useId();
  const incomeSliderId = useId();

  // Voice speech-to-text recognition for vernacular/semi-literate users
  const { isListening, transcript, startListening, stopListening } = useSpeechRecognition({
    language: "hi-IN",
    onResult: (spokenText) => {
      const lower = spokenText.toLowerCase();
      if (/tailor|silai|kapda|सिलाई|दर्जी|कपड़ा/i.test(lower)) {
        setSelectedActivity("tailoring");
        setDemographic("SC_WOMEN");
        setCost(140000);
      } else if (/student|padhai|college|chhatra|छात्र|पढ़ाई|कॉलेज/i.test(lower)) {
        setSelectedActivity("education");
        setDemographic("SC_STUDENTS");
        setCost(800000);
      } else if (/truck|vehicle|gadi|transport|गाड़ी|ट्रक/i.test(lower)) {
        setSelectedActivity("transport");
        setCost(500000);
      } else if (/dairy|doodh|gai|buffalo|दूध|गाय|भैंस/i.test(lower)) {
        setSelectedActivity("dairy");
        setCost(140000);
      } else if (/machine|workshop|karkhana|कारखाना/i.test(lower)) {
        setSelectedActivity("manufacturing");
        setCost(1500000);
      }
    },
  });

  const handleActivitySelect = (activity: ActivityOption) => {
    setSelectedActivity(activity.id);
    setCost(activity.defaultCost);
    if (activity.category === "women") {
      setDemographic("SC_WOMEN");
    } else if (activity.category === "education") {
      setDemographic("SC_STUDENTS");
    } else {
      if (demographic === "SC_STUDENTS") {
        setDemographic("ALL_SC");
      }
    }
  };

  const userProfile: UserProfile = {
    annualFamilyIncome: income,
    estimatedCost: cost,
    targetGroup: demographic,
    gender: demographic === "SC_WOMEN" ? "FEMALE" : undefined,
    educationLevel: demographic === "SC_STUDENTS" ? "GRADUATE" : undefined,
  };

  const evalResult = evaluateEligibility(userProfile);
  const primaryScheme: SchemeRule | undefined = evalResult.primaryScheme;
  const funding = primaryScheme ? calculateFundingBreakdown(primaryScheme, cost) : null;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-7 space-y-5 sm:space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-700">
              <Sparkles className="h-5 w-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Smart Scheme Recommender
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Deliverable 1: Evaluates project type, cost, income, and category to instantly match the statutory MoSJE credit scheme.
          </p>
        </div>

        {/* Voice Input Trigger for Accessibility */}
        <button
          type="button"
          onClick={isListening ? stopListening : startListening}
          className={`w-full sm:w-auto min-h-[44px] flex items-center justify-center space-x-2 px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
            isListening
              ? "bg-amber-100 border-amber-300 text-amber-900 animate-pulse ring-2 ring-amber-300/60"
              : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 shadow-2xs"
          }`}
          title="Speak your enterprise requirements in Hindi or English"
        >
          <Mic className={`h-4 w-4 ${isListening ? "text-amber-700" : "text-amber-600"}`} />
          <span>{isListening ? "Listening... (Boliye)" : "Voice Match (बोलकर बताएं)"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 4 Interactive Input Steps */}
        <div className="lg:col-span-7 space-y-5">
          {/* Step 1: Enterprise Activity */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">
                1. Select Enterprise Activity or Purpose
              </span>
              <span className="text-[11px] text-slate-400">Step 1 of 4</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ACTIVITIES.map((act) => {
                const IconComponent = act.icon;
                const isSelected = selectedActivity === act.id;
                return (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => handleActivitySelect(act)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "border-amber-500 bg-amber-50/50 shadow-2xs"
                        : "border-slate-200 bg-white hover:bg-slate-50/80"
                    }`}
                  >
                    <IconComponent
                      className={`h-4 w-4 mb-2 ${
                        isSelected ? "text-amber-700" : "text-slate-500"
                      }`}
                    />
                    <div>
                      <span className={`text-xs font-bold block leading-tight ${
                        isSelected ? "text-slate-900" : "text-slate-700"
                      }`}>
                        {act.label}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5 line-clamp-1">
                        {act.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Project Cost Slider */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label htmlFor={costSliderId} className="text-xs font-bold text-slate-800 cursor-pointer">
                2. Estimated Total Project / Study Cost
              </label>
              <span className="text-sm font-bold text-slate-900 tabular-nums">
                {formatCurrency(cost)}
              </span>
            </div>

            <Slider
              id={costSliderId}
              min={20000}
              max={5000000}
              step={10000}
              value={[cost]}
              onValueChange={([val]) => setCost(val)}
            />

            <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] text-slate-400">
              <button
                type="button"
                onClick={() => setCost(50000)}
                className="hover:text-slate-700 cursor-pointer py-1"
              >
                ₹50K<span className="hidden sm:inline"> (Micro)</span>
              </button>
              <button
                type="button"
                onClick={() => setCost(140000)}
                className="font-medium text-amber-700 hover:underline cursor-pointer py-1"
              >
                ₹1.40L<span className="hidden sm:inline"> (MCF Cap)</span>
              </button>
              <button
                type="button"
                onClick={() => setCost(500000)}
                className="hover:text-slate-700 cursor-pointer py-1"
              >
                ₹5.00L<span className="hidden sm:inline"> (Medium)</span>
              </button>
              <button
                type="button"
                onClick={() => setCost(5000000)}
                className="font-medium text-slate-600 hover:underline cursor-pointer py-1"
              >
                ₹50.00L<span className="hidden sm:inline"> (Term Cap)</span>
              </button>
            </div>
          </div>

          {/* Step 3: Annual Family Income Slider */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor={incomeSliderId} className="text-xs font-bold text-slate-800 cursor-pointer">
                  3. Annual Family Income
                </label>
                <span className="text-[10px] text-slate-400 block">
                  Statutory ceiling is ₹5.00 Lakhs per annum
                </span>
              </div>
              <span className={`text-sm font-bold tabular-nums ${
                income > 500000 ? "text-red-600" : "text-slate-900"
              }`}>
                {formatCurrency(income)}
              </span>
            </div>

            <Slider
              id={incomeSliderId}
              min={50000}
              max={600000}
              step={10000}
              value={[income]}
              onValueChange={([val]) => setIncome(val)}
            />

            <div className="flex justify-between text-[10px] text-slate-400">
              <span>₹50K</span>
              <span className="hidden sm:inline">₹2.40L (Avg)</span>
              <span className="text-amber-700 font-semibold">₹5.00L Cap</span>
              <span>₹6.00L</span>
            </div>
          </div>

          {/* Step 4: Beneficiary Profile Category */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-slate-800 block">
              4. Beneficiary Category
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDemographic("ALL_SC")}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center min-h-[44px] flex items-center justify-center ${
                  demographic === "ALL_SC"
                    ? "border-amber-500 bg-amber-50/60 text-slate-900 shadow-2xs"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                General SC
              </button>
              <button
                type="button"
                onClick={() => setDemographic("SC_WOMEN")}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center min-h-[44px] flex items-center justify-center ${
                  demographic === "SC_WOMEN"
                    ? "border-amber-500 bg-amber-50/60 text-slate-900 shadow-2xs"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                SC Woman (4% Rate)
              </button>
              <button
                type="button"
                onClick={() => setDemographic("SC_STUDENTS")}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center min-h-[44px] flex items-center justify-center ${
                  demographic === "SC_STUDENTS"
                    ? "border-amber-500 bg-amber-50/60 text-slate-900 shadow-2xs"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                SC Student
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Matched Scheme Recommendation Card */}
        <div className="lg:col-span-5 bg-slate-50 rounded-2xl border border-slate-200/90 p-4 sm:p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Matched Scheme Output
            </span>
            {evalResult.isEligible ? (
              <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200 text-[11px] font-semibold">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Statutorily Eligible
              </Badge>
            ) : (
              <Badge variant="destructive" className="text-[11px]">
                <AlertCircle className="h-3 w-3 mr-1" />
                Exceeds Limits
              </Badge>
            )}
          </div>

          {primaryScheme && evalResult.isEligible ? (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] text-amber-800 uppercase font-bold tracking-wider">
                  {primaryScheme.code} • {primaryScheme.category.replace("_", " ")}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5 leading-snug">
                  {primaryScheme.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Tailored concessional assistance covering up to 90% of your project cost under NSFDC guidelines.
                </p>
              </div>

              {/* Concessional Terms Matrix */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 block">Concessional Rate</span>
                  <span className="text-sm font-bold text-emerald-700 tabular-nums font-sans">
                    {primaryScheme.interestRateMin}% - {primaryScheme.interestRateMax}% p.a.
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 block">Grace Moratorium</span>
                  <span className="text-sm font-bold text-slate-900 tabular-nums font-sans">
                    {primaryScheme.moratoriumMonths} Months
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 block">Repayment Tenure</span>
                  <span className="text-sm font-bold text-slate-900 tabular-nums font-sans">
                    {primaryScheme.repaymentTenureYears} Years
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 block">Max Project Limit</span>
                  <span className="text-sm font-bold text-slate-900 tabular-nums font-sans">
                    {formatCurrency(primaryScheme.maxProjectCost)}
                  </span>
                </div>
              </div>

              {/* Funding Structure Breakdown (Up to 90% Coverage) */}
              {funding && (
                <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-2">
                  <span className="text-[11px] font-bold text-slate-700 block">
                    Funding Breakdown Structure
                  </span>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">NSFDC (Government Share - Up to 90%):</span>
                      <span className="font-bold text-slate-900 tabular-nums font-sans">
                        {formatCurrency(funding.nsfdcAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Channel Partner Bank Share (5%):</span>
                      <span className="font-medium text-slate-700 tabular-nums font-sans">
                        {formatCurrency(funding.channelPartnerAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Promoter / Applicant Share (5%):</span>
                      <span className="font-medium text-slate-700 tabular-nums font-sans">
                        {formatCurrency(funding.promoterAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Connected Pipeline Direct Actions */}
              <div className="space-y-2 pt-1">
                <Link
                  href={`/calculator?scheme=${primaryScheme.code}&amount=${funding?.totalCost || cost}&rate=${primaryScheme.interestRateMin}&tenure=${primaryScheme.repaymentTenureYears}`}
                  className="w-full min-h-[44px] py-2.5 px-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center justify-between transition-colors shadow-xs group"
                >
                  <div className="flex items-center space-x-2">
                    <Calculator className="h-4 w-4 text-amber-100" />
                    <span>Simulate Projected EMI &amp; Moratorium</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-amber-100 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
                </Link>

                <Link
                  href={`/locator?category=${primaryScheme.code}&amount=${funding?.totalCost || cost}`}
                  className="w-full min-h-[44px] py-2.5 px-3 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-amber-600" />
                    <span>Find Solvent Channel Partner Branch</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-700 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/80 space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-amber-800 font-bold">
                <AlertCircle className="h-4 w-4" />
                <span>Eligibility Ceiling Exceeded</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                {evalResult.rejectionReasons[0] ||
                  "The entered income or project cost exceeds statutory MoSJE concessional ceilings. Family annual income must not exceed ₹5.00 Lakhs."}
              </p>
              <p className="text-slate-500 text-[11px] pt-1">
                Tip: Adjust your annual income slider below ₹5.00 Lakhs or reduce project cost to evaluate eligible schemes.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
