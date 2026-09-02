"use client";

import React from "react";
import { LoanParameters } from "@/lib/calculator/types";
import { Sliders, Sparkles, Clock, Percent, IndianRupee, Calendar } from "lucide-react";

interface LoanSlidersProps {
  params: LoanParameters;
  onChange: (updated: LoanParameters) => void;
}

interface PresetOption {
  label: string;
  params: Partial<LoanParameters>;
}

const PRESETS: PresetOption[] = [
  {
    label: "Mahila Samriddhi (MSY 4%)",
    params: { principal: 140000, annualInterestRate: 4.0, tenureYears: 3, moratoriumMonths: 6 },
  },
  {
    label: "Micro Credit (MCF ₹1.40L)",
    params: { principal: 140000, annualInterestRate: 6.5, tenureYears: 5, moratoriumMonths: 6 },
  },
  {
    label: "Term Loan (₹5.00L, 7.5%)",
    params: { principal: 500000, annualInterestRate: 7.5, tenureYears: 5, moratoriumMonths: 12 },
  },
  {
    label: "Education Loan (₹10.00L)",
    params: { principal: 1000000, annualInterestRate: 8.0, tenureYears: 7, moratoriumMonths: 12 },
  },
];

export function LoanSliders({ params, onChange }: LoanSlidersProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleSliderChange = (key: keyof LoanParameters, value: number) => {
    onChange({
      ...params,
      [key]: value,
    });
  };

  const applyPreset = (preset: PresetOption) => {
    onChange({
      ...params,
      ...preset.params,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-amber-500/10 text-amber-600 rounded-lg">
            <Sliders className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-mosje-navy">Loan Parameters</h2>
            <p className="text-xs text-slate-500">Fine-tune principal, concessional rate, and tenure</p>
          </div>
        </div>
      </div>

      {/* Preset Buttons */}
      <div>
        <div className="flex items-center space-x-1.5 mb-2 text-xs font-semibold text-slate-700">
          <Sparkles className="h-3.5 w-3.5 text-amber-600" />
          <span>Statutory Scheme Presets:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => applyPreset(preset)}
              className="text-xs px-3 py-1.5 rounded-full border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 text-slate-700 transition-colors font-medium active:scale-95"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="space-y-5">
        {/* Loan Principal Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <IndianRupee className="h-3.5 w-3.5 text-amber-600" />
              Loan Principal Amount
            </label>
            <span className="font-bold text-sm text-mosje-navy font-mono tabular-nums">
              {formatCurrency(params.principal)}
            </span>
          </div>
          <input
            type="range"
            min="20000"
            max="5000000"
            step="10000"
            value={params.principal}
            onChange={(e) => handleSliderChange("principal", Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>₹20K (Micro)</span>
            <span>₹1.40L (MCF Limit)</span>
            <span>₹50L (Term Loan Limit)</span>
          </div>
        </div>

        {/* Concessional Interest Rate Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Percent className="h-3.5 w-3.5 text-amber-600" />
              Concessional Interest Rate
            </label>
            <span className="font-bold text-sm text-mosje-navy font-mono tabular-nums">
              {params.annualInterestRate.toFixed(1)}% p.a.
            </span>
          </div>
          <input
            type="range"
            min="4.0"
            max="10.0"
            step="0.5"
            value={params.annualInterestRate}
            onChange={(e) => handleSliderChange("annualInterestRate", Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>4.0% (MSY Women)</span>
            <span>6.5% (MCF Standard)</span>
            <span>8.0% - 10.0% (Cap)</span>
          </div>
        </div>

        {/* Repayment Tenure Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-amber-600" />
              Repayment Tenure
            </label>
            <span className="font-bold text-sm text-mosje-navy font-mono tabular-nums">
              {params.tenureYears} Years ({params.tenureYears * 12} Months)
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={params.tenureYears}
            onChange={(e) => handleSliderChange("tenureYears", Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>1 Year</span>
            <span>5 Years (Standard)</span>
            <span>10 Years (Maximum)</span>
          </div>
        </div>

        {/* Moratorium Duration Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-amber-600" />
              Moratorium Gestation Period
            </label>
            <span className="font-bold text-sm text-amber-700 font-mono tabular-nums">
              {params.moratoriumMonths === 0
                ? "No Moratorium (0 Months)"
                : `${params.moratoriumMonths} Months Repayment Holiday`}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="12"
            step="1"
            value={params.moratoriumMonths}
            onChange={(e) => handleSliderChange("moratoriumMonths", Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>0 Months</span>
            <span>6 Months (Standard)</span>
            <span>12 Months (Statutory Max)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
