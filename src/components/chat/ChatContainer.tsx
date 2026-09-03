"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ChatMessage,
  QuickPrompt,
  AssistantLanguage,
  DialogState,
} from "@/lib/chat/types";
import { ChatMessageItem } from "./ChatMessageItem";
import { QuickReplyChips } from "./QuickReplyChips";
import { VoiceInputButton } from "./VoiceInputButton";
import { InlineSchemeWidget } from "./InlineSchemeWidget";
import {
  speakText,
  pauseSpeech,
  resumeSpeech,
  cancelSpeech,
  isAudioMuted,
  setAudioMuted,
  AudioPlaybackState,
} from "@/lib/audio/speechSynthesis";
import { advanceDialog } from "@/lib/chat/dialogEngine";
import { DIALOG_PROMPTS } from "@/lib/chat/prompts";
import {
  Send,
  RotateCcw,
  Volume2,
  VolumeX,
  Pause,
  Play,
  Square,
  Languages,
  MessageSquare,
} from "lucide-react";

const INITIAL_MESSAGES: Record<AssistantLanguage, ChatMessage[]> = {
  "en-IN": [
    {
      id: "msg-welcome-en",
      sender: "ASSISTANT",
      text: DIALOG_PROMPTS["en-IN"].GREETING.promptText,
      timestamp: "Just now",
      type: "TEXT",
    },
  ],
  "hi-IN": [
    {
      id: "msg-welcome-hi",
      sender: "ASSISTANT",
      text: DIALOG_PROMPTS["hi-IN"].GREETING.promptText,
      timestamp: "अभी",
      type: "TEXT",
    },
  ],
};

interface ChatContainerProps {
  onReplayAudio?: (text: string, lang: AssistantLanguage) => void;
  renderWidget?: (message: ChatMessage) => React.ReactNode;
  initialQuery?: string;
  initialScheme?: string;
}

