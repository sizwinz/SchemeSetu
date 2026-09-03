"use client";

import React from "react";
import { Landmark, ShieldAlert, ArrowRight, CheckCircle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function OfficialMoSJEBanner() {
  return (
    <div className="w-full bg-slate-50 border-b border-slate-200/90 py-3.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-slate-700">
        {/* Left: Department & Statutory Mandate */}
        <div className="flex items-start sm:items-center space-x-3">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-700 border border-amber-500/20 shrink-0 mt-0.5 sm:mt-0">
            <Landmark className="h-4 w-4" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-1.5 font-semibold text-slate-900">
              <span>Ministry of Social Justice &amp; Empowerment (MoSJE)</span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span className="text-slate-600 font-normal">NSFDC Affirmative Credit Wing</span>
              <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-mono text-slate-600">
                PS-26092
              </Badge>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Statutory Concessional Credit (up to 90% project cost at 4.0% - 8.0% p.a.) for SC entrepreneurs with annual family income up to ₹5.00 Lakhs.
            </p>
          </div>
        </div>

        {/* Right: Channel Finance Regulatory Notice */}
        <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs shrink-0">
          <Info className="h-3.5 w-3.5 text-amber-600 shrink-0" />
          <span className="text-[11px] text-slate-600">
            <strong className="text-slate-800 font-semibold">Channel Finance Rule:</strong> Funds routed strictly via authorized SCAs, PSBs, RRBs &amp; MFIs.
          </span>
        </div>
      </div>
    </div>
  );
}
