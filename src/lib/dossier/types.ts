export type ComplianceCategory = "IDENTITY" | "ENTERPRISE" | "BANKING";

export interface ComplianceDocument {
  id: string;
  category: ComplianceCategory;
  title: string;
  description: string;
  authority: string;
  isVerified: boolean;
}

export interface ApplicantProfile {
  id: string;
  fullName: string;
  casteCategory: string;
  annualIncome: number;
  enterpriseName: string;
  enterpriseActivity: string;
  district: string;
  state: string;
}

export interface FinancingDetails {
  schemeCode: string;
  schemeName: string;
  totalCost: number;
  concessionalAmount: number;
  promoterContribution: number;
  interestRate: number;
  tenureMonths: number;
  moratoriumMonths: number;
  monthlyEmi: number;
}

export interface DesignatedBranch {
  id: string;
  name: string;
  branchName: string;
  institutionType: string;
  nodalOfficer: string;
  contactPhone: string;
  address: string;
  healthScore: number;
  healthTier: string;
}

export interface ApplicationDossier {
  applicationId: string;
  submissionDate: string;
  applicant: ApplicantProfile;
  financing: FinancingDetails;
  branch: DesignatedBranch;
  documents: ComplianceDocument[];
  checksum: string;
  verificationUrl: string;
}

export interface QrPayload {
  app: string;
  sc: string;
  ca: number;
  emi: number;
  bp: string;
  chk: string;
  ts: number;
}
