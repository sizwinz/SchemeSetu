import { describe, it, expect } from "vitest";
import {
  progressLeadStatus,
  verifyQrToken,
  recalculateNetworkHealth,
  calculateNationalMetrics,
} from "@/lib/admin/engine";
import { PRESEEDED_LEADS } from "@/lib/admin/data";
import { PRESEEDED_PARTNERS } from "@/lib/partners/data";
import { serializeDossierQrPayload, getSampleDossier } from "@/lib/dossier/engine";

describe("Institutional Administration & Governance Engine", () => {
  describe("Lead Status Progression and Quota Deduction", () => {
    const lead = PRESEEDED_LEADS[0]; // Rekha Devi (MSY, ₹1,26,000)
    const initialQuota = 85.0; // Lakhs

    it("should update status to DOCUMENTS_VERIFIED without deducting quota", () => {
      const { updatedLead, updatedQuotaLakhs } = progressLeadStatus(
        lead,
        "DOCUMENTS_VERIFIED",
        initialQuota
      );

      expect(updatedLead.status).toBe("DOCUMENTS_VERIFIED");
      expect(updatedLead.verifiedDate).toBeDefined();
      expect(updatedQuotaLakhs).toBe(initialQuota);
    });

    it("should deduct loan amount from branch quota when status advances to CREDIT_SANCTIONED", () => {
      const { updatedLead, updatedQuotaLakhs } = progressLeadStatus(
        lead,
        "CREDIT_SANCTIONED",
        initialQuota
      );

      expect(updatedLead.status).toBe("CREDIT_SANCTIONED");
      expect(updatedLead.sanctionedDate).toBeDefined();

      // Loan amount is 126,000 = 1.26 Lakhs
      // 85.0 - 1.26 = 83.74 -> rounded to 83.7 Lakhs
      expect(updatedQuotaLakhs).toBeLessThan(initialQuota);
      expect(updatedQuotaLakhs).toBe(83.7);
    });

    it("should not double-deduct quota when advancing from SANCTIONED to DISBURSED", () => {
      const sanctionedLead = { ...lead, status: "CREDIT_SANCTIONED" as const };
      const currentQuota = 83.7;

      const { updatedLead, updatedQuotaLakhs } = progressLeadStatus(
        sanctionedLead,
        "DISBURSED",
        currentQuota
      );

      expect(updatedLead.status).toBe("DISBURSED");
      expect(updatedLead.disbursedDate).toBeDefined();
      expect(updatedQuotaLakhs).toBe(currentQuota);
    });
  });

  describe("QR Verification Desk and Tamper Detection", () => {
    it("should verify an authentic dossier QR token", () => {
      const sample = getSampleDossier();
      const validToken = serializeDossierQrPayload(sample);

      const result = verifyQrToken(validToken);

      expect(result.isValid).toBe(true);
      expect(result.isTampered).toBe(false);
      expect(result.payload?.app).toBe(sample.applicationId);
      expect(result.statusMessage).toContain("VERIFIED AUTHENTIC");
    });

    it("should detect tampering when loan parameters are manipulated", () => {
      const sample = getSampleDossier();
      const rawPayload = JSON.parse(serializeDossierQrPayload(sample));

      // Attacker inflates concessional amount from 126000 to 200000
      rawPayload.ca = 200000;
      const tamperedToken = JSON.stringify(rawPayload);

      const result = verifyQrToken(tamperedToken);

      expect(result.isValid).toBe(false);
      expect(result.isTampered).toBe(true);
      expect(result.statusMessage).toContain("SECURITY ALERT: Tampered");
    });

    it("should handle malformed non-JSON token strings gracefully", () => {
      const result = verifyQrToken("invalid-string");
      expect(result.isValid).toBe(false);
      expect(result.isTampered).toBe(false);
      expect(result.statusMessage).toContain("Invalid QR code format");
    });
  });

  describe("Dynamic NPA Ceiling Policy Governor", () => {
    it("should re-tier institutions when NPA ceiling is tightened to 3.0%", () => {
      const summary = recalculateNetworkHealth(PRESEEDED_PARTNERS, 3.0);

      expect(summary.npaCeiling).toBe(3.0);
      // Tightening ceiling to 3% moves all partners with NPA > 3% to HIGH_RISK
      expect(summary.highRiskCount).toBeGreaterThan(
        PRESEEDED_PARTNERS.filter((p) => p.healthTier === "HIGH_RISK").length
      );
    });

    it("should re-tier institutions when NPA ceiling is relaxed to 15.0%", () => {
      const summary = recalculateNetworkHealth(PRESEEDED_PARTNERS, 15.0);

      expect(summary.npaCeiling).toBe(15.0);
      // High-NPA partners below 15% (with positive quota) can move to MODERATE
      const bobChowk = summary.partners.find((p) => p.id === "lko-psb-02");
      // bobChowk has 0 quota so it remains HIGH_RISK
      expect(bobChowk?.dynamicHealthTier).toBe("HIGH_RISK");
    });
  });

  describe("National Governance Metrics Calculation", () => {
    it("should accurately compute macro KPI aggregates", () => {
      const metrics = calculateNationalMetrics(PRESEEDED_LEADS, PRESEEDED_PARTNERS);

      expect(metrics.totalLeads).toBe(PRESEEDED_LEADS.length);
      expect(metrics.totalSanctionedValueCr).toBeGreaterThan(0);
      expect(metrics.averageTurnaroundDays).toBe(14.2);
      expect(metrics.solventBranchesCount).toBeGreaterThan(0);
    });
  });
});
