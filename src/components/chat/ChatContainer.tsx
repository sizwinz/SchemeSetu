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
}

export function ChatContainer({
  onReplayAudio,
  renderWidget,
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
      setInputText("");
    }
  };

  const submitMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
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
      // Advance the multi-turn conversational dialogue state machine
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMessage(inputText);
  };

  const handlePromptSelect = (prompt: QuickPrompt) => {
    submitMessage(prompt.value);
  };

  const handleVoiceTranscript = (transcript: string) => {
    if (transcript && transcript.trim()) {
      setInputText(transcript);
      submitMessage(transcript);
    }
  };

  const defaultRenderWidget = (msg: ChatMessage) => {
    if (
      msg.type === "SCHEME_WIDGET" &&
      msg.widgetData?.evaluationResult &&
      msg.widgetData?.userProfile
    ) {
      return (
        <InlineSchemeWidget
          initialResult={msg.widgetData.evaluationResult}
          initialProfile={msg.widgetData.userProfile as any}
        />
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] sm:h-[700px] max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200/90 shadow-md overflow-hidden">
      {/* Top Controls Bar */}
      <div className="bg-mosje-navy text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 bg-amber-500/20 text-amber-300 rounded-lg border border-amber-500/30">
            <MessageSquare className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold leading-tight">SchemeSetu Assistant</h2>
            <p className="text-[10px] text-slate-300">MoSJE Bilingual Voice & Chat Advisor</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Auto-Speak Audio Toggle */}
          <button
            type="button"
            onClick={() => setAutoSpeak(!autoSpeak)}
            className={`p-1.5 rounded-md border text-xs flex items-center space-x-1 transition-colors ${
              autoSpeak
                ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
            }`}
            title={autoSpeak ? "Voice output enabled" : "Voice output muted"}
          >
            {autoSpeak ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            <span className="text-[10px] hidden sm:inline">{autoSpeak ? "Voice On" : "Muted"}</span>
          </button>

          {/* Explicit Language Toggle */}
          <button
            type="button"
            onClick={handleLanguageToggle}
            className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center space-x-1 transition-colors"
            title="Switch Language (Hindi / English)"
          >
            <Languages className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-[10px]">{language === "en-IN" ? "EN / हि" : "हि / EN"}</span>
          </button>

          {/* Reset Conversation */}
          <button
            type="button"
            onClick={handleResetChat}
            className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Reset conversation"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto px-4 py-3 bg-mosje-slate">
        {messages.map((msg) => (
          <ChatMessageItem
            key={msg.id}
            message={msg}
            onReplayAudio={(text) => handleAudioPlayback(text, language)}
            renderWidget={renderWidget || defaultRenderWidget}
          />
        ))}

        {isProcessing && (
          <div className="flex items-center space-x-2 text-xs text-slate-500 my-2 px-3">
            <div className="h-2 w-2 bg-amber-500 rounded-full animate-ping" />
            <span>
              {language === "hi-IN"
                ? "सलाहकार सोच रहा है..."
                : "Advisor is evaluating concessional criteria..."}
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Recommendation Chips */}
      <div className="px-4 pt-1 bg-white border-t border-slate-100">
        <QuickReplyChips
          prompts={prompts}
          onSelect={handlePromptSelect}
          disabled={isProcessing}
        />
      </div>

      {/* Input Control Bar */}
      <div className="p-3 bg-white border-t border-slate-200">
        <form onSubmit={handleFormSubmit} className="flex items-center space-x-2">
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
                ? "अपना प्रश्न या व्यवसाय यहाँ लिखें..."
                : "Type enterprise idea or criteria..."
            }
            className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-slate-50/50"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isProcessing}
            className="bg-mosje-saffron hover:bg-amber-600 disabled:opacity-50 text-white p-2.5 rounded-xl shadow-xs transition-colors shrink-0"
            title="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
