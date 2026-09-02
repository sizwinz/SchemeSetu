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
import { MapPin, Building2, ShieldCheck, Map, List, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function LocatorPage() {
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictHub>(DISTRICT_HUBS[0]);
  const [userCoords, setUserCoords] = useState<GeoCoordinates>(DISTRICT_HUBS[0].coordinates);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [designatedPartner, setDesignatedPartnerState] = useState<ChannelPartner | null>(null);
  const [activeMobileTab, setActiveMobileTab] = useState<"map" | "list">("map");

  const [filters, setFilters] = useState<PartnerFilterOptions>({
    includeHighRisk: false, // Default: strictly exclude high-NPA branches
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
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-amber-500/10 text-amber-600 rounded-lg">
              <Building2 className="h-6 w-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-mosje-navy tracking-tight">
              Authorized Channel Partner Locator & Health Router
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Find solvent SCAs, Public Sector Banks, and RRBs. Institutions with high NPAs (&gt;10%) or exhausted quotas are automatically filtered out.
          </p>
        </div>

        {designatedPartner && (
          <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-semibold">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Designated: {designatedPartner.name}</span>
          </div>
        )}
      </div>

      {/* Filter Toolbar */}
      <PartnerFilter
        selectedDistrict={selectedDistrict}
        onDistrictChange={setSelectedDistrict}
        onUserCoordsChange={setUserCoords}
        filters={filters}
        onFilterChange={setFilters}
        totalFound={rankedPartners.length}
      />

      {/* Mobile Segments Tab Bar */}
      <div className="flex sm:hidden bg-slate-200/80 p-1 rounded-xl text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveMobileTab("map")}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
            activeMobileTab === "map"
              ? "bg-white text-mosje-navy shadow-xs"
              : "text-slate-600"
          }`}
        >
          <Map className="h-3.5 w-3.5" />
          <span>Map View</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveMobileTab("list")}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
            activeMobileTab === "list"
              ? "bg-white text-mosje-navy shadow-xs"
              : "text-slate-600"
          }`}
        >
          <List className="h-3.5 w-3.5" />
          <span>Branch List ({rankedPartners.length})</span>
        </button>
      </div>

      {/* 50/50 Desktop Split View / Tabbed Mobile View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Pane: Interactive Map */}
        <div
          className={`lg:col-span-6 sticky top-20 ${
            activeMobileTab === "list" ? "hidden sm:block" : "block"
          }`}
        >
          <PartnerMap
            partners={rankedPartners}
            userCoords={userCoords}
            selectedPartnerId={selectedPartnerId}
            onSelectPartner={setSelectedPartnerId}
          />
        </div>

        {/* Right Pane: Scrollable Partner Cards List */}
        <div
          className={`lg:col-span-6 space-y-4 ${
            activeMobileTab === "map" ? "hidden sm:block" : "block"
          }`}
        >
          {rankedPartners.length > 0 ? (
            <div className="space-y-3 max-h-[650px] overflow-y-auto pr-1">
              {rankedPartners.map((partner) => (
                <PartnerCard
                  key={partner.id}
                  partner={partner}
                  isSelected={partner.id === selectedPartnerId}
                  isDesignated={designatedPartner?.id === partner.id}
                  onSelect={() => setSelectedPartnerId(partner.id)}
                  onDesignate={handleDesignate}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-full w-12 h-12 mx-auto flex items-center justify-center">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-base text-mosje-navy">
                No Solvent Partners Found in this District
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                All local institutions in this area exceed the statutory 10% NPA limit or have exhausted their credit quotas.
              </p>
              <button
                type="button"
                onClick={() => setFilters({ ...filters, includeHighRisk: true })}
                className="text-xs text-amber-700 hover:text-amber-800 font-semibold underline"
              >
                Inspect High-Risk & Depleted Partners
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
