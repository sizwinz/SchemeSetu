"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChannelPartner, GeoCoordinates } from "@/lib/partners/types";
import { MapPin, Navigation, ShieldCheck, AlertCircle } from "lucide-react";

interface PartnerMapProps {
  partners: (ChannelPartner & { distanceKm?: number })[];
  userCoords: GeoCoordinates;
  selectedPartnerId?: string | null;
  onSelectPartner: (partnerId: string) => void;
  className?: string;
}

export function PartnerMap({
  partners,
  userCoords,
  selectedPartnerId,
  onSelectPartner,
  className = "h-[450px] sm:h-[600px] w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200",
}: PartnerMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);
  const [isMapReady, setIsMapReady] = useState<boolean>(false);

  // Initialize Leaflet Map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      const L = (await import("leaflet")).default;

      if (!isMounted || !mapContainerRef.current) return;

      // Base map centered on user coordinates
      const map = L.map(mapContainerRef.current, {
        center: [userCoords.lat, userCoords.lng],
        zoom: 12,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
      markersGroupRef.current = markersGroup;
      setIsMapReady(true);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersGroupRef.current = null;
      }
    };
  }, []);

  // Pan map when user coordinates change
  useEffect(() => {
    if (mapInstanceRef.current && isMapReady) {
      mapInstanceRef.current.setView([userCoords.lat, userCoords.lng], 12);
    }
  }, [userCoords, isMapReady]);

  // Update Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current || !isMapReady) return;

    let isMounted = true;

    async function updateMarkers() {
      const L = (await import("leaflet")).default;
      if (!isMounted || !markersGroupRef.current) return;

      markersGroupRef.current.clearLayers();

      // 1. User Location Marker
      const userIcon = L.divIcon({
        className: "custom-health-pin",
        html: `
          <div class="relative flex items-center justify-center">
            <span class="absolute h-8 w-8 rounded-full bg-blue-500/30 animate-ping"></span>
            <div class="h-5 w-5 rounded-full bg-blue-600 border-2 border-white shadow-md flex items-center justify-center text-white">
              <span class="h-2 w-2 rounded-full bg-white"></span>
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      L.marker([userCoords.lat, userCoords.lng], { icon: userIcon })
        .addTo(markersGroupRef.current)
        .bindPopup(`
          <div class="text-xs p-1">
            <strong class="text-slate-900 block font-semibold">Your Location</strong>
            <span class="text-slate-500 text-[10px]">Active search epicenter</span>
          </div>
        `);

      // 2. Partner Branch Markers
      partners.forEach((partner) => {
        const isSelected = partner.id === selectedPartnerId;
        const colorClass =
          partner.healthTier === "SOLVENT"
            ? "bg-emerald-600 text-white border-white"
            : partner.healthTier === "MODERATE"
            ? "bg-amber-500 text-white border-white"
            : "bg-red-600 text-white border-white";

        const ringClass = isSelected
          ? "ring-4 ring-amber-400 scale-110 shadow-lg"
          : "shadow-md hover:scale-105";

        const partnerIcon = L.divIcon({
          className: "custom-health-pin",
          html: `
            <div class="h-7 w-7 rounded-full ${colorClass} ${ringClass} flex items-center justify-center font-bold text-[11px] font-mono border-2 transition-all cursor-pointer">
              ${partner.healthScore}
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([partner.coordinates.lat, partner.coordinates.lng], {
          icon: partnerIcon,
        }).addTo(markersGroupRef.current);

        marker.on("click", () => {
          onSelectPartner(partner.id);
        });

        const popupContent = `
          <div class="p-1 font-sans text-xs space-y-1 min-w-[180px]">
            <div class="font-bold text-slate-900 leading-tight">${partner.name}</div>
            <div class="text-slate-500 text-[10px]">${partner.branchName}</div>
            <div class="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200">
              <span class="font-semibold text-slate-700">Health: ${partner.healthScore}/100</span>
              <span class="text-slate-500">${partner.distanceKm ? `${partner.distanceKm} km` : ""}</span>
            </div>
            <div class="text-[10px] text-slate-600">NPA: ${partner.npaPercentage}% | Quota: ₹${partner.remainingQuotaLakhs}L</div>
          </div>
        `;

        marker.bindPopup(popupContent);

        if (isSelected) {
          marker.openPopup();
        }
      });
    }

    updateMarkers();

    return () => {
      isMounted = false;
    };
  }, [partners, userCoords, selectedPartnerId, onSelectPartner, isMapReady]);

  // Fly to selected partner
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedPartnerId) return;

    const partner = partners.find((p) => p.id === selectedPartnerId);
    if (partner) {
      mapInstanceRef.current.flyTo(
        [partner.coordinates.lat, partner.coordinates.lng],
        14,
        { duration: 0.8 }
      );
    }
  }, [selectedPartnerId, partners]);

  return (
    <div className={`relative ${className} bg-slate-100`}>
      <div ref={mapContainerRef} className="h-full w-full z-0" />

      {/* Floating Map Legend */}
      <div className="absolute top-3 right-3 z-10 bg-white/95 backdrop-blur-xs rounded-xl p-2.5 shadow-md border border-slate-200/80 text-[11px] space-y-1.5 pointer-events-auto">
        <div className="font-bold text-slate-800 text-[10px] uppercase tracking-wider">
          Institutional Health
        </div>
        <div className="flex items-center space-x-2">
          <span className="h-3 w-3 rounded-full bg-emerald-600 shrink-0" />
          <span className="text-slate-700 font-medium">Solvent (Score 80-100)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="h-3 w-3 rounded-full bg-amber-500 shrink-0" />
          <span className="text-slate-700 font-medium">Moderate (50-79)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="h-3 w-3 rounded-full bg-red-600 shrink-0" />
          <span className="text-slate-700 font-medium">High-Risk (NPA &gt; 10%)</span>
        </div>
      </div>
    </div>
  );
}
