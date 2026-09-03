"use client";

import React, { useState } from "react";
import { ShieldCheck, ArrowRight, X, CheckCircle2, Lock, FileCheck2, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function TrustBanner() {
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <>
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
            <ShieldCheck className="h-5 w-5" />
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm sm:text-base font-bold text-slate-900">
                Sovereign Trust, Privacy &amp; Statutory Compliance
              </h4>
              <Badge variant="outline" className="text-[10px] text-emerald-700 bg-emerald-50 border-emerald-200 font-semibold">
                DPDP Act, 2023 Compliant
              </Badge>
              <Badge variant="outline" className="text-[10px] text-blue-700 bg-blue-50 border-blue-200 font-semibold">
                DigiLocker Synced
              </Badge>
              <Badge variant="outline" className="text-[10px] text-amber-800 bg-amber-50 border-amber-200 font-semibold">
                PM-SURAJ Aligned
              </Badge>
            </div>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              All loan evaluations enforce official MoSJE/NSFDC affirmative guidelines with client-side data minimization and zero cloud data leakage.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowModal(true)}
          className="self-start md:self-auto rounded-xl font-semibold shrink-0 text-xs shadow-2xs"
        >
          <span>Compliance Protocol</span>
          <ArrowRight className="h-3.5 w-3.5 ml-1" />
        </Button>
      </div>

      {/* Information Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-xl space-y-4 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  MoSJE Statutory Verification &amp; Privacy Protocol
                </h3>
                <p className="text-xs text-slate-500">
                  Ensuring transparency, zero corruption, and equitable credit access
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600 border-t border-slate-100 pt-3">
              <div className="flex items-start space-x-2.5">
                <Lock className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">DPDP Act, 2023 Data Minimization:</strong>
                  <span>
                    Sensitive socio-economic declarations (income, caste, enterprise cost) are processed client-side. No sensitive data is stored or monetized on unverified cloud instances.
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <FileCheck2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">DigiLocker Consent-Based Sync:</strong>
                  <span>
                    Direct verification of authentic caste and income credentials from DigiLocker API gateways eliminates predatory third-party field intermediaries.
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <Landmark className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">PM-SURAJ &amp; Channel Finance Routing:</strong>
                  <span>
                    Generated application packets are standardized for seamless handoff to active SCAs, Public Sector Banks, Regional Rural Banks, and PM-SURAJ credit desks.
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowModal(false)}
                className="rounded-xl"
              >
                Understood &amp; Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
