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
import { SpotlightCard } from "@/components/reactbits/SpotlightCard";
import { CountUp } from "@/components/reactbits/CountUp";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

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
      {/* 4 Macro KPI Cards with ReactBits SpotlightCard & CountUp */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono tabular-nums">
        <SpotlightCard
          spotlightColor="rgba(217, 119, 6, 0.08)"
          className="p-4 sm:p-5 space-y-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-sans">National Pre-Screened Leads</span>
            <Users className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            <CountUp to={totalLeadsCount * 142} duration={1.2} />
          </div>
          <span className="text-[10px] text-emerald-600 font-sans font-semibold">
            +18.4% month-over-month
          </span>
        </SpotlightCard>

        <SpotlightCard
          spotlightColor="rgba(16, 185, 129, 0.08)"
          className="p-4 sm:p-5 space-y-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-sans">Total Credit Sanctioned</span>
            <IndianRupee className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-700">
            ₹{totalSanctionedCr.toFixed(2)} Cr
          </div>
          <span className="text-[10px] text-slate-400 font-sans">
            Under 6.5% - 8% Statutory Cap
          </span>
        </SpotlightCard>

        <SpotlightCard
          spotlightColor="rgba(37, 99, 235, 0.08)"
          className="p-4 sm:p-5 space-y-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-sans">Network Solvency Index</span>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            <CountUp
              to={Math.round((healthSummary.solventCount / Math.max(1, initialPartners.length)) * 100)}
              duration={1}
              suffix="%"
            />
          </div>
          <span className="text-[10px] text-emerald-600 font-sans font-semibold">
            {healthSummary.solventCount} of {initialPartners.length} Branches Solvent
          </span>
        </SpotlightCard>

        <SpotlightCard
          spotlightColor="rgba(99, 102, 241, 0.08)"
          className="p-4 sm:p-5 space-y-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-sans">Avg Verification Velocity</span>
            <Clock className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            <CountUp to={6.4} duration={0.8} suffix=" Days" />
          </div>
          <span className="text-[10px] text-emerald-600 font-sans font-semibold">
            -4.2 days vs manual paper flow
          </span>
        </SpotlightCard>
      </div>

      {/* Statutory NPA Ceiling Policy Governor Slider */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-amber-500/10 text-amber-600 rounded-xl">
              <SlidersHorizontal className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
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

        {/* Interactive Shadcn Slider */}
        <div className="space-y-2.5 pt-2">
          <Slider
            min={5.0}
            max={15.0}
            step={0.5}
            value={[npaCeiling]}
            onValueChange={([val]) => setNpaCeiling(val)}
          />

          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>5.0% (Strict Solvency)</span>
            <span className="text-amber-700 font-bold">10.0% (Statutory Default)</span>
            <span>15.0% (Relaxed Tolerance)</span>
          </div>
        </div>

        {/* Real-time Impact Readout with Badges */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs flex flex-wrap items-center justify-between gap-3 font-mono tabular-nums">
          <div className="flex items-center space-x-2">
            <Badge variant="success" className="text-[11px]">
              {healthSummary.solventCount} Active
            </Badge>
            <span className="text-slate-700 font-sans">Solvent Partners</span>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="warning" className="text-[11px]">
              {healthSummary.moderateCount} Branches
            </Badge>
            <span className="text-slate-700 font-sans">Moderate Health</span>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="destructive" className="text-[11px]">
              {healthSummary.highRiskCount} Excluded
            </Badge>
            <span className="text-slate-700 font-sans">High-Risk (Filtered Out)</span>
          </div>

          <div className="text-slate-600 text-[11px] font-sans">
            Filtered Rate:{" "}
            <strong className="text-slate-900 font-mono">
              {((healthSummary.highRiskCount / Math.max(1, initialPartners.length)) * 100).toFixed(0)}%
            </strong>
          </div>
        </div>
      </div>

      {/* National Channel Partner Network Solvency Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-amber-600" />
              National Channel Partner Solvency Table
            </h3>
            <p className="text-xs text-slate-500">
              Live solvency health tiers computed dynamically against current {npaCeiling.toFixed(1)}% statutory ceiling
            </p>
          </div>

          {/* State Filter Dropdown */}
          <div className="flex items-center space-x-2">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="text-xs py-1.5 px-3 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <option value="ALL">All States ({initialPartners.length})</option>
              {availableStates.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-600 font-mono tabular-nums">
            <thead className="text-[11px] text-slate-500 uppercase bg-slate-50/90 font-sans border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-semibold">Institution / Branch</th>
                <th className="px-4 py-3 font-semibold">State</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">NPA Ratio</th>
                <th className="px-4 py-3 font-semibold">Lending Quota</th>
                <th className="px-4 py-3 font-semibold">Turnaround</th>
                <th className="px-4 py-3 font-semibold">Solvency Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPartners.map((partner) => {
                const isSolvent = partner.healthTier === "SOLVENT";
                const isModerate = partner.healthTier === "MODERATE";

                return (
                  <tr key={partner.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-bold text-slate-900 font-sans block">
                        {partner.name}
                      </span>
                      <span className="text-[11px] text-slate-400 font-sans">
                        {partner.branchName}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-sans text-slate-700">{partner.state}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {partner.institutionType}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-800">
                      <span
                        className={
                          partner.npaPercentage > npaCeiling
                            ? "text-red-600"
                            : partner.npaPercentage > npaCeiling * 0.7
                            ? "text-amber-600"
                            : "text-emerald-700"
                        }
                      >
                        {partner.npaPercentage}%
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      ₹{partner.remainingQuotaLakhs} Lakhs
                    </td>
                    <td className="px-4 py-3 text-slate-600 font-sans">
                      {partner.averageTurnaroundDays} days
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={isSolvent ? "success" : isModerate ? "warning" : "destructive"}
                        className="text-[10px] font-sans"
                      >
                        {isSolvent ? (
                          <>
                            <ShieldCheck className="h-3 w-3 mr-1" />
                            Solvent ({partner.healthScore}/100)
                          </>
                        ) : isModerate ? (
                          <>
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Moderate ({partner.healthScore}/100)
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            High Risk ({partner.healthScore}/100)
                          </>
                        )}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
