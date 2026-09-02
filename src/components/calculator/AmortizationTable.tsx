"use client";

import React, { useState } from "react";
import { AmortizationRow, AnnualSummaryRow } from "@/lib/calculator/types";
import { exportAmortizationCSV } from "@/lib/calculator/engine";
import { Download, Table as TableIcon, Calendar } from "lucide-react";

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
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Header & Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-mosje-navy flex items-center gap-2">
            <TableIcon className="h-4 w-4 text-amber-600" />
            Repayment Amortization Schedule
          </h3>
          <p className="text-xs text-slate-500">
            Transparent schedule of principal reduction, interest, and moratorium distribution
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-200/70 p-0.5 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode("annual")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                viewMode === "annual"
                  ? "bg-white text-mosje-navy shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Annual Summary
            </button>
            <button
              type="button"
              onClick={() => setViewMode("monthly")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                viewMode === "monthly"
                  ? "bg-white text-mosje-navy shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Monthly ({monthlySchedule.length} mo)
            </button>
          </div>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={handleDownloadCSV}
            className="flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 hover:border-amber-500 hover:bg-amber-50/50 text-slate-700 bg-white shadow-2xs transition-colors"
            title="Download CSV amortization schedule"
          >
            <Download className="h-3.5 w-3.5 text-amber-600" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto max-h-96">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-100/90 text-slate-700 uppercase tracking-wider text-[10px] font-semibold sticky top-0 z-10 border-b border-slate-200">
            <tr>
              <th className="py-3 px-3 sm:px-4">
                {viewMode === "annual" ? "Year" : "Month"}
              </th>
              <th className="py-3 px-3 sm:px-4">Opening Balance</th>
              <th className="py-3 px-3 sm:px-4">Principal Paid</th>
              <th className="py-3 px-3 sm:px-4">Interest Paid</th>
              <th className="py-3 px-3 sm:px-4">Moratorium Surcharge</th>
              <th className="py-3 px-3 sm:px-4">Total Payment</th>
              <th className="py-3 px-3 sm:px-4">Closing Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800 font-mono tabular-nums">
            {viewMode === "annual"
              ? annualSummary.map((row) => (
                  <tr key={row.year} className="hover:bg-amber-50/20 transition-colors">
                    <td className="py-2.5 px-3 sm:px-4 font-bold text-mosje-navy flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-slate-400" />
                      Year {row.year}
                    </td>
                    <td className="py-2.5 px-3 sm:px-4 text-slate-600">
                      {formatCurrency(row.openingBalance)}
                    </td>
                    <td className="py-2.5 px-3 sm:px-4 text-slate-900 font-semibold">
                      {formatCurrency(row.totalPrincipalPaid)}
                    </td>
                    <td className="py-2.5 px-3 sm:px-4 text-amber-800">
                      {formatCurrency(row.totalInterestPaid)}
                    </td>
                    <td className="py-2.5 px-3 sm:px-4 text-slate-600">
                      {formatCurrency(row.totalMoratoriumPaid)}
                    </td>
                    <td className="py-2.5 px-3 sm:px-4 text-mosje-navy font-bold">
                      {formatCurrency(row.totalPaid)}
                    </td>
                    <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-900">
                      {formatCurrency(row.closingBalance)}
                    </td>
                  </tr>
                ))
              : monthlySchedule.map((row) => (
                  <tr key={row.month} className="hover:bg-amber-50/20 transition-colors">
                    <td className="py-2 px-3 sm:px-4 font-semibold text-mosje-navy">
                      Month {row.month}
                    </td>
                    <td className="py-2 px-3 sm:px-4 text-slate-600">
                      {formatCurrency(row.openingBalance)}
                    </td>
                    <td className="py-2 px-3 sm:px-4 text-slate-900">
                      {formatCurrency(row.principalPaid)}
                    </td>
                    <td className="py-2 px-3 sm:px-4 text-amber-800">
                      {formatCurrency(row.interestPaid)}
                    </td>
                    <td className="py-2 px-3 sm:px-4 text-slate-600">
                      {formatCurrency(row.moratoriumPaid)}
                    </td>
                    <td className="py-2 px-3 sm:px-4 text-mosje-navy font-bold">
                      {formatCurrency(row.totalPayment)}
                    </td>
                    <td className="py-2 px-3 sm:px-4 font-semibold text-slate-900">
                      {formatCurrency(row.closingBalance)}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
