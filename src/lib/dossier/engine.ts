import {
  ApplicationDossier,
  ComplianceDocument,
  QrPayload,
} from "./types";

export function computeDossierChecksum(payload: {
  applicationId: string;
  schemeCode: string;
  concessionalAmount: number;
  monthlyEmi: number;
  partnerId: string;
}): string {
  const seed = `${payload.applicationId}|${payload.schemeCode}|${payload.concessionalAmount}|${payload.monthlyEmi}|${payload.partnerId}|MoSJE_SETU_2026`;
  let hash = 0x811c9dc5; // 32-bit FNV offset basis
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193); // 32-bit FNV prime
  }
  return (hash >>> 0).toString(16).toUpperCase().padStart(8, "0");
}

export function verifyDossierChecksum(
  payload: {
    applicationId: string;
    schemeCode: string;
    concessionalAmount: number;
    monthlyEmi: number;
    partnerId: string;
  },
  checksum: string
): boolean {
  if (!checksum || checksum.length !== 8) return false;
  const expected = computeDossierChecksum(payload);
  return expected.toUpperCase() === checksum.toUpperCase();
}

export function serializeDossierQrPayload(dossier: ApplicationDossier): string {
  const payload: QrPayload = {
    app: dossier.applicationId,
    sc: dossier.financing.schemeCode,
    ca: dossier.financing.concessionalAmount,
    emi: dossier.financing.monthlyEmi,
    bp: dossier.branch.id,
    chk: dossier.checksum,
    ts: Math.floor(new Date(dossier.submissionDate).getTime() / 1000),
  };
  return JSON.stringify(payload);
}

export function deserializeDossierQrPayload(raw: string): QrPayload | null {
  try {
    const data = JSON.parse(raw);
    if (
      typeof data.app === "string" &&
      typeof data.sc === "string" &&
      typeof data.ca === "number" &&
      typeof data.emi === "number" &&
      typeof data.bp === "string" &&
      typeof data.chk === "string"
    ) {
      return data as QrPayload;
    }
    return null;
  } catch {
    return null;
  }
}

export function calculateDocumentReadiness(documents: ComplianceDocument[]): {
  verifiedCount: number;
  totalCount: number;
  percentage: number;
  isReady: boolean;
} {
  const totalCount = documents.length;
  if (totalCount === 0) {
    return { verifiedCount: 0, totalCount: 0, percentage: 0, isReady: false };
  }
  const verifiedCount = documents.filter((doc) => doc.isVerified).length;
  const percentage = Math.round((verifiedCount / totalCount) * 100);
  const isReady = verifiedCount === totalCount;
  return { verifiedCount, totalCount, percentage, isReady };
}

export function getStandardComplianceDocuments(): ComplianceDocument[] {
  return [
    {
      id: "doc-caste",
      category: "IDENTITY",
      title: "Scheduled Caste (SC) Certificate",
      description: "Statutory community caste certificate issued by Tehsildar / Sub-Divisional Magistrate (SDM).",
      authority: "Revenue Department / SDM Office",
      isVerified: true,
    },
    {
      id: "doc-income",
      category: "IDENTITY",
      title: "Annual Family Income Certificate",
      description: "Certified total family income not exceeding Rs. 5.00 Lakhs per annum for concessional quota.",
      authority: "Tehsildar / Competent State Authority",
      isVerified: true,
    },
    {
      id: "doc-kyc",
      category: "IDENTITY",
      title: "Aadhaar Card & Identity Proof",
      description: "Government photo identity proof with current residential address.",
      authority: "UIDAI / Election Commission of India",
      isVerified: true,
    },
    {
      id: "doc-quotation",
      category: "ENTERPRISE",
      title: "Machinery / Equipment Cost Quotation",
      description: "GST-compliant proforma invoice for business assets, machinery, or raw materials to be procured.",
      authority: "Authorized Vendor / Manufacturer",
      isVerified: true,
    },
    {
      id: "doc-udyam",
      category: "ENTERPRISE",
      title: "Udyam MSME Registration / Trade License",
      description: "Micro-enterprise registration or municipal local body trade license certificate.",
      authority: "Ministry of MSME / Municipal Corporation",
      isVerified: false,
    },
    {
      id: "doc-bank",
      category: "BANKING",
      title: "Bank Account Passbook / 6-Month Statement",
      description: "Operative bank account statement showing verified IFSC and account number.",
      authority: "Commercial Bank / Regional Rural Bank",
      isVerified: true,
    },
  ];
}

export function getSampleDossier(): ApplicationDossier {
  const applicationId = "SETU-2026-LKO-8492";
  const schemeCode = "MSY";
  const concessionalAmount = 126000;
  const monthlyEmi = 3721;
  const partnerId = "lko-sca-01";

  const checksum = computeDossierChecksum({
    applicationId,
    schemeCode,
    concessionalAmount,
    monthlyEmi,
    partnerId,
  });

  return {
    applicationId,
    submissionDate: "2026-09-02T10:30:00Z",
    applicant: {
      id: "app-rekha-devi",
      fullName: "Smt. Rekha Devi",
      casteCategory: "Scheduled Caste (SC)",
      annualIncome: 180000,
      enterpriseName: "Devi Garments & Tailoring Unit",
      enterpriseActivity: "Micro-Enterprise Garment Fabrication",
      district: "Lucknow",
      state: "Uttar Pradesh",
    },
    financing: {
      schemeCode,
      schemeName: "Mahila Samriddhi Yojana (MSY)",
      totalCost: 140000,
      concessionalAmount,
      promoterContribution: 14000,
      interestRate: 4.0,
      tenureMonths: 36,
      moratoriumMonths: 3,
      monthlyEmi,
    },
    branch: {
      id: partnerId,
      name: "UP Scheduled Castes Finance & Development Corp (UPSCFDC)",
      branchName: "Hazratganj Central SCA Office",
      institutionType: "SCA",
      nodalOfficer: "Shri R. K. Gautam (General Manager)",
      contactPhone: "+91-522-2238450",
      address: "Bapu Bhawan Commercial Complex, Hazratganj, Lucknow",
      healthScore: 94,
      healthTier: "SOLVENT",
    },
    documents: getStandardComplianceDocuments(),
    checksum,
    verificationUrl: `https://schemesetu.gov.in/verify?dossierId=${applicationId}&chk=${checksum}`,
  };
}
