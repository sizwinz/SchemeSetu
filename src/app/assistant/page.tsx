"use client";

import React, { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function AssistantContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialScheme = searchParams.get("scheme") || "";

  return <ChatContainer initialQuery={initialQuery} initialScheme={initialScheme} />;
}

export default function AssistantPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-12 px-4 sm:px-6 pt-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Conversational Scheme Advisor
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Voice-enabled interactive pre-screening for MoSJE concessional credit programs.
          </p>
        </div>
        <div className="hidden sm:flex items-center space-x-1.5">
          <Badge variant="outline" className="text-slate-600 bg-white border-slate-200 text-xs py-1 px-3">
            <ShieldCheck className="h-3.5 w-3.5 mr-1 text-emerald-600" />
            <span>Statutory 90% Assistance</span>
          </Badge>
        </div>
      </div>

      <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Assistant...</div>}>
        <AssistantContent />
      </Suspense>
    </div>
  );
}
