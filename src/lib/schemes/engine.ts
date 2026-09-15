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

const ACTIVITY_SCHEME_PREFERENCES: Record<string, SchemeRule["code"][]> = {
  kirana: ["MCF"],
  dairy: ["MCF"],
  tailoring: ["MSY", "MCF"],
  artisanal: ["MSY", "MCF"],
  transport: ["TERM_LOAN"],
  manufacturing: ["TERM_LOAN"],
};

export function rankSchemesByBenefit(
  schemes: SchemeRule[],
  projectCategory?: string
): SchemeRule[] {
  const preferredCodes = projectCategory
    ? ACTIVITY_SCHEME_PREFERENCES[projectCategory]
    : undefined;

  return [...schemes].sort((a, b) => {
    // Activity fit is evaluated before financial tie-breakers. This avoids
    // recommending a women-focused handicraft scheme for a retail kiosk only
    // because the applicant also happens to be a woman.
    if (preferredCodes) {
      const aPreference = preferredCodes.indexOf(a.code);
      const bPreference = preferredCodes.indexOf(b.code);
      const aMatches = aPreference !== -1;
      const bMatches = bPreference !== -1;

      if (aMatches !== bMatches) return aMatches ? -1 : 1;
      if (aMatches && bMatches && aPreference !== bPreference) {
        return aPreference - bPreference;
      }
    }

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
      if (profile.gender !== "FEMALE" && profile.targetGroup !== "SC_WOMEN") {
        qualifies = false;
      }
    }

    if (qualifies) {
      eligibleSchemes.push(scheme);
    }
  }

  if (eligibleSchemes.length > 0) {
    const ranked = rankSchemesByBenefit(eligibleSchemes, profile.projectCategory);
    const primaryScheme = ranked[0];
    const otherEligible = ranked.slice(1);

    otherEligible.forEach((s) => {
      if (!suggestedAlternatives.some((alt) => alt.id === s.id)) {
        suggestedAlternatives.push(s);
      }
    });

    const calculatedFunding = calculateFundingBreakdown(primaryScheme, cost);

    return {
      isEligible: true,
      primaryScheme,
      eligibleSchemes: ranked,
      rejectionReasons: [],
      suggestedAlternatives,
      calculatedFunding,
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
