"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Phone,
  Mail,
  Clock,
  Building2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ShieldCheck,
  Send,
  CheckCircle2,
  Landmark,
  ExternalLink,
  MapPin,
  FileQuestion,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    id: "faq-1",
    category: "Branch Desk",
    question: "What should I do if a local bank branch refuses to accept my Pre-Screened Application Slip?",
    answer:
      "All authorized Channel Partners (SCAs, PSBs, and RRBs) are bound by statutory MoSJE lending directives. If a bank officer refuses to review your pre-screened dossier, note the officer's name, branch IFSC code, and request to speak with the designated District Lead Bank Manager (DLBM). You can also escalate immediately through our Level 2 State Channelising Agency Helpdesk or file an online grievance via CPGRAMS.",
  },
  {
    id: "faq-2",
    category: "Financial Rules",
    question: "Is there any mandatory margin money required for Micro Credit Finance (MCF)?",
    answer:
      "No. For micro-credit schemes up to ₹1.40 Lakhs (such as MCF and Mahila Samriddhi Yojana), NSFDC guidelines mandate zero applicant promoter contribution. Up to 90% of the project cost is provided by NSFDC as concessional refinancing, with the remaining 10% covered by the Channel Partner bank or state subsidy.",
  },
  {
    id: "faq-3",
    category: "Disbursement",
    question: "How long does it take for loan funds to be disbursed after branch document verification?",
    answer:
      "Under Citizen Charter standards, once your original caste certificate, income verification, and project proposal are verified at the branch desk, the designated Channel Partner must sanction and disburse credit within 15 to 30 working days. You can track progress in the Institutional Administration Console.",
  },
  {
    id: "faq-4",
    category: "Eligibility",
    question: "Can an applicant apply for both Term Loan and Education Loan simultaneously?",
    answer:
      "No. An individual beneficiary may only hold one active subsidized concessional credit facility from NSFDC at any given time. Once a student or entrepreneur completes full repayment or reaches the designated statutory milestones, subsequent expansion loans can be applied for.",
  },
  {
    id: "faq-5",
    category: "Partner Solvency",
    question: "Why does the Partner Locator mark some bank branches as 'High NPA / Filtered'?",
    answer:
      "When a banking branch has gross non-performing assets (NPAs) exceeding 10% or exhausted affirmative lending quotas, loan files often get backlogged or rejected. SchemeSetu automatically filters out high-risk branches to ensure your pre-screened file is directed exclusively to solvent, high-performing branches.",
  },
  {
    id: "faq-6",
    category: "Women Entrepreneurs",
    question: "What specific benefits does Mahila Samriddhi Yojana offer over standard commercial loans?",
    answer:
      "Mahila Samriddhi Yojana provides an ultra-concessional 4.0% per annum interest rate specifically for SC women micro-entrepreneurs, compared to commercial bank rates of 11.5% to 14.0%. It includes a 6-month repayment grace period (moratorium) during which no principal repayment is required, and covers up to 90% of eligible project cost.",
  },
];

