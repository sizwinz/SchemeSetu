"use client";

import React from "react";
import { ComplianceDocument } from "@/lib/dossier/types";
import { calculateDocumentReadiness } from "@/lib/dossier/engine";
import { CheckCircle2, AlertCircle, FileCheck, Shield } from "lucide-react";

interface DocumentChecklistProps {
  documents: ComplianceDocument[];
  onToggleDocument: (id: string) => void;
  className?: string;
}

export function DocumentChecklist({
  documents,
  onToggleDocument,
  className = "",
}: DocumentChecklistProps) {
  const readiness = calculateDocumentReadiness(documents);

  const categories: { key: "IDENTITY" | "ENTERPRISE" | "BANKING"; label: string }[] = [
    { key: "IDENTITY", label: "Category A: Identity & Socio-Economic Verification" },
    { key: "ENTERPRISE", label: "Category B: Enterprise Feasibility & Quotations" },
    { key: "BANKING", label: "Category C: Banking & Disbursement Records" },
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Readiness Progress Banner */}
      <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <div className="flex items-center space-x-2">
            <FileCheck className="h-5 w-5 text-mosje-saffron" />
            <h4 className="text-xs sm:text-sm font-bold text-mosje-navy">
              Statutory Document Compliance Checklist
            </h4>
          </div>

          <span
            className={`text-xs font-bold font-mono px-2.5 py-1 rounded-full border ${
              readiness.isReady
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-amber-50 text-amber-800 border-amber-200"
            }`}
          >
            {readiness.verifiedCount} of {readiness.totalCount} Verified ({readiness.percentage}%)
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              readiness.isReady ? "bg-emerald-600" : "bg-mosje-saffron"
            }`}
            style={{ width: `${readiness.percentage}%` }}
          />
        </div>

        <p className="text-[11px] text-slate-500 mt-2">
          {readiness.isReady
            ? "All statutory documents verified. Your application packet is 100% ready for branch submission."
            : "Review and gather the remaining required documents before presenting your physical dossier at the branch."}
        </p>
      </div>

      {/* Categorized Document Groups */}
      <div className="space-y-4">
        {categories.map((cat) => {
          const catDocs = documents.filter((d) => d.category === cat.key);
          if (catDocs.length === 0) return null;

          return (
            <div key={cat.key} className="space-y-2">
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1">
                {cat.label}
              </h5>

              <div className="grid grid-cols-1 gap-2">
                {catDocs.map((doc) => (
                  <label
                    key={doc.id}
                    onClick={() => onToggleDocument(doc.id)}
                    className={`flex items-start space-x-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                      doc.isVerified
                        ? "bg-emerald-50/50 border-emerald-200 text-slate-900"
                        : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={doc.isVerified}
                      onChange={() => {}} // handled by container onClick
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 shrink-0 accent-emerald-600"
                    />

                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold leading-tight">
                          {doc.title}
                        </span>
                        {doc.isVerified && (
                          <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100/70 px-1.5 py-0.2 rounded">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-normal">
                        {doc.description}
                      </p>
                      <div className="text-[10px] text-slate-400 font-medium">
                        Issuing Authority: {doc.authority}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
