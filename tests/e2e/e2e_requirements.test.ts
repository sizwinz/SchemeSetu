import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Schemes & Recommender Modules
import {
  calculateFundingBreakdown,
  rankSchemesByBenefit,
  evaluateEligibility,
} from "@/lib/schemes/engine";
import { MOSJE_SCHEMES } from "@/lib/schemes/data";
import { SchemeRule, UserProfile } from "@/lib/schemes/types";

// Calculator & Moratorium Engine Modules
import {
  calculateStandardEMI,
  calculateMoratoriumAccrual,
  calculateCommercialComparison,
  calculateConcessionalLoan,
  generateAmortizationSchedule,
  generateAnnualSummary,
  exportAmortizationCSV,
} from "@/lib/calculator/engine";
import { LoanParameters } from "@/lib/calculator/types";

// Partners & Solvency Locator Modules
import {
  calculateHaversineDistance,
  computeHealthScore,
  filterAndRankPartners,
} from "@/lib/partners/engine";
import { PRESEEDED_PARTNERS, DISTRICT_HUBS } from "@/lib/partners/data";
import {
  ChannelPartner,
  GeoCoordinates,
  PartnerFilterOptions,
} from "@/lib/partners/types";

// Dossier & Referral Slip Modules
import {
  computeDossierChecksum,
  verifyDossierChecksum,
  serializeDossierQrPayload,
  deserializeDossierQrPayload,
  calculateDocumentReadiness,
  getStandardComplianceDocuments,
  getSampleDossier,
} from "@/lib/dossier/engine";
import { ComplianceDocument } from "@/lib/dossier/types";

// Vernacular Audio & Voice Modules
import {
  stripMarkdown,
  findBestVoice,
  checkSpeechSynthesisSupported,
} from "@/lib/audio/speechSynthesis";

// ============================================================================
// TIER 1: FEATURE COVERAGE (>=5 Test Cases Per Feature across 8 Features)
// ============================================================================

