export type TargetDemographic = "ALL_SC" | "SC_WOMEN" | "SC_STUDENTS";

export type SchemeCategory =
  | "MICRO_FINANCE"
  | "TERM_LOAN"
  | "WOMEN_EMPOWERMENT"
  | "EDUCATION";

export interface FundingBreakdown {
  nsfdcSharePercent: number;
  channelPartnerSharePercent: number;
  promoterContributionPercent: number;
  maxSubsidyAmount?: number;
}

export interface SchemeRule {
  id: string;
  name: string;
  code: "MCF" | "TERM_LOAN" | "MSY" | "ELS";
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
  educationLevel?:
    | "BELOW_10TH"
    | "10TH_PASS"
    | "12TH_PASS"
    | "GRADUATE"
    | "POST_GRADUATE";
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
  matchScore?: number;
}
