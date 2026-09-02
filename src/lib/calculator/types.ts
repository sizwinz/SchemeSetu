export interface LoanParameters {
  principal: number;
  annualInterestRate: number;
  tenureYears: number;
  moratoriumMonths: number;
}

export interface CommercialComparison {
  providerName: string;
  annualRate: number;
  monthlyEMI: number;
  totalInterest: number;
  totalPayable: number;
  lifetimeSavings: number;
  monthlySavings: number;
  savingsPercentage: number;
}

export interface CalculationResult {
  principal: number;
  annualInterestRate: number;
  tenureYears: number;
  tenureMonths: number;
  moratoriumMonths: number;
  standardEMI: number;
  accruedGestationInterest: number;
  monthlyMoratoriumSurcharge: number;
  effectiveMonthlyEMI: number;
  totalConcessionalInterest: number;
  totalPayable: number;
  comparisons: {
    bank: CommercialComparison;
    nbfc: CommercialComparison;
  };
}

export interface AmortizationRow {
  month: number;
  openingBalance: number;
  principalPaid: number;
  interestPaid: number;
  moratoriumPaid: number;
  totalPayment: number;
  closingBalance: number;
}

export interface AnnualSummaryRow {
  year: number;
  openingBalance: number;
  totalPrincipalPaid: number;
  totalInterestPaid: number;
  totalMoratoriumPaid: number;
  totalPaid: number;
  closingBalance: number;
}