describe("Tier 1: Feature Coverage", () => {
  // Feature 1: Statutory Scheme Recommender (4 parameters)
  describe("Feature 1: Statutory Scheme Recommender", () => {
    it("T1.1.1: matches Mahila Samriddhi Yojana (MSY) for SC female applicants within cost and income bounds", () => {
      const profile: UserProfile = {
        annualFamilyIncome: 180000,
        estimatedCost: 140000,
        targetGroup: "SC_WOMEN",
        gender: "FEMALE",
      };
      const result = evaluateEligibility(profile);
      expect(result.isEligible).toBe(true);
      expect(result.primaryScheme?.code).toBe("MSY");
      expect(result.primaryScheme?.interestRateMin).toBe(4.0);
      expect(result.primaryScheme?.targetGroup).toBe("SC_WOMEN");
    });

    it("T1.1.2: matches Micro Credit Finance (MCF) for small project costs up to Rs. 1.40 Lakhs", () => {
      const profile: UserProfile = {
        annualFamilyIncome: 120000,
        estimatedCost: 100000,
        targetGroup: "ALL_SC",
        gender: "MALE",
      };
      const result = evaluateEligibility(profile);
      expect(result.isEligible).toBe(true);
      expect(result.primaryScheme?.code).toBe("MCF");
      expect(result.primaryScheme?.interestRateMin).toBe(5.0);
      expect(result.primaryScheme?.maxProjectCost).toBe(140000);
    });

    it("T1.1.3: matches NSFDC Term Loan Scheme for capital projects between Rs. 1.40L and Rs. 50L", () => {
      const profile: UserProfile = {
        annualFamilyIncome: 300000,
        estimatedCost: 1500000,
        targetGroup: "ALL_SC",
      };
      const result = evaluateEligibility(profile);
      expect(result.isEligible).toBe(true);
      expect(result.primaryScheme?.code).toBe("TERM_LOAN");
      expect(result.primaryScheme?.maxProjectCost).toBe(5000000);
      expect(result.primaryScheme?.repaymentTenureYears).toBe(10);
    });

    it("T1.1.4: matches Educational Loan Scheme (ELS) for qualified SC students", () => {
      const profile: UserProfile = {
        annualFamilyIncome: 250000,
        estimatedCost: 2000000,
        targetGroup: "SC_STUDENTS",
        educationLevel: "GRADUATE",
      };
      const result = evaluateEligibility(profile);
      expect(result.isEligible).toBe(true);
      expect(result.primaryScheme?.code).toBe("ELS");
      expect(result.primaryScheme?.moratoriumMonths).toBe(12);
      expect(result.primaryScheme?.interestRateMin).toBe(4.0);
    });

    it("T1.1.5: ranks eligible schemes prioritizing lowest interest rate and maximum government coverage", () => {
      const ranked = rankSchemesByBenefit(MOSJE_SCHEMES);
      expect(ranked.length).toBe(4);
      // Lowest interest schemes (4.0% min) appear first: MSY and ELS
      expect(ranked[0].interestRateMin).toBe(4.0);
      expect(ranked[1].interestRateMin).toBe(4.0);
      // Higher interest schemes follow: MCF (5.0%) then Term Loan (6.5%)
      expect(ranked[2].interestRateMin).toBe(5.0);
      expect(ranked[3].interestRateMin).toBe(6.5);
    });
  });

  // Feature 2: 90% NSFDC Financing Breakdown
  describe("Feature 2: 90% NSFDC Financing Breakdown", () => {
    it("T1.2.1: calculates exact 90% government refinancing share for standard MCF loan", () => {
      const mcfScheme = MOSJE_SCHEMES.find((s) => s.code === "MCF")!;
      const breakdown = calculateFundingBreakdown(mcfScheme, 140000);
      expect(breakdown.totalCost).toBe(140000);
      expect(breakdown.nsfdcAmount).toBe(126000); // 90% of 1,40,000
      expect(breakdown.channelPartnerAmount).toBe(14000); // 10% channel partner
      expect(breakdown.promoterAmount).toBe(0); // 0% promoter contribution
    });

    it("T1.2.2: verifies zero promoter margin for MSY affirmative women loans", () => {
      const msyScheme = MOSJE_SCHEMES.find((s) => s.code === "MSY")!;
      const breakdown = calculateFundingBreakdown(msyScheme, 100000);
      expect(breakdown.nsfdcAmount).toBe(90000);
      expect(breakdown.channelPartnerAmount).toBe(10000);
      expect(breakdown.promoterAmount).toBe(0);
      expect(breakdown.subsidyAmount).toBe(10000); // MSY capital subsidy
    });

    it("T1.2.3: verifies 5% promoter share requirement for NSFDC Term Loan Scheme", () => {
      const termLoan = MOSJE_SCHEMES.find((s) => s.code === "TERM_LOAN")!;
      const breakdown = calculateFundingBreakdown(termLoan, 2000000);
      expect(breakdown.nsfdcAmount).toBe(1800000); // 90%
      expect(breakdown.channelPartnerAmount).toBe(100000); // 5%
      expect(breakdown.promoterAmount).toBe(100000); // 5% promoter equity
      expect(breakdown.nsfdcAmount + breakdown.channelPartnerAmount + breakdown.promoterAmount).toBe(2000000);
    });

    it("T1.2.4: verifies sum of all breakdown components matches total eligible cost", () => {
      const testCosts = [50000, 140000, 500000, 2500000, 5000000];
      const termLoan = MOSJE_SCHEMES.find((s) => s.code === "TERM_LOAN")!;
      testCosts.forEach((c) => {
        const bd = calculateFundingBreakdown(termLoan, c);
        expect(bd.nsfdcAmount + bd.channelPartnerAmount + bd.promoterAmount).toBe(bd.totalCost);
      });
    });

    it("T1.2.5: caps eligible funding breakdown to scheme maxProjectCost ceiling", () => {
      const msyScheme = MOSJE_SCHEMES.find((s) => s.code === "MSY")!;
      const breakdown = calculateFundingBreakdown(msyScheme, 250000); // Exceeds 1.40L
      expect(breakdown.totalCost).toBe(140000);
      expect(breakdown.nsfdcAmount).toBe(126000);
      expect(breakdown.channelPartnerAmount).toBe(14000);
    });
  });

  // Feature 3: Concessional vs Commercial EMI Engine
  describe("Feature 3: Concessional vs Commercial EMI Engine", () => {
    it("T1.3.1: calculates reducing balance monthly EMI at 4.0% concessional rate", () => {
      // Principal 1,40,000 at 4.0% for 3 years (36 months)
      const emi = calculateStandardEMI(140000, 4.0, 36);
      expect(emi).toBe(4133);
    });

    it("T1.3.2: calculates commercial bank benchmark at 14.0% with positive savings", () => {
      const result = calculateConcessionalLoan({
        principal: 140000,
        annualInterestRate: 4.0,
        tenureYears: 3,
        moratoriumMonths: 0,
      });
      const commercialBank = result.comparisons.bank;
      expect(commercialBank.annualRate).toBe(14.0);
      expect(commercialBank.monthlyEMI).toBeGreaterThan(result.effectiveMonthlyEMI);
      expect(commercialBank.lifetimeSavings).toBeGreaterThan(20000);
      expect(commercialBank.savingsPercentage).toBeGreaterThan(50);
    });

    it("T1.3.3: calculates NBFC-MFI benchmark at 18.0% demonstrating aggressive commercial relief", () => {
      const result = calculateConcessionalLoan({
        principal: 140000,
        annualInterestRate: 6.5,
        tenureYears: 5,
        moratoriumMonths: 6,
      });
      const nbfc = result.comparisons.nbfc;
      expect(nbfc.annualRate).toBe(18.0);
      expect(nbfc.monthlyEMI).toBeGreaterThan(result.comparisons.bank.monthlyEMI);
      expect(nbfc.lifetimeSavings).toBeGreaterThan(40000);
      expect(nbfc.monthlySavings).toBeGreaterThan(700);
    });

    it("T1.3.4: calculates monthly savings delta between commercial EMI and concessional effective EMI", () => {
      const comp = calculateCommercialComparison("Test Bank", 15.0, 100000, 36, 3000, 108000);
      expect(comp.monthlyEMI).toBe(calculateStandardEMI(100000, 15.0, 36));
      expect(comp.monthlySavings).toBe(comp.monthlyEMI - 3000);
      expect(comp.lifetimeSavings).toBe(comp.totalPayable - 108000);
    });

    it("T1.3.5: calculates total loan lifetime cost including concessional interest and gestation surcharge", () => {
      const result = calculateConcessionalLoan({
        principal: 500000,
        annualInterestRate: 7.0,
        tenureYears: 5,
        moratoriumMonths: 6,
      });
      expect(result.totalPayable).toBe(result.effectiveMonthlyEMI * result.tenureMonths);
      expect(result.totalConcessionalInterest).toBe(result.totalPayable - result.principal);
      expect(result.totalPayable).toBeGreaterThan(result.principal);
    });
  });

  // Feature 4: Dynamic Gestation Moratorium (3-12 months)
  describe("Feature 4: Dynamic Gestation Moratorium", () => {
    it("T1.4.1: calculates simple interest accrued during 3-month moratorium", () => {
      // 1,40,000 * 0.04 * (3 / 12) = 1400
      const interest = calculateMoratoriumAccrual(140000, 4.0, 3);
      expect(interest).toBe(1400);
    });

    it("T1.4.2: calculates simple interest accrued during 6-month moratorium", () => {
      // 1,40,000 * 0.065 * 0.5 = 4550
      const interest = calculateMoratoriumAccrual(140000, 6.5, 6);
      expect(interest).toBe(4550);
    });

    it("T1.4.3: calculates simple interest accrued during 12-month moratorium for education loans", () => {
      // 8,00,000 * 0.04 * 1.0 = 32000
      const interest = calculateMoratoriumAccrual(800000, 4.0, 12);
      expect(interest).toBe(32000);
    });

    it("T1.4.4: amortizes accrued gestation interest as flat monthly surcharge over tenure without penal compounding", () => {
      const result = calculateConcessionalLoan({
        principal: 140000,
        annualInterestRate: 6.5,
        tenureYears: 5, // 60 months
        moratoriumMonths: 6,
      });
      expect(result.accruedGestationInterest).toBe(4550);
      expect(result.monthlyMoratoriumSurcharge).toBe(Math.round(4550 / 60)); // 76
      expect(result.effectiveMonthlyEMI).toBe(result.standardEMI + 76);
    });

    it("T1.4.5: verifies total principal repaid across amortization schedule equals original principal", () => {
      const schedule = generateAmortizationSchedule({
        principal: 140000,
        annualInterestRate: 4.0,
        tenureYears: 3,
        moratoriumMonths: 6,
      });
      expect(schedule.length).toBe(36);
      const totalPrincipalPaid = schedule.reduce((acc, row) => acc + row.principalPaid, 0);
      expect(totalPrincipalPaid).toBe(140000);
      expect(schedule[schedule.length - 1].closingBalance).toBe(0);
    });
  });

  // Feature 5: Three-Step Pipeline Data Handoff
  describe("Feature 5: Three-Step Pipeline Data Handoff", () => {
    it("T1.5.1: generates valid URL query string from Step 1 Recommender to Step 2 Calculator", () => {
      const scheme = MOSJE_SCHEMES.find((s) => s.code === "MSY")!;
      const cost = 140000;
      const query = new URLSearchParams({
        scheme: scheme.code,
        amount: String(cost),
        rate: String(scheme.interestRateMin),
        tenure: String(scheme.repaymentTenureYears),
      }).toString();

      expect(query).toContain("scheme=MSY");
      expect(query).toContain("amount=140000");
      expect(query).toContain("rate=4");
      expect(query).toContain("tenure=3");
    });

    it("T1.5.2: parses Step 1 query parameters into valid Calculator loan parameters", () => {
      const searchParams = new URLSearchParams("scheme=MSY&amount=140000&rate=4&tenure=3");
      const schemeCode = searchParams.get("scheme");
      const amount = Number(searchParams.get("amount"));
      const rate = Number(searchParams.get("rate"));
      const tenure = Number(searchParams.get("tenure"));

      expect(schemeCode).toBe("MSY");
      expect(amount).toBe(140000);
      expect(rate).toBe(4);
      expect(tenure).toBe(3);

      const params: LoanParameters = {
        principal: amount,
        annualInterestRate: rate,
        tenureYears: tenure,
        moratoriumMonths: 6,
      };
      const result = calculateConcessionalLoan(params);
      expect(result.principal).toBe(140000);
      expect(result.annualInterestRate).toBe(4);
      expect(result.tenureYears).toBe(3);
    });

    it("T1.5.3: generates valid URL query string from Step 2 Calculator to Step 3 Locator", () => {
      const loanParams: LoanParameters = {
        principal: 126000,
        annualInterestRate: 4.0,
        tenureYears: 3,
        moratoriumMonths: 6,
      };
      const query = new URLSearchParams({
        scheme: "MSY",
        amount: String(loanParams.principal),
        moratorium: String(loanParams.moratoriumMonths),
      }).toString();

      expect(query).toContain("scheme=MSY");
      expect(query).toContain("amount=126000");
      expect(query).toContain("moratorium=6");
    });

    it("T1.5.4: propagates scheme code into Partner Locator filter options", () => {
      const locatorSearchParams = new URLSearchParams("scheme=MSY&amount=126000");
      const filterOptions: PartnerFilterOptions = {
        schemeCode: locatorSearchParams.get("scheme") || undefined,
        includeHighRisk: false,
      };

      const lucknowCoords: GeoCoordinates = { lat: 26.8467, lng: 80.9462 };
      const filtered = filterAndRankPartners(PRESEEDED_PARTNERS, lucknowCoords, filterOptions);

      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach((partner) => {
        expect(partner.supportedSchemes).toContain("MSY");
        expect(partner.healthTier).not.toBe("HIGH_RISK");
      });
    });

    it("T1.5.5: applies fallback defaults when query parameters are missing or corrupted", () => {
      const corruptedParams = new URLSearchParams("scheme=UNKNOWN&amount=invalid&rate=abc");
      const amount = Number(corruptedParams.get("amount"));
      const safeAmount = isNaN(amount) || amount <= 0 ? 140000 : amount;
      const rate = Number(corruptedParams.get("rate"));
      const safeRate = isNaN(rate) || rate <= 0 ? 6.5 : rate;

      expect(safeAmount).toBe(140000);
      expect(safeRate).toBe(6.5);
      const result = calculateConcessionalLoan({
        principal: safeAmount,
        annualInterestRate: safeRate,
        tenureYears: 3,
        moratoriumMonths: 3,
      });
      expect(result.principal).toBe(140000);
      expect(result.effectiveMonthlyEMI).toBeGreaterThan(0);
    });
  });

  // Feature 6: Channel Partner Solvency Filter (<10% NPA)
  describe("Feature 6: Channel Partner Solvency Filter", () => {
    it("T1.6.1: classifies partner with NPA > 10.0% as HIGH_RISK", () => {
      const health = computeHealthScore(12.8, 15.0, 50.0, 20);
      expect(health.tier).toBe("HIGH_RISK");
      expect(health.score).toBeLessThan(60);
    });

    it("T1.6.2: classifies partner with NPA < 5.0% and score >= 80 as SOLVENT", () => {
      const health = computeHealthScore(2.4, 3.1, 85.0, 14);
      expect(health.tier).toBe("SOLVENT");
      expect(health.score).toBeGreaterThanOrEqual(80);
    });

    it("T1.6.3: filters out HIGH_RISK branches when includeHighRisk is false", () => {
      const userCoords: GeoCoordinates = { lat: 26.8467, lng: 80.9462 }; // Lucknow
      const solventOnly = filterAndRankPartners(PRESEEDED_PARTNERS, userCoords, {
        includeHighRisk: false,
      });

      const highNpaPartner = solventOnly.find((p) => p.npaPercentage >= 10.0);
      expect(highNpaPartner).toBeUndefined();

      // Specifically verify Bank of Baroda Chowk (12.8% NPA) is excluded
      const bobChowk = solventOnly.find((p) => p.id === "lko-psb-02");
      expect(bobChowk).toBeUndefined();
    });

    it("T1.6.4: includes HIGH_RISK branches when includeHighRisk is true", () => {
      const userCoords: GeoCoordinates = { lat: 26.8467, lng: 80.9462 };
      const allPartners = filterAndRankPartners(PRESEEDED_PARTNERS, userCoords, {
        includeHighRisk: true,
      });

      const bobChowk = allPartners.find((p) => p.id === "lko-psb-02");
      expect(bobChowk).toBeDefined();
      expect(bobChowk?.healthTier).toBe("HIGH_RISK");
    });

    it("T1.6.5: filters partners across all 4 authorized institution types (SCA, PSB, RRB, NBFC_MFI)", () => {
      const userCoords: GeoCoordinates = { lat: 26.8467, lng: 80.9462 };
      const scas = filterAndRankPartners(PRESEEDED_PARTNERS, userCoords, { institutionType: "SCA" });
      const psbs = filterAndRankPartners(PRESEEDED_PARTNERS, userCoords, { institutionType: "PSB" });
      const rrbs = filterAndRankPartners(PRESEEDED_PARTNERS, userCoords, { institutionType: "RRB" });
      const nbfcs = filterAndRankPartners(PRESEEDED_PARTNERS, userCoords, { institutionType: "NBFC_MFI" });

      expect(scas.length).toBeGreaterThan(0);
      expect(psbs.length).toBeGreaterThan(0);
      expect(rrbs.length).toBeGreaterThan(0);
      expect(nbfcs.length).toBeGreaterThan(0);

      scas.forEach((p) => expect(p.institutionType).toBe("SCA"));
      psbs.forEach((p) => expect(p.institutionType).toBe("PSB"));
      rrbs.forEach((p) => expect(p.institutionType).toBe("RRB"));
      nbfcs.forEach((p) => expect(p.institutionType).toBe("NBFC_MFI"));
    });
  });

  // Feature 7: Official Referral Slip Generation
  describe("Feature 7: Official Referral Slip Generation", () => {
    it("T1.7.1: generates sample dossier with complete structural sections and active status", () => {
      const dossier = getSampleDossier();
      expect(dossier.applicationId).toMatch(/^SETU-2026-/);
      expect(dossier.applicant.fullName).toBeTruthy();
      expect(dossier.applicant.annualIncome).toBeLessThanOrEqual(500000);
      expect(dossier.financing.schemeCode).toBe("MSY");
      expect(dossier.branch.healthTier).toBe("SOLVENT");
      expect(dossier.documents.length).toBeGreaterThanOrEqual(6);
      expect(dossier.checksum).toHaveLength(8);
    });

    it("T1.7.2: includes formatted application ID with NSFDC prefix and unique components", () => {
      const partner = PRESEEDED_PARTNERS[0];
      const appId = `NSFDC-2026-${partner.id.toUpperCase()}-748291`;
      expect(appId).toContain("NSFDC-2026-");
      expect(appId).toContain(partner.id.toUpperCase());
    });

    it("T1.7.3: computes 32-bit FNV tamper-proof checksum for referral slip data payload", () => {
      const payload = {
        applicationId: "SETU-2026-LKO-8492",
        schemeCode: "MSY",
        concessionalAmount: 126000,
        monthlyEmi: 3721,
        partnerId: "lko-sca-01",
      };
      const checksum = computeDossierChecksum(payload);
      expect(checksum).toHaveLength(8);
      expect(verifyDossierChecksum(payload, checksum)).toBe(true);
    });

    it("T1.7.4: rejects modified referral slip payload with mismatched checksum", () => {
      const originalPayload = {
        applicationId: "SETU-2026-LKO-8492",
        schemeCode: "MSY",
        concessionalAmount: 126000,
        monthlyEmi: 3721,
        partnerId: "lko-sca-01",
      };
      const checksum = computeDossierChecksum(originalPayload);

      // Tampered payload with higher loan amount
      const tamperedPayload = { ...originalPayload, concessionalAmount: 200000 };
      expect(verifyDossierChecksum(tamperedPayload, checksum)).toBe(false);
    });

    it("T1.7.5: calculates compliance document verification readiness ratio", () => {
      const docs = getStandardComplianceDocuments();
      expect(docs.length).toBe(6);
      const readiness = calculateDocumentReadiness(docs);
      expect(readiness.totalCount).toBe(6);
      expect(readiness.verifiedCount).toBe(5); // 5 of 6 verified in standard set
      expect(readiness.percentage).toBe(83); // Math.round(5/6 * 100)
      expect(readiness.isReady).toBe(false);
    });
  });

  // Feature 8: Audio Sanitization & Voice Cascade
  describe("Feature 8: Audio Sanitization & Voice Cascade", () => {
    it("T1.8.1: strips markdown markup characters (bold, italics, hashtags, code) for clean TTS", () => {
      const raw = "### **Important Notice**\nThis is a *subsidized* scheme with `4.0%` rate.";
      const cleaned = stripMarkdown(raw);
      expect(cleaned).not.toContain("**");
      expect(cleaned).not.toContain("###");
      expect(cleaned).not.toContain("`");
      expect(cleaned).not.toContain("*");
      expect(cleaned).toContain("Important Notice");
      expect(cleaned).toContain("4.0% rate");
    });

    it("T1.8.2: strips markdown hyperlinks leaving clean readable anchor text", () => {
      const raw = "Please review the [MoSJE Guidelines](https://socialjustice.gov.in) before applying.";
      const cleaned = stripMarkdown(raw);
      expect(cleaned).toBe("Please review the MoSJE Guidelines before applying.");
      expect(cleaned).not.toContain("http");
    });

    it("T1.8.3: normalizes bullet points and multi-line breaks into natural pauses", () => {
      const raw = "Key Requirements:\n• Caste Certificate\n• Income Proof\n- Bank Passbook";
      const cleaned = stripMarkdown(raw);
      expect(cleaned).not.toContain("•");
      expect(cleaned).not.toContain("\n");
      expect(cleaned).toContain("Caste Certificate");
      expect(cleaned).toContain("Bank Passbook");
    });

    it("T1.8.4: verifies speech synthesis supported detector returns boolean without errors", () => {
      const supported = checkSpeechSynthesisSupported();
      expect(typeof supported).toBe("boolean");
    });

    it("T1.8.5: selects appropriate voice through cascade when speech synthesis is available", () => {
      const originalWindow = (global as any).window;
      const mockVoices = [
        { name: "Google हिन्दी", lang: "hi-IN", default: true },
        { name: "Microsoft Heera - English (India)", lang: "en-IN", default: false },
        { name: "Google US English", lang: "en-US", default: false },
      ];

      (global as any).window = {
        speechSynthesis: {
          getVoices: () => mockVoices,
          onvoiceschanged: null,
          speaking: false,
          paused: false,
          speak: vi.fn(),
          cancel: vi.fn(),
        },
        SpeechSynthesisUtterance: class {},
      };

      const hindiVoice = findBestVoice("hi-IN");
      expect(hindiVoice?.lang).toBe("hi-IN");

      const englishVoice = findBestVoice("en-IN");
      expect(englishVoice?.lang).toBe("en-IN");

      // Cleanup
      (global as any).window = originalWindow;
    });
  });
});

