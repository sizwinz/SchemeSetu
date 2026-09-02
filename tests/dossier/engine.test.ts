import { describe, it, expect } from "vitest";
import {
  computeDossierChecksum,
  verifyDossierChecksum,
  serializeDossierQrPayload,
  deserializeDossierQrPayload,
  calculateDocumentReadiness,
  getSampleDossier,
  getStandardComplianceDocuments,
} from "@/lib/dossier/engine";

describe("Application Dossier Cryptographic & Document Engine", () => {
  const basePayload = {
    applicationId: "SETU-2026-LKO-8492",
    schemeCode: "MSY",
    concessionalAmount: 126000,
    monthlyEmi: 3721,
    partnerId: "lko-sca-01",
  };

  describe("Tamper-Detection Checksum Calculation", () => {
    it("should generate a consistent 8-character hexadecimal checksum", () => {
      const checksum1 = computeDossierChecksum(basePayload);
      const checksum2 = computeDossierChecksum(basePayload);

      expect(checksum1).toHaveLength(8);
      expect(checksum1).toMatch(/^[0-9A-F]{8}$/);
      expect(checksum1).toBe(checksum2);
    });

    it("should successfully verify an unaltered dossier payload", () => {
      const checksum = computeDossierChecksum(basePayload);
      const isValid = verifyDossierChecksum(basePayload, checksum);
      expect(isValid).toBe(true);
    });

    it("should detect tampering if the concessional loan amount is altered by 1 Rupee", () => {
      const originalChecksum = computeDossierChecksum(basePayload);
      const tamperedPayload = { ...basePayload, concessionalAmount: 126001 };

      const isValid = verifyDossierChecksum(tamperedPayload, originalChecksum);
      expect(isValid).toBe(false);
    });

    it("should detect tampering if the scheme code is manipulated", () => {
      const originalChecksum = computeDossierChecksum(basePayload);
      const tamperedPayload = { ...basePayload, schemeCode: "TERM_LOAN" };

      const isValid = verifyDossierChecksum(tamperedPayload, originalChecksum);
      expect(isValid).toBe(false);
    });

    it("should detect tampering if the designated branch partner ID is spoofed", () => {
      const originalChecksum = computeDossierChecksum(basePayload);
      const tamperedPayload = { ...basePayload, partnerId: "lko-psb-02" };

      const isValid = verifyDossierChecksum(tamperedPayload, originalChecksum);
      expect(isValid).toBe(false);
    });

    it("should reject invalid or malformed checksum strings", () => {
      expect(verifyDossierChecksum(basePayload, "")).toBe(false);
      expect(verifyDossierChecksum(basePayload, "SHORT")).toBe(false);
    });
  });

  describe("QR Payload Serialization and Deserialization", () => {
    it("should serialize dossier into compact JSON and deserialize correctly", () => {
      const sample = getSampleDossier();
      const rawJson = serializeDossierQrPayload(sample);

      expect(typeof rawJson).toBe("string");
      const decoded = deserializeDossierQrPayload(rawJson);

      expect(decoded).not.toBeNull();
      expect(decoded?.app).toBe(sample.applicationId);
      expect(decoded?.sc).toBe(sample.financing.schemeCode);
      expect(decoded?.ca).toBe(sample.financing.concessionalAmount);
      expect(decoded?.emi).toBe(sample.financing.monthlyEmi);
      expect(decoded?.bp).toBe(sample.branch.id);
      expect(decoded?.chk).toBe(sample.checksum);
    });

    it("should return null when deserializing malformed JSON", () => {
      expect(deserializeDossierQrPayload("not-a-json")).toBeNull();
      expect(deserializeDossierQrPayload('{"incomplete": true}')).toBeNull();
    });
  });

  describe("Document Readiness Progress Tracker", () => {
    it("should accurately compute readiness statistics for standard compliance documents", () => {
      const docs = getStandardComplianceDocuments();
      const result = calculateDocumentReadiness(docs);

      expect(result.totalCount).toBe(6);
      expect(result.verifiedCount).toBe(5);
      expect(result.percentage).toBe(83);
      expect(result.isReady).toBe(false);
    });

    it("should mark isReady as true when all compliance documents are verified", () => {
      const allVerified = getStandardComplianceDocuments().map((d) => ({
        ...d,
        isVerified: true,
      }));
      const result = calculateDocumentReadiness(allVerified);

      expect(result.verifiedCount).toBe(6);
      expect(result.percentage).toBe(100);
      expect(result.isReady).toBe(true);
    });

    it("should handle empty document lists gracefully", () => {
      const result = calculateDocumentReadiness([]);
      expect(result.percentage).toBe(0);
      expect(result.isReady).toBe(false);
    });
  });

  describe("Sample Pre-Screened Dossier Generator", () => {
    it("should generate a sample dossier with verified checksum and valid MSY parameters", () => {
      const dossier = getSampleDossier();

      expect(dossier.applicant.fullName).toBe("Smt. Rekha Devi");
      expect(dossier.applicant.casteCategory).toBe("Scheduled Caste (SC)");
      expect(dossier.financing.interestRate).toBe(4.0);
      expect(dossier.financing.promoterContribution).toBe(14000); // 10% promoter contribution
      expect(dossier.branch.healthTier).toBe("SOLVENT");

      const payload = {
        applicationId: dossier.applicationId,
        schemeCode: dossier.financing.schemeCode,
        concessionalAmount: dossier.financing.concessionalAmount,
        monthlyEmi: dossier.financing.monthlyEmi,
        partnerId: dossier.branch.id,
      };

      expect(verifyDossierChecksum(payload, dossier.checksum)).toBe(true);
    });
  });
});
