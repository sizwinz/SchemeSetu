"use client";

import React, { useState } from "react";
import { BeneficiaryLead, LeadStatus } from "@/lib/admin/types";
import {
  Search,
  Filter,
  CheckCircle2,
  FileCheck,
  Building2,
  ArrowRight,
  XCircle,
  Clock,
  Send,
} from "lucide-react";

interface BranchLeadQueueProps {
  leads: BeneficiaryLead[];
  onUpdateStatus: (leadId: string, newStatus: LeadStatus) => void;
  branchQuotaLakhs: number;
}

export function BranchLeadQueue({
  leads,
  onUpdateStatus,
  branchQuotaLakhs,
}: BranchLeadQueueProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filteredLeads = leads.filter((lead) => {
    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        lead.applicantName.toLowerCase().includes(q) ||
        lead.applicationId.toLowerCase().includes(q) ||
        lead.enterpriseActivity.toLowerCase().includes(q) ||
        lead.schemeName.toLowerCase().includes(q);
      if (!match) return false;
    }

    // 2. Status Filter
    if (statusFilter !== "ALL" && lead.status !== statusFilter) {
      return false;
    }

    return true;
  });

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case "PRE_SCREENED":
        return (
          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Pre-Screened
          </span>
        );
      case "DOCUMENTS_VERIFIED":
        return (
          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            Docs Verified
          </span>
        );
      case "CREDIT_SANCTIONED":
        return (
          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            Sanctioned
          </span>
        );
      case "DISBURSED":
        return (
          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Disbursed
          </span>
        );
      case "REJECTED":
        return (
          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
            Rejected
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden space-y-4 p-4 sm:p-5">
      {/* Header with Search and Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-mosje-navy">
            Designated Incoming Beneficiary Leads
          </h3>
          <p className="text-[11px] text-slate-500">
            Showing {filteredLeads.length} applications assigned to this branch
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, ID, or activity..."
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold py-1.5 px-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="PRE_SCREENED">Pre-Screened</option>
            <option value="DOCUMENTS_VERIFIED">Docs Verified</option>
            <option value="CREDIT_SANCTIONED">Sanctioned</option>
            <option value="DISBURSED">Disbursed</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-[11px] text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3">Application ID</th>
              <th className="py-2.5 px-3">Applicant & Activity</th>
              <th className="py-2.5 px-3">Scheme & Sum</th>
              <th className="py-2.5 px-3">Monthly EMI</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Workflow Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-900 block">{lead.applicationId}</span>
                    <span className="text-[10px] text-slate-400 font-sans">
                      {new Date(lead.submissionDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </span>
                  </td>

                  <td className="py-3 px-3 font-sans">
                    <span className="font-bold text-slate-900 block">{lead.applicantName}</span>
                    <span className="text-[11px] text-slate-500 block leading-tight">
                      {lead.enterpriseActivity}
                    </span>
                  </td>

                  <td className="py-3 px-3 font-sans">
                    <span className="font-semibold text-mosje-navy block">{lead.schemeName}</span>
                    <span className="font-mono text-emerald-700 font-bold">
                      ₹{lead.concessionalAmount.toLocaleString("en-IN")}
                    </span>
                  </td>

                  <td className="py-3 px-3 font-mono font-bold text-slate-800">
                    ₹{lead.monthlyEmi.toLocaleString("en-IN")}
                  </td>

                  <td className="py-3 px-3 font-sans">{getStatusBadge(lead.status)}</td>

                  <td className="py-3 px-3 text-right font-sans">
                    <div className="flex items-center justify-end space-x-1.5">
                      {lead.status === "PRE_SCREENED" && (
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(lead.id, "DOCUMENTS_VERIFIED")}
                          className="text-[11px] font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          Verify Docs
                        </button>
                      )}

                      {lead.status === "DOCUMENTS_VERIFIED" && (
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(lead.id, "CREDIT_SANCTIONED")}
                          className="text-[11px] font-semibold text-purple-800 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                          title="Sanction credit and deduct from branch quota"
                        >
                          Sanction Credit
                        </button>
                      )}

                      {lead.status === "CREDIT_SANCTIONED" && (
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(lead.id, "DISBURSED")}
                          className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          Disburse Funds
                        </button>
                      )}

                      {lead.status === "DISBURSED" && (
                        <span className="text-[11px] text-slate-400 font-medium italic">
                          Completed
                        </span>
                      )}

                      {lead.status !== "DISBURSED" && lead.status !== "REJECTED" && (
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(lead.id, "REJECTED")}
                          className="text-[10px] font-semibold text-slate-400 hover:text-red-600 p-1 transition-colors"
                          title="Reject application"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400 font-sans">
                  No beneficiary applications match the current search or filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