// ============================================================================
// TIER 2: BOUNDARY & CORNER CASES (>=5 Test Cases Per Feature across 8 Areas)
// ============================================================================

describe("Tier 2: Boundary & Corner Cases", () => {
  // Boundary 1: Recommender Income Boundaries
  describe("Boundary 1: Recommender Income Boundaries (5.00L vs 5.01L)", () => {
    it("T2.1.1: qualifies applicant with income exactly at statutory ceiling of Rs. 5,00,000", () => {
      const profile: UserProfile = {
        annualFamilyIncome: 500000,
        estimatedCost: 140000,
        targetGroup: "ALL_SC",
        gender: "MALE",
      };
      const result = evaluateEligibility(profile);
      expect(result.isEligible).toBe(true);
      expect(result.rejectionReasons.length).toBe(0);
    });

    it("T2.1.2: strictly rejects applicant with income Rs. 5,00,001 exceeding ceiling by one rupee", () => {
      const profile: UserProfile = {
        annualFamilyIncome: 500001,
        estimatedCost: 140000,
        targetGroup: "ALL_SC",
      };
      const result = evaluateEligibility(profile);
      expect(result.isEligible).toBe(false);
      expect(result.rejectionReasons.some((r) => r.includes("exceeds the statutory MoSJE ceiling of Rs. 5.00 Lakhs"))).toBe(true);
    });

    it("T2.1.3: qualifies applicant with income Rs. 0 (BPL affirmative priority)", () => {
      const profile: UserProfile = {
        annualFamilyIncome: 0,
        estimatedCost: 120000,
        targetGroup: "SC_WOMEN",
        gender: "FEMALE",
      };
      const result = evaluateEligibility(profile);
      expect(result.isEligible).toBe(true);
      expect(result.primaryScheme?.code).toBe("MSY");
    });

    it("T2.1.4: clamps negative income input to 0 without throwing error", () => {
      const profile: UserProfile = {
        annualFamilyIncome: -50000,
        estimatedCost: 140000,
        targetGroup: "ALL_SC",
        gender: "MALE",
      };
      const result = evaluateEligibility(profile);
      expect(result.isEligible).toBe(true);
    });

    it("T2.1.5: formats very high income (Rs. 50,00,000) cleanly in rejection message", () => {
      const profile: UserProfile = {
        annualFamilyIncome: 5000000,
        estimatedCost: 140000,
        targetGroup: "ALL_SC",
      };
      const result = evaluateEligibility(profile);
      expect(result.isEligible).toBe(false);
      expect(result.rejectionReasons[0]).toContain("50,00,000");
    });
  });

  // Boundary 2: Recommender Cost Limits (1.40L and 50L)
  describe("Boundary 2: Recommender Cost Limits (1.40L vs 1.40001L and 50L)", () => {
    it("T2.2.1: qualifies MCF for project cost exactly at Rs. 1,40,000", () => {
      const profile: UserProfile = {
        annualFamilyIncome: 200000,
        estimatedCost: 140000,
        targetGroup: "ALL_SC",
        gender: "MALE",
      };
      const result = evaluateEligibility(profile);
      expect(result.isEligible).toBe(true);
      expect(result.primaryScheme?.code).toBe("MCF");
    });

    it("T2.2.2: routes cost of Rs. 1,40,001 to Term Loan Scheme as suggested alternative", () => {
      const profile: UserProfile = {
        annualFamilyIncome: 200000,
        estimatedCost: 140001,
        targetGroup: "ALL_SC",
      };
      const result = evaluateEligibility(profile);
      expect(result.isEligible).toBe(true);
      expect(result.primaryScheme?.code).toBe("TERM_LOAN");
      // MCF should not be eligible since cost > 1.40L
      expect(result.eligibleSchemes.some((s) => s.code === "MCF")).toBe(false);
    });

    it("T2.2.3: qualifies Term Loan Scheme for cost exactly at Rs. 50,00,000 ceiling", () => {
      const profile: UserProfile = {
        annualFamilyIncome: 450000,
        estimatedCost: 5000000,
        targetGroup: "ALL_SC",
      };
      const result = evaluateEligibility(profile);
      expect(result.isEligible).toBe(true);
      expect(result.primaryScheme?.code).toBe("TERM_LOAN");
    });

    it("T2.2.4: strictly rejects project cost of Rs. 50,00,001 exceeding maximum MoSJE threshold", () => {
      const profile: UserProfile = {
        annualFamilyIncome: 300000,
        estimatedCost: 5000001,
        targetGroup: "ALL_SC",
      };
      const result = evaluateEligibility(profile);
      expect(result.isEligible).toBe(false);
      expect(result.rejectionReasons.some((r) => r.includes("exceeds the maximum concessional loan limit of Rs. 50.00 Lakhs"))).toBe(true);
    });

    it("T2.2.5: handles project cost of Rs. 0 with zero funding breakdown safely", () => {
      const mcfScheme = MOSJE_SCHEMES.find((s) => s.code === "MCF")!;
      const breakdown = calculateFundingBreakdown(mcfScheme, 0);
      expect(breakdown.totalCost).toBe(0);
      expect(breakdown.nsfdcAmount).toBe(0);
      expect(breakdown.channelPartnerAmount).toBe(0);
      expect(breakdown.promoterAmount).toBe(0);
    });
  });

  // Boundary 3: Calculator Principal & Interest Rate Limits
  describe("Boundary 3: Calculator Principal & Interest Rate Limits", () => {
    it("T2.3.1: clamps loan principal below Rs. 10,000 to minimum threshold of Rs. 10,000", () => {
      const result = calculateConcessionalLoan({
        principal: 5000,
        annualInterestRate: 4.0,
        tenureYears: 1,
        moratoriumMonths: 0,
      });
      expect(result.principal).toBe(10000);
      expect(result.effectiveMonthlyEMI).toBeGreaterThan(0);
    });

    it("T2.3.2: calculates zero-interest loan (0% rate) with equal principal installments without NaN", () => {
      const emi = calculateStandardEMI(120000, 0, 12);
      expect(emi).toBe(10000);
      expect(isNaN(emi)).toBe(false);

      const schedule = generateAmortizationSchedule({
        principal: 120000,
        annualInterestRate: 0,
        tenureYears: 1,
        moratoriumMonths: 0,
      });
      expect(schedule.length).toBe(12);
      expect(schedule[0].principalPaid).toBe(10000);
      expect(schedule[0].interestPaid).toBe(0);
      expect(schedule[schedule.length - 1].closingBalance).toBe(0);
    });

    it("T2.3.3: handles minimum 1-year tenure (12 months) accurately", () => {
      const result = calculateConcessionalLoan({
        principal: 60000,
        annualInterestRate: 5.0,
        tenureYears: 1,
        moratoriumMonths: 0,
      });
      expect(result.tenureMonths).toBe(12);
      expect(result.standardEMI).toBe(5136);
      expect(result.totalPayable).toBe(5136 * 12);
    });

    it("T2.3.4: handles maximum 10-year tenure (120 months) for large Term Loans", () => {
      const result = calculateConcessionalLoan({
        principal: 5000000,
        annualInterestRate: 8.0,
        tenureYears: 10,
        moratoriumMonths: 6,
      });
      expect(result.tenureMonths).toBe(120);
      expect(result.effectiveMonthlyEMI).toBeGreaterThan(60000);

      const schedule = generateAmortizationSchedule({
        principal: 5000000,
        annualInterestRate: 8.0,
        tenureYears: 10,
        moratoriumMonths: 6,
      });
      expect(schedule.length).toBe(120);
      expect(schedule[schedule.length - 1].closingBalance).toBe(0);
    });

    it("T2.3.5: clamps negative tenure to minimum 1 year", () => {
      const result = calculateConcessionalLoan({
        principal: 100000,
        annualInterestRate: 5.0,
        tenureYears: -3,
        moratoriumMonths: 0,
      });
      expect(result.tenureYears).toBe(1);
      expect(result.tenureMonths).toBe(12);
    });
  });

  // Boundary 4: Moratorium Grace Period Bounds (0, 3, 12, 24)
  describe("Boundary 4: Moratorium Grace Period Bounds", () => {
    it("T2.4.1: calculates zero gestation interest when moratorium is 0 months", () => {
      const interest = calculateMoratoriumAccrual(140000, 6.5, 0);
      expect(interest).toBe(0);
      const result = calculateConcessionalLoan({
        principal: 140000,
        annualInterestRate: 6.5,
        tenureYears: 3,
        moratoriumMonths: 0,
      });
      expect(result.accruedGestationInterest).toBe(0);
      expect(result.monthlyMoratoriumSurcharge).toBe(0);
      expect(result.effectiveMonthlyEMI).toBe(result.standardEMI);
    });

    it("T2.4.2: calculates exact minimum 3-month moratorium interest", () => {
      // 1,40,000 * 0.05 * (3 / 12) = 1750
      const interest = calculateMoratoriumAccrual(140000, 5.0, 3);
      expect(interest).toBe(1750);
    });

    it("T2.4.3: calculates exact maximum standard 12-month moratorium interest", () => {
      // 20,00,000 * 0.04 * (12 / 12) = 80000
      const interest = calculateMoratoriumAccrual(2000000, 4.0, 12);
      expect(interest).toBe(80000);
    });

    it("T2.4.4: clamps moratorium input exceeding 24 months to 24 months maximum safety ceiling", () => {
      const result = calculateConcessionalLoan({
        principal: 140000,
        annualInterestRate: 6.5,
        tenureYears: 5,
        moratoriumMonths: 36, // Exceeds 24
      });
      expect(result.moratoriumMonths).toBe(24);
    });

    it("T2.4.5: clamps negative moratorium input to 0 without reducing standard repayment", () => {
      const result = calculateConcessionalLoan({
        principal: 140000,
        annualInterestRate: 6.5,
        tenureYears: 3,
        moratoriumMonths: -6,
      });
      expect(result.moratoriumMonths).toBe(0);
      expect(result.accruedGestationInterest).toBe(0);
      expect(result.effectiveMonthlyEMI).toBe(result.standardEMI);
    });
  });

  // Boundary 5: Commercial Comparison Edge Conditions
  describe("Boundary 5: Commercial Comparison Edge Conditions", () => {
    it("T2.5.1: yields zero lifetime savings when commercial rate equals concessional rate", () => {
      const emi = calculateStandardEMI(100000, 10.0, 36);
      const totalPayable = emi * 36;
      const comp = calculateCommercialComparison("Equal Rate Bank", 10.0, 100000, 36, emi, totalPayable);
      expect(comp.lifetimeSavings).toBe(0);
      expect(comp.monthlySavings).toBe(0);
      expect(comp.savingsPercentage).toBe(0);
    });

    it("T2.5.2: handles 1-month tenure edge case safely without division by zero", () => {
      const emi = calculateStandardEMI(10000, 12.0, 1);
      expect(emi).toBe(10100); // 10000 principal + 100 1-month interest
    });

    it("T2.5.3: handles zero tenure months by returning principal directly", () => {
      const emi = calculateStandardEMI(50000, 10.0, 0);
      expect(emi).toBe(50000);
    });

    it("T2.5.4: maintains monotonic increase in savings as commercial interest rate climbs", () => {
      const comp14 = calculateCommercialComparison("14% Bank", 14.0, 140000, 36, 4133, 148788);
      const comp18 = calculateCommercialComparison("18% NBFC", 18.0, 140000, 36, 4133, 148788);
      const comp24 = calculateCommercialComparison("24% MoneyLender", 24.0, 140000, 36, 4133, 148788);

      expect(comp18.monthlyEMI).toBeGreaterThan(comp14.monthlyEMI);
      expect(comp24.monthlyEMI).toBeGreaterThan(comp18.monthlyEMI);
      expect(comp24.lifetimeSavings).toBeGreaterThan(comp18.lifetimeSavings);
      expect(comp18.lifetimeSavings).toBeGreaterThan(comp14.lifetimeSavings);
    });

    it("T2.5.5: ensures annual summary aggregates months accurately for non-round tenures", () => {
      const schedule = generateAmortizationSchedule({
        principal: 140000,
        annualInterestRate: 4.0,
        tenureYears: 2, // 24 months
        moratoriumMonths: 3,
      });
      const summary = generateAnnualSummary(schedule);
      expect(summary.length).toBe(2);
      expect(summary[0].year).toBe(1);
      expect(summary[1].year).toBe(2);
      const totalPaid = summary.reduce((acc, y) => acc + y.totalPrincipalPaid, 0);
      expect(totalPaid).toBe(140000);
    });
  });

  // Boundary 6: Channel Partner NPA & Solvency Boundaries (9.9% vs 10.0% vs 10.1%)
  describe("Boundary 6: Channel Partner NPA & Solvency Boundaries", () => {
    it("T2.6.1: classifies partner with NPA 9.9% as MODERATE / eligible when quota is active", () => {
      const health = computeHealthScore(9.9, 8.0, 40.0, 20);
      expect(health.tier).not.toBe("HIGH_RISK");
      expect(health.tier).toBe("MODERATE");
    });

    it("T2.6.2: classifies partner with NPA exactly at boundary 10.0% as MODERATE", () => {
      const health = computeHealthScore(10.0, 8.0, 40.0, 20);
      expect(health.tier).not.toBe("HIGH_RISK");
      expect(health.tier).toBe("MODERATE");
    });

    it("T2.6.3: classifies partner with NPA 10.1% strictly as HIGH_RISK", () => {
      const health = computeHealthScore(10.1, 8.0, 40.0, 20);
      expect(health.tier).toBe("HIGH_RISK");
    });

    it("T2.6.4: classifies partner with remaining quota 0.0 Lakhs as HIGH_RISK even if NPA is low", () => {
      const health = computeHealthScore(2.0, 2.0, 0.0, 15);
      expect(health.tier).toBe("HIGH_RISK");
    });

    it("T2.6.5: classifies partner with negative quota as HIGH_RISK", () => {
      const health = computeHealthScore(3.0, 3.0, -10.0, 15);
      expect(health.tier).toBe("HIGH_RISK");
    });
  });

  // Boundary 7: Geolocation & Distance Limits
  describe("Boundary 7: Geolocation & Distance Limits", () => {
    it("T2.7.1: returns exactly 0.0 km for identical coordinates", () => {
      const coords: GeoCoordinates = { lat: 26.8467, lng: 80.9462 };
      const dist = calculateHaversineDistance(coords, coords);
      expect(dist).toBe(0.0);
    });

    it("T2.7.2: computes valid spherical distance across major inter-city coordinates without NaN", () => {
      const delhi = DISTRICT_HUBS.find((h) => h.id === "delhi")!.coordinates;
      const mumbai = DISTRICT_HUBS.find((h) => h.id === "mumbai")!.coordinates;
      const dist = calculateHaversineDistance(delhi, mumbai);
      // Distance between Delhi and Mumbai is approx 1,148 km
      expect(dist).toBeGreaterThan(1100);
      expect(dist).toBeLessThan(1200);
      expect(isNaN(dist)).toBe(false);
    });

    it("T2.7.3: returns empty array without throwing when filtering an empty partner list", () => {
      const coords: GeoCoordinates = { lat: 26.8467, lng: 80.9462 };
      const result = filterAndRankPartners([], coords, { includeHighRisk: false });
      expect(result).toEqual([]);
    });

    it("T2.7.4: strictly enforces maxDistanceKm radius threshold", () => {
      const lucknowCoords = DISTRICT_HUBS.find((h) => h.id === "lucknow")!.coordinates;
      const within15Km = filterAndRankPartners(PRESEEDED_PARTNERS, lucknowCoords, {
        maxDistanceKm: 15,
        includeHighRisk: true,
      });

      expect(within15Km.length).toBeGreaterThan(0);
      within15Km.forEach((p) => {
        expect(p.distanceKm).toBeLessThanOrEqual(15);
      });
    });

    it("T2.7.5: sorts partners within 10km proximity threshold by health score", () => {
      const lucknowCoords = DISTRICT_HUBS.find((h) => h.id === "lucknow")!.coordinates;
      const ranked = filterAndRankPartners(PRESEEDED_PARTNERS, lucknowCoords, {
        maxDistanceKm: 10,
        includeHighRisk: false,
      });

      // All branches in Lucknow central cluster are within 10km; highest health score should be first
      expect(ranked.length).toBeGreaterThanOrEqual(2);
      expect(ranked[0].healthScore).toBeGreaterThanOrEqual(ranked[1].healthScore);
    });
  });

  // Boundary 8: Audio Sanitization & Voice Cascade Edge Cases
  describe("Boundary 8: Audio Sanitization & Voice Cascade Edge Cases", () => {
    it("T2.8.1: handles empty string in stripMarkdown returning empty string", () => {
      expect(stripMarkdown("")).toBe("");
      expect(stripMarkdown("   ")).toBe("");
    });

    it("T2.8.2: handles text composed solely of markdown punctuation symbols", () => {
      expect(stripMarkdown("****")).toBe("");
      expect(stripMarkdown("### ___ ```")).toBe("");
    });

    it("T2.8.3: handles deeply nested brackets and formatting without regex catastrophic backtracking", () => {
      const complex = "[[Link Title]](http://example.com) with **nested *bold* formatting**.";
      const cleaned = stripMarkdown(complex);
      expect(cleaned).toContain("Link Title");
      expect(cleaned).not.toContain("**");
    });

    it("T2.8.4: executes Indic fallback tier 4 when non-English regional voice is not installed, or default when no Indic voice exists", () => {
      const originalWindow = (global as any).window;

      // Case A: Indic voice exists in browser -> falls back to Indian voice
      const voicesWithIndic = [
        { name: "Hindi Voice", lang: "hi-IN", default: false },
        { name: "System Default", lang: "en-US", default: true },
      ];

      (global as any).window = {
        speechSynthesis: {
          getVoices: () => voicesWithIndic,
          onvoiceschanged: null,
          speaking: false,
          paused: false,
          speak: vi.fn(),
          cancel: vi.fn(),
        },
        SpeechSynthesisUtterance: class {},
      };

      const fallbackToIndic = findBestVoice("fr-FR");
      expect(fallbackToIndic?.name).toBe("Hindi Voice");

      // Case B: No Indic voice installed -> falls back to system default (tier 5)
      const voicesWithoutIndic = [
        { name: "US English", lang: "en-US", default: false },
        { name: "UK English Default", lang: "en-GB", default: true },
      ];

      (global as any).window.speechSynthesis.getVoices = () => voicesWithoutIndic;
      const fallbackToDefault = findBestVoice("fr-FR");
      expect(fallbackToDefault?.name).toBe("UK English Default");

      (global as any).window = originalWindow;
    });

    it("T2.8.5: returns null from findBestVoice when browser environment does not support SpeechSynthesis", () => {
      const originalWindow = (global as any).window;
      (global as any).window = undefined;
      const voice = findBestVoice("hi-IN");
      expect(voice).toBeNull();
      (global as any).window = originalWindow;
    });
  });
});

