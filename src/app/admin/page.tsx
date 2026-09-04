"use client";

import React, { useState } from "react";
import { PRESEEDED_LEADS } from "@/lib/admin/data";
import { PRESEEDED_PARTNERS } from "@/lib/partners/data";
import { BeneficiaryLead, LeadStatus } from "@/lib/admin/types";
import { progressLeadStatus } from "@/lib/admin/engine";
import { QrVerificationDesk } from "@/components/admin/QrVerificationDesk";
import { BranchLeadQueue } from "@/components/admin/BranchLeadQueue";
import { MinistryGovernance } from "@/components/admin/MinistryGovernance";
import { Building2, Landmark, ShieldCheck, IndianRupee, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"branch" | "ministry">("branch");
  const [leads, setLeads] = useState<BeneficiaryLead[]>(PRESEEDED_LEADS);
  const [branchQuotaLakhs, setBranchQuotaLakhs] = useState<number>(85.0);

  const handleUpdateLeadStatus = (leadId: string, newStatus: LeadStatus) => {
    const targetLead = leads.find((l) => l.id === leadId);
    if (!targetLead) return;

    const { updatedLead, updatedQuotaLakhs } = progressLeadStatus(
      targetLead,
      newStatus,
      branchQuotaLakhs
    );

    setLeads((prev) => prev.map((l) => (l.id === leadId ? updatedLead : l)));
    setBranchQuotaLakhs(updatedQuotaLakhs);
  };

  const sanctionedTotalCr =
    leads
      .filter((l) => l.status === "CREDIT_SANCTIONED" || l.status === "DISBURSED")
      .reduce((sum, l) => sum + l.concessionalAmount, 0) / 10000000;

  return (
    <div className="space-y-4 sm:space-y-6 max-w-[1600px] mx-auto pb-8 sm:pb-16 px-4 sm:px-6 lg:px-8 2xl:px-12 pt-3 sm:pt-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-amber-500/10 text-amber-600 rounded-xl shrink-0">
              <Landmark className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h1 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight">
              Institutional Administration &amp; MoSJE Governance
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time pre-screened applicant queues, cryptographic QR verification desk, and national Channel Partner lending health governance.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <Badge variant="sovereign" className="text-xs py-1 px-3">
            <ShieldCheck className="h-3.5 w-3.5 mr-1" />
            <span>MoSJE / NSFDC Authorized</span>
          </Badge>
        </div>
      </div>

      {/* Primary Role Navigation Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 sm:gap-2 bg-slate-100 p-1.5 rounded-2xl w-full sm:w-fit">
        <button
          type="button"
          onClick={() => setActiveTab("branch")}
          className={`flex items-center justify-center space-x-2 px-3 sm:px-4 py-2.5 sm:py-2 min-h-[44px] rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "branch"
              ? "bg-white text-slate-900 shadow-2xs font-bold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Building2 className="h-4 w-4 text-amber-600 shrink-0" />
          <span>Branch Officer Console</span>
          <span className="ml-1 text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
            {leads.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("ministry")}
          className={`flex items-center justify-center space-x-2 px-3 sm:px-4 py-2.5 sm:py-2 min-h-[44px] rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "ministry"
              ? "bg-white text-slate-900 shadow-2xs font-bold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Layers className="h-4 w-4 text-amber-600 shrink-0" />
          <span>MoSJE Network Governance</span>
          <span className="ml-1 text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
            {PRESEEDED_PARTNERS.length} Partners
          </span>
        </button>
      </div>

      {/* Tab 1: Branch Officer Console */}
      {activeTab === "branch" && (
        <div className="space-y-6">
          {/* Physical Countertop QR Scanner Desk */}
          <QrVerificationDesk
            leads={leads}
            onVerifyLead={(leadId) => handleUpdateLeadStatus(leadId, "DOCUMENTS_VERIFIED")}
          />

          {/* Assigned Beneficiary Lead Queue */}
          <BranchLeadQueue
            leads={leads}
            onUpdateStatus={handleUpdateLeadStatus}
            branchQuotaLakhs={branchQuotaLakhs}
          />
        </div>
      )}

      {/* Tab 2: Ministry Network Governance */}
      {activeTab === "ministry" && (
        <MinistryGovernance
          initialPartners={PRESEEDED_PARTNERS}
          totalLeadsCount={leads.length}
          totalSanctionedCr={sanctionedTotalCr + 24.5}
        />
      )}
    </div>
  );
}
