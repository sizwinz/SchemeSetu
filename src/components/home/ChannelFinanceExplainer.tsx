"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ArrowRight,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ChannelFinanceExplainer() {
  return (
    <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-7 space-y-6">
      {/* Title & Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
            Problem Statement Context
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            How the Channel Finance System Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            MoSJE (Ministry of Social Justice and Empowerment) and NSFDC (National Scheduled Castes Finance and Development Corporation) do not disburse direct loans to citizens. Concessional credit is strictly routed through authorized Channel Partners. SchemeSetu eliminates misrouted applications by routing only to solvent branches.
          </p>
        </div>

        <Link
          href="/locator"
          className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 transition-colors shrink-0 shadow-2xs group"
        >
          <span>Open Partner Health Map</span>
          <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* The 4 Authorized Channel Partner Types with Full Forms Beside Short Forms */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 1. SCA */}
        <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2.5">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 font-bold text-xs border border-blue-200/60 shrink-0">
              SCA
            </span>
            <h3 className="text-xs font-bold text-slate-900 leading-tight">
              State Channelizing Agencies
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            State-level government corporations designated for Scheduled Caste development, disbursing direct micro-credit and affirmative women schemes.
          </p>
        </div>

        {/* 2. PSB */}
        <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2.5">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 font-bold text-xs border border-emerald-200/60 shrink-0">
              PSB
            </span>
            <h3 className="text-xs font-bold text-slate-900 leading-tight">
              Public Sector Banks
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Nationalized commercial banks (SBI, PNB, Canara Bank) processing medium-to-large Term Loans (up to ₹50 Lakhs) and Education Loans.
          </p>
        </div>

        {/* 3. RRB */}
        <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2.5">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 font-bold text-xs border border-amber-200/60 shrink-0">
              RRB
            </span>
            <h3 className="text-xs font-bold text-slate-900 leading-tight">
              Regional Rural Banks
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Grassroots rural banking institutions servicing agricultural, dairy, and rural transport enterprise loans in semi-urban and rural areas.
          </p>
        </div>

        {/* 4. NBFC-MFI */}
        <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2.5">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-700 font-bold text-xs border border-purple-200/60 shrink-0">
              NBFC-MFI
            </span>
            <h3 className="text-xs font-bold text-slate-900 leading-tight">
              Microfinance Institutions
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Non-Banking Financial Companies accredited for rapid micro-credit (MCF up to ₹1.40L) directly to self-help groups and small vendors.
          </p>
        </div>
      </div>

      {/* The Core Bottleneck & Solution: NPA & Overdue Router */}
      <div className="bg-slate-50 rounded-xl border border-slate-200/90 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-900">
              Why SchemeSetu Filters High-NPA (Non-Performing Assets) and Overdue Burdened Branches
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            When beneficiaries apply to banks with non-performing asset (NPA) rates above 10% or exhausted statutory quotas, applications get stalled or rejected. SchemeSetu calculates a live Solvency Score, automatically routing you only to financially sound institutions with active disbursement quotas.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 text-xs">
          <div className="flex items-center space-x-1.5 bg-white px-3 py-2 rounded-xl border border-emerald-200 text-emerald-800 shadow-2xs">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <span className="font-semibold">Solvent (&lt;10% NPA): Allowed</span>
          </div>

          <div className="flex items-center space-x-1.5 bg-white px-3 py-2 rounded-xl border border-red-200 text-red-700 shadow-2xs">
            <XCircle className="h-4 w-4 text-red-500" />
            <span className="font-semibold">High NPA (&gt;10%): Filtered</span>
          </div>
        </div>
      </div>
    </section>
  );
}
