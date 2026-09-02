import {
  LoanParameters,
  CalculationResult,
  CommercialComparison,
  AmortizationRow,
  AnnualSummaryRow,
} from "./types";

export function calculateStandardEMI(
  principal: number,
  annualRate: number,
  tenureMonths: number
): number {
  if (tenureMonths <= 0) return principal;
  if (annualRate <= 0) {
    return Math.round(principal / tenureMonths);
  }

  const monthlyRate = annualRate / 100 / 12;
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  const emi = (principal * monthlyRate * factor) / (factor - 1);
  return Math.round(emi);
}

export function calculateMoratoriumAccrual(
  principal: number,
  annualRate: number,
  moratoriumMonths: number
): number {
  if (moratoriumMonths <= 0 || annualRate <= 0 || principal <= 0) return 0;
  // NSFDC Simple Interest Convention: (P * R * T)
  const gestationYears = moratoriumMonths / 12;
  const interest = principal * (annualRate / 100) * gestationYears;
  return Math.round(interest);
}

export function calculateCommercialComparison(
  providerName: string,
  annualRate: number,
  principal: number,
  tenureMonths: number,
  concessionalEffectiveEMI: number,
  concessionalTotalPayable: number
): CommercialComparison {
  const monthlyEMI = calculateStandardEMI(principal, annualRate, tenureMonths);
  const totalPayable = monthlyEMI * tenureMonths;
  const totalInterest = Math.max(0, totalPayable - principal);
  const lifetimeSavings = Math.max(0, totalPayable - concessionalTotalPayable);
  const monthlySavings = Math.max(0, monthlyEMI - concessionalEffectiveEMI);
  const savingsPercentage =
    totalInterest > 0 ? Math.round((lifetimeSavings / totalInterest) * 100) : 0;

  return {
    providerName,
    annualRate,
    monthlyEMI,
    totalInterest,
    totalPayable,
    lifetimeSavings,
    monthlySavings,
    savingsPercentage,
  };
}

export function calculateConcessionalLoan(
  params: LoanParameters
): CalculationResult {
  const principal = Math.max(10000, Math.round(params.principal));
  const annualInterestRate = Math.max(0, params.annualInterestRate);
  const tenureYears = Math.max(1, params.tenureYears);
  const tenureMonths = tenureYears * 12;
  const moratoriumMonths = Math.max(0, Math.min(24, Math.round(params.moratoriumMonths)));

  const standardEMI = calculateStandardEMI(principal, annualInterestRate, tenureMonths);
  const accruedGestationInterest = calculateMoratoriumAccrual(
    principal,
    annualInterestRate,
    moratoriumMonths
  );

  const monthlyMoratoriumSurcharge =
    tenureMonths > 0 ? Math.round(accruedGestationInterest / tenureMonths) : 0;
  const effectiveMonthlyEMI = standardEMI + monthlyMoratoriumSurcharge;
  const totalPayable = effectiveMonthlyEMI * tenureMonths;
  const totalConcessionalInterest = Math.max(0, totalPayable - principal);

  const bankComparison = calculateCommercialComparison(
    "Commercial Bank",
    14.0,
    principal,
    tenureMonths,
    effectiveMonthlyEMI,
    totalPayable
  );

  const nbfcComparison = calculateCommercialComparison(
    "NBFC-MFI Micro-Lender",
    18.0,
    principal,
    tenureMonths,
    effectiveMonthlyEMI,
    totalPayable
  );

  return {
    principal,
    annualInterestRate,
    tenureYears,
    tenureMonths,
    moratoriumMonths,
    standardEMI,
    accruedGestationInterest,
    monthlyMoratoriumSurcharge,
    effectiveMonthlyEMI,
    totalConcessionalInterest,
    totalPayable,
    comparisons: {
      bank: bankComparison,
      nbfc: nbfcComparison,
    },
  };
}

export function generateAmortizationSchedule(
  params: LoanParameters
): AmortizationRow[] {
  const result = calculateConcessionalLoan(params);
  const schedule: AmortizationRow[] = [];

  let currentBalance = result.principal;
  const monthlyRate = result.annualInterestRate / 100 / 12;

  for (let month = 1; month <= result.tenureMonths; month++) {
    const openingBalance = currentBalance;
    const isFinalMonth = month === result.tenureMonths;

    let interestPaid = Math.round(openingBalance * monthlyRate);
    let principalPaid = result.standardEMI - interestPaid;

    if (isFinalMonth || principalPaid > openingBalance) {
      principalPaid = openingBalance;
    }

    const moratoriumPaid = result.monthlyMoratoriumSurcharge;
    const totalPayment = principalPaid + interestPaid + moratoriumPaid;
    const closingBalance = Math.max(0, openingBalance - principalPaid);

    schedule.push({
      month,
      openingBalance,
      principalPaid,
      interestPaid,
      moratoriumPaid,
      totalPayment,
      closingBalance,
    });

    currentBalance = closingBalance;
  }

  return schedule;
}

export function generateAnnualSummary(
  schedule: AmortizationRow[]
): AnnualSummaryRow[] {
  const annualSummaries: AnnualSummaryRow[] = [];
  const totalYears = Math.ceil(schedule.length / 12);

  for (let year = 1; year <= totalYears; year++) {
    const startIdx = (year - 1) * 12;
    const endIdx = Math.min(year * 12, schedule.length);
    const yearRows = schedule.slice(startIdx, endIdx);

    if (yearRows.length === 0) continue;

    const openingBalance = yearRows[0].openingBalance;
    const closingBalance = yearRows[yearRows.length - 1].closingBalance;

    const totalPrincipalPaid = yearRows.reduce(
      (sum, row) => sum + row.principalPaid,
      0
    );
    const totalInterestPaid = yearRows.reduce(
      (sum, row) => sum + row.interestPaid,
      0
    );
    const totalMoratoriumPaid = yearRows.reduce(
      (sum, row) => sum + row.moratoriumPaid,
      0
    );
    const totalPaid = yearRows.reduce(
      (sum, row) => sum + row.totalPayment,
      0
    );

    annualSummaries.push({
      year,
      openingBalance,
      totalPrincipalPaid,
      totalInterestPaid,
      totalMoratoriumPaid,
      totalPaid,
      closingBalance,
    });
  }

  return annualSummaries;
}

export function exportAmortizationCSV(schedule: AmortizationRow[]): string {
  const headers = [
    "Month",
    "Opening Balance (INR)",
    "Principal (INR)",
    "Interest (INR)",
    "Moratorium Surcharge (INR)",
    "Total Installment (INR)",
    "Closing Balance (INR)",
  ];

  const rows = schedule.map((row) =>
    [
      row.month,
      row.openingBalance,
      row.principalPaid,
      row.interestPaid,
      row.moratoriumPaid,
      row.totalPayment,
      row.closingBalance,
    ].join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}
