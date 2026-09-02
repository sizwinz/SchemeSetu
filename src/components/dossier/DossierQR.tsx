"use client";

import React, { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download, ShieldCheck, QrCode } from "lucide-react";

interface DossierQRProps {
  value: string;
  applicationId: string;
  checksum: string;
  className?: string;
}

export function DossierQR({
  value,
  applicationId,
  checksum,
  className = "",
}: DossierQRProps) {
  const qrWrapperRef = useRef<HTMLDivElement>(null);

  const handleDownloadQR = () => {
    if (!qrWrapperRef.current) return;
    const svgElement = qrWrapperRef.current.querySelector("svg");
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = `QR_${applicationId}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      {/* QR Code Container */}
      <div
        ref={qrWrapperRef}
        className="bg-white p-3 rounded-2xl border-2 border-slate-900/80 shadow-xs inline-block"
      >
        <QRCodeSVG
          value={value}
          size={160}
          level="H"
          includeMargin={true}
          fgColor="#000000"
          bgColor="#FFFFFF"
        />
      </div>

      {/* Verification Labels */}
      <div className="mt-2 space-y-1">
        <div className="flex items-center justify-center space-x-1 text-emerald-700 font-bold text-xs">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span className="font-mono tracking-wide">{applicationId}</span>
        </div>

        <div className="text-[10px] text-slate-500 font-mono">
          Security Checksum: <span className="font-bold text-slate-700">{checksum}</span>
        </div>

        <div className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">
          Level-H Error Corrected • Offline Scannable
        </div>
      </div>

      {/* Download Action (Hidden on Print) */}
      <button
        type="button"
        onClick={handleDownloadQR}
        className="mt-3 text-[11px] font-semibold text-mosje-navy hover:text-amber-700 border border-slate-300 hover:border-amber-500 bg-white px-3 py-1.5 rounded-xl shadow-2xs transition-all flex items-center space-x-1.5 print:hidden cursor-pointer"
      >
        <Download className="h-3.5 w-3.5" />
        <span>Save QR Code</span>
      </button>
    </div>
  );
}
