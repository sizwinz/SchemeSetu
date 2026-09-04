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
    <div className="space-y-3 sm:space-y-4 max-w-4xl mx-auto pb-4 sm:pb-8 px-3 sm:px-6 pt-3 sm:pt-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight">
            AI Scheme Assistant
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Voice and chat-enabled interactive pre-screening for MoSJE concessional credit programs.
          </p>
        </div>
        <div className="flex items-center space-x-1.5 shrink-0">
          <Badge variant="outline" className="text-slate-600 bg-white border-slate-200 text-[10px] sm:text-xs py-0.5 sm:py-1 px-2 sm:px-3">
            <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 text-emerald-600" />
            <span>90% Assistance</span>
          </Badge>
        </div>
      </div>

      <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Assistant...</div>}>
        <AssistantContent />
      </Suspense>
    </div>
  );
}
