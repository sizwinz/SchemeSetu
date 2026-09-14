"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ApplicationDossier } from "@/lib/dossier/types";
import {
  getSampleDossier,
  serializeDossierQrPayload,
  computeDossierChecksum,
} from "@/lib/dossier/engine";
import { getDesignatedPartner } from "@/lib/partners/store";
import { getStoredApplicantProfile } from "@/lib/user/profileStore";
import {
  getStoredVerifiedDocIds,
  saveStoredVerifiedDocIds,
  clearStoredVerifiedDocIds,
} from "@/lib/dossier/store";
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
  Copy,
  ExternalLink,
  MapPin,
  FileCheck,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function DossierPage() {
  const [dossier, setDossier] = useState<ApplicationDossier>(getSampleDossier());
  const [copiedId, setCopiedId] = useState<boolean>(false);

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
        enterpriseActivity: storedProfile.enterpriseActivity,
        district: storedProfile.district,
        state: storedProfile.state,
      };

      const newChecksum = computeDossierChecksum({
        applicationId: prev.applicationId,
        schemeCode: prev.financing.schemeCode,
        concessionalAmount: prev.financing.concessionalAmount,
        monthlyEmi: prev.financing.monthlyEmi,
        partnerId,
      });

      return {
        ...prev,
        applicant: updatedApplicant,
        branch: updatedBranch,
        checksum: newChecksum,
      };
    });
    // Hydrate verified documents from localStorage
    const storedVerified = getStoredVerifiedDocIds();
    if (storedVerified) {
      setDossier((prev) => ({
        ...prev,
        documents: prev.documents.map((d) => ({
          ...d,
          isVerified: storedVerified.includes(d.id),
        })),
      }));
    }
  }, []);

  const handleToggleDocument = (docId: string) => {
    setDossier((prev) => {
      const updatedDocs = prev.documents.map((d) =>
        d.id === docId ? { ...d, isVerified: !d.isVerified } : d
      );
      const verifiedIds = updatedDocs.filter((d) => d.isVerified).map((d) => d.id);
      saveStoredVerifiedDocIds(verifiedIds);
      return {
        ...prev,
        documents: updatedDocs,
      };
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(dossier.applicationId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleResetSample = () => {
    clearStoredVerifiedDocIds();
    setDossier(getSampleDossier());
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const qrPayloadString = serializeDossierQrPayload(dossier);

  const verifiedDocsCount = dossier.documents.filter((d) => d.isVerified).length;
  const totalDocsCount = dossier.documents.length;

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 py-5 sm:py-8 space-y-6 sm:space-y-8 overflow-x-hidden max-w-full">
      {/* Screen Action Bar (Hidden during @media print) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-amber-600 shrink-0" />
            <span>Pre-Screened Application Dossier &amp; Routing Slip</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Certified MoSJE pre-qualification packet with high-density scannable QR verification code.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={handleResetSample}
            className="text-xs rounded-xl min-h-[38px] cursor-pointer"
            title="Reset to statutory sample application"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
            <span>Load Sample</span>
          </Button>

          <Button
            size="sm"
            variant="accent"
            onClick={handlePrint}
            className="text-xs rounded-xl font-bold min-h-[38px] cursor-pointer"
          >
            <Printer className="h-4 w-4 mr-1" />
            <span>Print Official Slip</span>
          </Button>
        </div>
      </div>

      {/* 12-Column Desktop Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (col-span-12 lg:col-span-8): Formal A4 Document Card */}
        <div className="lg:col-span-8">
          <div className="bg-white border-2 border-slate-900/90 rounded-2xl p-4 sm:p-8 shadow-sm space-y-5 sm:space-y-6 print:border-none print:shadow-none print:p-0 print:m-0 text-slate-900">
            {/* Document Header with MoSJE Emblem */}
            <div className="text-center pb-4 border-b-2 border-slate-900 space-y-1">
              <div className="flex items-center justify-center space-x-2">
                <Landmark className="h-6 w-6 sm:h-7 sm:w-7 text-slate-900" />
                <div className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-slate-700">
                  Government of India &bull; Ministry of Social Justice and Empowerment
                </div>
              </div>
              <h1 className="text-base sm:text-xl font-black uppercase tracking-tight text-slate-900 pt-1">
                Pre-Screened Concessional Credit Application Dossier
              </h1>
              <p className="text-[11px] sm:text-xs font-medium text-slate-600">
                National Scheduled Castes Finance &amp; Development Corporation (NSFDC) Channel Financing
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2">
                <Badge variant="success" className="text-[10px] font-bold uppercase">
                  Verified Pre-Screened &bull; Priority
                </Badge>
                <span className="font-mono text-xs font-bold text-slate-800">
                  Application ID: {dossier.applicationId}
                </span>
              </div>
            </div>

            {/* 2-Column Split: Key Info & Cryptographic QR Slip */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-start">
              {/* Left Column: Applicant & Financing Profile */}
              <div className="md:col-span-8 space-y-4 sm:space-y-5 order-last md:order-first">
                {/* Applicant Identity Card */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <User className="h-4 w-4 text-amber-600" />
                    <span>1. Verified Applicant Profile</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Full Name</span>
                      <span className="font-bold text-slate-900">{dossier.applicant.fullName}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Socio-Economic Category</span>
                      <span className="font-bold text-slate-900 font-mono">
                        {dossier.applicant.casteCategory}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Declared Family Income</span>
                      <span className="font-bold text-slate-900 font-mono">
                        {formatCurrency(dossier.applicant.annualIncome)} / year
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Jurisdiction</span>
                      <span className="font-bold text-slate-900">
                        {dossier.applicant.district}, {dossier.applicant.state}
                      </span>
                    </div>

                    <div className="col-span-2 pt-1 border-t border-slate-200">
                      <span className="text-[10px] text-slate-400 block uppercase">Target Enterprise / Purpose</span>
                      <span className="font-semibold text-slate-800">
                        {dossier.applicant.enterpriseActivity}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Concessional Financing Details */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span>2. Matched Concessional Credit Parameters</span>
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono tabular-nums">
                    <div className="col-span-2 sm:col-span-3 pb-1 border-b border-slate-200">
                      <span className="text-[10px] text-slate-400 block uppercase font-sans">Matched Scheme</span>
                      <span className="font-bold text-slate-900 font-sans text-sm">
                        {dossier.financing.schemeName} ({dossier.financing.schemeCode})
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-sans">Total Project Cost</span>
                      <span className="font-semibold text-slate-800">{formatCurrency(dossier.financing.totalCost)}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-sans">Concessional Loan (90%)</span>
                      <span className="font-bold text-slate-900">{formatCurrency(dossier.financing.concessionalAmount)}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-sans">Promoter Share (10%)</span>
                      <span className="font-semibold text-slate-700">{formatCurrency(dossier.financing.promoterContribution)}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-sans">Interest Rate</span>
                      <span className="font-bold text-amber-700">{dossier.financing.interestRate}% p.a.</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-sans">Gestation Period</span>
                      <span className="font-semibold text-slate-800 font-sans">
                        {dossier.financing.moratoriumMonths} Months Grace
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-sans">Effective Monthly EMI</span>
                      <span className="font-bold text-emerald-700 text-sm">
                        {formatCurrency(dossier.financing.monthlyEmi)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Designated Branch Routing Details */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Building2 className="h-4 w-4 text-amber-600" />
                      <span>3. Designated Solvent Processing Branch</span>
                    </h3>
                    <Badge variant="success" className="text-[10px] font-mono">
                      Score: {dossier.branch.healthScore}/100 Solvent
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="col-span-2">
                      <span className="font-bold text-slate-900 block">{dossier.branch.name}</span>
                      <span className="text-slate-600 text-[11px]">{dossier.branch.address}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Nodal Officer</span>
                      <span className="font-semibold text-slate-800">{dossier.branch.nodalOfficer}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Direct Desk Contact</span>
                      <span className="font-mono text-slate-800 font-semibold">{dossier.branch.contactPhone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Verifiable Tamper-Evident QR Code */}
              <div className="md:col-span-4 flex flex-col items-center order-first md:order-last w-full">
                <DossierQR
                  value={qrPayloadString}
                  checksum={dossier.checksum}
                  applicationId={dossier.applicationId}
                />
              </div>
            </div>

            {/* Statutory Document Checklist Component */}
            <div className="pt-2 border-t border-slate-200">
              <DocumentChecklist
                documents={dossier.documents}
                onToggleDocument={handleToggleDocument}
              />
            </div>

            {/* Statutory Official Signoff Block */}
            <div className="pt-6 border-t-2 border-slate-900 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-xs">
              <div className="space-y-4 sm:space-y-6">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">Beneficiary Declaration</span>
                <div className="h-10 border-b border-dashed border-slate-400" />
                <span className="text-[11px] text-slate-700 block">Applicant Signature / Thumb Impression</span>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">Processing Branch Officer</span>
                <div className="h-10 border-b border-dashed border-slate-400" />
                <span className="text-[11px] text-slate-700 block">Officer Signature &amp; Branch Stamp</span>
              </div>

              <div className="col-span-1 space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-[10px] font-mono">
                <span className="font-bold uppercase text-slate-600 block font-sans">Statutory Integrity Seal</span>
                <div>Generated: {new Date(dossier.submissionDate).toLocaleDateString("en-IN")}</div>
                <div>Checksum: {dossier.checksum}</div>
                <div className="text-emerald-700 font-semibold">Status: MoSJE Pre-Screened</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (col-span-12 lg:col-span-4): Desktop Actions & Branch Desk Companion Rail */}
        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-20 print:hidden">
          {/* Quick Actions & Export Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <FileCheck className="h-4 w-4 text-amber-600" />
              <span>Official Slip Actions</span>
            </span>

            <div className="space-y-2">
              <Button
                variant="accent"
                onClick={handlePrint}
                className="w-full justify-center rounded-xl font-bold text-xs min-h-[42px] cursor-pointer shadow-xs"
              >
                <Printer className="h-4 w-4 mr-2" />
                <span>Print Official Slip (A4)</span>
              </Button>

              <button
                type="button"
                onClick={handleCopyId}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <Copy className="h-3.5 w-3.5 text-slate-500" />
                  <span className="font-mono">{dossier.applicationId}</span>
                </div>
                <span className="text-[11px] text-amber-700 font-bold">
                  {copiedId ? "Copied!" : "Copy ID"}
                </span>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Verified Checksum:</span>
              <span className="font-mono font-bold text-slate-800">{dossier.checksum}</span>
            </div>
          </div>

          {/* Designated Processing Branch Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-emerald-600" />
                <span>Assigned Channel Partner</span>
              </span>
              <Badge variant="success" className="text-[10px] font-mono">
                {dossier.branch.healthScore}/100 Solvent
              </Badge>
            </div>

            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-slate-900">{dossier.branch.name}</h4>
              <p className="text-[11px] text-slate-500">{dossier.branch.address}</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Nodal Officer</span>
                <span className="font-bold text-slate-800">{dossier.branch.nodalOfficer}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Direct Phone</span>
                <a
                  href={`tel:${dossier.branch.contactPhone}`}
                  className="font-mono font-bold text-emerald-700 hover:underline flex items-center gap-1"
                >
                  <Phone className="h-3 w-3" />
                  <span>{dossier.branch.contactPhone}</span>
                </a>
              </div>
            </div>

            <Button variant="outline" size="sm" asChild className="w-full text-xs rounded-xl">
              <Link href="/locator">
                <MapPin className="h-3.5 w-3.5 mr-1 text-amber-600" />
                <span>View on Partner Locator Map</span>
              </Link>
            </Button>
          </div>

          {/* Physical Bank Desk Checklist */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Branch Visit Checklist</span>
              </span>
              <span className="text-[11px] font-bold text-slate-600">
                {verifiedDocsCount}/{totalDocsCount} Ready
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Carry your printed A4 slip along with original caste certificate, income verification, and project proposal to the bank counter for immediate QR authentication.
            </p>
          </div>

          {/* Citizen Charter Standard Notice */}
          <div className="bg-emerald-50/70 rounded-2xl border border-emerald-200/80 p-4 space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-emerald-900 font-bold">
              <Clock className="h-4 w-4 text-emerald-700 shrink-0" />
              <span>Citizen Charter Guarantee</span>
            </div>
            <p className="text-[11px] text-emerald-950/80 leading-relaxed">
              Statutory 15 to 30 working day processing timeline once physical verification is authenticated at the branch desk.
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:text-emerald-900 pt-1"
            >
              <span>Verify in Institutional Desk</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
