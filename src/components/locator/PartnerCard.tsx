"use client";

import React from "react";
import Link from "next/link";
import { ChannelPartner } from "@/lib/partners/types";
import {
  Building2,
  MapPin,
  Phone,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Clock,
  ArrowRight,
} from "lucide-react";

interface PartnerCardProps {
  partner: ChannelPartner & { distanceKm?: number };
  isSelected: boolean;
  isDesignated: boolean;
  onSelect: () => void;
  onDesignate: (partner: ChannelPartner) => void;
}

export function PartnerCard({
  partner,
  isSelected,
  isDesignated,
  onSelect,
  onDesignate,
}: PartnerCardProps) {
  const isSolvent = partner.healthTier === "SOLVENT";
  const isModerate = partner.healthTier === "MODERATE";
  const isHighRisk = partner.healthTier === "HIGH_RISK";

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${partner.coordinates.lat},${partner.coordinates.lng}`;

  return (
    <div
      onClick={onSelect}
      className={`rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer bg-white text-slate-800 ${
        isSelected
          ? "border-amber-500 shadow-md ring-1 ring-amber-500/50"
          : "border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-sm"
      }`}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
        <div className="space-y-0.5">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
              {partner.institutionType}
            </span>
            {partner.distanceKm !== undefined && (
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-mono tabular-nums">
                {partner.distanceKm} km away
              </span>
            )}
          </div>
          <h4 className="text-sm sm:text-base font-bold text-mosje-navy leading-snug pt-1">
            {partner.name}
          </h4>
          <p className="text-xs text-slate-500">{partner.branchName}</p>
        </div>

        {/* Health Badge */}
        <div
          className={`shrink-0 flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold font-mono tabular-nums border ${
            isSolvent
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : isModerate
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
          title={`Health Score: ${partner.healthScore}/100`}
        >
          {isSolvent ? (
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          ) : (
            <AlertTriangle className="h-3.5 w-3.5" />
          )}
          <span>{partner.healthScore}/100</span>
        </div>
      </div>

      {/* Institutional Health & Quota Details */}
      <div className="grid grid-cols-3 gap-2 py-3 text-xs border-b border-slate-100 font-mono tabular-nums">
        <div>
          <span className="text-[10px] text-slate-400 font-sans block">NPA Ratio</span>
          <span
            className={`font-bold ${
              isHighRisk
                ? "text-red-600"
                : isModerate
                ? "text-amber-600"
                : "text-emerald-700"
            }`}
          >
            {partner.npaPercentage}%
          </span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 font-sans block">Lending Quota</span>
          <span className="font-bold text-slate-800">
            ₹{partner.remainingQuotaLakhs} Lakhs
          </span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 font-sans block">Avg Sanction</span>
          <span className="font-bold text-slate-800 flex items-center gap-1">
            <Clock className="h-3 w-3 text-slate-400" />
            {partner.averageTurnaroundDays}d
          </span>
        </div>
      </div>

      {/* Address & Nodal Officer */}
      <div className="py-2.5 text-xs text-slate-600 space-y-1">
        <div className="flex items-start space-x-1.5">
          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span className="text-[11px] leading-tight text-slate-500">
            {partner.address}, {partner.district}
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-slate-500 font-medium">
            Nodal: {partner.nodalOfficer}
          </span>
          <a
            href={`tel:${partner.contactPhone}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center space-x-1 text-amber-700 hover:text-amber-800 text-[11px] font-semibold"
          >
            <Phone className="h-3 w-3" />
            <span>Call Branch</span>
          </a>
        </div>
      </div>

      {/* Supported Schemes Tags */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1 pb-3">
        <span className="text-[10px] font-semibold text-slate-400 uppercase">Schemes:</span>
        {partner.supportedSchemes.map((code) => (
          <span
            key={code}
            className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200"
          >
            {code}
          </span>
        ))}
      </div>

      {/* Action CTA Buttons */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDesignate(partner);
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
            isDesignated
              ? "bg-emerald-600 text-white shadow-xs"
              : isHighRisk
              ? "bg-slate-200 text-slate-500 hover:bg-slate-300"
              : "bg-mosje-saffron hover:bg-amber-600 text-white shadow-xs cursor-pointer"
          }`}
        >
          {isDesignated ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              <span>Designated Branch</span>
            </>
          ) : (
            <>
              <Building2 className="h-4 w-4" />
              <span>Select as Routing Partner</span>
            </>
          )}
        </button>

        {isDesignated && (
          <Link
            href="/dossier"
            onClick={(e) => e.stopPropagation()}
            className="py-2 px-3 rounded-xl bg-mosje-navy hover:bg-slate-800 text-amber-300 text-xs font-semibold shadow-xs transition-colors flex items-center space-x-1.5"
          >
            <span>Create Dossier</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}

        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-mosje-navy hover:bg-slate-50 transition-colors"
          title="Open driving directions in maps"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
