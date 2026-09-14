import React from "react";
import Link from "next/link";
import {
  Scale,
  ArrowLeft,
  ShieldAlert,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Landmark,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Terms of Service | SchemeSetu - MoSJE",
  description: "Official terms and statutory conditions for concessional credit matching and application pre-screening under MoSJE and NSFDC guidelines.",
};

const TOC_SECTIONS = [
  { id: "section-1", title: "1. Beneficiary Eligibility Invariants" },
  { id: "section-2", title: "2. Channel Partner Mechanism" },
  { id: "section-3", title: "3. Nature of Pre-Screening" },
  { id: "section-4", title: "4. Applicant Obligations & Fraud" },
  { id: "section-5", title: "5. Jurisdiction & Governing Law" },
];

export default function TermsOfServicePage() {
  return (
    <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 2xl:px-12 py-6 sm:py-10 space-y-8 overflow-x-hidden max-w-full">
      {/* Back Navigation */}
      <Link
        href="/"
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-amber-700 transition-colors group"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
        <span>Return to SchemeSetu Home</span>
      </Link>

      {/* Header Banner */}
      <div className="space-y-3 border-b border-slate-200 pb-6">
        <div className="flex items-center space-x-2">
          <Badge variant="sovereign" className="text-xs py-1 px-3">
            <Scale className="h-3.5 w-3.5 mr-1" />
            <span>Statutory MoSJE / NSFDC Framework</span>
          </Badge>
          <span className="text-xs text-slate-500">Last Revised: January 2026 &bull; Government of India</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Terms of Service &amp; Concessional Lending Guidelines
        </h1>

        <p className="text-sm text-slate-600 leading-relaxed max-w-4xl">
          Please review the statutory terms governing the SchemeSetu platform. By accessing or utilizing our scheme matching engine, EMI simulators, and pre-screened application routing desk, you agree to comply with the rules established under the Ministry of Social Justice and Empowerment (MoSJE).
        </p>
      </div>

      {/* Important Statutory Alert Banner */}
      <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-300/80 space-y-2">
        <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs sm:text-sm">
          <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0" />
          <span>Zero Intermediary Fee Guarantee (Bhrashtachar Mukt Bharat)</span>
        </div>
        <p className="text-xs text-amber-950 leading-relaxed">
          SchemeSetu and the Ministry of Social Justice &amp; Empowerment charge zero fees for application pre-screening, eligibility evaluations, or channel partner routing. Never pay any fee or commission to unauthorized third-party agents or intermediaries claiming to guarantee loan sanctions.
        </p>
      </div>

      {/* 12-Column Desktop Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (col-span-12 lg:col-span-4): Sticky TOC & Guidance Rail */}
        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-20">
          {/* Table of Contents */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-amber-600" />
              <span>Table of Contents</span>
            </span>

            <nav className="space-y-1.5 text-xs">
              {TOC_SECTIONS.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className="block py-2 px-3 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors font-medium"
                >
                  {sec.title}
                </a>
              ))}
            </nav>
          </div>

          {/* Statutory Lending Invariant Card */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-2 text-xs">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Key Affirmative Invariants</span>
            </span>
            <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-500">
              <li>Statutory Interest: 4.0% to 8.0% p.a.</li>
              <li>Annual Income Cap: ₹5.00 Lakhs / yr</li>
              <li>Project Coverage: Up to 90% Costs</li>
              <li>Gestation Grace: 3 to 12 Months</li>
            </ul>
          </div>
        </div>

        {/* Right Column (col-span-12 lg:col-span-8): Policy Sections */}
        <div className="lg:col-span-8 space-y-6 text-xs text-slate-700 leading-relaxed">
          {/* Section 1 */}
          <section id="section-1" className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 scroll-mt-24">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>1. Beneficiary Eligibility Invariants</span>
            </h2>
            <p>
              Concessional assistance provided under NSFDC schemes (including Mahila Samriddhi Yojana, Micro Credit Finance, Term Loan Scheme, and Education Loan Scheme) is governed by statutory socio-economic criteria:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>
                <strong>Target Group Mandate:</strong> Applicants must belong to the Scheduled Caste (SC) community or designated affirmative action categories (such as Safai Karamcharis / manual scavengers and their dependents).
              </li>
              <li>
                <strong>Annual Family Income Ceiling:</strong> Certified family annual income must not exceed ₹5.00 Lakhs per annum across both rural and urban domains.
              </li>
              <li>
                <strong>Age Eligibility:</strong> Beneficiaries must be between 18 and 50 years of age on the date of formal loan sanction.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section id="section-2" className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 scroll-mt-24">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Landmark className="h-4 w-4 text-amber-600" />
              <span>2. Channel Partner Lending Mechanism</span>
            </h2>
            <p>
              Applicants acknowledge that MoSJE and NSFDC operate as Apex refinancing institutions. Concessional loans are not disbursed directly from government headquarters. All applications pre-screened on SchemeSetu are routed to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>State Channelising Agencies (SCAs) in your respective state or union territory.</li>
              <li>Accredited Public Sector Commercial Banks (PSBs) like SBI, PNB, and Canara Bank.</li>
              <li>Designated Regional Rural Banks (RRBs) servicing agricultural and semi-urban territories.</li>
              <li>Accredited Non-Banking Financial Company Microfinance Institutions (NBFC-MFIs).</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section id="section-3" className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 scroll-mt-24">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <span>3. Nature of Pre-Screening &amp; Final Sanction Authority</span>
            </h2>
            <p>
              Generation of a Pre-Screened Application Slip or QR Dossier confirms programmatic eligibility based on the applicant&apos;s self-declared parameters. Final credit sanction, margin verification, and disbursement remain the statutory prerogative of the designated Channel Partner bank after physical verification of original caste certificates, income certificates, Aadhaar identity, and project proposals.
            </p>
          </section>

          {/* Section 4 */}
          <section id="section-4" className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 scroll-mt-24">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-red-600" />
              <span>4. Applicant Obligations &amp; Misrepresentation</span>
            </h2>
            <p>
              Any willful misstatement, fraudulent caste certificate submission, artificial deflation of declared income, or diversion of concessional funds to unauthorized speculative activities will result in immediate disqualification, cancellation of interest subsidies, recovery proceedings under Public Demands Recovery Acts, and appropriate criminal prosecution.
            </p>
          </section>

          {/* Section 5 */}
          <section id="section-5" className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 scroll-mt-24">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Scale className="h-4 w-4 text-slate-700" />
              <span>5. Jurisdiction &amp; Governing Law</span>
            </h2>
            <p>
              These terms are governed by the laws of the Republic of India. Any legal dispute, claim, or proceeding arising under or in connection with SchemeSetu shall be subject to the exclusive jurisdiction of the competent courts of New Delhi, India.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
