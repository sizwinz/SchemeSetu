import React from "react";
import { ChatMessage } from "@/lib/chat/types";
import { Bot, User, Volume2 } from "lucide-react";

interface ChatMessageItemProps {
  message: ChatMessage;
  onReplayAudio?: (text: string) => void;
  renderWidget?: (message: ChatMessage) => React.ReactNode;
}

export function ChatMessageItem({
  message,
  onReplayAudio,
  renderWidget,
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
        <div className="h-8 w-8 rounded-full bg-mosje-navy text-amber-400 flex items-center justify-center shrink-0 shadow-xs border border-slate-700">
          <Bot className="h-4 w-4" />
        </div>
      )}

      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm transition-all ${
          isUser
            ? "bg-white text-slate-900 border border-slate-200 shadow-xs rounded-tr-xs"
            : "bg-mosje-navy text-white shadow-sm rounded-tl-xs"
        }`}
      >
        <div className="flex items-center justify-between gap-3 mb-1">
          <span
            className={`text-[10px] font-semibold tracking-wider uppercase ${
              isUser ? "text-slate-600" : "text-amber-400"
            }`}
          >
            {isUser ? "You" : "SchemeSetu Advisor"}
          </span>
          <div className="flex items-center space-x-1.5">
            <span
              className={`text-[10px] ${
                isUser ? "text-slate-600" : "text-slate-300"
              }`}
            >
              {message.timestamp}
            </span>
            {isAssistant && onReplayAudio && (
              <button
                type="button"
                onClick={() => onReplayAudio(message.text)}
                className="text-slate-300 hover:text-amber-300 p-0.5 rounded transition-colors"
                title="Read aloud"
              >
                <Volume2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="whitespace-pre-wrap leading-relaxed">
          {message.text}
        </div>

        {renderWidget && renderWidget(message)}
      </div>

      {isUser && (
        <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 shadow-xs">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}