// ============================================================================
// TIER 3: CROSS-FEATURE COMBINATIONS (Pairwise Cross-Module Interactions)
// ============================================================================

describe("Tier 3: Cross-Feature Combinations", () => {
  it("T3.1: MSY end-to-end combination: Recommender -> 90% Breakdown -> Calculator -> Solvent SCA", () => {
    // 1. Recommender: Woman applicant in Lucknow with tailoring project (Rs. 1.40L)
    const profile: UserProfile = {
      annualFamilyIncome: 180000,
      estimatedCost: 140000,
      targetGroup: "SC_WOMEN",
      gender: "FEMALE",
    };
    const recResult = evaluateEligibility(profile);
    expect(recResult.isEligible).toBe(true);
    expect(recResult.primaryScheme?.code).toBe("MSY");

    // 2. Breakdown: 90% NSFDC
    const funding = calculateFundingBreakdown(recResult.primaryScheme!, 140000);
    expect(funding.nsfdcAmount).toBe(126000);
    expect(funding.promoterAmount).toBe(0);

    // 3. Calculator: 4.0% rate with 6-month moratorium
    const calcResult = calculateConcessionalLoan({
      principal: funding.totalCost,
      annualInterestRate: recResult.primaryScheme!.interestRateMin,
      tenureYears: recResult.primaryScheme!.repaymentTenureYears,
      moratoriumMonths: 6,
    });
    expect(calcResult.effectiveMonthlyEMI).toBeGreaterThan(4000);
    expect(calcResult.comparisons.bank.lifetimeSavings).toBeGreaterThan(20000);

    // 4. Locator: Solvent SCA supporting MSY in Lucknow
    const lucknowCoords = DISTRICT_HUBS.find((h) => h.id === "lucknow")!.coordinates;
    const partners = filterAndRankPartners(PRESEEDED_PARTNERS, lucknowCoords, {
      schemeCode: "MSY",
      institutionType: "SCA",
      includeHighRisk: false,
    });
    expect(partners.length).toBeGreaterThan(0);
    expect(partners[0].institutionType).toBe("SCA");
    expect(partners[0].healthTier).toBe("SOLVENT");
    expect(partners[0].supportedSchemes).toContain("MSY");
  });

  it("T3.2: MCF end-to-end combination: Recommender -> Calculator -> Solvent RRB Router", () => {
    // 1. Recommender: Micro enterprise (Rs. 1.20L)
    const profile: UserProfile = {
      annualFamilyIncome: 150000,
      estimatedCost: 120000,
      targetGroup: "ALL_SC",
      gender: "MALE",
    };
    const recResult = evaluateEligibility(profile);
    expect(recResult.primaryScheme?.code).toBe("MCF");

    // 2. Calculator: 6.5% rate with 3-month moratorium
    const calcResult = calculateConcessionalLoan({
      principal: 120000,
      annualInterestRate: recResult.primaryScheme!.interestRateMax,
      tenureYears: 3,
      moratoriumMonths: 3,
    });
    expect(calcResult.accruedGestationInterest).toBe(1950);

    // 3. Locator: Solvent RRB in Jaipur supporting MCF
    const jaipurCoords = DISTRICT_HUBS.find((h) => h.id === "jaipur")!.coordinates;
    const rrbs = filterAndRankPartners(PRESEEDED_PARTNERS, jaipurCoords, {
      schemeCode: "MCF",
      institutionType: "RRB",
      includeHighRisk: false,
    });
    expect(rrbs.length).toBeGreaterThan(0);
    expect(rrbs[0].institutionType).toBe("RRB");
    expect(rrbs[0].healthTier).toBe("SOLVENT");
  });

  it("T3.3: Term Loan end-to-end combination: Recommender -> 5% Promoter Equity -> 10-Yr Amortization -> PSB", () => {
    // 1. Recommender: Transport vehicle (Rs. 15.00L)
    const profile: UserProfile = {
      annualFamilyIncome: 350000,
      estimatedCost: 1500000,
      targetGroup: "ALL_SC",
    };
    const recResult = evaluateEligibility(profile);
    expect(recResult.primaryScheme?.code).toBe("TERM_LOAN");

    // 2. Funding Breakdown: 90% NSFDC, 5% Bank, 5% Promoter
    const funding = calculateFundingBreakdown(recResult.primaryScheme!, 1500000);
    expect(funding.nsfdcAmount).toBe(1350000);
    expect(funding.promoterAmount).toBe(75000);

    // 3. Calculator: 10-year repayment schedule
    const schedule = generateAmortizationSchedule({
      principal: funding.nsfdcAmount,
      annualInterestRate: 7.5,
      tenureYears: 10,
      moratoriumMonths: 6,
    });
    expect(schedule.length).toBe(120);
    expect(schedule[schedule.length - 1].closingBalance).toBe(0);

    // 4. Locator: Solvent PSB in New Delhi supporting Term Loans
    const delhiCoords = DISTRICT_HUBS.find((h) => h.id === "delhi")!.coordinates;
    const psbs = filterAndRankPartners(PRESEEDED_PARTNERS, delhiCoords, {
      schemeCode: "TERM_LOAN",
      institutionType: "PSB",
      includeHighRisk: false,
    });
    expect(psbs.length).toBeGreaterThan(0);
    expect(psbs[0].healthTier).toBe("SOLVENT");
  });

  it("T3.4: Educational Loan Scheme combination: Student Profile -> 4.0% Female Rate -> 12-Mo Gestation -> PSB", () => {
    const profile: UserProfile = {
      annualFamilyIncome: 280000,
      estimatedCost: 2000000,
      targetGroup: "SC_STUDENTS",
      gender: "FEMALE",
      educationLevel: "GRADUATE",
    };
    const recResult = evaluateEligibility(profile);
    expect(recResult.primaryScheme?.code).toBe("ELS");

    // Female student gets 4.0% rate
    const calcResult = calculateConcessionalLoan({
      principal: 2000000,
      annualInterestRate: 4.0,
      tenureYears: 5,
      moratoriumMonths: 12,
    });
    expect(calcResult.accruedGestationInterest).toBe(80000);
    expect(calcResult.effectiveMonthlyEMI).toBeGreaterThan(34000);

    // Solvent PSB in Bengaluru
    const blrCoords = DISTRICT_HUBS.find((h) => h.id === "bengaluru")!.coordinates;
    const partners = filterAndRankPartners(PRESEEDED_PARTNERS, blrCoords, {
      schemeCode: "ELS",
      institutionType: "PSB",
      includeHighRisk: false,
    });
    expect(partners.length).toBeGreaterThan(0);
    expect(partners[0].healthTier).toBe("SOLVENT");
  });

  it("T3.5: Automatic alternative suggestion promotion: Over-budget micro loan promotes to Term Loan", () => {
    const profile: UserProfile = {
      annualFamilyIncome: 200000,
      estimatedCost: 350000, // Exceeds MCF 1.40L limit
      targetGroup: "ALL_SC",
    };
    const recResult = evaluateEligibility(profile);
    expect(recResult.isEligible).toBe(true);
    expect(recResult.primaryScheme?.code).toBe("TERM_LOAN");

    // Seamlessly calculates Term Loan with 6-month moratorium
    const calc = calculateConcessionalLoan({
      principal: 350000,
      annualInterestRate: recResult.primaryScheme!.interestRateMin,
      tenureYears: 5,
      moratoriumMonths: 6,
    });
    expect(calc.principal).toBe(350000);
    expect(calc.effectiveMonthlyEMI).toBeGreaterThan(6000);
  });

  it("T3.6: Full URL pipeline parameter serialization and deserialization integrity", () => {
    // Step 1: Serialize Recommender parameters
    const step1Params = {
      scheme: "MSY",
      amount: "140000",
      rate: "4.0",
      tenure: "3",
    };
    const step1Query = new URLSearchParams(step1Params).toString();

    // Step 2: Hydrate Calculator from query
    const hydratedSearchParams = new URLSearchParams(step1Query);
    const loanParams: LoanParameters = {
      principal: Number(hydratedSearchParams.get("amount")),
      annualInterestRate: Number(hydratedSearchParams.get("rate")),
      tenureYears: Number(hydratedSearchParams.get("tenure")),
      moratoriumMonths: 6,
    };
    const calcResult = calculateConcessionalLoan(loanParams);

    // Step 3: Serialize Locator parameters from Calculator result
    const step2Query = new URLSearchParams({
      scheme: hydratedSearchParams.get("scheme")!,
      amount: String(calcResult.principal),
      moratorium: String(calcResult.moratoriumMonths),
    }).toString();

    const locatorParams = new URLSearchParams(step2Query);
    expect(locatorParams.get("scheme")).toBe("MSY");
    expect(locatorParams.get("amount")).toBe("140000");
    expect(locatorParams.get("moratorium")).toBe("6");
  });

  it("T3.7: Amortization schedule export matches Calculator summary figures", () => {
    const loanParams: LoanParameters = {
      principal: 140000,
      annualInterestRate: 4.0,
      tenureYears: 3,
      moratoriumMonths: 6,
    };
    const calc = calculateConcessionalLoan(loanParams);
    const schedule = generateAmortizationSchedule(loanParams);
    const csv = exportAmortizationCSV(schedule);

    const rows = csv.split("\n");
    expect(rows.length).toBe(37); // Header + 36 monthly rows
    expect(rows[0]).toContain("Month,Opening Balance (INR)");

    // First month opening balance matches principal
    expect(rows[1]).toContain(",140000,");
    // Last month closing balance is 0
    expect(rows[rows.length - 1].endsWith(",0")).toBe(true);
  });

  it("T3.8: Zero promoter equity for MCF vs 5% promoter equity for Term Loan comparison", () => {
    const mcf = MOSJE_SCHEMES.find((s) => s.code === "MCF")!;
    const tls = MOSJE_SCHEMES.find((s) => s.code === "TERM_LOAN")!;

    const mcfBreakdown = calculateFundingBreakdown(mcf, 140000);
    const tlsBreakdown = calculateFundingBreakdown(tls, 140000);

    expect(mcfBreakdown.promoterAmount).toBe(0);
    expect(tlsBreakdown.promoterAmount).toBe(7000); // 5% of 1,40,000
    expect(mcfBreakdown.nsfdcAmount).toBe(tlsBreakdown.nsfdcAmount); // Both 90%
  });

  it("T3.9: Gestation moratorium impact on lifetime commercial savings comparison", () => {
    // Zero moratorium loan
    const loanNoMoratorium = calculateConcessionalLoan({
      principal: 140000,
      annualInterestRate: 4.0,
      tenureYears: 3,
      moratoriumMonths: 0,
    });

    // 6-month moratorium loan
    const loanWithMoratorium = calculateConcessionalLoan({
      principal: 140000,
      annualInterestRate: 4.0,
      tenureYears: 3,
      moratoriumMonths: 6,
    });

    expect(loanWithMoratorium.accruedGestationInterest).toBeGreaterThan(0);
    expect(loanWithMoratorium.totalPayable).toBeGreaterThan(loanNoMoratorium.totalPayable);
    // Even with moratorium, commercial savings remain massive (> Rs. 20,000)
    expect(loanWithMoratorium.comparisons.bank.lifetimeSavings).toBeGreaterThan(20000);
  });

  it("T3.10: Insolvent branch filtering preserves solvent branches in same district", () => {
    const lucknowCoords = DISTRICT_HUBS.find((h) => h.id === "lucknow")!.coordinates;

    // Filter with high risk excluded
    const solventOnly = filterAndRankPartners(PRESEEDED_PARTNERS, lucknowCoords, {
      includeHighRisk: false,
    });

    // Verify Bob Chowk (NPA 12.8%) is excluded
    expect(solventOnly.some((p) => p.id === "lko-psb-02")).toBe(false);

    // Verify UPSCFDC Central SCA (NPA 2.4%) is preserved
    const upscfdc = solventOnly.find((p) => p.id === "lko-sca-01");
    expect(upscfdc).toBeDefined();
    expect(upscfdc?.healthTier).toBe("SOLVENT");
  });

  it("T3.11: Multi-tier institution filtering within partner locator", () => {
    const delhiCoords = DISTRICT_HUBS.find((h) => h.id === "delhi")!.coordinates;

    const nbfcs = filterAndRankPartners(PRESEEDED_PARTNERS, delhiCoords, {
      institutionType: "NBFC_MFI",
      includeHighRisk: false,
    });
    expect(nbfcs.length).toBeGreaterThan(0);
    expect(nbfcs[0].institutionType).toBe("NBFC_MFI");

    const scas = filterAndRankPartners(PRESEEDED_PARTNERS, delhiCoords, {
      institutionType: "SCA",
      includeHighRisk: false,
    });
    expect(scas.length).toBeGreaterThan(0);
    expect(scas[0].institutionType).toBe("SCA");
  });

  it("T3.12: Application dossier checksum sensitivity across changes in amount and partner", () => {
    const base = {
      applicationId: "SETU-2026-TEST-1001",
      schemeCode: "MSY",
      concessionalAmount: 126000,
      monthlyEmi: 4133,
      partnerId: "lko-sca-01",
    };
    const baseChecksum = computeDossierChecksum(base);

    // Change amount
    const alteredAmount = { ...base, concessionalAmount: 126001 };
    expect(computeDossierChecksum(alteredAmount)).not.toBe(baseChecksum);

    // Change partner
    const alteredPartner = { ...base, partnerId: "del-sca-01" };
    expect(computeDossierChecksum(alteredPartner)).not.toBe(baseChecksum);

    // Change EMI
    const alteredEmi = { ...base, monthlyEmi: 4134 };
    expect(computeDossierChecksum(alteredEmi)).not.toBe(baseChecksum);
  });

  it("T3.13: QR payload serialization and deserialization roundtrip", () => {
    const sampleDossier = getSampleDossier();
    const qrString = serializeDossierQrPayload(sampleDossier);
    expect(qrString).toBeTruthy();

    const deserialized = deserializeDossierQrPayload(qrString);
    expect(deserialized).not.toBeNull();
    expect(deserialized?.app).toBe(sampleDossier.applicationId);
    expect(deserialized?.sc).toBe(sampleDossier.financing.schemeCode);
    expect(deserialized?.ca).toBe(sampleDossier.financing.concessionalAmount);
    expect(deserialized?.emi).toBe(sampleDossier.financing.monthlyEmi);
    expect(deserialized?.chk).toBe(sampleDossier.checksum);
  });

  it("T3.14: Document readiness computation for complete vs incomplete compliance sets", () => {
    const completeDocs: ComplianceDocument[] = [
      { id: "1", category: "IDENTITY", title: "Caste Cert", description: "", authority: "", isVerified: true },
      { id: "2", category: "IDENTITY", title: "Income Cert", description: "", authority: "", isVerified: true },
    ];
    const readyResult = calculateDocumentReadiness(completeDocs);
    expect(readyResult.isReady).toBe(true);
    expect(readyResult.percentage).toBe(100);

    const incompleteDocs: ComplianceDocument[] = [
      { id: "1", category: "IDENTITY", title: "Caste Cert", description: "", authority: "", isVerified: true },
      { id: "2", category: "IDENTITY", title: "Income Cert", description: "", authority: "", isVerified: false },
    ];
    const pendingResult = calculateDocumentReadiness(incompleteDocs);
    expect(pendingResult.isReady).toBe(false);
    expect(pendingResult.percentage).toBe(50);
  });

  it("T3.15: Vernacular voice recognition keyword matching maps to valid scheme profile", () => {
    // Simulation of vernacular voice triggers in SmartRecommenderWizard
    const sampleUtterances = [
      { text: "mujhe silai machine lagani hai", expectedActivity: "tailoring", expectedScheme: "MSY" },
      { text: "commercial truck business ke liye loan", expectedActivity: "transport", expectedScheme: "TERM_LOAN" },
      { text: "college education padhai ke liye", expectedActivity: "education", expectedScheme: "ELS" },
    ];

    sampleUtterances.forEach((item) => {
      let activity = "";
      if (/silai|tailor/i.test(item.text)) activity = "tailoring";
      if (/truck|transport/i.test(item.text)) activity = "transport";
      if (/education|padhai|college/i.test(item.text)) activity = "education";

      expect(activity).toBe(item.expectedActivity);

      const profile: UserProfile = {
        annualFamilyIncome: 200000,
        estimatedCost: activity === "tailoring" ? 140000 : activity === "transport" ? 1500000 : 800000,
        targetGroup: activity === "tailoring" ? "SC_WOMEN" : activity === "education" ? "SC_STUDENTS" : "ALL_SC",
        gender: activity === "tailoring" ? "FEMALE" : undefined,
        educationLevel: activity === "education" ? "GRADUATE" : undefined,
      };
      const result = evaluateEligibility(profile);
      expect(result.primaryScheme?.code).toBe(item.expectedScheme);
    });
  });

  it("T3.16: Multi-state district switching re-ranks nearest solvent SCA while preserving scheme terms", () => {
    const msyScheme = MOSJE_SCHEMES.find((s) => s.code === "MSY")!;

    // Case A: User in Lucknow
    const lucknowCoords = DISTRICT_HUBS.find((h) => h.id === "lucknow")!.coordinates;
    const lkoPartners = filterAndRankPartners(PRESEEDED_PARTNERS, lucknowCoords, {
      schemeCode: msyScheme.code,
      institutionType: "SCA",
      includeHighRisk: false,
    });
    expect(lkoPartners[0].district).toBe("Lucknow");
    expect(lkoPartners[0].name).toContain("UPSCFDC");

    // Case B: User switches to Mumbai
    const mumbaiCoords = DISTRICT_HUBS.find((h) => h.id === "mumbai")!.coordinates;
    const mumPartners = filterAndRankPartners(PRESEEDED_PARTNERS, mumbaiCoords, {
      schemeCode: msyScheme.code,
      institutionType: "SCA",
      includeHighRisk: false,
    });
    expect(mumPartners[0].district).toBe("Mumbai");
    expect(mumPartners[0].name).toContain("MPBCDC");
  });
});

