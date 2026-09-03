"use client";

import React from "react";
import {
  Mic,
  Languages,
  CheckCircle2,
  Sparkles,
  Calculator,
  FileCheck,
  MapPin,
  QrCode,
  ArrowRight,
} from "lucide-react";

interface Step {
  stepNumber: number;
  title: string;
  subtitle: string;
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: Step[] = [
  {
    stepNumber: 1,
    title: "Voice / Chat Intake",
    subtitle: "Vernacular Speech Input",
    detail: "Voice-first speech input supporting Hindi, English, and regional dialects without forms.",
    icon: Mic,
  },
  {
    stepNumber: 2,
    title: "Multilingual AI",
    subtitle: "Conversational Guidance",
    detail: "Context-aware AI assistant guides applicants across 9 official Indian languages.",
    icon: Languages,
  },
  {
    stepNumber: 3,
    title: "Eligibility Check",
    subtitle: "Statutory Ceiling Audit",
    detail: "Real-time validation against the ₹5.00 Lakhs income ceiling and SC quotas.",
    icon: CheckCircle2,
  },
  {
    stepNumber: 4,
    title: "Scheme Recommendation",
    subtitle: "Match Score & 90% Split",
    detail: "Recommends optimal scheme with confidence score and 90:5:5 funding breakdown.",
    icon: Sparkles,
  },
  {
    stepNumber: 5,
    title: "Financial Calculation",
    subtitle: "Subsidized EMI & Moratorium",
    detail: "Computes 4.0% - 8.0% rates, 3 to 12 months grace periods, and commercial relief.",
    icon: Calculator,
  },
  {
    stepNumber: 6,
    title: "DigiLocker Document Sync",
    subtitle: "Consent-Based Verification",
    detail: "Authenticates caste, income, and business documents without intermediaries.",
    icon: FileCheck,
  },
  {
    stepNumber: 7,
    title: "Solvent Partner Router",
    subtitle: "<10% NPA Institutional Filter",
    detail: "Geo-spatial routing to solvent SCAs, PSBs, RRBs, and MFIs with active quotas.",
    icon: MapPin,
  },
  {
    stepNumber: 8,
    title: "Verifiable Application",
    subtitle: "Level-H QR & PM-SURAJ",
    detail: "Generates cryptographic QR dossier ready for countertop branch verification.",
    icon: QrCode,
  },
];

export function WorkflowJourney() {
  return (
    <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
            End-to-End Beneficiary Architecture
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            The 8-Step SchemeSetu Delivery Journey
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Eliminating offline confusion, misrouted applications, and disbursement bottlenecks from discovery to solvent channel partner disbursal.
          </p>
        </div>

        <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Frictionless Digital Pipeline</span>
        </div>
      </div>

      {/* 8-Step Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {STEPS.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.stepNumber}
              className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all space-y-2.5 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                  Step {step.stepNumber}
                </span>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-900 leading-snug">
                  {step.title}
                </h3>
                <span className="text-[10px] font-semibold text-amber-800 block">
                  {step.subtitle}
                </span>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                {step.detail}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
