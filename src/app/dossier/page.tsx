"use client";

import React, { useState, useEffect } from "react";
import { ApplicationDossier } from "@/lib/dossier/types";
import {
  getSampleDossier,
  serializeDossierQrPayload,
  computeDossierChecksum,
} from "@/lib/dossier/engine";
import { getDesignatedPartner } from "@/lib/partners/store";
import { getStoredApplicantProfile } from "@/lib/user/profileStore";
import { DossierQR } from "@/components/dossier/DossierQR";
import { DocumentChecklist } from "@/components/dossier/DocumentChecklist";
import {
  Printer,
  ShieldCheck,
  Building2,
  FileText,
  Landmark,
  RefreshCw,
  Clock,
  Phone,
  CheckCircle2,
  User,
} from "lucide-react";

export default function DossierPage() {
  const [dossier, setDossier] = useState<ApplicationDossier>(getSampleDossier());

  // Load applicant profile and designated partner
  useEffect(() => {
    const designated = getDesignatedPartner();
    const storedProfile = getStoredApplicantProfile();

    setDossier((prev) => {
      let updatedBranch = prev.branch;
      let partnerId = prev.branch.id;

      if (designated) {
        partnerId = designated.id;
        updatedBranch = {
          id: designated.id,
          name: designated.name,
          branchName: designated.branchName,
          institutionType: designated.institutionType,
          nodalOfficer: designated.nodalOfficer,
          contactPhone: designated.contactPhone,
          address: designated.address,
          healthScore: designated.healthScore,
          healthTier: designated.healthTier,
        };
      }

      const updatedApplicant = {
        ...prev.applicant,
        fullName: storedProfile.fullName,
        casteCategory: storedProfile.casteCategory,
        annualIncome: storedProfile.annualIncome,
        district: storedProfile.district,
        state: storedProfile.state,
        enterpriseActivity: storedProfile.enterpriseActivity,
      };

      const newChecksum = computeDossierChecksum({
        applicationId: prev.applicationId,
        schemeCode: prev.financing.schemeCode,
        concessionalAmount: prev.financing.concessionalAmount,
        monthlyEmi: prev.financing.monthlyEmi,
        partnerId: partnerId,
      });

      return {
        ...prev,
        applicant: updatedApplicant,
        branch: updatedBranch,
        checksum: newChecksum,
        verificationUrl: `https://schemesetu.gov.in/verify?dossierId=${prev.applicationId}&chk=${newChecksum}`,
      };
    });

    const handleProfileUpdate = (e: any) => {
      const updated = e.detail;
      setDossier((prev) => ({
        ...prev,
        applicant: {
          ...prev.applicant,
          fullName: updated.fullName,
          casteCategory: updated.casteCategory,
          annualIncome: updated.annualIncome,
          district: updated.district,
          state: updated.state,
          enterpriseActivity: updated.enterpriseActivity,
        },
      }));
    };

    window.addEventListener("schemesetu_profile_updated", handleProfileUpdate);
    return () => {
      window.removeEventListener("schemesetu_profile_updated", handleProfileUpdate);
    };
  }, []);

  const handleToggleDocument = (docId: string) => {
    setDossier((prev) => ({
      ...prev,
      documents: prev.documents.map((doc) =>
        doc.id === docId ? { ...doc, isVerified: !doc.isVerified } : doc
      ),
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleResetSample = () => {
    setDossier(getSampleDossier());
  };

  const qrPayloadString = serializeDossierQrPayload(dossier);

  return (
    <div className="max-w-4xl mx-auto pb-16 space-y-6">
      {/* Screen Action Bar (Hidden during @media print) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
        <div>
          <h2 className="text-base font-bold text-mosje-navy flex items-center gap-2">
            <FileText className="h-5 w-5 text-mosje-saffron" />
            <span>Pre-Screened Application Dossier &amp; Routing Slip</span>
          </h2>
          <p className="text-xs text-slate-500">
            Certified MoSJE pre-qualification packet with high-density scannable QR verification code.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleResetSample}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-xl transition-colors flex items-center space-x-1.5 cursor-pointer"
            title="Reset to statutory sample application"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Load Sample</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="text-xs font-semibold text-white bg-mosje-saffron hover:bg-amber-600 px-4 py-2 rounded-xl shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Print Official Slip</span>
          </button>
        </div>
      </div>

      {/* Formal A4 Document Card (Prints cleanly on A4 paper) */}
      <div className="bg-white border-2 border-slate-900/90 rounded-2xl p-6 sm:p-8 shadow-md space-y-6 print:border-none print:shadow-none print:p-0 print:m-0 text-slate-900">
        {/* Document Header with MoSJE Emblem */}
        <div className="text-center pb-4 border-b-2 border-slate-900 space-y-1">
          <div className="flex items-center justify-center space-x-2">
            <Landmark className="h-7 w-7 text-mosje-navy" />
            <div className="text-[11px] font-extrabold uppercase tracking-widest text-slate-700">
              Government of India &bull; Ministry of Social Justice and Empowerment
            </div>
          </div>
          <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight text-mosje-navy pt-1">
            Pre-Screened Concessional Credit Application Dossier
          </h1>
          <p className="text-xs font-medium text-slate-600">
            National Scheduled Castes Finance &amp; Development Corporation (NSFDC) Channel Financing
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-300">
              VERIFIED PRE-SCREENED &bull; AFFIRMATIVE ACTION PRIORITY
            </span>
            <span className="font-mono text-xs font-bold text-slate-800">
              Application ID: {dossier.applicationId}
            </span>
            <span className="text-xs text-slate-500">
              Date: {new Date(dossier.submissionDate).toLocaleDateString("en-IN", { dateStyle: "long" })}
            </span>
          </div>
        </div>

        {/* 2-Column Split: Left Summary Table, Right Scannable QR */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pb-4 border-b border-slate-200">
          {/* Left Table: Applicant & Financing */}
          <div className="md:col-span-8 space-y-4">
            {/* Applicant Details */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  1. Applicant Profile
                </h3>
                <span className="text-[10px] text-slate-400 italic">
                  (Auto-populated from citizen profile)
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 block">Full Name:</span>
                  <span className="font-bold text-slate-900">{dossier.applicant.fullName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Socio-Economic Category:</span>
                  <span className="font-bold text-emerald-700">{dossier.applicant.casteCategory}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Certified Annual Income:</span>
                  <span className="font-bold text-slate-900 font-mono">
                    ₹{dossier.applicant.annualIncome.toLocaleString("en-IN")} (&le; ₹5.00L Limit)
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Enterprise Activity:</span>
                  <span className="font-medium text-slate-800">{dossier.applicant.enterpriseActivity}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Location:</span>
                  <span className="font-medium text-slate-700">
                    {dossier.applicant.district}, {dossier.applicant.state}
                  </span>
                </div>
              </div>
            </div>

            {/* Financing Breakdown */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                2. Concessional Financing Structure
              </h3>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-mono tabular-nums">
                <div>
                  <span className="text-[10px] text-slate-400 font-sans block">Matched Scheme</span>
                  <span className="font-bold text-mosje-navy font-sans block">
                    {dossier.financing.schemeName}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-sans block">Total Project Cost</span>
                  <span className="font-bold text-slate-900">
                    ₹{dossier.financing.totalCost.toLocaleString("en-IN")}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-sans block">NSFDC Loan Share (90%)</span>
                  <span className="font-bold text-emerald-700">
                    ₹{dossier.financing.concessionalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-sans block">Interest Rate</span>
                  <span className="font-bold text-amber-600">
                    {dossier.financing.interestRate}% p.a.
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-sans block">Repayment Tenure</span>
                  <span className="font-bold text-slate-900">
                    {dossier.financing.tenureMonths / 12} Years ({dossier.financing.tenureMonths}m)
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-sans block">Projected Monthly EMI</span>
                  <span className="font-black text-mosje-navy text-sm">
                    ₹{dossier.financing.monthlyEmi.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Verifiable QR Code */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-3 bg-slate-50 border border-slate-200 rounded-2xl">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Verifiable Application QR
            </h4>
            <DossierQR
              value={qrPayloadString}
              applicationId={dossier.applicationId}
              checksum={dossier.checksum}
            />
          </div>
        </div>

        {/* Designated Channel Partner Routing Slip */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            3. Designated Channel Partner Routing Slip
          </h3>
          <div className="bg-amber-50/50 border border-amber-200/80 rounded-xl p-4 text-xs space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <span className="font-bold text-sm text-mosje-navy block">
                  {dossier.branch.name}
                </span>
                <span className="text-slate-600 text-[11px] font-medium">
                  {dossier.branch.branchName} ({dossier.branch.institutionType})
                </span>
              </div>

              <div className="flex items-center space-x-1.5 bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-xs font-bold font-mono">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Health Score: {dossier.branch.healthScore}/100 Solvent</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-amber-200/60 text-[11px] text-slate-600">
              <div>
                <span className="font-semibold text-slate-700">Branch Address: </span>
                {dossier.branch.address}
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-slate-700">Nodal Officer: </span>
                <span>{dossier.branch.nodalOfficer}</span>
                <a href={`tel:${dossier.branch.contactPhone}`} className="text-amber-700 font-semibold underline">
                  {dossier.branch.contactPhone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Statutory Document Compliance Checklist */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            4. Statutory Document Verification Checklist
          </h3>
          <DocumentChecklist
            documents={dossier.documents}
            onToggleDocument={handleToggleDocument}
          />
        </div>

        {/* Branch Official Sanction & Seal Block (For Bank / SCA Use Only) */}
        <div className="pt-3 border-t-2 border-slate-900 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              5. Branch Acknowledgment &amp; Sanction Seal (For Official Bank / SCA Use Only)
            </h4>
            <span className="text-[10px] text-slate-500 italic">
              To be stamped &amp; signed upon physical verification
            </span>
          </div>

          <div className="border border-slate-300 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-12 gap-4 text-xs font-mono">
            <div className="sm:col-span-7 space-y-3">
              <div>
                <span className="text-[10px] text-slate-400 font-sans block">Date of Application Receipt:</span>
                <span className="border-b border-slate-400 inline-block w-48 h-5"></span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-sans block">Branch Credit File Reference No:</span>
                <span className="border-b border-slate-400 inline-block w-48 h-5"></span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-sans block">Verified By (Nodal Officer Signature):</span>
                <span className="border-b border-slate-400 inline-block w-60 h-6"></span>
              </div>
            </div>

            <div className="sm:col-span-5 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-6 text-center text-slate-400 text-[11px] font-sans">
              <Building2 className="h-8 w-8 mb-1 opacity-40" />
              <span>Official Bank / SCA Rubber Stamp</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