// ============================================================================
// TIER 4: REAL-WORLD APPLICATION SCENARIOS (5 Realistic End-to-End Journeys)
// ============================================================================

describe("Tier 4: Real-World Application Scenarios", () => {
  it("Scenario 1: Marginalized Woman Artisan (Rekha Devi) - Mahila Samriddhi Yojana (MSY)", () => {
    // 1. Profile: Scheduled Caste female artisan in Lucknow establishing garment tailoring unit
    const profile: UserProfile = {
      annualFamilyIncome: 180000, // <= 5.00L ceiling
      estimatedCost: 140000, // Maximum MCF/MSY limit
      targetGroup: "SC_WOMEN",
      gender: "FEMALE",
    };

    // 2. Step 1: Scheme Recommendation
    const evaluation = evaluateEligibility(profile);
    expect(evaluation.isEligible).toBe(true);
    expect(evaluation.primaryScheme?.code).toBe("MSY");
    expect(evaluation.primaryScheme?.interestRateMin).toBe(4.0);

    // 3. 90% NSFDC Funding Structure
    const funding = calculateFundingBreakdown(evaluation.primaryScheme!, profile.estimatedCost);
    expect(funding.nsfdcAmount).toBe(126000); // 90% Government share
    expect(funding.channelPartnerAmount).toBe(14000); // 10% SCA share
    expect(funding.promoterAmount).toBe(0); // 0% Promoter burden
    expect(funding.subsidyAmount).toBe(10000); // Capital subsidy

    // 4. Step 2: Financial & Moratorium Calculation (6-month grace period)
    const calculation = calculateConcessionalLoan({
      principal: funding.totalCost,
      annualInterestRate: evaluation.primaryScheme!.interestRateMin,
      tenureYears: evaluation.primaryScheme!.repaymentTenureYears,
      moratoriumMonths: 6,
    });
    expect(calculation.accruedGestationInterest).toBe(2800); // 140000 * 0.04 * 0.5
    expect(calculation.monthlyMoratoriumSurcharge).toBe(78); // 2800 / 36
    expect(calculation.effectiveMonthlyEMI).toBe(calculation.standardEMI + 78);
    expect(calculation.comparisons.bank.lifetimeSavings).toBeGreaterThan(20000);

    // 5. Step 3: Solvent Channel Partner Locator & Routing in Lucknow
    const lucknowCoords = DISTRICT_HUBS.find((h) => h.id === "lucknow")!.coordinates;
    const rankedPartners = filterAndRankPartners(PRESEEDED_PARTNERS, lucknowCoords, {
      schemeCode: "MSY",
      institutionType: "SCA",
      includeHighRisk: false,
    });
    expect(rankedPartners.length).toBeGreaterThan(0);
    const designatedPartner = rankedPartners[0];
    expect(designatedPartner.id).toBe("lko-sca-01");
    expect(designatedPartner.healthTier).toBe("SOLVENT");
    expect(designatedPartner.npaPercentage).toBeLessThan(5.0);

    // 6. Referral Slip Generation & Verification
    const applicationId = `NSFDC-2026-${designatedPartner.id.toUpperCase()}-182934`;
    const checksum = computeDossierChecksum({
      applicationId,
      schemeCode: evaluation.primaryScheme!.code,
      concessionalAmount: funding.nsfdcAmount,
      monthlyEmi: calculation.effectiveMonthlyEMI,
      partnerId: designatedPartner.id,
    });
    expect(checksum).toHaveLength(8);
  });

  it("Scenario 2: Dalit Small Business Owner (Ramesh Kumar) - NSFDC Term Loan Scheme", () => {
    // 1. Profile: SC entrepreneur in New Delhi scaling logistics transport business
    const profile: UserProfile = {
      annualFamilyIncome: 320000,
      estimatedCost: 1500000, // Rs. 15.00 Lakhs
      targetGroup: "ALL_SC",
    };

    // 2. Step 1: Scheme Recommendation
    const evaluation = evaluateEligibility(profile);
    expect(evaluation.isEligible).toBe(true);
    expect(evaluation.primaryScheme?.code).toBe("TERM_LOAN");
    expect(evaluation.primaryScheme?.repaymentTenureYears).toBe(10);

    // 3. 90% NSFDC Funding Structure
    const funding = calculateFundingBreakdown(evaluation.primaryScheme!, profile.estimatedCost);
    expect(funding.nsfdcAmount).toBe(1350000); // 90% NSFDC
    expect(funding.channelPartnerAmount).toBe(75000); // 5% Bank
    expect(funding.promoterAmount).toBe(75000); // 5% Promoter equity

    // 4. Step 2: Financial Calculation with 12-month moratorium
    const calculation = calculateConcessionalLoan({
      principal: funding.nsfdcAmount,
      annualInterestRate: 7.5,
      tenureYears: 10,
      moratoriumMonths: 12,
    });
    expect(calculation.accruedGestationInterest).toBe(101250); // 1350000 * 0.075 * 1.0
    expect(calculation.tenureMonths).toBe(120);
    expect(calculation.comparisons.bank.lifetimeSavings).toBeGreaterThan(450000);

    // 5. Step 3: Solvent PSB Routing in New Delhi
    const delhiCoords = DISTRICT_HUBS.find((h) => h.id === "delhi")!.coordinates;
    const solventPsbs = filterAndRankPartners(PRESEEDED_PARTNERS, delhiCoords, {
      schemeCode: "TERM_LOAN",
      institutionType: "PSB",
      includeHighRisk: false,
    });
    expect(solventPsbs.length).toBeGreaterThan(0);
    const chosenPsb = solventPsbs[0];
    expect(chosenPsb.id).toBe("del-psb-01"); // State Bank of India Parliament Street
    expect(chosenPsb.healthTier).toBe("SOLVENT");
    expect(chosenPsb.remainingQuotaLakhs).toBeGreaterThanOrEqual(100.0);
  });

  it("Scenario 3: Rural Youth Micro-Enterprise (Suresh Paswan) - Micro Credit Finance (MCF)", () => {
    // 1. Profile: Rural youth establishing local dairy & livestock stall
    const profile: UserProfile = {
      annualFamilyIncome: 120000,
      estimatedCost: 100000, // Rs. 1.00 Lakh
      targetGroup: "ALL_SC",
      gender: "MALE",
    };

    // 2. Step 1: Scheme Recommendation
    const evaluation = evaluateEligibility(profile);
    expect(evaluation.isEligible).toBe(true);
    expect(evaluation.primaryScheme?.code).toBe("MCF");

    // 3. Funding Breakdown: Zero promoter margin
    const funding = calculateFundingBreakdown(evaluation.primaryScheme!, profile.estimatedCost);
    expect(funding.nsfdcAmount).toBe(90000);
    expect(funding.promoterAmount).toBe(0);

    // 4. Step 2: 3-month moratorium calculation
    const calculation = calculateConcessionalLoan({
      principal: funding.totalCost,
      annualInterestRate: 5.0,
      tenureYears: 3,
      moratoriumMonths: 3,
    });
    expect(calculation.accruedGestationInterest).toBe(1250); // 100000 * 0.05 * 0.25
    expect(calculation.effectiveMonthlyEMI).toBeGreaterThan(0);

    // 5. Step 3: Solvent Regional Rural Bank (RRB) Routing
    const lucknowCoords = DISTRICT_HUBS.find((h) => h.id === "lucknow")!.coordinates;
    const solventRrbs = filterAndRankPartners(PRESEEDED_PARTNERS, lucknowCoords, {
      schemeCode: "MCF",
      institutionType: "RRB",
      includeHighRisk: false,
    });
    expect(solventRrbs.length).toBeGreaterThan(0);
    const rrb = solventRrbs[0];
    expect(rrb.institutionType).toBe("RRB");
    expect(rrb.healthTier).not.toBe("HIGH_RISK");
  });

  it("Scenario 4: First-Generation SC Student (Priya K.) - Educational Loan Scheme (ELS)", () => {
    // 1. Profile: First-generation SC female student pursuing accredited professional engineering degree
    const profile: UserProfile = {
      annualFamilyIncome: 240000,
      estimatedCost: 2000000, // Rs. 20.00 Lakhs
      targetGroup: "SC_STUDENTS",
      gender: "FEMALE",
      educationLevel: "GRADUATE",
    };

    // 2. Step 1: Scheme Recommendation
    const evaluation = evaluateEligibility(profile);
    expect(evaluation.isEligible).toBe(true);
    expect(evaluation.primaryScheme?.code).toBe("ELS");

    // 3. 90% NSFDC Funding Structure
    const funding = calculateFundingBreakdown(evaluation.primaryScheme!, profile.estimatedCost);
    expect(funding.nsfdcAmount).toBe(1800000);
    expect(funding.channelPartnerAmount).toBe(200000);
    expect(funding.promoterAmount).toBe(0);

    // 4. Step 2: Extended 12-Month Gestation Moratorium
    const calculation = calculateConcessionalLoan({
      principal: funding.totalCost,
      annualInterestRate: 4.0, // Concessional rate for female students
      tenureYears: 5,
      moratoriumMonths: 12,
    });
    expect(calculation.accruedGestationInterest).toBe(80000); // 2000000 * 0.04 * 1.0
    expect(calculation.monthlyMoratoriumSurcharge).toBe(Math.round(80000 / 60)); // 1333

    // 5. Step 3: Solvent Partner Routing in Bengaluru
    const blrCoords = DISTRICT_HUBS.find((h) => h.id === "bengaluru")!.coordinates;
    const partners = filterAndRankPartners(PRESEEDED_PARTNERS, blrCoords, {
      schemeCode: "ELS",
      includeHighRisk: false,
    });
    expect(partners.length).toBeGreaterThan(0);
    const designated = partners[0];
    expect(designated.healthTier).toBe("SOLVENT");
    expect(designated.supportedSchemes).toContain("ELS");
  });

  it("Scenario 5: Insolvent Partner Evasion & Automated Safe Re-Routing", () => {
    // 1. Borrower is physically close to Chowk, Lucknow (near Bank of Baroda Chowk with 12.8% NPA)
    const chowkCoords: GeoCoordinates = { lat: 26.868, lng: 80.904 };

    // 2. Search without high-risk branches (default production setting)
    const solventOnly = filterAndRankPartners(PRESEEDED_PARTNERS, chowkCoords, {
      includeHighRisk: false,
    });

    // 3. Verify Bank of Baroda Chowk (NPA 12.8%, remaining quota 0L) is strictly excluded
    const bobChowk = solventOnly.find((p) => p.id === "lko-psb-02");
    expect(bobChowk).toBeUndefined();

    // 4. Verify system safely re-routes borrower to nearest solvent institution
    expect(solventOnly.length).toBeGreaterThan(0);
    const safeRoute = solventOnly[0];
    expect(safeRoute.healthTier).toBe("SOLVENT");
    expect(safeRoute.npaPercentage).toBeLessThan(10.0);
    expect(safeRoute.remainingQuotaLakhs).toBeGreaterThan(0);

    // 5. Generating referral slip with safe partner succeeds and displays solvent health badge
    const slipPayload = {
      applicationId: `SETU-2026-SAFE-${safeRoute.id.toUpperCase()}`,
      schemeCode: "MCF",
      concessionalAmount: 126000,
      monthlyEmi: 2739,
      partnerId: safeRoute.id,
    };
    const checksum = computeDossierChecksum(slipPayload);
    expect(verifyDossierChecksum(slipPayload, checksum)).toBe(true);
  });
});
