import { describe, it, expect } from "vitest";
import {
  calculateStandardEMI,
  calculateMoratoriumAccrual,
  calculateConcessionalLoan,
  generateAmortizationSchedule,
  generateAnnualSummary,
  exportAmortizationCSV,
} from "@/lib/calculator/engine";

describe("Financial Calculation & Moratorium Engine", () => {
  describe("Standard Reducing Balance EMI", () => {
    it("should accurately calculate monthly EMI for standard MoSJE loan parameters", () => {
      // Principal: Rs. 1,40,000, Rate: 6.5%, Tenure: 5 Years (60 months)
      const emi = calculateStandardEMI(140000, 6.5, 60);
      expect(emi).toBe(2739);
    });

    it("should calculate lower EMI for Mahila Samriddhi Yojana (4.0% affirmative rate)", () => {
      // Principal: Rs. 1,40,000, Rate: 4.0%, Tenure: 3 Years (36 months)
      const emi = calculateStandardEMI(140000, 4.0, 36);
      expect(emi).toBe(4133);
    });

    it("should safely handle zero interest rate loans without NaN or Infinity", () => {
      const emi = calculateStandardEMI(120000, 0, 12);
      expect(emi).toBe(10000);
    });
  });

  describe("Moratorium Gestation Simple Interest Accrual", () => {
    it("should calculate exact simple interest accrued during gestation", () => {
      // Principal: Rs. 1,40,000, Rate: 6.5%, Moratorium: 6 Months (0.5 years)
      // 140000 * 0.065 * 0.5 = 4550
      const interest = calculateMoratoriumAccrual(140000, 6.5, 6);
      expect(interest).toBe(4550);
    });

    it("should return zero accrued interest when moratorium is zero months", () => {
      const interest = calculateMoratoriumAccrual(140000, 6.5, 0);
      expect(interest).toBe(0);
    });

    it("should calculate 12-month moratorium interest for higher capital projects", () => {
      // Principal: Rs. 5,00,000, Rate: 7.5%, Moratorium: 12 Months
      // 500000 * 0.075 * 1.0 = 37500
      const interest = calculateMoratoriumAccrual(500000, 7.5, 12);
      expect(interest).toBe(37500);
    });
  });

  describe("Concessional Loan & Commercial Benchmarking", () => {
    it("should distribute moratorium interest evenly across tenure without penal compounding", () => {
      const result = calculateConcessionalLoan({
        principal: 140000,
        annualInterestRate: 6.5,
        tenureYears: 5,
        moratoriumMonths: 6,
      });

      expect(result.accruedGestationInterest).toBe(4550);
      // 4550 / 60 months = 76 per month
      expect(result.monthlyMoratoriumSurcharge).toBe(76);
      expect(result.effectiveMonthlyEMI).toBe(result.standardEMI + 76);
    });

    it("should calculate substantial savings against Commercial Banks (14%) and NBFCs (18%)", () => {
      const result = calculateConcessionalLoan({
        principal: 140000,
        annualInterestRate: 6.5,
        tenureYears: 5,
        moratoriumMonths: 6,
      });

      // Commercial Bank (14.0%)
      expect(result.comparisons.bank.monthlyEMI).toBeGreaterThan(result.effectiveMonthlyEMI);
      expect(result.comparisons.bank.lifetimeSavings).toBeGreaterThan(20000);

      // NBFC-MFI (18.0%)
      expect(result.comparisons.nbfc.monthlyEMI).toBeGreaterThan(result.comparisons.bank.monthlyEMI);
      expect(result.comparisons.nbfc.lifetimeSavings).toBeGreaterThan(40000);
      expect(result.comparisons.nbfc.savingsPercentage).toBeGreaterThan(50);
    });
  });

  describe("Amortization Schedule Generation", () => {
    it("should generate exact number of monthly rows and close balance to zero", () => {
      const schedule = generateAmortizationSchedule({
        principal: 140000,
        annualInterestRate: 6.5,
        tenureYears: 5,
        moratoriumMonths: 6,
      });

      expect(schedule.length).toBe(60);
      expect(schedule[0].openingBalance).toBe(140000);
      expect(schedule[schedule.length - 1].closingBalance).toBe(0);

      // Verify that total principal paid equals initial principal exactly
      const totalPrincipalPaid = schedule.reduce((sum, row) => sum + row.principalPaid, 0);
      expect(totalPrincipalPaid).toBe(140000);
    });

    it("should accurately summarize monthly amortization into annual milestones", () => {
      const schedule = generateAmortizationSchedule({
        principal: 140000,
        annualInterestRate: 6.5,
        tenureYears: 5,
        moratoriumMonths: 6,
      });

      const annualSummary = generateAnnualSummary(schedule);
      expect(annualSummary.length).toBe(5);

      const totalPrincipalAcrossYears = annualSummary.reduce(
        (sum, row) => sum + row.totalPrincipalPaid,
        0
      );
      expect(totalPrincipalAcrossYears).toBe(140000);
      expect(annualSummary[annualSummary.length - 1].closingBalance).toBe(0);
    });

    it("should export schedule cleanly as CSV text with headers", () => {
      const schedule = generateAmortizationSchedule({
        principal: 140000,
        annualInterestRate: 6.5,
        tenureYears: 1,
        moratoriumMonths: 0,
      });

      const csv = exportAmortizationCSV(schedule);
      expect(csv).toContain("Month,Opening Balance (INR),Principal (INR)");
      const lines = csv.split("\n");
      expect(lines.length).toBe(13); // 1 header + 12 monthly rows
    });
  });
});
