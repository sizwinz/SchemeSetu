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
    <div className="flex-1 flex flex-col max-w-5xl xl:max-w-6xl mx-auto w-full px-2.5 sm:px-6 lg:px-8 pt-2 sm:pt-4 pb-2 sm:pb-8 min-h-0 overflow-hidden">
      {/* Title Bar: Compact 1-line on mobile, expanded on desktop */}
      <div className="flex items-center justify-between gap-2 pb-2 sm:pb-3 shrink-0">
        <div className="flex items-center space-x-2 min-w-0">
          <h1 className="text-base sm:text-2xl font-bold text-slate-900 tracking-tight truncate">
            AI Scheme Assistant
          </h1>
          <span className="hidden sm:inline text-xs text-slate-500">• Voice &amp; Chat Pre-Screening</span>
        </div>
        <div className="flex items-center space-x-1.5 shrink-0">
          <Badge variant="outline" className="text-slate-600 bg-white border-slate-200 text-[10px] sm:text-xs py-0.5 px-2 sm:px-3">
            <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 text-emerald-600" />
            <span>90% Assistance</span>
          </Badge>
        </div>
      </div>

      {/* Chat Component fills remaining flex viewport space */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Assistant...</div>}>
          <AssistantContent />
        </Suspense>
      </div>
    </div>
  );
}
