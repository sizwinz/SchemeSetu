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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        lead.applicantName.toLowerCase().includes(q) ||
        lead.applicationId.toLowerCase().includes(q) ||
        lead.enterpriseActivity.toLowerCase().includes(q) ||
        lead.schemeName.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (statusFilter !== "ALL" && lead.status !== statusFilter) {
      return false;
    }

    return true;
  });

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case "PRE_SCREENED":
        return (
          <Badge variant="outline" className="text-[10px] text-blue-700 bg-blue-50/50 border-blue-200">
            Pre-Screened
          </Badge>
        );
      case "DOCUMENTS_VERIFIED":
        return (
          <Badge variant="warning" className="text-[10px]">
            Docs Verified
          </Badge>
        );
      case "CREDIT_SANCTIONED":
        return (
          <Badge variant="success" className="text-[10px]">
            Sanctioned
          </Badge>
        );
      case "DISBURSED":
        return (
          <Badge variant="default" className="text-[10px] bg-slate-900 text-white">
            Disbursed
          </Badge>
        );
      default:
        return null;
    }
  };

  const getNextAction = (lead: BeneficiaryLead) => {
    switch (lead.status) {
      case "PRE_SCREENED":
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onUpdateStatus(lead.id, "DOCUMENTS_VERIFIED")}
            className="text-[11px] h-7 px-2.5 rounded-lg border-amber-300 text-amber-800 hover:bg-amber-50"
          >
            <FileCheck className="h-3 w-3 mr-1" />
            Verify Documents
          </Button>
        );
      case "DOCUMENTS_VERIFIED":
        return (
          <Button
            size="sm"
            variant="accent"
            onClick={() => onUpdateStatus(lead.id, "CREDIT_SANCTIONED")}
            className="text-[11px] h-7 px-2.5 rounded-lg"
          >
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Sanction Credit
          </Button>
        );
      case "CREDIT_SANCTIONED":
        return (
          <Button
            size="sm"
            variant="default"
            onClick={() => onUpdateStatus(lead.id, "DISBURSED")}
            className="text-[11px] h-7 px-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white"
          >
            <Send className="h-3 w-3 mr-1" />
            Disburse Funds
          </Button>
        );
      case "DISBURSED":
        return (
          <span className="text-[11px] text-slate-400 italic flex items-center gap-1 font-mono">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
            Completed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden space-y-4">
      {/* Header with Remaining Quota Tracker */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            Assigned Beneficiary Routing Queue
          </h3>
          <p className="text-xs text-slate-500">
            Review pre-screened applications routed to Lucknow District SCA Branch
          </p>
        </div>

        <Badge variant="sovereign" className="text-xs py-1 px-3">
          <Building2 className="h-3.5 w-3.5 mr-1" />
          <span>Remaining Quota: ₹{branchQuotaLakhs.toFixed(2)} Lakhs</span>
        </Badge>
      </div>

      {/* Filter Toolbar */}
      <div className="px-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by applicant name, ID, or activity..."
            className="w-full text-xs py-2 pl-8 pr-3 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Status Stage Segment Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-xs font-semibold">
          {[
            { id: "ALL", label: "All Leads" },
            { id: "PRE_SCREENED", label: "Pre-Screened" },
            { id: "DOCUMENTS_VERIFIED", label: "Docs Verified" },
            { id: "CREDIT_SANCTIONED", label: "Sanctioned" },
            { id: "DISBURSED", label: "Disbursed" },
          ].map((stage) => (
            <button
              key={stage.id}
              type="button"
              onClick={() => setStatusFilter(stage.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === stage.id
                  ? "bg-slate-900 text-white shadow-2xs font-bold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {stage.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table of Leads */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left text-slate-600 font-mono tabular-nums">
          <thead className="text-[11px] text-slate-500 uppercase bg-slate-50/90 font-sans border-y border-slate-200">
            <tr>
              <th className="px-4 py-3 font-semibold">Applicant &amp; ID</th>
              <th className="px-4 py-3 font-semibold">Enterprise Activity</th>
              <th className="px-4 py-3 font-semibold">Scheme Code</th>
              <th className="px-4 py-3 font-semibold">Sanction Amount</th>
              <th className="px-4 py-3 font-semibold">Status Stage</th>
              <th className="px-4 py-3 font-semibold text-right">Workflow Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3 font-sans">
                    <span className="font-bold text-slate-900 block">{lead.applicantName}</span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {lead.applicationId}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-sans text-slate-700 max-w-xs truncate">
                    {lead.enterpriseActivity}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-[10px]">
                      {lead.schemeCode}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-900">
                    ₹{lead.concessionalAmount.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3 font-sans">{getStatusBadge(lead.status)}</td>
                  <td className="px-4 py-3 font-sans text-right">{getNextAction(lead)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400 font-sans">
                  No applicant leads found matching current search or stage filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
