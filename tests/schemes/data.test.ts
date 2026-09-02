import { describe, it, expect } from "vitest";
import { MOSJE_SCHEMES } from "@/lib/schemes/data";

describe("MoSJE Schemes Dataset Integrity", () => {
  it("should contain all 4 core statutory schemes", () => {
    expect(MOSJE_SCHEMES.length).toBeGreaterThanOrEqual(4);
    const codes = MOSJE_SCHEMES.map((s) => s.code);
    expect(codes).toContain("MCF");
    expect(codes).toContain("TERM_LOAN");
    expect(codes).toContain("MSY");
    expect(codes).toContain("ELS");
  });

  it("should strictly enforce annual family income cap of Rs. 5.00 Lakhs across all schemes", () => {
    MOSJE_SCHEMES.forEach((scheme) => {
      expect(scheme.maxAnnualIncome).toBe(500000);
    });
  });

  it("should ensure NSFDC funding share does not exceed statutory 90% limit", () => {
    MOSJE_SCHEMES.forEach((scheme) => {
      expect(scheme.fundingBreakdown.nsfdcSharePercent).toBeLessThanOrEqual(90);
      expect(scheme.fundingBreakdown.nsfdcSharePercent).toBeGreaterThan(0);
    });
  });

  it("should ensure institutional shares sum exactly to 100%", () => {
    MOSJE_SCHEMES.forEach((scheme) => {
      const { nsfdcSharePercent, channelPartnerSharePercent, promoterContributionPercent } =
        scheme.fundingBreakdown;
      const total = nsfdcSharePercent + channelPartnerSharePercent + promoterContributionPercent;
      expect(total).toBe(100);
    });
  });

  it("should have valid concessional interest rates between 4.0% and 15.0%", () => {
    MOSJE_SCHEMES.forEach((scheme) => {
      expect(scheme.interestRateMin).toBeGreaterThanOrEqual(4.0);
      expect(scheme.interestRateMax).toBeLessThanOrEqual(15.0);
      expect(scheme.interestRateMin).toBeLessThanOrEqual(scheme.interestRateMax);
    });
  });

  it("should correctly configure Mahila Samriddhi Yojana for SC women at 4% rate", () => {
    const msy = MOSJE_SCHEMES.find((s) => s.code === "MSY");
    expect(msy).toBeDefined();
    expect(msy?.targetGroup).toBe("SC_WOMEN");
    expect(msy?.interestRateMin).toBe(4.0);
    expect(msy?.maxProjectCost).toBe(140000);
  });
});
