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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
      <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="space-y-0.5">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-[10px] font-mono">
              {partner.institutionType}
            </Badge>
            {partner.distanceKm !== undefined && (
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-mono tabular-nums">
                {partner.distanceKm} km away
              </span>
            )}
          </div>
          <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug pt-1">
            {partner.name}
          </h4>
          <p className="text-xs text-slate-500">{partner.branchName}</p>
        </div>

        {/* Health Badge */}
        <Badge
          variant={isSolvent ? "success" : isModerate ? "warning" : "destructive"}
          className="text-xs font-mono font-bold"
          title={`Health Score: ${partner.healthScore}/100`}
        >
          {isSolvent ? (
            <ShieldCheck className="h-3.5 w-3.5 mr-1 text-emerald-600" />
          ) : (
            <AlertTriangle className="h-3.5 w-3.5 mr-1" />
          )}
          <span>{partner.healthScore}/100</span>
        </Badge>
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
      <div className="py-2.5 space-y-1.5 text-xs text-slate-600">
        <div className="flex items-start space-x-2">
          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span className="line-clamp-1">{partner.address}</span>
        </div>

        <div className="flex items-center justify-between text-[11px] pt-1">
          <span className="text-slate-500">
            Officer: <strong className="text-slate-800 font-medium">{partner.nodalOfficer}</strong>
          </span>
          <a
            href={`tel:${partner.contactPhone}`}
            onClick={(e) => e.stopPropagation()}
            className="text-amber-700 hover:text-amber-800 font-mono flex items-center gap-1 font-semibold"
          >
            <Phone className="h-3 w-3" />
            <span>{partner.contactPhone}</span>
          </a>
        </div>
      </div>

      {/* Action Footers */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors"
        >
          <span>Get Directions</span>
          <ExternalLink className="h-3 w-3" />
        </a>

        {isDesignated ? (
          <Badge variant="success" className="py-1 px-2.5 text-xs">
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
            Designated Branch
          </Badge>
        ) : (
          <Button
            size="sm"
            variant="default"
            onClick={(e) => {
              e.stopPropagation();
              onDesignate(partner);
            }}
            className="rounded-xl font-bold"
          >
            Select as Routing Partner
          </Button>
        )}
      </div>
    </div>
  );
}
