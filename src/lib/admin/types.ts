import { QrPayload } from "../dossier/types";
import { ChannelPartner, HealthTier } from "../partners/types";

export type LeadStatus =
  | "PRE_SCREENED"
  | "DOCUMENTS_VERIFIED"
  | "CREDIT_SANCTIONED"
  | "DISBURSED"
  | "REJECTED";

export interface BeneficiaryLead {
  id: string;
  applicationId: string;
  applicantName: string;
  casteCategory: string;
  annualIncome: number;
  enterpriseActivity: string;
  schemeCode: string;
  schemeName: string;
  projectCost: number;
  concessionalAmount: number;
  monthlyEmi: number;
  designatedBranchId: string;
  designatedBranchName: string;
  status: LeadStatus;
  submissionDate: string;
  verifiedDate?: string;
  sanctionedDate?: string;
  disbursedDate?: string;
  remarks?: string;
}

export interface NationalGovernanceMetrics {
  totalLeads: number;
  totalSanctionedValueCr: number;
  averageTurnaroundDays: number;
  nationalQuotaUtilizationPct: number;
  solventBranchesCount: number;
  moderateBranchesCount: number;
  highRiskBranchesCount: number;
}

export interface QrVerificationResult {
  isValid: boolean;
  isTampered: boolean;
  payload: QrPayload | null;
  statusMessage: string;
}

export interface NetworkHealthSummary {
  npaCeiling: number;
  solventCount: number;
  moderateCount: number;
  highRiskCount: number;
  partners: (ChannelPartner & { dynamicHealthTier: HealthTier })[];
}