export default function HelpdeskPage() {
  const [openFaq, setOpenFaq] = useState<string | null>("faq-1");
  const [ticketSubmitted, setTicketSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    fullName: "",
    applicationId: "",
    phone: "",
    issueType: "BRANCH_REFUSAL",
    message: "",
  });

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSubmitted(true);
    setTimeout(() => {
      setTicketSubmitted(false);
      setFormData({
        fullName: "",
        applicationId: "",
        phone: "",
        issueType: "BRANCH_REFUSAL",
        message: "",
      });
    }, 4000);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 py-5 sm:py-8 space-y-6 sm:space-y-8 overflow-x-hidden max-w-full">
      {/* Top Breadcrumb Navigation */}
      <Link
        href="/"
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-amber-700 transition-colors group"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
        <span>Return to SchemeSetu Home</span>
      </Link>

      {/* Hero Header */}
      <div className="space-y-3 border-b border-slate-200 pb-6">
        <div className="flex items-center space-x-2">
          <Badge variant="sovereign" className="text-xs py-1 px-3">
            <HelpCircle className="h-3.5 w-3.5 mr-1" />
            <span>Citizen Assistance Desk</span>
          </Badge>
          <span className="text-xs text-slate-500">Government of India &bull; MoSJE &bull; NSFDC</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          MoSJE Citizen Helpdesk &amp; Grievance Redressal
        </h1>

        <p className="text-sm text-slate-600 leading-relaxed max-w-4xl">
          Dedicated assistance for Scheduled Caste entrepreneurs, women beneficiaries, and students applying for concessional credit under NSFDC programs. Get toll-free helpline guidance, resolve branch routing issues, or file statutory grievances under the Citizen Charter.
        </p>
      </div>

      {/* 4-Card Emergency Helplines & Statutory Channels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: National Toll-Free */}
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                National Helpline
              </span>
              <span className="text-sm font-bold text-slate-900 font-sans tabular-nums">
                1800-11-2001
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Direct citizen helpline for scheme inquiry, eligibility verification, and application status.
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center text-[11px] text-slate-500 gap-1.5">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>Mon - Fri, 9:30 AM - 5:30 PM IST</span>
          </div>
        </div>

        {/* Card 2: Official Support Email */}
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Official Support Desk
              </span>
              <span className="text-xs font-bold text-slate-900 font-mono break-all">
                support-nsfdc@gov.in
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Email channel for pre-screened application escalations and branch dispute filings.
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center text-[11px] text-slate-500 gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Guaranteed 48-Hour Response Time</span>
          </div>
        </div>

        {/* Card 3: NSFDC Headquarters */}
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                NSFDC Headquarters
              </span>
              <span className="text-xs font-bold text-slate-900">
                Scope Minar, Delhi
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            National Scheduled Castes Finance &amp; Development Corporation, Laxmi Nagar, Delhi 110092.
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center text-[11px] text-slate-500 gap-1.5">
            <Landmark className="h-3.5 w-3.5 text-slate-400" />
            <span>Apex Statutory MoSJE Enterprise</span>
          </div>
        </div>

        {/* Card 4: CPGRAMS Central Portal */}
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Centralized Redressal
              </span>
              <span className="text-xs font-bold text-slate-900 font-mono">
                CPGRAMS Portal
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Official Government of India public grievance portal with statutory oversight and tracking.
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-purple-700 font-semibold">
            <a
              href="https://pgportal.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:underline"
            >
              <span>pgportal.gov.in</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <span className="text-slate-400">Level 3</span>
          </div>
        </div>
      </div>

      {/* Main 12-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (col-span-12 lg:col-span-7 xl:col-span-8): Ticket Form & FAQ Accordion */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8">
          {/* Interactive Grievance Ticket Form */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-7 space-y-5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                Fast-Track Resolution
              </span>
              <h2 className="text-lg sm:text-2xl font-bold text-slate-900 mt-0.5">
                Submit Grievance or Branch Issue Ticket
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                If an assigned Channel Partner bank is delaying or unlawfully refusing your application slip, submit an inquiry for nodal review.
              </p>
            </div>

            {ticketSubmitted ? (
              <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-in fade-in zoom-in-95">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                <h3 className="text-sm font-bold text-slate-900">Ticket Dispatched to MoSJE Nodal Officer</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Your ticket has been logged with Priority SLA. You will receive an SMS acknowledgement on your contact phone.
                </p>
                <Badge variant="success" className="font-mono text-xs">
                  Ticket Reference: TKT-{Date.now().toString().slice(-6)}
                </Badge>
              </div>
            ) : (
              <form onSubmit={handleSubmitTicket} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajesh Kumar"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full text-base sm:text-xs py-2.5 px-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full text-base sm:text-xs py-2.5 px-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Application ID (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. NSFDC-2026-98421"
                      value={formData.applicationId}
                      onChange={(e) => setFormData({ ...formData, applicationId: e.target.value })}
                      className="w-full text-base sm:text-xs py-2.5 px-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Issue Classification *
                    </label>
                    <select
                      value={formData.issueType}
                      onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
                      className="w-full text-base sm:text-xs py-2.5 px-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                    >
                      <option value="BRANCH_REFUSAL">Branch Refused Application Dossier</option>
                      <option value="EXCESS_MARGIN">Bank Demanded Illegal Margin Money</option>
                      <option value="DELAYED_DISBURSAL">Disbursal Exceeded 30-Day SLA</option>
                      <option value="DOCUMENT_DISPUTE">Caste / Income Verification Dispute</option>
                      <option value="PORTAL_BUG">Technical Platform / QR Scanning Issue</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Grievance Description *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide branch name, branch officer designation, date of visit, and specific reason stated for refusal or delay..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full text-base sm:text-xs p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  variant="accent"
                  className="w-full sm:w-auto min-h-[44px] px-6 rounded-xl font-bold text-xs cursor-pointer shadow-xs"
                >
                  <Send className="h-4 w-4 mr-2" />
                  <span>Submit Grievance Ticket</span>
                </Button>
              </form>
            )}
          </div>

          {/* Frequently Asked Questions (FAQ) Section */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-7 space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                Self-Service Assistance
              </span>
              <h2 className="text-lg sm:text-2xl font-bold text-slate-900 mt-0.5">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Key statutory guidelines for affirmative concessional credit procedures and grievance resolutions.
              </p>
            </div>

            <div className="divide-y divide-slate-200 border-t border-slate-100">
              {FAQS.map((faq) => {
                const isOpen = openFaq === faq.id;
                return (
                  <div key={faq.id} className="py-3.5">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                      className="w-full flex items-center justify-between text-left gap-3 cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md shrink-0">
                          {faq.category}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-amber-700 transition-colors">
                          {faq.question}
                        </span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-amber-600" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <p className="text-xs text-slate-600 leading-relaxed mt-2.5 pl-1 animate-in fade-in duration-150">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (col-span-12 lg:col-span-5 xl:col-span-4): Sticky Escalation Matrix & Routing */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4 lg:sticky lg:top-20">
          {/* Statutory 3-Tier Escalation Matrix */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block">
                Statutory Architecture
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                3-Tier Escalation Matrix
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Statutory protocol guaranteed under MoSJE affirmative directives.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Level 1: Branch Nodal Officer</span>
                  <Badge variant="outline" className="text-[10px] bg-white">7-Day SLA</Badge>
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Contact the Lead District Bank Manager (DLBM) or Branch Chief Manager of the designated solvent bank.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Level 2: State Channelising Agency (SCA)</span>
                  <Badge variant="outline" className="text-[10px] bg-white">14-Day SLA</Badge>
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Escalate to the Managing Director of your State SC Development &amp; Finance Corporation.
                </p>
              </div>

              <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Level 3: Central MoSJE CPGRAMS</span>
                  <Badge variant="sovereign" className="text-[10px]">Statutory</Badge>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Final escalation directly to the Government of India Centralized Public Grievance Redress and Monitoring System.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <Link
                href="/locator"
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold flex items-center justify-between transition-colors min-h-[44px] group"
              >
                <span>Find Alternative Solvent Branch</span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Citizen Charter & SLA Standards */}
          <div className="bg-emerald-50/70 rounded-2xl border border-emerald-200/80 p-4 space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-emerald-900 font-bold">
              <Clock className="h-4 w-4 text-emerald-700 shrink-0" />
              <span>Citizen Charter Turnaround Times</span>
            </div>
            <ul className="list-disc pl-4 space-y-1 text-[11px] text-emerald-950/80">
              <li>Document authentication at branch counter: Same day</li>
              <li>Credit sanction order issue: 15 working days</li>
              <li>Subsidy claim &amp; loan disbursal: Within 30 working days</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
