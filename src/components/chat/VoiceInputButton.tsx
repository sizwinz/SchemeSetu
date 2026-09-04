"use client";

import React from "react";
import { Mic, MicOff, AlertCircle } from "lucide-react";
import { useSpeechRecognition } from "@/lib/audio/speechRecognition";
import { AssistantLanguage } from "@/lib/chat/types";

interface VoiceInputButtonProps {
  language: AssistantLanguage;
  onTranscript: (transcript: string) => void;
  disabled?: boolean;
}

export function VoiceInputButton({
  language,
  onTranscript,
  disabled = false,
}: VoiceInputButtonProps) {
  const {
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
  } = useSpeechRecognition({
    language,
    onResult: (text) => {
      onTranscript(text);
    },
  });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isSupported) {
    return (
      <button
        type="button"
        disabled
        className="p-2.5 rounded-xl border border-slate-200 text-slate-300 cursor-not-allowed shrink-0 relative group"
        title="Voice input not supported in this browser"
      >
        <MicOff className="h-4 w-4" />
        <span className="sr-only">Voice input not supported</span>
      </button>
    );
  }

  return (
    <div className="relative shrink-0 flex items-center">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className={`relative p-2.5 min-h-[44px] min-w-[44px] rounded-xl border transition-all flex items-center justify-center cursor-pointer ${
          isListening
            ? "bg-amber-600 border-amber-600 text-white shadow-md shadow-amber-600/30"
            : "bg-white border-slate-300 text-slate-700 hover:border-amber-500 hover:bg-amber-50/40"
        } disabled:opacity-50 disabled:pointer-events-none`}
        title={
          isListening
            ? language === "hi-IN"
              ? "रिकॉर्डिंग रोकें (टैप करें)"
              : "Stop listening (Tap to send)"
            : language === "hi-IN"
            ? "बोलने के लिए टैप करें"
            : "Tap to speak your prompt"
        }
      >
        {isListening ? (
          <>
            <span className="absolute -inset-1 rounded-xl bg-amber-500/40 animate-ping" />
            <Mic className="h-4 w-4 relative z-10 animate-pulse" />
          </>
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </button>

      {error && !isListening && (
        <div className="absolute bottom-full mb-2 left-0 z-30 bg-red-800 text-white text-[11px] px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap flex items-center gap-1.5 border border-red-700">
          <AlertCircle className="h-3.5 w-3.5 text-amber-300" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
