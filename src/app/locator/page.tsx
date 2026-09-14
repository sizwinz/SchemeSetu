"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DISTRICT_HUBS, PRESEEDED_PARTNERS } from "@/lib/partners/data";
import { MOSJE_SCHEMES } from "@/lib/schemes/data";
import {
  ChannelPartner,
  DistrictHub,
  GeoCoordinates,
  PartnerFilterOptions,
} from "@/lib/partners/types";
import { filterAndRankPartners } from "@/lib/partners/engine";
import { getDesignatedPartner, setDesignatedPartner } from "@/lib/partners/store";
import { PartnerMap } from "@/components/locator/PartnerMap";
import { PartnerFilter } from "@/components/locator/PartnerFilter";
import { PartnerCard } from "@/components/locator/PartnerCard";
import { ReferralSlipModal } from "@/components/locator/ReferralSlipModal";
import { MapPin, Building2, ShieldCheck, Map, List, CheckCircle2, ArrowRight, FileText, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function normalizeSchemeCode(code: string): string | undefined {
  const upper = code.trim().toUpperCase();
  if (upper === "TLS" || upper === "TERM_LOAN") return "TERM_LOAN";
  if (["MSY", "MCF", "ELS"].includes(upper)) return upper;
  return upper || undefined;
}

function LocatorContent() {
  const searchParams = useSearchParams();
  const rawScheme = searchParams.get("scheme") || searchParams.get("category") || "";
  const rawAmount = searchParams.get("amount") || searchParams.get("cost");
  const rawMoratorium = searchParams.get("moratorium");

  const incomingScheme = rawScheme ? normalizeSchemeCode(rawScheme) : undefined;
  const incomingAmount = rawAmount && !isNaN(Number(rawAmount)) ? Number(rawAmount) : undefined;
  const incomingMoratorium = rawMoratorium && !isNaN(Number(rawMoratorium)) ? Number(rawMoratorium) : undefined;

  const [selectedDistrict, setSelectedDistrict] = useState<DistrictHub>(DISTRICT_HUBS[0]);
  const [userCoords, setUserCoords] = useState<GeoCoordinates>(DISTRICT_HUBS[0].coordinates);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [designatedPartner, setDesignatedPartnerState] = useState<ChannelPartner | null>(null);
  const [showReferralSlip, setShowReferralSlip] = useState<boolean>(false);
  const [activeMobileTab, setActiveMobileTab] = useState<"map" | "list">("map");

  const [filters, setFilters] = useState<PartnerFilterOptions>(() => ({
    includeHighRisk: false,
    schemeCode: incomingScheme,
  }));

  useEffect(() => {
    if (incomingScheme) {
      setFilters((prev) => ({
        ...prev,
        schemeCode: incomingScheme,
      }));
    }
  }, [incomingScheme]);

  const matchedScheme = MOSJE_SCHEMES.find(
    (s) => s.code === filters.schemeCode || (filters.schemeCode === "TERM_LOAN" && s.code === "TERM_LOAN")
  );

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  useEffect(() => {
    const saved = getDesignatedPartner();
    if (saved) {
      setDesignatedPartnerState(saved);
    }
  }, []);

  const rankedPartners = filterAndRankPartners(PRESEEDED_PARTNERS, userCoords, filters);

  const handleDesignate = (partner: ChannelPartner) => {
    setDesignatedPartner(partner);
    setDesignatedPartnerState(partner);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 py-5 sm:py-8 space-y-6 sm:space-y-8 overflow-x-hidden max-w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-amber-500/10 text-amber-600 rounded-xl shrink-0">
              <Building2 className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h1 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight">
              Authorized Channel Partner Locator &amp; Health Router
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Find solvent SCAs, Public Sector Banks, and RRBs. Institutions with high NPAs (&gt;10%) or exhausted quotas are automatically filtered out.
          </p>
        </div>

        {designatedPartner && (
          <Badge variant="success" className="py-1 px-3 text-xs font-semibold">
            <CheckCircle2 className="h-4 w-4 mr-1.5 text-emerald-600 shrink-0" />
            <span>Designated: {designatedPartner.name}</span>
          </Badge>
        )}
      </div>

      {/* Prominent Designated Partner Handoff Banner */}
      {designatedPartner && (
        <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs animate-in fade-in">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl shrink-0">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block text-sm">
                Designated Branch: {designatedPartner.name}
              </span>
              <span className="text-slate-600 text-[11px]">
                {designatedPartner.branchName} &bull; Health Score: {designatedPartner.healthScore}/100 Solvent &bull; Contact: {designatedPartner.nodalOfficer} ({designatedPartner.contactPhone})
              </span>
            </div>
          </div>

          <Button
            variant="sovereign"
            size="sm"
            onClick={() => setShowReferralSlip(true)}
            className="rounded-xl shrink-0 self-start sm:self-auto font-semibold gap-1.5 shadow-xs cursor-pointer"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>View &amp; Print Referral Slip</span>
          </Button>
        </div>
      )}

      {/* Active Scheme Context Indicator (Pipeline Step 3 State Handoff) */}
      {matchedScheme && (
        <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs animate-in fade-in">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">
                  Active Scheme Context: {matchedScheme.name} ({matchedScheme.code})
                </span>
                <Badge variant="outline" className="text-[10px] bg-amber-100/60 text-amber-900 border-amber-300 font-semibold">
                  Pre-Screened Routing
                </Badge>
              </div>
              <span className="text-slate-600 text-[11px] block mt-0.5">
                Filtering solvent branches authorized for {matchedScheme.code} with NPA &lt; 10%
                {incomingAmount ? ` &bull; Project Cost: ${formatCurrency(incomingAmount)}` : ""}
                {incomingMoratorium ? ` &bull; Gestation Grace: ${incomingMoratorium} Months` : ""}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters((prev) => ({ ...prev, schemeCode: undefined }))}
              className="text-xs h-8 px-2.5 rounded-xl border-amber-300 text-amber-900 hover:bg-amber-100 cursor-pointer"
            >
              Reset Scheme Filter
            </Button>
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <PartnerFilter
        selectedDistrict={selectedDistrict}
        onDistrictChange={setSelectedDistrict}
        onUserCoordsChange={setUserCoords}
        filters={filters}
        onFilterChange={setFilters}
        totalFound={rankedPartners.length}
      />

      {/* Mobile/Tablet Segments Tab Bar */}
      <div className="flex lg:hidden bg-slate-100 p-1 rounded-xl text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveMobileTab("map")}
          className={`flex-1 min-h-[44px] py-2 px-3 rounded-lg flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
            activeMobileTab === "map"
              ? "bg-white text-slate-900 shadow-2xs font-bold"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Map className="h-4 w-4" />
          <span>Interactive Map</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMobileTab("list")}
          className={`flex-1 min-h-[44px] py-2 px-3 rounded-lg flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
            activeMobileTab === "list"
              ? "bg-white text-slate-900 shadow-2xs font-bold"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <List className="h-4 w-4" />
          <span>Partner List ({rankedPartners.length})</span>
        </button>
      </div>

      {/* 50/50 Desktop Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 50% Pane: Leaflet Interactive Map */}
        <div
          className={`lg:col-span-6 sticky top-20 ${
            activeMobileTab === "list" ? "hidden lg:block" : "block"
          }`}
        >
          <PartnerMap
            partners={rankedPartners}
            selectedPartnerId={selectedPartnerId}
            onSelectPartner={(partnerId: string) => setSelectedPartnerId(partnerId)}
            userCoords={userCoords}
            className="h-[450px] sm:h-[600px] lg:h-[720px] w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200"
          />
        </div>

        {/* Right 50% Pane: Partner Cards List */}
        <div
          className={`lg:col-span-6 space-y-4 max-h-[720px] overflow-y-auto pr-1 ${
            activeMobileTab === "map" ? "hidden lg:block" : "block"
          }`}
        >
          {rankedPartners.length > 0 ? (
            rankedPartners.map((partner) => (
              <PartnerCard
                key={partner.id}
                partner={partner}
                isSelected={selectedPartnerId === partner.id}
                isDesignated={designatedPartner?.id === partner.id}
                onSelect={() => setSelectedPartnerId(partner.id)}
                onDesignate={handleDesignate}
              />
            ))
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200/90 text-slate-500">
              <ShieldCheck className="h-8 w-8 text-amber-600 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold text-slate-700">
                No solvent institutions found under current filter.
              </p>
              <p className="text-xs mt-1 text-slate-400">
                Try enabling &ldquo;Include Overdue / High-Risk Branches&rdquo; or change search radius.
              </p>
            </div>
          )}
        </div>
      </div>

      {designatedPartner && (
        <ReferralSlipModal
          partner={designatedPartner}
          isOpen={showReferralSlip}
          onClose={() => setShowReferralSlip(false)}
          activeSchemeCode={filters.schemeCode || incomingScheme}
          targetAmount={incomingAmount}
        />
      )}
    </div>
  );
}

export default function LocatorPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1600px] mx-auto px-4 py-12 text-center text-xs text-slate-500">
          Loading Channel Partner Directory...
        </div>
      }
    >
      <LocatorContent />
    </Suspense>
  );
}
