"use client";

import React, { useState } from "react";
import { DISTRICT_HUBS } from "@/lib/partners/data";
import { DistrictHub, GeoCoordinates, PartnerFilterOptions } from "@/lib/partners/types";
import { calculateHaversineDistance } from "@/lib/partners/engine";
import { Navigation, MapPin, Building2, Filter, AlertTriangle, ShieldCheck, CheckCircle2, X } from "lucide-react";

interface PartnerFilterProps {
  selectedDistrict: DistrictHub;
  onDistrictChange: (hub: DistrictHub) => void;
  onUserCoordsChange: (coords: GeoCoordinates) => void;
  filters: PartnerFilterOptions;
  onFilterChange: (filters: PartnerFilterOptions) => void;
  totalFound: number;
}

function findNearestHub(coords: GeoCoordinates): DistrictHub {
  let nearest = DISTRICT_HUBS[0];
  let minDistance = Infinity;
  for (const hub of DISTRICT_HUBS) {
    const dist = calculateHaversineDistance(coords, hub.coordinates);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = hub;
    }
  }
  return nearest;
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
  const [activeLocationLabel, setActiveLocationLabel] = useState<string | null>(null);

  const applyDetectedCoordinates = (coords: GeoCoordinates, label: string) => {
    const nearestHub = findNearestHub(coords);
    onUserCoordsChange(coords);
    onDistrictChange(nearestHub);
    setActiveLocationLabel(`${label} (Hub: ${nearestHub.name})`);
    setGeoError(null);
  };

  const tryIpFallback = async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/locate");
      if (res.ok) {
        const data = await res.json();
        if (data.success && typeof data.lat === "number" && typeof data.lng === "number") {
          const locName = data.city ? `${data.city}${data.region ? `, ${data.region}` : ""}` : "Network Location";
          applyDetectedCoordinates({ lat: data.lat, lng: data.lng }, locName);
          return true;
        }
      }
    } catch {
      // Fallback failed
    }
    return false;
  };

  const handleAutoGPS = async () => {
    setIsLocating(true);
    setGeoError(null);

    // 1. Try Browser Geolocation API
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 6000,
            maximumAge: 60000,
          });
        });

        applyDetectedCoordinates(
          {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          "Device GPS"
        );
        setIsLocating(false);
        return;
      } catch {
        // Geolocation failed or permission denied, continue to IP fallback
      }
    }

    // 2. Fallback to Edge/IP Geolocation API
    const ipSuccess = await tryIpFallback();
    setIsLocating(false);

    if (!ipSuccess) {
      setGeoError("Unable to auto-detect location. Please select your district from the dropdown list.");
    }
  };

  const handleClearLocation = () => {
    setActiveLocationLabel(null);
    setGeoError(null);
    onUserCoordsChange(selectedDistrict.coordinates);
  };

  const handleDistrictSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const hub = DISTRICT_HUBS.find((h) => h.id === e.target.value);
    if (hub) {
      setActiveLocationLabel(null);
      setGeoError(null);
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
            className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-slate-300 hover:border-amber-500 hover:bg-amber-50 text-slate-700 bg-white transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50 min-h-[44px] cursor-pointer"
          >
            <Navigation className={`h-3.5 w-3.5 text-amber-600 ${isLocating ? "animate-spin" : ""}`} />
            <span>{isLocating ? "Detecting Location..." : "Auto GPS"}</span>
          </button>
        </div>
      </div>

      {activeLocationLabel && (
        <div className="text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-1.5 min-w-0">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="font-semibold truncate">
              Location Detected: {activeLocationLabel}
            </span>
          </div>
          <button
            type="button"
            onClick={handleClearLocation}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-emerald-100 transition-colors shrink-0 cursor-pointer"
            title="Reset to default district"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {geoError && (
        <div className="text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-center gap-1.5">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
          <span>{geoError}</span>
        </div>
      )}

      {/* Institution Type Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 pb-1 touch-pan-x">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
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
              className={`text-xs px-3 py-1.5 min-h-[32px] rounded-full font-medium transition-all shrink-0 cursor-pointer ${
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
