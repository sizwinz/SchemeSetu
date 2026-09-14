"use client";

import React from "react";
import Image from "next/image";
import { ChannelPartner } from "@/lib/partners/types";
import { getStoredApplicantProfile } from "@/lib/user/profileStore";
import { getStoredWizardState } from "@/lib/schemes/store";
import { getStoredCalculatorState } from "@/lib/calculator/store";
import {
  Printer,
  X,
  ShieldCheck,
  Building2,
  User,
  Phone,
  Calendar,
  CheckCircle2,
  FileText,
  MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ReferralSlipModalProps {
  partner: ChannelPartner;
  isOpen: boolean;
  onClose: () => void;
}

export function ReferralSlipModal({
  partner,
  isOpen,
  onClose,
}: ReferralSlipModalProps) {
  if (!isOpen) return null;

  const profile = getStoredApplicantProfile();
  const wizard = getStoredWizardState();
  const calculator = getStoredCalculatorState();

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const applicationId = `NSFDC-2026-${partner.id.toUpperCase()}-${Math.floor(
    100000 + Math.random() * 900000
  )}`;

  const totalCost = wizard.cost || calculator.params.principal || 140000;
  const nsfdcShare = Math.round(totalCost * 0.9);
  const promoterShare = totalCost - nsfdcShare;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full p-5 sm:p-8 space-y-6 relative my-auto animate-in fade-in zoom-in-95 duration-200 print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none">
        {/* Action Bar (Hidden in Print) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 print:hidden">
          <div className="flex items-center space-x-2">
            <Badge variant="sovereign" className="text-xs py-1 px-3">
              <ShieldCheck className="h-3.5 w-3.5 mr-1" />
              <span>MoSJE / NSFDC Official Pre-Screened Referral</span>
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              onClick={handlePrint}
              size="sm"
              className="bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-semibold gap-1.5 shadow-xs cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Referral Slip</span>
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Slip Content */}
        <div className="space-y-6 text-slate-900">
          {/* Header Section */}
          <div className="text-center space-y-1.5 pb-4 border-b border-slate-200">
            <div className="flex items-center justify-center space-x-2">
              <Image
                src="/logo.png"
                alt="Government of India Emblem / SchemeSetu Logo"
                width={36}
                height={36}
                className="h-9 w-9 object-contain"
              />
              <div className="text-left">
                <span className="font-extrabold text-base sm:text-lg block tracking-tight text-slate-900 leading-tight">
                  SchemeSetu Affirmative Credit Portal
                </span>
                <span className="text-[10px] sm:text-xs text-slate-500 block">
                  Ministry of Social Justice &amp; Empowerment (MoSJE) &bull; National Scheduled Castes Finance &amp; Development Corporation
                </span>
              </div>
            </div>

            <h2 className="text-sm sm:text-base font-bold text-amber-900 tracking-wide uppercase pt-2">
              Pre-Screened Channel Partner Referral Slip
            </h2>
            <p className="text-[11px] text-slate-500">
              Application ID: <strong className="font-mono text-slate-900">{applicationId}</strong> &bull; Generated on: {new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}
            </p>
          </div>

          {/* Section 1: Designated Channel Partner & Solvency Proof */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
              1. Designated Solvent Channel Partner
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Institution &amp; Branch:</span>
                <span className="font-bold text-slate-900 text-sm block">{partner.name}</span>
                <span className="text-slate-600 block">{partner.branchName}</span>
                <span className="text-slate-500 text-[11px] block mt-0.5">{partner.address}</span>
              </div>

              <div className="space-y-1">
                <div>
                  <span className="text-slate-500 block text-[11px]">Assigned Nodal Officer:</span>
                  <span className="font-bold text-slate-900 block">{partner.nodalOfficer}</span>
                  <span className="text-slate-600 font-mono text-[11px] block">Tel: {partner.contactPhone}</span>
                </div>
                <div className="pt-1 flex items-center gap-2">
                  <Badge variant="success" className="text-[10px] py-0.5 px-2">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Solvency: {partner.healthScore}/100 (&lt;10% NPA)
                  </Badge>
                  <span className="text-[10px] text-slate-500">Active Lending Quota</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Beneficiary Profile & Concessional Scheme Match */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Beneficiary Details */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                2. Beneficiary Applicant
              </span>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Applicant Name:</span>
                  <span className="font-bold text-slate-900">{profile.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Caste Category:</span>
                  <span className="font-semibold text-slate-800">{profile.casteCategory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Caste Certificate:</span>
                  <span className="font-mono text-slate-700">{profile.casteCertificateNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Certified Income:</span>
                  <span className="font-semibold text-emerald-700">{formatCurrency(profile.annualIncome)} / yr</span>
                </div>
              </div>
            </div>

            {/* Scheme & Financial Assistance */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                3. Concessional Credit Terms
              </span>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimated Project Cost:</span>
                  <span className="font-bold text-slate-900">{formatCurrency(totalCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">NSFDC Refinancing (90%):</span>
                  <span className="font-bold text-emerald-700">{formatCurrency(nsfdcShare)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Concessional Rate:</span>
                  <span className="font-bold text-slate-900">{calculator.params.annualInterestRate}% p.a.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Moratorium Grace Period:</span>
                  <span className="font-bold text-amber-700">{calculator.params.moratoriumMonths} Months Grace</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Countertop Physical Verification Checklist */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              4. Mandatory Documents to Carry to Branch Desk
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Original Scheduled Caste Certificate</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Income Certificate (&le; ₹5.00 Lakhs / yr)</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Aadhaar Card &amp; PAN Card</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Project Proposal / Quotation for Machinery</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Bank Account Passbook / Cancelled Cheque</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Passport Sized Photographs (2 Copies)</span>
              </div>
            </div>
          </div>

          {/* Citizen Charter Notice */}
          <div className="text-center pt-2 text-[11px] text-slate-500 border-t border-slate-200">
            <p>
              Under MoSJE Citizen Charter, authorized Channel Partners must evaluate and sanction pre-screened affirmative credit within 15 to 30 working days upon document submission.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
