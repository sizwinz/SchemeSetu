import {
  ChannelPartner,
  GeoCoordinates,
  HealthTier,
  PartnerFilterOptions,
} from "./types";

export function calculateHaversineDistance(
  from: GeoCoordinates,
  to: GeoCoordinates
): number {
  if (from.lat === to.lat && from.lng === to.lng) {
    return 0.0;
  }

  const R = 6371; // Earth radius in kilometers
  const dLat = ((to.lat - from.lat) * Math.PI) / 180;
  const dLon = ((to.lng - from.lng) * Math.PI) / 180;

  const lat1 = (from.lat * Math.PI) / 180;
  const lat2 = (to.lat * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10;
}

export function computeHealthScore(
  npaPercentage: number,
  overdueRate: number,
  remainingQuotaLakhs: number,
  averageTurnaroundDays: number
): { score: number; tier: HealthTier } {
  const quotaRatio = Math.min(100, (remainingQuotaLakhs / 50) * 100);
  const baseScore =
    100 - npaPercentage * 4.5 - overdueRate * 2.5 + quotaRatio * 0.3;
  const turnaroundPenalty = averageTurnaroundDays > 25 ? 10 : 0;
  const score = Math.max(
    0,
    Math.min(100, Math.round(baseScore - turnaroundPenalty))
  );

  let tier: HealthTier;
  if (npaPercentage > 10.0 || remainingQuotaLakhs <= 0) {
    tier = "HIGH_RISK";
  } else if (npaPercentage < 5.0 && score >= 80) {
    tier = "SOLVENT";
  } else {
    tier = "MODERATE";
  }

  return { score, tier };
}

export function filterAndRankPartners(
  partners: ChannelPartner[],
  userCoords: GeoCoordinates,
  options: PartnerFilterOptions = {}
): (ChannelPartner & { distanceKm: number })[] {
  const withDistance = partners.map((partner) => ({
    ...partner,
    distanceKm: calculateHaversineDistance(userCoords, partner.coordinates),
  }));

  const filtered = withDistance.filter((partner) => {
    // 1. High-Risk / NPA >10% Filter
    if (!options.includeHighRisk && partner.healthTier === "HIGH_RISK") {
      return false;
    }

    // 2. Institution Type Filter
    if (
      options.institutionType &&
      options.institutionType !== "ALL" &&
      partner.institutionType !== options.institutionType
    ) {
      return false;
    }

    // 3. Scheme Support Filter
    if (
      options.schemeCode &&
      options.schemeCode !== "ALL" &&
      !partner.supportedSchemes.includes(options.schemeCode)
    ) {
      return false;
    }

    // 4. Max Distance Radius Filter (if specified)
    if (
      options.maxDistanceKm &&
      partner.distanceKm > options.maxDistanceKm
    ) {
      return false;
    }

    return true;
  });

  // Sort by geographic proximity primarily; if within 10km, prioritize health score
  filtered.sort((a, b) => {
    const distDiff = a.distanceKm - b.distanceKm;
    if (Math.abs(distDiff) < 10) {
      return b.healthScore - a.healthScore;
    }
    return distDiff;
  });

  return filtered;
}
