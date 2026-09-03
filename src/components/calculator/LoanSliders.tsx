"use client";

import React, { useId } from "react";
import { LoanParameters } from "@/lib/calculator/types";
import { Sliders, Clock, Percent, IndianRupee, Calendar } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface LoanSlidersProps {
  params: LoanParameters;
  onChange: (updated: LoanParameters) => void;
}

const PRINCIPAL_PRESETS = [
  { label: "₹50K", value: 50000 },
  { label: "₹1.40L (MCF)", value: 140000 },
  { label: "₹5.00L", value: 500000 },
  { label: "₹10.00L", value: 1000000 },
  { label: "₹25.00L", value: 2500000 },
  { label: "₹50.00L (TLS)", value: 5000000 },
];

const RATE_PRESETS = [
  { label: "4.0% (MSY)", value: 4.0 },
  { label: "6.5% (MCF)", value: 6.5 },
  { label: "7.5%", value: 7.5 },
  { label: "8.0% (TLS)", value: 8.0 },
  { label: "10.0%", value: 10.0 },
];

const TENURE_PRESETS = [
  { label: "1 Year", value: 1 },
  { label: "3 Years", value: 3 },
  { label: "5 Years", value: 5 },
  { label: "7 Years", value: 7 },
  { label: "10 Years", value: 10 },
];

const MORATORIUM_PRESETS = [
  { label: "0 Mo (Immediate)", value: 0 },
  { label: "3 Months", value: 3 },
  { label: "6 Months (Std)", value: 6 },
  { label: "12 Months (Max)", value: 12 },
];

export function LoanSliders({ params, onChange }: LoanSlidersProps) {
  const principalSliderId = useId();
  const rateSliderId = useId();
  const tenureSliderId = useId();
  const moratoriumSliderId = useId();

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

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-6">
      {/* Card Header */}
      <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
          <Sliders className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            Loan Simulation Parameters
          </h3>
          <p className="text-xs text-slate-500">
            Configure capital, concessional rate, and grace period
          </p>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="space-y-6">
        {/* 1. Loan Principal Slider */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-center text-xs">
            <label htmlFor={principalSliderId} className="font-bold text-slate-800 flex items-center gap-1.5 cursor-pointer">
              <IndianRupee className="h-3.5 w-3.5 text-amber-600" />
              Loan Principal Amount
            </label>
            <span className="font-bold text-base text-slate-900 tabular-nums">
              {formatCurrency(params.principal)}
            </span>
          </div>

          <Slider
            id={principalSliderId}
            min={20000}
            max={5000000}
            step={10000}
            value={[params.principal]}
            onValueChange={([val]) => handleSliderChange("principal", val)}
          />

          {/* Quick Principal Chips */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {PRINCIPAL_PRESETS.map((p) => {
              const isSelected = params.principal === p.value;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => handleSliderChange("principal", p.value)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer font-medium ${
                    isSelected
                      ? "border-amber-500 bg-amber-50 text-amber-900 font-bold"
                      : "border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Concessional Interest Rate Slider */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-center text-xs">
            <label htmlFor={rateSliderId} className="font-bold text-slate-800 flex items-center gap-1.5 cursor-pointer">
              <Percent className="h-3.5 w-3.5 text-amber-600" />
              Concessional Interest Rate
            </label>
            <span className="font-bold text-base text-slate-900 tabular-nums">
              {params.annualInterestRate.toFixed(1)}% p.a.
            </span>
          </div>

          <Slider
            id={rateSliderId}
            min={4.0}
            max={10.0}
            step={0.5}
            value={[params.annualInterestRate]}
            onValueChange={([val]) => handleSliderChange("annualInterestRate", val)}
          />

          {/* Quick Rate Chips */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {RATE_PRESETS.map((r) => {
              const isSelected = Math.abs(params.annualInterestRate - r.value) < 0.1;
              return (
                <button
                  key={r.label}
                  type="button"
                  onClick={() => handleSliderChange("annualInterestRate", r.value)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer font-medium ${
                    isSelected
                      ? "border-amber-500 bg-amber-50 text-amber-900 font-bold"
                      : "border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Repayment Tenure Slider */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-center text-xs">
            <label htmlFor={tenureSliderId} className="font-bold text-slate-800 flex items-center gap-1.5 cursor-pointer">
              <Calendar className="h-3.5 w-3.5 text-amber-600" />
              Repayment Tenure
            </label>
            <span className="font-bold text-base text-slate-900 tabular-nums">
              {params.tenureYears} Years ({params.tenureYears * 12} Months)
            </span>
          </div>

          <Slider
            id={tenureSliderId}
            min={1}
            max={10}
            step={1}
            value={[params.tenureYears]}
            onValueChange={([val]) => handleSliderChange("tenureYears", val)}
          />

          {/* Quick Tenure Chips */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {TENURE_PRESETS.map((t) => {
              const isSelected = params.tenureYears === t.value;
              return (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => handleSliderChange("tenureYears", t.value)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer font-medium ${
                    isSelected
                      ? "border-amber-500 bg-amber-50 text-amber-900 font-bold"
                      : "border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Moratorium Duration Slider */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-center text-xs">
            <label htmlFor={moratoriumSliderId} className="font-bold text-slate-800 flex items-center gap-1.5 cursor-pointer">
              <Clock className="h-3.5 w-3.5 text-amber-600" />
              Gestation / Moratorium Grace Period
            </label>
            <span className="font-bold text-base text-slate-900 tabular-nums">
              {params.moratoriumMonths} Months Grace
            </span>
          </div>

          <Slider
            id={moratoriumSliderId}
            min={0}
            max={12}
            step={3}
            value={[params.moratoriumMonths]}
            onValueChange={([val]) => handleSliderChange("moratoriumMonths", val)}
          />

          {/* Quick Moratorium Chips */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {MORATORIUM_PRESETS.map((m) => {
              const isSelected = params.moratoriumMonths === m.value;
              return (
                <button
                  key={m.label}
                  type="button"
                  onClick={() => handleSliderChange("moratoriumMonths", m.value)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer font-medium ${
                    isSelected
                      ? "border-amber-500 bg-amber-50 text-amber-900 font-bold"
                      : "border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-500 pt-1 leading-relaxed">
            {params.moratoriumMonths > 0
              ? `During the ${params.moratoriumMonths}-month gestation period, you pay ₹0 principal. Only nominal monthly interest is serviced.`
              : "Immediate repayment without moratorium: Principal repayment starts in Month 1."}
          </p>
        </div>
      </div>
    </div>
  );
}
