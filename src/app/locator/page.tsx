"use client";

import React, { useState, useEffect } from "react";
import { DISTRICT_HUBS, PRESEEDED_PARTNERS } from "@/lib/partners/data";
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
import { MapPin, Building2, ShieldCheck, Map, List, CheckCircle2, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LocatorPage() {
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictHub>(DISTRICT_HUBS[0]);
  const [userCoords, setUserCoords] = useState<GeoCoordinates>(DISTRICT_HUBS[0].coordinates);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [designatedPartner, setDesignatedPartnerState] = useState<ChannelPartner | null>(null);
  const [activeMobileTab, setActiveMobileTab] = useState<"map" | "list">("map");

  const [filters, setFilters] = useState<PartnerFilterOptions>({
    includeHighRisk: false,
  });

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
    <div className="space-y-4 sm:space-y-6 max-w-[1600px] mx-auto pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 2xl:px-12 pt-3 sm:pt-4 overflow-x-hidden max-w-full">
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

          <Button variant="sovereign" size="sm" asChild className="rounded-xl shrink-0 self-start sm:self-auto">
            <Link href="/dossier">
              <span>Proceed to Application Dossier</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
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
          />
        </div>

        {/* Right 50% Pane: Partner Cards List */}
        <div
          className={`lg:col-span-6 space-y-4 max-h-[700px] overflow-y-auto pr-1 ${
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
    </div>
  );
}
