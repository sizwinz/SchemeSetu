"use client";

import React from "react";
import { Check, X, ShieldAlert, Sparkles, Scale, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PlatformFeature {
  featureName: string;
  pmsuraj: boolean | string;
  myscheme: boolean | string;
  jansamarth: boolean | string;
  haqdarshak: boolean | string;
  schemesetu: boolean | string;
  whyItMatters: string;
}

const COMPARISON_ROWS: PlatformFeature[] = [
  {
    featureName: "MoSJE Channel Finance Integration (SCAs, RRBs, MFIs)",
    pmsuraj: "Partial",
    myscheme: false,
    jansamarth: false,
    haqdarshak: false,
    schemesetu: true,
    whyItMatters: "Concessional funds flow strictly via designated channel partners, not direct commercial branches.",
  },
  {
    featureName: "Operational Partner Health & NPA Filter (<10% Solvency)",
    pmsuraj: false,
    myscheme: false,
    jansamarth: false,
    haqdarshak: false,
    schemesetu: true,
    whyItMatters: "Protects applicants from being routed to branches with stalled quotas or high default ratios.",
  },
  {
    featureName: "Voice-First Multilingual AI (Dialect & Regional Speech)",
    pmsuraj: false,
    myscheme: false,
    jansamarth: false,
    haqdarshak: "Agent Only",
    schemesetu: true,
    whyItMatters: "Empowers semi-literate beneficiaries to discover schemes without typing complex forms.",
  },
  {
    featureName: "Subsidized EMI & Moratorium Gestation Calculator",
    pmsuraj: false,
    myscheme: false,
    jansamarth: "Basic EMI",
    haqdarshak: false,
    schemesetu: true,
    whyItMatters: "Models 4.0% - 8.0% affirmative rates with 3 to 12 months ₹0-principal grace periods.",
  },
  {
    featureName: "Zero-Intermediary Handoff (Tamper-Proof QR Dossier)",
    pmsuraj: false,
    myscheme: false,
    jansamarth: false,
    haqdarshak: false,
    schemesetu: true,
    whyItMatters: "Eliminates third-party commission agents through offline-scannable cryptographic slips.",
  },
  {
    featureName: "DPDP Act, 2023 Data Minimization & Privacy Architecture",
    pmsuraj: "Centralized",
    myscheme: "Centralized",
    jansamarth: "Centralized",
    haqdarshak: "Field Agent",
    schemesetu: true,
    whyItMatters: "Sensitive socio-economic declarations are processed client-side without cloud leakage.",
  },
];

export function CompetitorComparison() {
  const renderCell = (val: boolean | string, isSchemeSetu = false) => {
    if (val === true) {
      return (
        <span className={`inline-flex items-center justify-center ${isSchemeSetu ? "text-emerald-700 font-bold" : "text-emerald-600"}`}>
          <Check className="h-4 w-4" />
        </span>
      );
    }
    if (val === false) {
      return (
        <span className="inline-flex items-center justify-center text-slate-300">
          <X className="h-4 w-4" />
        </span>
      );
    }
    return (
      <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
        {val}
      </span>
    );
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-5">
      {/* Title & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
            Competitive Benchmark &amp; Systemic Gaps
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            How SchemeSetu Compares to Existing Platforms
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Addressing critical functional gaps across PM-SURAJ, myScheme, JanSamarth, and private civic-tech intermediaries.
          </p>
        </div>

        <Badge variant="outline" className="text-xs py-1 px-3 text-amber-900 bg-amber-50 border-amber-200 self-start sm:self-auto shrink-0 font-semibold">
          <Sparkles className="h-3.5 w-3.5 mr-1 text-amber-600" />
          <span>MoSJE Delivery Innovation</span>
        </Badge>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="text-[11px] text-slate-500 uppercase bg-slate-50/80 border-y border-slate-200">
            <tr>
              <th className="px-4 py-3 font-bold text-slate-900 w-1/3">Key Evaluation Criteria</th>
              <th className="px-3 py-3 font-semibold text-center text-slate-600">PM-SURAJ</th>
              <th className="px-3 py-3 font-semibold text-center text-slate-600">myScheme</th>
              <th className="px-3 py-3 font-semibold text-center text-slate-600">JanSamarth</th>
              <th className="px-3 py-3 font-semibold text-center text-slate-600">Haqdarshak</th>
              <th className="px-4 py-3 font-bold text-center text-amber-900 bg-amber-50/80 border-x border-amber-200">
                SchemeSetu (Ours)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {COMPARISON_ROWS.map((row) => (
              <tr key={row.featureName} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-4 py-3.5">
                  <span className="font-bold text-slate-900 block leading-tight">
                    {row.featureName}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {row.whyItMatters}
                  </span>
                </td>
                <td className="px-3 py-3.5 text-center">{renderCell(row.pmsuraj)}</td>
                <td className="px-3 py-3.5 text-center">{renderCell(row.myscheme)}</td>
                <td className="px-3 py-3.5 text-center">{renderCell(row.jansamarth)}</td>
                <td className="px-3 py-3.5 text-center">{renderCell(row.haqdarshak)}</td>
                <td className="px-4 py-3.5 text-center bg-amber-50/40 border-x border-amber-100">
                  {renderCell(row.schemesetu, true)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Note */}
      <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-start space-x-2.5 text-xs text-slate-600">
        <Info className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-800 font-semibold">Institutional Takeaway:</strong> Existing national portals focus primarily on generic form intake or Scheduled Commercial Banks. SchemeSetu is the first dedicated solution engineered specifically for the MoSJE Channel Finance System (SCAs, RRBs, NBFC-MFIs) that algorithmically mitigates institutional default risks before application submission.
        </p>
      </div>
    </section>
  );
}
