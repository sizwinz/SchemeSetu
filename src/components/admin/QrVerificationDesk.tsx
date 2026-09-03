"use client";

import React, { useState, useRef, useEffect } from "react";
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
  Camera,
  VideoOff,
} from "lucide-react";

export function QrVerificationDesk() {
  const [tokenInput, setTokenInput] = useState<string>("");
  const [result, setResult] = useState<QrVerificationResult | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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
    stopCamera();
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      setIsCameraActive(false);
      setCameraError(
        "Camera permission denied or camera device unavailable. You can paste or type the QR payload directly."
      );
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

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
              Countertop QR Verification &amp; Tamper Detection Desk
            </h3>
            <p className="text-[11px] text-slate-500">
              Scan paper/digital dossier QR or paste verification token to verify cryptographic integrity
            </p>
          </div>
        </div>

        {/* Demo & Camera Triggers */}
        <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-0">
          <button
            type="button"
            onClick={isCameraActive ? stopCamera : startCamera}
            className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-xl border transition-colors flex items-center space-x-1.5 cursor-pointer ${
              isCameraActive
                ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
            }`}
          >
            {isCameraActive ? <VideoOff className="h-3.5 w-3.5" /> : <Camera className="h-3.5 w-3.5" />}
            <span>{isCameraActive ? "Close Scanner" : "Scan via Camera"}</span>
          </button>

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
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-700 p-1.5 rounded-xl transition-colors cursor-pointer"
              title="Reset Desk"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Live Camera Viewfinder Overlay */}
      {isCameraActive && (
        <div className="bg-slate-900 rounded-2xl p-4 flex flex-col items-center space-y-3 relative overflow-hidden">
          <div className="relative w-full max-w-sm aspect-video sm:aspect-square bg-black rounded-xl overflow-hidden flex items-center justify-center">
            <video
              ref={videoRef}
              playsInline
              className="w-full h-full object-cover"
            />
            {/* Target Reticle Viewfinder Box */}
            <div className="absolute inset-8 sm:inset-12 border-2 border-dashed border-emerald-400/80 rounded-2xl pointer-events-none flex items-center justify-center">
              <span className="text-[10px] text-emerald-300 font-mono bg-black/60 px-2 py-0.5 rounded">
                Align QR inside reticle
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => {
                handleLoadSample();
                stopCamera();
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs cursor-pointer"
            >
              Simulate Scan Capture
            </button>
            <button
              type="button"
              onClick={stopCamera}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {cameraError && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 flex items-start space-x-2">
          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <span>{cameraError}</span>
        </div>
      )}

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
