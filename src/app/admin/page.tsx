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
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-amber-500/10 text-amber-600 rounded-lg">
              <Landmark className="h-6 w-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-mosje-navy tracking-tight">
              Institutional Administration & MoSJE Governance
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time pre-screened applicant queues, cryptographic QR verification desk, and national Channel Partner lending health governance.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Authority:</span>
          <span className="bg-slate-100 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full border border-slate-200">
            MoSJE / NSFDC Authorized
          </span>
        </div>
      </div>

      {/* Role Switcher Segmented Tabs */}
      <div className="bg-slate-200/80 p-1.5 rounded-2xl flex flex-col sm:flex-row gap-1 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab("branch")}
          className={`flex-1 py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer ${
            activeTab === "branch"
              ? "bg-white text-mosje-navy shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>Branch Credit Officer Portal (Lead Queue & Sanctions)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("ministry")}
          className={`flex-1 py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer ${
            activeTab === "ministry"
              ? "bg-white text-mosje-navy shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Landmark className="h-4 w-4" />
          <span>MoSJE Ministry Governance (National Health & Quota Risk Controls)</span>
        </button>
      </div>

      {/* Tab Content 1: Branch Credit Officer Portal */}
      {activeTab === "branch" && (
        <div className="space-y-6">
          {/* Branch Context Banner */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Active Branch Counter
              </span>
              <h2 className="text-base sm:text-lg font-bold text-mosje-navy">
                UP Scheduled Castes Finance & Development Corp (UPSCFDC)
              </h2>
              <p className="text-xs text-slate-500">
                Hazratganj Central SCA Office • Nodal Officer: Shri R. K. Gautam
              </p>
            </div>

            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 text-right font-mono tabular-nums">
              <span className="text-[10px] font-sans font-semibold text-slate-500 block">
                Allocated Lending Quota
              </span>
              <span className="text-lg sm:text-xl font-black text-amber-700">
                ₹{branchQuotaLakhs.toFixed(1)} Lakhs
              </span>
              <span className="text-[10px] text-slate-400 block font-sans">
                Automatically decremented upon sanction
              </span>
            </div>
          </div>

          {/* Countertop QR Verification Desk */}
          <QrVerificationDesk />

          {/* Incoming Beneficiary Leads Queue */}
          <BranchLeadQueue
            leads={leads}
            onUpdateStatus={handleUpdateLeadStatus}
            branchQuotaLakhs={branchQuotaLakhs}
          />
        </div>
      )}

      {/* Tab Content 2: MoSJE Ministry Governance */}
      {activeTab === "ministry" && (
        <MinistryGovernance
          initialPartners={PRESEEDED_PARTNERS}
          totalLeadsCount={leads.length}
          totalSanctionedCr={sanctionedTotalCr}
        />
      )}
    </div>
  );
}
