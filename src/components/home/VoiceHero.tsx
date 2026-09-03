"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSpeechRecognition } from "@/lib/audio/speechRecognition";
import { Search, Mic, Megaphone, Loader2 } from "lucide-react";

export function VoiceHero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { isListening, isSupported, transcript, startListening, stopListening } =
    useSpeechRecognition({
      language: "hi-IN",
      onResult: (finalTranscript) => {
        setSearchQuery(finalTranscript);
        if (finalTranscript.trim()) {
          setTimeout(() => {
            router.push(`/assistant?q=${encodeURIComponent(finalTranscript.trim())}`);
          }, 800);
        }
      },
    });

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/assistant?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <section className="flex flex-col items-center justify-center text-center pt-6 pb-4 px-4 max-w-2xl mx-auto space-y-6">
      {/* Title & Subtitle */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          How can we help you today?
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto">
          Speak directly or search to find the right financial support for your needs.
        </p>
      </div>

      {/* Concentric Voice Microphone Button */}
      <div className="flex flex-col items-center justify-center space-y-3 pt-2">
        <button
          type="button"
          onClick={handleMicClick}
          className="relative group flex items-center justify-center focus:outline-none cursor-pointer"
          title={isListening ? "Listening... click to stop" : "Click to speak in Hindi or English"}
        >
          {/* Outermost soft gradient ring */}
          <div
            className={`w-32 h-32 sm:w-36 sm:h-36 rounded-full flex items-center justify-center transition-all duration-500 ${
              isListening
                ? "bg-amber-100/90 scale-105 shadow-md ring-4 ring-amber-200/60 animate-pulse"
                : "bg-[#F7EAE1]/80 hover:bg-[#F3E1D5]"
            }`}
          >
            {/* Inner secondary ring */}
            <div
              className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center transition-all duration-300 ${
                isListening ? "bg-amber-200/70" : "bg-[#EBD2C2]/70 group-hover:bg-[#E4C8B5]"
              }`}
            >
              {/* Center dark core button */}
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white shadow-sm transition-transform duration-200 active:scale-95 ${
                  isListening ? "bg-amber-600" : "bg-[#1E293B] group-hover:bg-slate-800"
                }`}
              >
                {isListening ? (
                  <Loader2 className="h-6 w-6 sm:h-7 sm:w-7 animate-spin text-white" />
                ) : (
                  <Mic className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                )}
              </div>
            </div>
          </div>
        </button>

        {/* Audio Waveform Bars */}
        <div className="flex items-center justify-center space-x-1 h-5 pt-1">
          <span
            className={`w-1 rounded-full bg-slate-800 transition-all ${
              isListening ? "h-4 animate-bounce" : "h-2"
            }`}
          />
          <span
            className={`w-1 rounded-full bg-slate-800 transition-all ${
              isListening ? "h-6 animate-bounce delay-75" : "h-3.5"
            }`}
          />
          <span
            className={`w-1 rounded-full bg-slate-800 transition-all ${
              isListening ? "h-5 animate-bounce delay-150" : "h-5"
            }`}
          />
          <span
            className={`w-1 rounded-full bg-slate-800 transition-all ${
              isListening ? "h-6 animate-bounce delay-100" : "h-3.5"
            }`}
          />
          <span
            className={`w-1 rounded-full bg-slate-800 transition-all ${
              isListening ? "h-4 animate-bounce delay-200" : "h-2"
            }`}
          />
        </div>

        {/* Action Prompt */}
        <p className="text-xs text-slate-500 italic">
          {isListening
            ? transcript
              ? `Hearing: "${transcript}"`
              : "Listening... Speak your requirement now"
            : 'Tap and speak: "Mujhe dukaan ke liye 2 lakh ka loan chahiye"'}
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearchSubmit} className="w-full max-w-xl">
        <div className="flex items-center bg-white border border-slate-200/90 rounded-2xl shadow-xs hover:border-slate-300 focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-100 p-1.5 transition-all">
          <div className="pl-3 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Describe your business need, project cost, or course..."
            className="w-full text-xs sm:text-sm px-3 py-2 text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
          />
          <button
            type="submit"
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-xl transition-colors shrink-0 cursor-pointer"
          >
            Search
          </button>
        </div>
      </form>

      {/* Announcement / Updates Ticker */}
      <div className="w-full max-w-xl bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 flex items-center space-x-2 text-xs text-slate-600">
        <Megaphone className="h-3.5 w-3.5 text-amber-600 shrink-0" />
        <span className="font-bold text-slate-700 shrink-0">Latest Updates:</span>
        <span className="truncate text-[11px] text-slate-500">
          MoSJE NSFDC Concessional Credit Window 2026 active. Concessional rates from 4.0% p.a.
        </span>
      </div>
    </section>
  );
}
