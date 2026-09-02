"use client";

import React, { useState } from "react";
import { DISTRICT_HUBS } from "@/lib/partners/data";
import { DistrictHub, GeoCoordinates, PartnerFilterOptions } from "@/lib/partners/types";
import { Navigation, MapPin, Building2, Filter, AlertTriangle, ShieldCheck } from "lucide-react";

interface PartnerFilterProps {
  selectedDistrict: DistrictHub;
  onDistrictChange: (hub: DistrictHub) => void;
  onUserCoordsChange: (coords: GeoCoordinates) => void;
  filters: PartnerFilterOptions;
  onFilterChange: (filters: PartnerFilterOptions) => void;
  totalFound: number;
}

export function PartnerFilter({
  selectedDistrict,
  onDistrictChange,
  onUserCoordsChange,
  filters,
  onFilterChange,
  totalFound,
}: PartnerFilterProps) {
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const handleAutoGPS = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        onUserCoordsChange({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        setIsLocating(false);
        setGeoError("Unable to retrieve location. Please select a district hub.");
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleDistrictSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const hub = DISTRICT_HUBS.find((h) => h.id === e.target.value);
    if (hub) {
      onDistrictChange(hub);
      onUserCoordsChange(hub.coordinates);
    }
  };

  const handleInstitutionSelect = (type: string) => {
    onFilterChange({
      ...filters,
      institutionType: type === "ALL" ? undefined : type,
    });
  };

  const toggleHighRisk = () => {
    onFilterChange({
      ...filters,
      includeHighRisk: !filters.includeHighRisk,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm space-y-4">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-amber-500/10 text-amber-600 rounded-lg">
            <Filter className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-mosje-navy">Channel Partner Filter Toolbar</h3>
            <p className="text-[11px] text-slate-500">
              Showing {totalFound} partner branches matching criteria
            </p>
          </div>
        </div>

        {/* High-NPA Filter Toggle */}
        <label className="inline-flex items-center space-x-2 cursor-pointer text-xs font-semibold select-none bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors">
          <input
            type="checkbox"
            checked={!filters.includeHighRisk}
            onChange={toggleHighRisk}
            className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 h-4 w-4 accent-amber-600"
          />
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span className="text-slate-700">Filter High-NPA (&gt;10%) Branches</span>
        </label>
      </div>

      {/* Geolocation Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* District Selector */}
        <div className="sm:col-span-8 flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
          <select
            value={selectedDistrict.id}
            onChange={handleDistrictSelect}
            className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-800"
          >
            {DISTRICT_HUBS.map((hub) => (
              <option key={hub.id} value={hub.id}>
                {hub.name} ({hub.state})
              </option>
            ))}
          </select>
        </div>

        {/* GPS Auto-Detect Button */}
        <div className="sm:col-span-4">
          <button
            type="button"
            onClick={handleAutoGPS}
            disabled={isLocating}
            className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-slate-300 hover:border-amber-500 hover:bg-amber-50 text-slate-700 bg-white transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50"
          >
            <Navigation className={`h-3.5 w-3.5 text-amber-600 ${isLocating ? "animate-spin" : ""}`} />
            <span>{isLocating ? "Detecting GPS..." : "Auto GPS"}</span>
          </button>
        </div>
      </div>

      {geoError && (
        <div className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 flex items-center gap-1.5">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
          <span>{geoError}</span>
        </div>
      )}

      {/* Institution Type Filters */}
      <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar pt-1">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1.5">
          Type:
        </span>
        {[
          { label: "All Types", value: "ALL" },
          { label: "SCA (State Agency)", value: "SCA" },
          { label: "Public Banks (PSB)", value: "PSB" },
          { label: "Rural Banks (RRB)", value: "RRB" },
          { label: "NBFC-MFI", value: "NBFC_MFI" },
        ].map((item) => {
          const isActive =
            (!filters.institutionType && item.value === "ALL") ||
            filters.institutionType === item.value;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => handleInstitutionSelect(item.value)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all shrink-0 ${
                isActive
                  ? "bg-mosje-navy text-amber-300 shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
