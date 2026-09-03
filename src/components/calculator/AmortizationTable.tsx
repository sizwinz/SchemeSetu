"use client";

import React, { useState } from "react";
import { AmortizationRow, AnnualSummaryRow } from "@/lib/calculator/types";
import { exportAmortizationCSV } from "@/lib/calculator/engine";
import { Download, Table as TableIcon, Calendar } from "lucide-react";
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

  const handleDownloadCSV = () => {
    const csvContent = exportAmortizationCSV(monthlySchedule);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `schemesetu_amortization_schedule_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Header & Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <TableIcon className="h-4 w-4 text-amber-600" />
            Repayment Amortization Schedule
          </h3>
          <p className="text-xs text-slate-500">
            Transparent schedule of principal reduction, interest, and moratorium distribution
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode("annual")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "annual"
                  ? "bg-white text-slate-900 shadow-2xs font-bold"
                  : "text-slate-500 hover:text-slate-800"
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
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Monthly ({monthlySchedule.length}m)
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadCSV}
            className="rounded-xl flex items-center space-x-1.5"
            title="Download CSV"
          >
            <Download className="h-3.5 w-3.5 text-slate-600" />
            <span className="hidden sm:inline">Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto max-h-[500px]">
        {viewMode === "annual" ? (
          <table className="w-full text-xs text-left text-slate-600 font-mono tabular-nums">
            <thead className="text-[11px] text-slate-500 uppercase bg-slate-50/90 sticky top-0 font-sans border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-semibold">Year</th>
                <th className="px-4 py-3 font-semibold">Opening Balance</th>
                <th className="px-4 py-3 font-semibold">Principal Paid</th>
                <th className="px-4 py-3 font-semibold">Interest Paid</th>
                <th className="px-4 py-3 font-semibold">Gestation Surcharge</th>
                <th className="px-4 py-3 font-semibold">Total Paid</th>
                <th className="px-4 py-3 font-semibold">Closing Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {annualSummary.map((row) => (
                <tr key={row.year} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3 font-bold text-slate-900 font-sans">
                    Year {row.year}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{formatCurrency(row.openingBalance)}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {formatCurrency(row.totalPrincipalPaid)}
                  </td>
                  <td className="px-4 py-3 text-amber-700">{formatCurrency(row.totalInterestPaid)}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {row.totalMoratoriumPaid > 0 ? formatCurrency(row.totalMoratoriumPaid) : "-"}
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-900">{formatCurrency(row.totalPaid)}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {formatCurrency(row.closingBalance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-xs text-left text-slate-600 font-mono tabular-nums">
            <thead className="text-[11px] text-slate-500 uppercase bg-slate-50/90 sticky top-0 font-sans border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-semibold">Month</th>
                <th className="px-4 py-3 font-semibold">Opening Balance</th>
                <th className="px-4 py-3 font-semibold">Principal Paid</th>
                <th className="px-4 py-3 font-semibold">Interest Paid</th>
                <th className="px-4 py-3 font-semibold">Moratorium Surcharge</th>
                <th className="px-4 py-3 font-semibold">Total Installment</th>
                <th className="px-4 py-3 font-semibold">Closing Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {monthlySchedule.map((row) => (
                <tr key={row.month} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-2.5 font-bold text-slate-900 font-sans">
                    M{row.month}
                  </td>
                  <td className="px-4 py-2.5 text-slate-600">{formatCurrency(row.openingBalance)}</td>
                  <td className="px-4 py-2.5 font-semibold text-slate-900">
                    {row.principalPaid === 0 ? (
                      <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-sans">
                        Grace Period
                      </span>
                    ) : (
                      formatCurrency(row.principalPaid)
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-amber-700">{formatCurrency(row.interestPaid)}</td>
                  <td className="px-4 py-2.5 text-slate-500">
                    {row.moratoriumPaid > 0 ? formatCurrency(row.moratoriumPaid) : "-"}
                  </td>
                  <td className="px-4 py-2.5 font-bold text-slate-900">
                    {formatCurrency(row.totalPayment)}
                  </td>
                  <td className="px-4 py-2.5 font-semibold text-slate-900">
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
