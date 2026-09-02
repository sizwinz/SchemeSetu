"use client";

import React, { useState } from "react";
import { ChannelPartner } from "@/lib/partners/types";
import { recalculateNetworkHealth } from "@/lib/admin/engine";
import {
  Users,
  IndianRupee,
  Clock,
  TrendingUp,
  SlidersHorizontal,
  ShieldCheck,
  AlertTriangle,
  Building2,
  Filter,
} from "lucide-react";

interface MinistryGovernanceProps {
  initialPartners: ChannelPartner[];
  totalLeadsCount: number;
  totalSanctionedCr: number;
}

export function MinistryGovernance({
  initialPartners,
  totalLeadsCount,
  totalSanctionedCr,
}: MinistryGovernanceProps) {
  const [npaCeiling, setNpaCeiling] = useState<number>(10.0);
  const [selectedState, setSelectedState] = useState<string>("ALL");

  const healthSummary = recalculateNetworkHealth(initialPartners, npaCeiling);

  const availableStates = Array.from(
    new Set(initialPartners.map((p) => p.state))
  ).sort();

  const filteredPartners = healthSummary.partners.filter((p) => {
    if (selectedState !== "ALL" && p.state !== selectedState) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 4 Macro KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono tabular-nums">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-sans">National Pre-Screened Leads</span>
            <Users className="h-4 w-4 text-mosje-saffron" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-mosje-navy">
            {(totalLeadsCount * 142).toLocaleString("en-IN")}
          </div>
          <span className="text-[10px] text-emerald-600 font-sans font-semibold">
            +18.4% month-over-month
          </span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-sans">Total Sanctioned Credit</span>
            <IndianRupee className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            ₹{(totalSanctionedCr + 54.8).toFixed(2)} Cr
          </div>
          <span className="text-[10px] text-slate-400 font-sans">
            Under NSFDC Concessional Quota
          </span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-sans">Average Turnaround Speed</span>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">14.2 Days</div>
          <span className="text-[10px] text-emerald-600 font-sans font-semibold">
            Down from 45+ days legacy
          </span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-sans">National Quota Utilization</span>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">68.5%</div>
          <span className="text-[10px] text-slate-400 font-sans">
            ₹31.5 Cr remaining allocation
          </span>
        </div>
      </div>

      {/* Statutory NPA Ceiling Policy Governor */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-amber-500/10 text-amber-600 rounded-lg">
              <SlidersHorizontal className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-mosje-navy">
                Statutory NPA Ceiling Policy Governor
              </h3>
              <p className="text-[11px] text-slate-500">
                Dynamically adjust maximum allowable Non-Performing Asset ratio for channel credit routing
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 font-medium block">Current Threshold</span>
            <span className="text-lg font-black font-mono text-amber-600">
              {npaCeiling.toFixed(1)}% NPA
            </span>
          </div>
        </div>

        {/* Interactive Slider */}
        <div className="space-y-2">
          <input
            type="range"
            min="5.0"
            max="15.0"
            step="0.5"
            value={npaCeiling}
            onChange={(e) => setNpaCeiling(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />

          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>5.0% (Strict Solvency)</span>
            <span className="text-amber-700 font-bold">10.0% (Statutory Default)</span>
            <span>15.0% (Relaxed Tolerance)</span>
          </div>
        </div>

        {/* Real-time Impact Readout */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs flex flex-wrap items-center justify-between gap-3 font-mono tabular-nums">
          <div className="flex items-center space-x-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-600 shrink-0" />
            <span className="text-slate-700 font-sans">Solvent Partners:</span>
            <span className="font-bold text-slate-900">{healthSummary.solventCount} Active</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shrink-0" />
            <span className="text-slate-700 font-sans">Moderate Health:</span>
            <span className="font-bold text-slate-900">{healthSummary.moderateCount} Branches</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-600 shrink-0" />
            <span className="text-slate-700 font-sans">High-Risk (Filtered):</span>
            <span className="font-bold text-red-600">{healthSummary.highRiskCount} Excluded</span>
          </div>
        </div>
      </div>

      {/* National Partner Solvency Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-mosje-navy">
              National Channel Partner Solvency & Quota Utilization
            </h3>
            <p className="text-[11px] text-slate-500">
              Reviewing {filteredPartners.length} institutions under {npaCeiling.toFixed(1)}% statutory ceiling
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="text-xs font-semibold py-1.5 px-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-700 focus:outline-none"
            >
              <option value="ALL">All States & Union Territories</option>
              {availableStates.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Institution Name</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">District & State</th>
                <th className="py-2.5 px-3 font-mono">NPA %</th>
                <th className="py-2.5 px-3 font-mono">Available Quota</th>
                <th className="py-2.5 px-3">Health Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
              {filteredPartners.map((partner) => (
                <tr key={partner.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-sans font-bold text-slate-900">
                    {partner.name}
                    <span className="text-[10px] text-slate-400 font-mono block font-normal">
                      {partner.branchName}
                    </span>
                  </td>

                  <td className="py-2.5 px-3 font-sans">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {partner.institutionType}
                    </span>
                  </td>

                  <td className="py-2.5 px-3 font-sans text-slate-600">
                    {partner.district}, {partner.state}
                  </td>

                  <td className="py-2.5 px-3">
                    <span
                      className={`font-bold ${
                        partner.npaPercentage > npaCeiling
                          ? "text-red-600"
                          : partner.npaPercentage < 5.0
                          ? "text-emerald-700"
                          : "text-amber-600"
                      }`}
                    >
                      {partner.npaPercentage}%
                    </span>
                  </td>

                  <td className="py-2.5 px-3 text-slate-900 font-bold">
                    ₹{partner.remainingQuotaLakhs}L
                  </td>

                  <td className="py-2.5 px-3 font-sans">
                    {partner.dynamicHealthTier === "SOLVENT" ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Solvent ({partner.healthScore})
                      </span>
                    ) : partner.dynamicHealthTier === "MODERATE" ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        Moderate ({partner.healthScore})
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                        High-Risk / Filtered
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
