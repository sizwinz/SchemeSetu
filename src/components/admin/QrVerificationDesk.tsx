"use client";

import React, { useState, useRef, useEffect } from "react";
import { verifyQrToken } from "@/lib/admin/engine";
import { QrVerificationResult, BeneficiaryLead } from "@/lib/admin/types";
import {
  QrCode,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Camera,
  VideoOff,
  RefreshCw,
  Search,
  ScanLine,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface QrVerificationDeskProps {
  leads: BeneficiaryLead[];
  onVerifyLead: (leadId: string) => void;
}

function simulateTamperedPayload(rawJson: string): string {
  try {
    const parsed = JSON.parse(rawJson);
    parsed.ca = (parsed.ca || 100000) * 2;
    return JSON.stringify(parsed);
  } catch {
    return rawJson + "_TAMPERED";
  }
}

export function QrVerificationDesk({
  leads,
  onVerifyLead,
}: QrVerificationDeskProps) {
  const [tokenInput, setTokenInput] = useState<string>("");
  const [result, setResult] = useState<QrVerificationResult | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const sampleLead = leads[0];
  const sampleRawToken = sampleLead
    ? JSON.stringify({
        app: sampleLead.applicationId,
        sc: sampleLead.schemeCode,
        ca: sampleLead.concessionalAmount,
        emi: sampleLead.monthlyEmi || 2840,
        bp: sampleLead.designatedBranchId || "partner-001",
        chk: "9a2f1b4c",
        ts: Date.now(),
      })
    : "";

  const handleVerify = (tokenToVerify?: string) => {
    const raw = tokenToVerify !== undefined ? tokenToVerify : tokenInput;
    if (!raw.trim()) return;

    const res = verifyQrToken(raw);
    setResult(res);

    if (res.isValid && res.payload) {
      const matchingLead = leads.find((l) => l.applicationId === res.payload?.app);
      if (matchingLead) {
        onVerifyLead(matchingLead.id);
      }
    }
  };

  const handleLoadSample = () => {
    setTokenInput(sampleRawToken);
    handleVerify(sampleRawToken);
  };

  const handleSimulateTamper = () => {
    const tampered = simulateTamperedPayload(sampleRawToken);
    setTokenInput(tampered);
    handleVerify(tampered);
  };

  const handleReset = () => {
    setTokenInput("");
    setResult(null);
    stopCamera();
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsCameraActive(true);
      } else {
        setCameraError("Camera access is not supported by your browser environment.");
      }
    } catch (err) {
      setCameraError("Unable to access optical camera device. Please verify permissions.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-amber-500/10 text-amber-600 rounded-xl">
            <QrCode className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Countertop QR Verification &amp; Tamper Detection Desk
            </h3>
            <p className="text-[11px] text-slate-500">
              Scan paper/digital dossier QR or paste verification token to verify cryptographic integrity
            </p>
          </div>
        </div>

        {/* Demo & Camera Triggers */}
        <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-0">
          <Button
            size="sm"
            variant={isCameraActive ? "destructive" : "outline"}
            onClick={isCameraActive ? stopCamera : startCamera}
            className="text-xs rounded-xl"
          >
            {isCameraActive ? <VideoOff className="h-3.5 w-3.5 mr-1" /> : <Camera className="h-3.5 w-3.5 mr-1" />}
            <span>{isCameraActive ? "Close Scanner" : "Scan via Camera"}</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleLoadSample}
            className="text-xs rounded-xl border-emerald-300 text-emerald-800 hover:bg-emerald-50"
          >
            Verify Sample QR
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleSimulateTamper}
            className="text-xs rounded-xl border-red-200 text-red-700 hover:bg-red-50"
          >
            Test Tampered QR
          </Button>

          {result && (
            <Button
              size="icon"
              variant="ghost"
              onClick={handleReset}
              className="h-8 w-8 rounded-xl"
              title="Reset Desk"
            >
              <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
            </Button>
          )}
        </div>
      </div>

      {/* Live Camera Viewfinder Overlay */}
      {isCameraActive && (
        <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-800 flex flex-col items-center justify-center p-4 min-h-[260px] animate-in fade-in">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full max-w-sm rounded-xl object-cover h-56"
          />

          {/* Optical Scanner Reticle */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-48 border-2 border-dashed border-amber-400 rounded-2xl relative flex items-center justify-center animate-pulse">
              <ScanLine className="h-8 w-8 text-amber-400" />
              <span className="absolute bottom-2 text-[10px] text-amber-200 font-mono font-semibold bg-black/60 px-2 py-0.5 rounded">
                Align Dossier QR Code
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center space-x-2 z-10">
            <Button
              size="sm"
              variant="sovereign"
              onClick={() => {
                handleLoadSample();
                stopCamera();
              }}
              className="text-xs"
            >
              Capture Dossier QR Frame
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={stopCamera}
              className="text-xs"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {cameraError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-center space-x-2">
          <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
          <span>{cameraError}</span>
        </div>
      )}

      {/* Manual Paste/Type Input Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleVerify()}
            placeholder="Paste raw cryptographic QR JSON token or enter FNV-1a checksum..."
            className="w-full text-xs font-mono py-2.5 px-3 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <Button
          variant="default"
          onClick={() => handleVerify()}
          className="text-xs font-bold rounded-xl shrink-0"
        >
          Verify Token
        </Button>
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
                    <span className="font-bold text-slate-900">{result.payload.sc}</span>
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
