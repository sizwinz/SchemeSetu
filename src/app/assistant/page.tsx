"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { ShieldCheck } from "lucide-react";

function AssistantContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialScheme = searchParams.get("scheme") || "";

  return <ChatContainer initialQuery={initialQuery} initialScheme={initialScheme} />;
}

export default function AssistantPage() {
  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Conversational Scheme Advisor
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Voice-enabled interactive pre-screening for MoSJE concessional credit programs.
          </p>
        </div>
        <div className="hidden sm:flex items-center space-x-1.5 text-xs text-slate-600 bg-white px-3 py-1.5 rounded-full border border-slate-200">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Statutory 90% Assistance</span>
        </div>
      </div>

      <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Assistant...</div>}>
        <AssistantContent />
      </Suspense>
    </div>
  );
}
