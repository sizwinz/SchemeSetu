"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function TrustBanner() {
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <>
      <section className="pt-2 pb-2">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                <h4 className="text-sm sm:text-base font-bold text-slate-900">
                  Secure &amp; Verified Process
                </h4>
                <Badge variant="success" className="text-[10px]">
                  Verified Channel
                </Badge>
              </div>
              <p className="text-xs text-slate-500">
                All applications are pre-screened under official MoSJE/NSFDC affirmative guidelines.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowModal(true)}
            className="self-start sm:self-auto rounded-xl font-semibold shrink-0"
          >
            <span>Learn More</span>
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
      </section>

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
                  Statutory MoSJE Verification Protocol
                </h3>
                <p className="text-xs text-slate-500">
                  Ensuring transparency, zero corruption, and equitable credit access
                </p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Direct Channel Partner Routing:</strong>
                  <span>
                    Your application is directed exclusively to solvent State Channelising Agencies (SCAs) or Public Sector Banks.
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Client-Side Cryptographic Hashing:</strong>
                  <span>
                    All sensitive declarations (income, caste, enterprise cost) are preserved with FNV-1a checksums and verifiable QR codes.
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Statutory Non-Discretionary Allocation:</strong>
                  <span>
                    Fixed 4% to 8% interest rates with up to 90% project cost coverage without informal intermediary fees.
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
