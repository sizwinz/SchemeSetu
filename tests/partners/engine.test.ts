import { describe, it, expect } from "vitest";
import {
  calculateHaversineDistance,
  computeHealthScore,
  filterAndRankPartners,
} from "@/lib/partners/engine";
import { PRESEEDED_PARTNERS } from "@/lib/partners/data";

describe("Channel Partner Geolocation & Health Routing Engine", () => {
  describe("Haversine Distance Calculation", () => {
    it("should calculate zero distance for identical coordinates", () => {
      const coords = { lat: 26.8467, lng: 80.9462 };
      expect(calculateHaversineDistance(coords, coords)).toBe(0);
    });

    it("should accurately calculate geographic distance between New Delhi and Lucknow", () => {
      const delhi = { lat: 28.6139, lng: 77.209 };
      const lucknow = { lat: 26.8467, lng: 80.9462 };
      const distance = calculateHaversineDistance(delhi, lucknow);

      // Great circle distance between Delhi and Lucknow is approximately 415-425 km
      expect(distance).toBeGreaterThan(400);
      expect(distance).toBeLessThan(440);
    });
  });

  describe("Institutional Health Scoring Algorithm", () => {
    it("should classify partner as SOLVENT when NPA < 5% and score >= 80", () => {
      const { score, tier } = computeHealthScore(2.4, 3.1, 85.0, 14);
      expect(score).toBeGreaterThanOrEqual(80);
      expect(tier).toBe("SOLVENT");
    });

    it("should classify partner as HIGH_RISK when NPA > 10% regardless of other factors", () => {
      const { tier } = computeHealthScore(12.8, 5.0, 100.0, 15);
      expect(tier).toBe("HIGH_RISK");
    });

    it("should classify partner as HIGH_RISK when remaining quota is depleted (0 Lakhs)", () => {
      const { tier } = computeHealthScore(3.0, 2.0, 0.0, 12);
      expect(tier).toBe("HIGH_RISK");
    });

    it("should classify partner as MODERATE when NPA is between 5% and 10%", () => {
      const { tier } = computeHealthScore(6.5, 7.0, 45.0, 20);
      expect(tier).toBe("MODERATE");
    });
  });

  describe("Partner Filtering and Health-Weighted Ranking", () => {
    const lucknowCoords = { lat: 26.8467, lng: 80.9462 };

    it("should exclude HIGH_RISK / high-NPA partners by default", () => {
      const results = filterAndRankPartners(PRESEEDED_PARTNERS, lucknowCoords);

      const hasHighRisk = results.some((p) => p.healthTier === "HIGH_RISK");
      expect(hasHighRisk).toBe(false);

      const highNpaPartner = results.find((p) => p.id === "lko-psb-02");
      expect(highNpaPartner).toBeUndefined();
    });

    it("should include HIGH_RISK partners when includeHighRisk option is enabled", () => {
      const results = filterAndRankPartners(PRESEEDED_PARTNERS, lucknowCoords, {
        includeHighRisk: true,
      });

      const highNpaPartner = results.find((p) => p.id === "lko-psb-02");
      expect(highNpaPartner).toBeDefined();
      expect(highNpaPartner?.healthTier).toBe("HIGH_RISK");
    });

    it("should filter partners by authorized scheme code", () => {
      const results = filterAndRankPartners(PRESEEDED_PARTNERS, lucknowCoords, {
        schemeCode: "ELS",
      });

      expect(results.length).toBeGreaterThan(0);
      results.forEach((p) => {
        expect(p.supportedSchemes).toContain("ELS");
      });
    });

    it("should filter partners by institution type", () => {
      const scaResults = filterAndRankPartners(PRESEEDED_PARTNERS, lucknowCoords, {
        institutionType: "SCA",
      });

      expect(scaResults.length).toBeGreaterThan(0);
      scaResults.forEach((p) => {
        expect(p.institutionType).toBe("SCA");
      });
    });

    it("should order nearby partners with closest distance first", () => {
      const results = filterAndRankPartners(PRESEEDED_PARTNERS, lucknowCoords);
      expect(results[0].distanceKm).toBeLessThan(10); // Local Lucknow branches are within 10km
      expect(results[0].district).toBe("Lucknow");
    });
  });
});
