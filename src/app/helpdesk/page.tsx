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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    id: "faq-1",
    question: "What should I do if a local bank branch refuses to accept my Pre-Screened Application Slip?",
    answer:
      "All authorized Channel Partners (SCAs, PSBs, and RRBs) are bound by statutory MoSJE lending directives. If a bank officer refuses to review your pre-screened dossier, note the officer's name, branch IFSC code, and request to speak with the designated District Lead Bank Manager (DLBM). You can also escalate immediately through our Level 2 State Channelising Agency Helpdesk or file an online grievance via CPGRAMS.",
  },
  {
    id: "faq-2",
    question: "Is there any mandatory margin money required for Micro Credit Finance (MCF)?",
    answer:
      "No. For micro-credit schemes up to ₹1.40 Lakhs (such as MCF and Mahila Samriddhi Yojana), NSFDC guidelines mandate zero applicant promoter contribution. Up to 90% of the project cost is provided by NSFDC as concessional refinancing, with the remaining 10% covered by the Channel Partner bank or state subsidy.",
  },
  {
    id: "faq-3",
    question: "How long does it take for loan funds to be disbursed after branch document verification?",
    answer:
      "Under Citizen Charter standards, once your original caste certificate, income verification, and project proposal are verified at the branch desk, the designated Channel Partner must sanction and disburse credit within 15 to 30 working days. You can track progress in the Institutional Administration Console.",
  },
  {
    id: "faq-4",
    question: "Can an applicant apply for both Term Loan and Education Loan simultaneously?",
    answer:
      "No. An individual beneficiary may only hold one active subsidized concessional credit facility from NSFDC at any given time. Once a student or entrepreneur completes full repayment or reaches the designated statutory milestones, subsequent expansion loans can be applied for.",
  },
  {
    id: "faq-5",
    question: "Why does the Partner Locator mark some bank branches as 'High NPA / Filtered'?",
    answer:
      "When a banking branch has gross non-performing assets (NPAs) exceeding 10% or exhausted affirmative lending quotas, loan files often get backlogged or rejected. SchemeSetu automatically filters out high-risk branches to ensure your pre-screened file is directed exclusively to solvent, high-performing branches.",
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
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
          <span className="text-xs text-slate-500">Government of India &bull; MoSJE</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          MoSJE Citizen Helpdesk &amp; Grievance Redressal
        </h1>

        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
          Dedicated assistance for Scheduled Caste entrepreneurs, women beneficiaries, and students applying for concessional credit under NSFDC programs. Get helpline guidance, resolve branch routing issues, or file statutory grievances.
        </p>
      </div>

      {/* Emergency Helpline Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1 */}
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                National Helpline
              </span>
              <span className="text-sm font-bold text-slate-900 font-sans tabular-nums">
                1800-11-2001 (Toll-Free)
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Direct citizen helpline for scheme inquiry, eligibility verification, and application status guidance.
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center text-[11px] text-slate-500 gap-1.5">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>Mon - Fri, 9:30 AM - 5:30 PM IST</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Official Support Desk
              </span>
              <span className="text-xs font-bold text-slate-900 font-mono break-all">
                support-nsfdc@socialjustice.gov.in
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Email channel for pre-screened application escalations, branch dispute filings, and technical inquiries.
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center text-[11px] text-slate-500 gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Guaranteed 48-Hour Response Time</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                NSFDC Headquarters
              </span>
              <span className="text-xs font-bold text-slate-900">
                Core 1 &amp; 2, Scope Minar, Delhi
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            National Scheduled Castes Finance &amp; Development Corporation, Laxmi Nagar District Centre, Delhi 110092.
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center text-[11px] text-slate-500 gap-1.5">
            <Landmark className="h-3.5 w-3.5 text-slate-400" />
            <span>Government of India Apex Enterprise</span>
          </div>
        </div>
      </div>

      {/* 2-Column Split: Ticket Form & 3-Tier Escalation Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Grievance Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 sm:p-7 space-y-5">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
              Fast-Track Resolution
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
              Submit Grievance or Branch Issue Ticket
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              If a designated Channel Partner bank is delaying or unlawfully refusing your application, submit an inquiry for nodal review.
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
                    placeholder="e.g. MOSJE-2026-8921"
                    value={formData.applicationId}
                    onChange={(e) => setFormData({ ...formData, applicationId: e.target.value })}
                    className="w-full text-base sm:text-xs py-2.5 px-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Issue Category *
                  </label>
                  <select
                    value={formData.issueType}
                    onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
                    className="w-full text-base sm:text-xs py-2.5 px-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="BRANCH_REFUSAL">Bank Branch Refused Application</option>
                    <option value="EXCESS_MARGIN">Demanding Unlawful Margin / Commission</option>
                    <option value="DISBURSEMENT_DELAY">Delay in Sanctioned Disbursement (&gt;30 Days)</option>
                    <option value="QR_SCAN_ISSUE">QR Slip Verification Failure at Counter</option>
                    <option value="GENERAL_INQUIRY">General Concessional Scheme Inquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Description of Issue / Branch Details *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide branch name, district, date of visit, and specific response received from the bank officer..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full text-base sm:text-xs py-2.5 px-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <Button
                type="submit"
                variant="accent"
                className="w-full sm:w-auto min-h-[44px] px-6 rounded-xl font-bold text-xs"
              >
                <Send className="h-4 w-4 mr-2" />
                <span>Submit Grievance Ticket</span>
              </Button>
            </form>
          )}
        </div>

        {/* Right: 3-Tier Escalation Framework */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
              Statutory 3-Tier Escalation Matrix
            </span>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Level 1: Branch Nodal Officer</span>
                  <Badge variant="outline" className="text-[10px]">7-Day SLA</Badge>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Contact the Lead District Bank Manager (DLBM) or Branch Chief Manager of the designated solvent bank.
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Level 2: State Channelising Agency (SCA)</span>
                  <Badge variant="outline" className="text-[10px]">14-Day SLA</Badge>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Escalate to the Managing Director of your State SC Development &amp; Finance Corporation.
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Level 3: Central MoSJE CPGRAMS</span>
                  <Badge variant="sovereign" className="text-[10px]">Statutory</Badge>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Final escalation directly to the Government of India Centralized Public Grievance Redress and Monitoring System.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200">
              <Link
                href="/locator"
                className="w-full py-2.5 px-3 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center justify-between transition-colors min-h-[44px] group"
              >
                <span>Find Alternative Solvent Partner Branch</span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions (FAQ) Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 sm:p-7 space-y-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
            Self-Service Assistance
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Key guidelines for affirmative concessional credit procedures and grievance resolutions.
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
                  <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-amber-700 transition-colors">
                    {faq.question}
                  </span>
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
  );
}
