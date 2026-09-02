import { describe, it, expect } from "vitest";
import {
  evaluateEligibility,
  calculateFundingBreakdown,
  rankSchemesByBenefit,
} from "@/lib/schemes/engine";
import { MOSJE_SCHEMES } from "@/lib/schemes/data";
import { SchemeRule, UserProfile } from "@/lib/schemes/types";

describe("Scheme Evaluation Engine", () => {
  it("should qualify an applicant with annual income exactly at Rs. 5.00 Lakhs", () => {
    const profile: UserProfile = {
      annualFamilyIncome: 500000,
      estimatedCost: 100000,
      gender: "MALE",
    };
    const result = evaluateEligibility(profile);
    expect(result.isEligible).toBe(true);
    expect(result.primaryScheme).toBeDefined();
    expect(result.rejectionReasons.length).toBe(0);
  });

  it("should reject an applicant with income exceeding Rs. 5.00 Lakhs with diagnostic reason", () => {
    const profile: UserProfile = {
      annualFamilyIncome: 550000,
      estimatedCost: 100000,
      gender: "MALE",
    };
    const result = evaluateEligibility(profile);
    expect(result.isEligible).toBe(false);
    expect(result.rejectionReasons.length).toBeGreaterThan(0);
    expect(result.rejectionReasons[0]).toContain(
      "exceeds the statutory MoSJE ceiling of Rs. 5.00 Lakhs"
    );
  });

  it("should suggest Term Loan when project cost exceeds Micro Credit Finance ceiling", () => {
    const profile: UserProfile = {
      annualFamilyIncome: 300000,
      estimatedCost: 350000,
      gender: "MALE",
    };
    const result = evaluateEligibility(profile);
    expect(result.isEligible).toBe(true);
    expect(result.primaryScheme?.code).toBe("TERM_LOAN");
  });

  it("should prioritize Mahila Samriddhi Yojana (4% rate) for SC women over MCF (5% rate)", () => {
    const profile: UserProfile = {
      annualFamilyIncome: 250000,
      estimatedCost: 100000,
      gender: "FEMALE",
    };
    const result = evaluateEligibility(profile);
    expect(result.isEligible).toBe(true);
    expect(result.primaryScheme?.code).toBe("MSY");
    expect(result.primaryScheme?.interestRateMin).toBe(4.0);
  });

  it("should qualify student applicants for Educational Loan Scheme", () => {
    const profile: UserProfile = {
      annualFamilyIncome: 400000,
      estimatedCost: 1500000,
      targetGroup: "SC_STUDENTS",
      educationLevel: "GRADUATE",
      gender: "MALE",
    };
    const result = evaluateEligibility(profile);
    expect(result.isEligible).toBe(true);
    const hasELS = result.eligibleSchemes.some((s) => s.code === "ELS");
    expect(hasELS).toBe(true);
  });

  it("should calculate exact institutional funding breakdown for Micro Credit Finance", () => {
    const mcfScheme = MOSJE_SCHEMES.find((s) => s.code === "MCF") as SchemeRule;
    const funding = calculateFundingBreakdown(mcfScheme, 100000);
    expect(funding.totalCost).toBe(100000);
    expect(funding.nsfdcAmount).toBe(90000);
    expect(funding.channelPartnerAmount).toBe(10000);
    expect(funding.promoterAmount).toBe(0);
    expect(funding.nsfdcAmount + funding.channelPartnerAmount + funding.promoterAmount).toBe(100000);
  });

  it("should calculate exact institutional funding breakdown for Term Loan", () => {
    const termLoanScheme = MOSJE_SCHEMES.find((s) => s.code === "TERM_LOAN") as SchemeRule;
    const funding = calculateFundingBreakdown(termLoanScheme, 2000000);
    expect(funding.totalCost).toBe(2000000);
    expect(funding.nsfdcAmount).toBe(1800000);
    expect(funding.channelPartnerAmount).toBe(100000);
    expect(funding.promoterAmount).toBe(100000);
    expect(funding.nsfdcAmount + funding.channelPartnerAmount + funding.promoterAmount).toBe(2000000);
  });

  it("should rank schemes strictly by lowest interest rate first", () => {
    const ranked = rankSchemesByBenefit(MOSJE_SCHEMES);
    for (let i = 0; i < ranked.length - 1; i++) {
      expect(ranked[i].interestRateMin).toBeLessThanOrEqual(ranked[i + 1].interestRateMin);
    }
  });
});
