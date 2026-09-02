"use client";

import React, { useState } from "react";
import { QrVerificationResult } from "@/lib/admin/types";
import { verifyQrToken } from "@/lib/admin/engine";
import { getSampleDossier, serializeDossierQrPayload } from "@/lib/dossier/engine";
import {
  QrCode,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  Building2,
  IndianRupee,
} from "lucide-react";

export function QrVerificationDesk() {
  const [tokenInput, setTokenInput] = useState<string>("");
  const [result, setResult] = useState<QrVerificationResult | null>(null);

  const handleVerify = () => {
    if (!tokenInput.trim()) return;
    const res = verifyQrToken(tokenInput.trim());
    setResult(res);
  };

  const handleLoadSample = () => {
    const sample = getSampleDossier();
    const token = serializeDossierQrPayload(sample);
    setTokenInput(token);
    const res = verifyQrToken(token);
    setResult(res);
  };

  const handleSimulateTamper = () => {
    const sample = getSampleDossier();
    const raw = JSON.parse(serializeDossierQrPayload(sample));
    // Manipulate loan sum from ₹1,26,000 to ₹2,50,000 without valid checksum
    raw.ca = 250000;
    const tamperedToken = JSON.stringify(raw);
    setTokenInput(tamperedToken);
    const res = verifyQrToken(tamperedToken);
    setResult(res);
  };

  const handleReset = () => {
    setTokenInput("");
    setResult(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-amber-500/10 text-amber-600 rounded-lg">
            <QrCode className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-mosje-navy">
              Countertop QR Verification & Tamper Detection Desk
            </h3>
            <p className="text-[11px] text-slate-500">
              Scan paper/digital dossier QR or paste verification token to verify cryptographic integrity
            </p>
          </div>
        </div>

        {/* Demo Triggers */}
        <div className="flex items-center space-x-2 pt-1 sm:pt-0">
          <button
            type="button"
            onClick={handleLoadSample}
            className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer"
          >
            Verify Sample QR
          </button>
          <button
            type="button"
            onClick={handleSimulateTamper}
            className="text-[11px] font-semibold text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer"
          >
            Test Tampered QR
          </button>
          {result && (
            <button
              type="button"
              onClick={handleReset}
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-700 p-1.5 rounded-xl transition-colors"
              title="Reset Desk"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Input Field */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="Scan optical barcode or paste verification token JSON string..."
            className="w-full text-xs font-mono py-2.5 pl-3 pr-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <button
          type="button"
          onClick={handleVerify}
          className="text-xs font-bold bg-mosje-navy hover:bg-slate-800 text-amber-300 px-4 py-2.5 rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          Verify Token
        </button>
      </div>

      {/* Verification Result Display */}
      {result && (
        <div
          className={`rounded-xl p-4 border transition-all ${
            result.isValid
              ? "bg-emerald-50 border-emerald-200 text-emerald-950"
              : result.isTampered
              ? "bg-red-50 border-red-200 text-red-950"
              : "bg-slate-50 border-slate-200 text-slate-700"
          }`}
        >
          {/* Status Banner */}
          <div className="flex items-start space-x-2.5">
            {result.isValid ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : result.isTampered ? (
              <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
            )}

            <div className="space-y-1">
              <div className="text-xs font-bold tracking-tight">
                {result.statusMessage}
              </div>

              {result.payload && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] font-mono tabular-nums">
                  <div className="bg-white/80 p-2 rounded-lg border border-slate-200/60">
                    <span className="text-[9px] text-slate-500 uppercase block font-sans">
                      Application ID
                    </span>
                    <span className="font-bold text-slate-900">{result.payload.app}</span>
                  </div>

                  <div className="bg-white/80 p-2 rounded-lg border border-slate-200/60">
                    <span className="text-[9px] text-slate-500 uppercase block font-sans">
                      Scheme Code
                    </span>
                    <span className="font-bold text-mosje-navy">{result.payload.sc}</span>
                  </div>

                  <div className="bg-white/80 p-2 rounded-lg border border-slate-200/60">
                    <span className="text-[9px] text-slate-500 uppercase block font-sans">
                      Concessional Loan
                    </span>
                    <span className="font-bold text-slate-900">
                      ₹{result.payload.ca.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="bg-white/80 p-2 rounded-lg border border-slate-200/60">
                    <span className="text-[9px] text-slate-500 uppercase block font-sans">
                      Monthly EMI
                    </span>
                    <span className="font-bold text-slate-900">
                      ₹{result.payload.emi.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
