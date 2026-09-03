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
import { speakText } from "@/lib/audio/speechSynthesis";
import { advanceDialog } from "@/lib/chat/dialogEngine";
import { DIALOG_PROMPTS } from "@/lib/chat/prompts";
import {
  Send,
  RotateCcw,
  Volume2,
  VolumeX,
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
  const [autoSpeak, setAutoSpeak] = useState<boolean>(true);
  const [inputText, setInputText] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>(() => INITIAL_MESSAGES["en-IN"]);
  const [prompts, setPrompts] = useState<QuickPrompt[]>(() => DIALOG_PROMPTS["en-IN"].GREETING.quickPrompts);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

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

    window.addEventListener("schemesetu_language_changed", handleLangChange);
    return () => {
      window.removeEventListener("schemesetu_language_changed", handleLangChange);
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

      if (autoSpeak) {
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
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50/90 border-b border-slate-200 text-xs">
        <div className="flex items-center space-x-2 text-slate-700">
          <MessageSquare className="h-4 w-4 text-mosje-saffron" />
          <span className="font-bold">
            {language === "hi-IN" ? "योजना सेतु सहायक (सक्रिय)" : "SchemeSetu Advisor (Active)"}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Audio Output Toggle */}
          <button
            type="button"
            onClick={() => setAutoSpeak(!autoSpeak)}
            className={`p-1.5 rounded-lg border transition-colors ${
              autoSpeak
                ? "bg-amber-100 text-amber-900 border-amber-300"
                : "bg-white text-slate-400 border-slate-200 hover:text-slate-600"
            }`}
            title={autoSpeak ? "Voice narration active (Click to mute)" : "Voice narration muted (Click to unmute)"}
          >
            {autoSpeak ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>

          {/* Bilingual Switcher */}
          <button
            type="button"
            onClick={handleLanguageToggle}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold transition-colors"
          >
            <Languages className="h-3.5 w-3.5 text-slate-500" />
            <span>{language === "hi-IN" ? "हिंदी" : "EN"}</span>
          </button>

          {/* Reset Conversation */}
          <button
            type="button"
            onClick={handleResetChat}
            className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
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
