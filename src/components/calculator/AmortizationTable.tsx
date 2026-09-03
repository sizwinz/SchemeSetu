"use client";

import React, { useState } from "react";
import { AmortizationRow, AnnualSummaryRow } from "@/lib/calculator/types";
import { Table, Download, Eye, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AmortizationTableProps {
  monthlySchedule: AmortizationRow[];
  annualSummary: AnnualSummaryRow[];
}

export function AmortizationTable({
  monthlySchedule,
  annualSummary,
}: AmortizationTableProps) {
  const [viewMode, setViewMode] = useState<"annual" | "monthly">("annual");

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleExportCSV = () => {
    const headers = [
      "Period",
      "Opening Balance",
      "Principal Paid",
      "Interest Paid",
      "Gestation Surcharge",
      "Total Payment",
      "Closing Balance",
    ];

    const dataRows =
      viewMode === "annual"
        ? annualSummary.map((row) => [
            `Year ${row.year}`,
            row.openingBalance,
            row.totalPrincipalPaid,
            row.totalInterestPaid,
            row.totalMoratoriumPaid,
            row.totalPaid,
            row.closingBalance,
          ])
        : monthlySchedule.map((row) => [
            `Month ${row.month}`,
            row.openingBalance,
            row.principalPaid,
            row.interestPaid,
            row.moratoriumPaid,
            row.totalPayment,
            row.closingBalance,
          ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...dataRows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `schemesetu_amortization_${viewMode}_${Date.now()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Header & Controls */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Table className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Repayment Amortization Schedule
            </h3>
            <p className="text-xs text-slate-500">
              Transparent breakdown of principal reduction, interest, and gestation surcharge
            </p>
          </div>
        </div>

        {/* View Mode Switcher and CSV Export */}
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode("annual")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "annual"
                  ? "bg-white text-slate-900 shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Annual Summary
            </button>
            <button
              type="button"
              onClick={() => setViewMode("monthly")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "monthly"
                  ? "bg-white text-slate-900 shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Monthly ({monthlySchedule.length}m)
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="text-xs h-8 px-2.5 rounded-xl text-slate-700"
          >
            <Download className="h-3.5 w-3.5 mr-1" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto max-h-[480px]">
        {viewMode === "annual" ? (
          <table className="w-full text-xs text-left text-slate-700 font-sans">
            <thead className="text-[11px] text-slate-500 uppercase bg-slate-50/90 sticky top-0 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-bold text-slate-700">Year</th>
                <th className="px-4 py-3 font-semibold text-right">Opening Balance</th>
                <th className="px-4 py-3 font-semibold text-right">Principal Paid</th>
                <th className="px-4 py-3 font-semibold text-right">Interest Paid</th>
                <th className="px-4 py-3 font-semibold text-right">Gestation Surcharge</th>
                <th className="px-4 py-3 font-semibold text-right">Total Paid</th>
                <th className="px-4 py-3 font-semibold text-right">Closing Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {annualSummary.map((row) => (
                <tr key={row.year} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3 font-bold text-slate-900">
                    Year {row.year}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-600 tabular-nums">
                    {formatCurrency(row.openingBalance)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-900 tabular-nums">
                    {formatCurrency(row.totalPrincipalPaid)}
                  </td>
                  <td className="px-4 py-3 text-right text-amber-800 tabular-nums font-medium">
                    {formatCurrency(row.totalInterestPaid)}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-500 tabular-nums">
                    {row.totalMoratoriumPaid > 0 ? formatCurrency(row.totalMoratoriumPaid) : "-"}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900 tabular-nums">
                    {formatCurrency(row.totalPaid)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-900 tabular-nums">
                    {formatCurrency(row.closingBalance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-xs text-left text-slate-700 font-sans">
            <thead className="text-[11px] text-slate-500 uppercase bg-slate-50/90 sticky top-0 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-bold text-slate-700">Month</th>
                <th className="px-4 py-3 font-semibold text-right">Opening Balance</th>
                <th className="px-4 py-3 font-semibold text-right">Principal Paid</th>
                <th className="px-4 py-3 font-semibold text-right">Interest Paid</th>
                <th className="px-4 py-3 font-semibold text-right">Moratorium Surcharge</th>
                <th className="px-4 py-3 font-semibold text-right">Total Installment</th>
                <th className="px-4 py-3 font-semibold text-right">Closing Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {monthlySchedule.map((row) => (
                <tr key={row.month} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-2.5 font-bold text-slate-900">
                    M{row.month}
                  </td>
                  <td className="px-4 py-2.5 text-right text-slate-600 tabular-nums">
                    {formatCurrency(row.openingBalance)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-semibold text-slate-900 tabular-nums">
                    {row.principalPaid === 0 ? (
                      <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-medium">
                        Grace Period
                      </span>
                    ) : (
                      formatCurrency(row.principalPaid)
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-right text-amber-800 tabular-nums font-medium">
                    {formatCurrency(row.interestPaid)}
                  </td>
                  <td className="px-4 py-2.5 text-right text-slate-500 tabular-nums">
                    {row.moratoriumPaid > 0 ? formatCurrency(row.moratoriumPaid) : "-"}
                  </td>
                  <td className="px-4 py-2.5 text-right font-bold text-slate-900 tabular-nums">
                    {formatCurrency(row.totalPayment)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-semibold text-slate-900 tabular-nums">
                    {formatCurrency(row.closingBalance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
