import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ArrowLeft,
  Lock,
  Database,
  EyeOff,
  UserCheck,
  Landmark,
  FileText,
  Phone,
  Mail,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Privacy Policy | SchemeSetu - MoSJE",
  description: "Official privacy policy and data protection framework for SchemeSetu under DPDP Act 2023 and MoSJE guidelines.",
};

const TOC_SECTIONS = [
  { id: "section-1", title: "1. Information Collected & Processed" },
  { id: "section-2", title: "2. Purpose & Statutory Legal Basis" },
  { id: "section-3", title: "3. Cryptographic QR & Minimization" },
  { id: "section-4", title: "4. Beneficiary Rights Under DPDP Act" },
  { id: "section-5", title: "5. Grievance Redressal & Nodal Officer" },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 2xl:px-12 py-6 sm:py-10 space-y-8 overflow-x-hidden max-w-full">
      {/* Back to Home Navigation */}
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
            <ShieldCheck className="h-3.5 w-3.5 mr-1" />
            <span>DPDP Act 2023 Compliant</span>
          </Badge>
          <span className="text-xs text-slate-500">Effective Date: January 1, 2026 &bull; Government of India</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Privacy Policy &amp; Data Protection Charter
        </h1>

        <p className="text-sm text-slate-600 leading-relaxed max-w-4xl">
          SchemeSetu is a sovereign digital initiative managed under the aegis of the Ministry of Social Justice and Empowerment (MoSJE) in coordination with the National Scheduled Castes Finance and Development Corporation (NSFDC). We enforce strict client-side data minimization to safeguard marginalized entrepreneurs and students.
        </p>
      </div>

      {/* Core Privacy Principles 3-Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center">
            <Lock className="h-5 w-5" />
          </div>
          <h3 className="text-xs font-bold text-slate-900">Client-Side Minimization</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Financial simulations and eligibility evaluations execute in your local browser session without persisting sensitive declarations on cloud servers.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
            <EyeOff className="h-5 w-5" />
          </div>
          <h3 className="text-xs font-bold text-slate-900">Zero Commercial Profiling</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your socio-economic category, annual income, and enterprise intent are never monetized, traded, or shared with third-party commercial entities.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-700 flex items-center justify-center">
            <Landmark className="h-5 w-5" />
          </div>
          <h3 className="text-xs font-bold text-slate-900">Official Channel Routing</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Verified pre-screened application data is routed exclusively to authorized State Channelising Agencies (SCAs) and Public Sector Banks.
          </p>
        </div>
      </div>

      {/* 12-Column Desktop Split Layout: Sticky Table of Contents + Structured Policy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (col-span-12 lg:col-span-4): Sticky Navigation & Nodal Authority */}
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

          {/* Statutory Compliance Badge Card */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-2 text-xs">
            <span className="font-bold text-slate-900 block">Statutory Invariants</span>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              SchemeSetu complies with Section 4 and Section 6 of the DPDP Act 2023 for informed affirmative credit facilitation.
            </p>
            <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
              Regulatory Authority: Ministry of Electronics and Information Technology (MeitY) &amp; MoSJE
            </div>
          </div>
        </div>

        {/* Right Column (col-span-12 lg:col-span-8): Structured Policy Sections */}
        <div className="lg:col-span-8 space-y-6 text-xs text-slate-700 leading-relaxed">
          {/* Section 1 */}
          <section id="section-1" className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 scroll-mt-24">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Database className="h-4 w-4 text-amber-600" />
              <span>1. Information We Collect &amp; Process</span>
            </h2>
            <p>
              When utilizing the SchemeSetu platform, you may optionally provide demographic and project declarations to determine concessional credit eligibility under MoSJE guidelines. This includes:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>
                <strong>Applicant Profile Information:</strong> Full legal name, caste category certification status (SC, SC-Women, Safai Karamchari), contact telephone number, and state/district of residence.
              </li>
              <li>
                <strong>Enterprise &amp; Project Parameters:</strong> Proposed enterprise activity (e.g., small retail, dairy, sanitation machinery, technical education), total project cost, and certified annual family income.
              </li>
              <li>
                <strong>Speech Audio Data:</strong> When voice-first mode is enabled, voice audio is converted to localized text solely through browser-native speech recognition APIs (Web Speech API). Audio voice streams are not stored or uploaded to external servers.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section id="section-2" className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 scroll-mt-24">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-emerald-600" />
              <span>2. Purpose &amp; Statutory Legal Basis</span>
            </h2>
            <p>
              All processing is conducted in accordance with the <em>Digital Personal Data Protection (DPDP) Act, 2023</em> and guidelines issued by the Ministry of Social Justice and Empowerment for the following purposes:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>
                Evaluating applicant eligibility against statutory income ceilings (e.g., ₹5.00 Lakhs per annum) and concessional interest subsidies (4% to 8% p.a.).
              </li>
              <li>
                Simulating prospective monthly EMI schedules and moratorium grace periods.
              </li>
              <li>
                Generating the cryptographic, tamper-evident Pre-Screened Application Dossier with FNV-1a checksum verification.
              </li>
              <li>
                Routing applications to verified, solvent Channel Partner branches with active lending quotas.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section id="section-3" className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 scroll-mt-24">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Lock className="h-4 w-4 text-blue-600" />
              <span>3. Cryptographic QR Dossier &amp; Data Minimization</span>
            </h2>
            <p>
              SchemeSetu features client-side data minimization. The printable Pre-Screened Application Slip generates a high-density, tamper-evident QR code containing the applicant ID, scheme code, sanctioned principal, and FNV-1a checksum. This allows physical branch verification officers at bank desks to validate eligibility without requiring unencrypted public cloud transmission of sensitive records.
            </p>
          </section>

          {/* Section 4 */}
          <section id="section-4" className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 scroll-mt-24">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-purple-600" />
              <span>4. Beneficiary Rights Under DPDP Act 2023</span>
            </h2>
            <p>
              Under Indian digital data privacy regulations, every applicant possesses the following statutory rights:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>
                <strong>Right to Access:</strong> Review your stored local profile declarations anytime through the Applicant Profile modal in the navigation bar.
              </li>
              <li>
                <strong>Right to Correction &amp; Erasure:</strong> Update or erase your local application declarations by clicking &quot;Load Sample&quot; or clearing local browser storage.
              </li>
              <li>
                <strong>Right to Grievance Redressal:</strong> Submit inquiries or complaints directly to the MoSJE Grievance Redressal Officer detailed below.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section id="section-5" className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 scroll-mt-24">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Landmark className="h-4 w-4 text-slate-700" />
              <span>5. Grievance Redressal &amp; Nodal Authority</span>
            </h2>
            <p>
              For privacy inquiries, statutory compliance requests, or grievance redressal, contact:
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5 text-slate-800">
              <p className="font-bold">Grievance Redressal Officer (Data Protection)</p>
              <p className="text-slate-600">Ministry of Social Justice &amp; Empowerment, Government of India</p>
              <p className="text-slate-600">Shastri Bhawan, Dr. Rajendra Prasad Road, New Delhi 110001</p>
              <p className="text-slate-600">
                National Helpline: <span className="font-mono font-semibold">1800-11-2001</span> (Toll-Free)
              </p>
              <p className="text-slate-600">
                Email: <span className="font-mono font-semibold">grievance-dataprivacy@socialjustice.gov.in</span>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
