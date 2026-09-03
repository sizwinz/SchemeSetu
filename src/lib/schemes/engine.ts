import {
  SchemeRule,
  UserProfile,
  EvaluationResult,
  CalculatedFunding,
} from "./types";
import { MOSJE_SCHEMES } from "./data";

export function calculateFundingBreakdown(
  scheme: SchemeRule,
  cost: number
): CalculatedFunding {
  const sanitizedCost = Math.max(0, cost);
  const eligibleCost = Math.min(sanitizedCost, scheme.maxProjectCost);

  const nsfdcAmount = Math.round(
    eligibleCost * (scheme.fundingBreakdown.nsfdcSharePercent / 100)
  );
  const channelPartnerAmount = Math.round(
    eligibleCost * (scheme.fundingBreakdown.channelPartnerSharePercent / 100)
  );
  const promoterAmount = Math.max(
    0,
    eligibleCost - nsfdcAmount - channelPartnerAmount
  );
  const subsidyAmount = scheme.fundingBreakdown.maxSubsidyAmount ?? 0;

  return {
    totalCost: eligibleCost,
    nsfdcAmount,
    channelPartnerAmount,
    promoterAmount,
    subsidyAmount,
  };
}

export function rankSchemesByBenefit(schemes: SchemeRule[]): SchemeRule[] {
  return [...schemes].sort((a, b) => {
    if (a.interestRateMin !== b.interestRateMin) {
      return a.interestRateMin - b.interestRateMin;
    }
    if (
      b.fundingBreakdown.nsfdcSharePercent !==
      a.fundingBreakdown.nsfdcSharePercent
    ) {
      return (
        b.fundingBreakdown.nsfdcSharePercent -
        a.fundingBreakdown.nsfdcSharePercent
      );
    }
    return b.maxProjectCost - a.maxProjectCost;
  });
}

export function evaluateEligibility(
  profile: UserProfile,
  schemes: SchemeRule[] = MOSJE_SCHEMES
): EvaluationResult {
  const rejectionReasons: string[] = [];
  const eligibleSchemes: SchemeRule[] = [];
  const suggestedAlternatives: SchemeRule[] = [];

  const income = Math.max(0, profile.annualFamilyIncome);
  const cost = Math.max(0, profile.estimatedCost);

  if (income > 500000) {
    rejectionReasons.push(
      `Annual family income of Rs. ${income.toLocaleString("en-IN")} exceeds the statutory MoSJE ceiling of Rs. 5.00 Lakhs.`
    );
  }

  for (const scheme of schemes) {
    let qualifies = true;

    if (income > scheme.maxAnnualIncome) {
      qualifies = false;
    }

    if (cost > scheme.maxProjectCost) {
      qualifies = false;
      if (scheme.code === "MCF" && cost <= 5000000) {
        const termLoan = schemes.find((s) => s.code === "TERM_LOAN");
        if (termLoan && !suggestedAlternatives.some((s) => s.id === termLoan.id)) {
          suggestedAlternatives.push(termLoan);
        }
      }
    }

    if (scheme.targetGroup === "SC_WOMEN") {
      if (profile.gender && profile.gender !== "FEMALE") {
        qualifies = false;
      }
    }

    if (scheme.targetGroup === "SC_STUDENTS") {
      const isStudent =
        profile.targetGroup === "SC_STUDENTS" ||
        profile.educationLevel === "GRADUATE" ||
        profile.educationLevel === "POST_GRADUATE" ||
        profile.educationLevel === "12TH_PASS";
      if (!isStudent) {
        qualifies = false;
      }
    }

    if (qualifies) {
      eligibleSchemes.push(scheme);
    }
  }

  if (eligibleSchemes.length > 0) {
    const ranked = rankSchemesByBenefit(eligibleSchemes);
    const primaryScheme = ranked[0];
    const otherEligible = ranked.slice(1);

    otherEligible.forEach((s) => {
      if (!suggestedAlternatives.some((alt) => alt.id === s.id)) {
        suggestedAlternatives.push(s);
      }
    });

    const calculatedFunding = calculateFundingBreakdown(primaryScheme, cost);

    let matchScore = 75;
    if (income <= 250000) matchScore += 10;
    else if (income <= 400000) matchScore += 6;

    if (cost <= primaryScheme.maxProjectCost * 0.9) matchScore += 9;
    else if (cost <= primaryScheme.maxProjectCost) matchScore += 5;

    if (primaryScheme.targetGroup === "SC_WOMEN" && profile.gender === "FEMALE") matchScore += 5;
    else if (primaryScheme.targetGroup === "SC_STUDENTS") matchScore += 5;
    else matchScore += 4;

    const normalizedMatchScore = Math.min(99, Math.max(80, matchScore));

    return {
      isEligible: true,
      primaryScheme,
      eligibleSchemes: ranked,
      rejectionReasons: [],
      suggestedAlternatives,
      calculatedFunding,
      matchScore: normalizedMatchScore,
    };
  }

  if (rejectionReasons.length === 0) {
    if (cost > 5000000) {
      rejectionReasons.push(
        `Estimated project cost of Rs. ${cost.toLocaleString("en-IN")} exceeds the maximum concessional loan limit of Rs. 50.00 Lakhs.`
      );
    } else {
      rejectionReasons.push(
        "No specific scheme matched the provided profile. Consider reviewing enterprise category or cost estimates."
      );
    }
  }

  const generalAlternatives = schemes.filter(
    (s) =>
      s.maxProjectCost >= cost &&
      (s.targetGroup === "ALL_SC" || s.targetGroup === profile.targetGroup)
  );

  generalAlternatives.forEach((alt) => {
    if (!suggestedAlternatives.some((s) => s.id === alt.id)) {
      suggestedAlternatives.push(alt);
    }
  });

  return {
    isEligible: false,
    eligibleSchemes: [],
    rejectionReasons,
    suggestedAlternatives,
  };
}
