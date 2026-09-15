export type TargetDemographic = "ALL_SC" | "SC_WOMEN";

export type SchemeCategory =
  | "MICRO_FINANCE"
  | "TERM_LOAN"
  | "WOMEN_EMPOWERMENT";

export interface FundingBreakdown {
  nsfdcSharePercent: number;
  channelPartnerSharePercent: number;
  promoterContributionPercent: number;
  maxSubsidyAmount?: number;
}

export interface SchemeRule {
  id: string;
  name: string;
  code: "MCF" | "TERM_LOAN" | "MSY";
  category: SchemeCategory;
  targetGroup: TargetDemographic;
  maxProjectCost: number;
  maxAnnualIncome: number;
  interestRateMin: number;
  interestRateMax: number;
  repaymentTenureYears: number;
  moratoriumMonths: number;
  fundingBreakdown: FundingBreakdown;
  keyBenefits: string[];
  eligibleActivities: string[];
}

export interface UserProfile {
  annualFamilyIncome: number;
  estimatedCost: number;
  targetGroup?: TargetDemographic;
  gender?: "MALE" | "FEMALE" | "OTHER";
  projectCategory?: string;
}

export interface CalculatedFunding {
  totalCost: number;
  nsfdcAmount: number;
  channelPartnerAmount: number;
  promoterAmount: number;
  subsidyAmount: number;
}

export interface EvaluationResult {
  isEligible: boolean;
  primaryScheme?: SchemeRule;
  eligibleSchemes: SchemeRule[];
  rejectionReasons: string[];
  suggestedAlternatives: SchemeRule[];
  calculatedFunding?: CalculatedFunding;
}
