"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HelpCircle, Phone, Mail, X, ShieldCheck } from "lucide-react";

export function Footer() {
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  return (
    <>
      <footer className="w-full border-t border-slate-200/80 bg-slate-50/50 py-8 px-4 text-center text-xs text-slate-500 space-y-3 mt-auto print:hidden">
        <div className="flex items-center justify-center space-x-2">
          <Image
            src="/logo.png"
            alt="SchemeSetu Logo"
            width={24}
            height={24}
            className="h-6 w-6 object-contain"
          />
          <span className="font-extrabold text-sm text-slate-900 tracking-tight">
            SchemeSetu
          </span>
        </div>
        <p className="font-medium text-slate-600">
          100% Sovereign &amp; Private. Verified with DigiLocker and NSFDC Guidelines.
        </p>
        <p className="text-[11px] text-slate-400">
          &copy; 2026 Ministry of Social Justice &amp; Empowerment. 100% Sovereign &amp; Private.
        </p>
        <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-500 pt-1">
          <Link href="/privacy" className="hover:text-slate-800 transition-colors">
            Privacy Policy
          </Link>
          <span>&bull;</span>
          <Link href="/terms" className="hover:text-slate-800 transition-colors">
            Terms of Service
          </Link>
          <span>&bull;</span>
          <Link href="/helpdesk" className="hover:text-slate-800 transition-colors">
            Helpdesk &amp; Grievances
          </Link>
        </div>
      </footer>

      {/* Floating Bottom-Right Help Button */}
      <button
        type="button"
        onClick={() => setShowHelpModal(true)}
        className="hidden md:flex fixed bottom-6 right-6 z-40 bg-[#0F172A] hover:bg-slate-800 text-white w-12 h-12 rounded-full shadow-lg items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer print:hidden"
        title="Need help? Click for MoSJE Helpline"
      >
        <HelpCircle className="h-6 w-6" />
      </button>

      {/* Helpdesk Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-xl space-y-4 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-amber-500/10 text-amber-600 rounded-xl">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">MoSJE Citizen Helpdesk</h3>
                <p className="text-xs text-slate-500">
                  National Scheduled Castes Finance &amp; Development Corporation
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600 border-t border-slate-100 pt-3">
              <div className="bg-slate-50 p-3 rounded-xl space-y-1">
                <div className="flex items-center space-x-2 text-slate-900 font-bold">
                  <Phone className="h-3.5 w-3.5 text-amber-600" />
                  <span>NSFDC Toll-Free National Helpline</span>
                </div>
                <p className="font-mono text-amber-700 font-bold text-sm">1800-11-8888</p>
                <p className="text-[11px] text-slate-400">Monday - Friday: 9:30 AM to 6:00 PM IST</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl space-y-1">
                <div className="flex items-center space-x-2 text-slate-900 font-bold">
                  <Mail className="h-3.5 w-3.5 text-amber-600" />
                  <span>Support Email</span>
                </div>
                <p className="font-mono text-slate-800 text-xs">support@schemesetu.gov.in</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
