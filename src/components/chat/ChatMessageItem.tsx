"use client";

import React from "react";
import { ChatMessage } from "@/lib/chat/types";
import { Bot, User, Volume2 } from "lucide-react";

interface ChatMessageItemProps {
  message: ChatMessage;
  onReplayAudio?: (text: string) => void;
  renderWidget?: (message: ChatMessage) => React.ReactNode;
  children?: React.ReactNode;
}

export function ChatMessageItem({
  message,
  onReplayAudio,
  renderWidget,
  children,
}: ChatMessageItemProps) {
  const isAssistant = message.sender === "ASSISTANT";
  const isUser = message.sender === "USER";

  return (
    <div
      className={`flex items-start gap-2.5 my-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {isAssistant && (
        <div className="h-8 w-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200 shadow-2xs">
          <Bot className="h-4 w-4" />
        </div>
      )}

      <div
        className={`max-w-[88%] sm:max-w-[78%] rounded-2xl p-4 sm:p-5 text-sm transition-all shadow-xs ${
          isUser
            ? "bg-slate-900 text-white rounded-tr-xs"
            : "bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs"
        }`}
      >
        <div className="flex items-center justify-between gap-3 mb-1.5">
          <span
            className={`text-[11px] font-semibold tracking-wide ${
              isUser ? "text-slate-300" : "text-slate-900"
            }`}
          >
            {isUser ? "You" : "SchemeSetu Advisor"}
          </span>
          <div className="flex items-center space-x-1.5">
            <span
              className={`text-[10px] ${
                isUser ? "text-slate-400" : "text-slate-400"
              }`}
            >
              {message.timestamp}
            </span>
            {isAssistant && onReplayAudio && (
              <button
                type="button"
                onClick={() => onReplayAudio(message.text)}
                className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition-colors cursor-pointer"
                title="Read aloud"
              >
                <Volume2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className={`whitespace-pre-wrap leading-relaxed text-xs sm:text-sm ${isUser ? "text-slate-100" : "text-slate-700"}`}>
          {message.text}
        </div>

        {renderWidget && renderWidget(message)}
        {children}
      </div>

      {isUser && (
        <div className="h-8 w-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 shadow-2xs">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}