export function ChatContainer({
  onReplayAudio,
  renderWidget,
  initialQuery,
  initialScheme,
}: ChatContainerProps) {
  const [language, setLanguage] = useState<AssistantLanguage>("en-IN");
  const [autoSpeak, setAutoSpeak] = useState<boolean>(!isAudioMuted());
  const [inputText, setInputText] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>(() => INITIAL_MESSAGES["en-IN"]);
  const [prompts, setPrompts] = useState<QuickPrompt[]>(() => DIALOG_PROMPTS["en-IN"].GREETING.quickPrompts);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Audio Playback State from global speech synthesis
  const [audioState, setAudioState] = useState<AudioPlaybackState>({
    isSpeaking: false,
    isPaused: false,
    isMuted: isAudioMuted(),
  });

  const [dialogState, setDialogState] = useState<DialogState>({
    currentStep: "GREETING",
    collectedProfile: {},
    language: "en-IN",
    autoSpeak: true,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialTriggerRef = useRef<boolean>(false);

  const handleAudioPlayback = (text: string, lang: AssistantLanguage) => {
    if (onReplayAudio) {
      onReplayAudio(text, lang);
    } else {
      speakText(text, lang);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Sync language with global header event
  useEffect(() => {
    const handleLangChange = (e: any) => {
      const targetLang: AssistantLanguage = e.detail === "hi" ? "hi-IN" : "en-IN";
      setLanguage(targetLang);
      setDialogState((prev) => ({ ...prev, language: targetLang }));
      setMessages(INITIAL_MESSAGES[targetLang]);
      setPrompts(DIALOG_PROMPTS[targetLang].GREETING.quickPrompts);
    };

    const handleAudio = (e: any) => {
      setAudioState(e.detail);
      if (e.detail.isMuted) {
        setAutoSpeak(false);
      }
    };

    window.addEventListener("schemesetu_language_changed", handleLangChange);
    window.addEventListener("schemesetu_audio_state", handleAudio);
    return () => {
      window.removeEventListener("schemesetu_language_changed", handleLangChange);
      window.removeEventListener("schemesetu_audio_state", handleAudio);
    };
  }, []);

  const handleLanguageToggle = () => {
    const nextLang: AssistantLanguage = language === "en-IN" ? "hi-IN" : "en-IN";
    setLanguage(nextLang);
    setDialogState((prev) => ({
      ...prev,
      language: nextLang,
    }));
    setMessages(INITIAL_MESSAGES[nextLang]);
    setPrompts(DIALOG_PROMPTS[nextLang].GREETING.quickPrompts);
  };

  const handleResetChat = () => {
    const confirmed = window.confirm(
      language === "hi-IN"
        ? "क्या आप अपनी पिछली बातचीत मिटाकर नई शुरुआत करना चाहते हैं?"
        : "Clear Conversation: Are you sure you want to reset the chat and clear your inputs?"
    );
    if (confirmed) {
      cancelSpeech();
      setDialogState({
        currentStep: "GREETING",
        collectedProfile: {},
        language,
        autoSpeak,
      });
      setMessages(INITIAL_MESSAGES[language]);
      setPrompts(DIALOG_PROMPTS[language].GREETING.quickPrompts);
    }
  };

  const submitMessage = (rawText: string) => {
    const trimmed = rawText.trim();
    if (!trimmed || isProcessing) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "USER",
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "TEXT",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsProcessing(true);

    try {
      const stepResult = advanceDialog(dialogState, trimmed);
      setDialogState(stepResult.nextState);

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: "ASSISTANT",
        text: stepResult.assistantReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: stepResult.widgetData ? "SCHEME_WIDGET" : "TEXT",
        widgetData: stepResult.widgetData,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setPrompts(stepResult.newPrompts);

      if (autoSpeak && !isAudioMuted()) {
        handleAudioPlayback(stepResult.assistantReply, language);
      }
    } catch {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: "SYSTEM",
        text:
          language === "hi-IN"
            ? "संदेश संसाधित करने में त्रुटि। कृपया पुनः प्रयास करें।"
            : "Unable to evaluate criteria. Please enter valid amounts or choose a suggested prompt.",
        timestamp: "Now",
        type: "ERROR",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Process initial query or scheme from URL
  useEffect(() => {
    if (!initialTriggerRef.current) {
      initialTriggerRef.current = true;
      if (initialQuery && initialQuery.trim()) {
        submitMessage(initialQuery.trim());
      } else if (initialScheme && initialScheme.trim()) {
        const schemePrompts: Record<string, string> = {
          MSY: "Tell me about Mahila Samriddhi Yojana (MSY) for women entrepreneurs",
          MCF: "I need micro credit finance for small business",
          TERM_LOAN: "I need a term loan for transport/manufacturing machinery",
          ELS: "I need educational loan for higher studies",
        };
        const queryText = schemePrompts[initialScheme] || `Tell me about ${initialScheme} scheme`;
        submitMessage(queryText);
      }
    }
  }, [initialQuery, initialScheme]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMessage(inputText);
  };

  const handlePromptSelect = (prompt: QuickPrompt) => {
    submitMessage(prompt.value);
  };

  const handleVoiceTranscript = (transcript: string) => {
    submitMessage(transcript);
  };

  return (
    <div className="flex flex-col h-[75vh] min-h-[500px] max-h-[850px] bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Chat Sub-Header Controls */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-3 bg-slate-50/90 border-b border-slate-200 text-xs gap-2">
        <div className="flex items-center space-x-2 text-slate-700 shrink-0">
          <MessageSquare className="h-4 w-4 text-mosje-saffron" />
          <span className="font-bold">
            {language === "hi-IN" ? "योजना सेतु सहायक" : "SchemeSetu Advisor"}
          </span>
        </div>

        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* Read Aloud Active Controls: Pause/Resume and Stop */}
          {(audioState.isSpeaking || audioState.isPaused) && (
            <div className="flex items-center space-x-1 bg-white px-2 py-1 rounded-xl border border-slate-200 shadow-2xs">
              <span className="relative flex h-2 w-2 mr-0.5">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                    audioState.isPaused ? "bg-amber-400" : "bg-emerald-400"
                  } opacity-75`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    audioState.isPaused ? "bg-amber-500" : "bg-emerald-500"
                  }`}
                />
              </span>

              {/* Pause / Resume Button */}
              <button
                type="button"
                onClick={audioState.isPaused ? resumeSpeech : pauseSpeech}
                className="p-1 rounded text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title={audioState.isPaused ? "Resume read aloud" : "Pause read aloud"}
              >
                {audioState.isPaused ? (
                  <Play className="h-3.5 w-3.5 fill-current" />
                ) : (
                  <Pause className="h-3.5 w-3.5 fill-current" />
                )}
              </button>

              {/* Stop Button */}
              <button
                type="button"
                onClick={cancelSpeech}
                className="p-1 rounded text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                title="Stop read aloud completely"
              >
                <Square className="h-3.5 w-3.5 fill-current" />
              </button>
            </div>
          )}

          {/* Audio Mute/Unmute Toggle */}
          <button
            type="button"
            onClick={() => {
              const nextMuted = !audioState.isMuted;
              setAudioMuted(nextMuted);
              setAutoSpeak(!nextMuted);
            }}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border transition-colors cursor-pointer font-semibold ${
              audioState.isMuted
                ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                : "bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200"
            }`}
            title={
              audioState.isMuted
                ? "Read aloud is muted (Click to unmute)"
                : "Read aloud is active (Click to mute)"
            }
          >
            {audioState.isMuted ? (
              <>
                <VolumeX className="h-3.5 w-3.5 text-red-600" />
                <span className="hidden sm:inline">Unmute</span>
              </>
            ) : (
              <>
                <Volume2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Mute</span>
              </>
            )}
          </button>

          {/* Bilingual Switcher */}
          <button
            type="button"
            onClick={handleLanguageToggle}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold transition-colors cursor-pointer"
          >
            <Languages className="h-3.5 w-3.5 text-slate-500" />
            <span>{language === "hi-IN" ? "हिंदी" : "EN"}</span>
          </button>

          {/* Reset Conversation */}
          <button
            type="button"
            onClick={handleResetChat}
            className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            title="Clear Chat Conversation"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40">
        {messages.map((msg) => (
          <ChatMessageItem
            key={msg.id}
            message={msg}
            onReplayAudio={(text) => handleAudioPlayback(text, language)}
          >
            {msg.widgetData?.evaluationResult && (
              <div className="mt-3">
                {renderWidget ? (
                  renderWidget(msg)
                ) : (
                  <InlineSchemeWidget
                    initialResult={msg.widgetData.evaluationResult}
                    initialProfile={{
                      annualFamilyIncome: msg.widgetData.userProfile?.annualFamilyIncome || 240000,
                      estimatedCost: msg.widgetData.userProfile?.estimatedCost || 140000,
                      gender: msg.widgetData.userProfile?.gender || "FEMALE",
                      targetGroup: msg.widgetData.userProfile?.targetGroup,
                      educationLevel: msg.widgetData.userProfile?.educationLevel,
                    }}
                  />
                )}
              </div>
            )}
          </ChatMessageItem>
        ))}

        {isProcessing && (
          <div className="flex items-center space-x-2 text-xs text-slate-400 bg-white p-3 rounded-2xl w-fit border border-slate-200">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span>
              {language === "hi-IN"
                ? "योजना सेतु आपकी पात्रता की गणना कर रहा है..."
                : "Evaluating affirmative action rules..."}
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Reply Chips */}
      {prompts.length > 0 && !isProcessing && (
        <div className="px-4 py-2 bg-white/80 border-t border-slate-100">
          <QuickReplyChips prompts={prompts} onSelect={handlePromptSelect} />
        </div>
      )}

      {/* Input Action Bar */}
      <div className="p-3 bg-white border-t border-slate-200">
        <form onSubmit={handleFormSubmit} className="flex items-center space-x-2">
          {/* Voice Speech-to-Text Button */}
          <VoiceInputButton
            language={language}
            onTranscript={handleVoiceTranscript}
            disabled={isProcessing}
          />

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isProcessing}
            placeholder={
              language === "hi-IN"
                ? "यहाँ टाइप करें या माइक दबाकर बोलें..."
                : "Type your query or tap mic to speak..."
            }
            className="flex-1 text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isProcessing}
            className="p-2.5 rounded-xl bg-mosje-navy hover:bg-slate-800 text-amber-300 font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0 shadow-xs cursor-pointer"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
