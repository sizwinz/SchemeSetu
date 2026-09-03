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
import { Button } from "@/components/ui/button";

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

  useEffect(() => {
    const handleAudioEvent = (e: Event) => {
      const customEvent = e as CustomEvent<AudioPlaybackState>;
      if (customEvent.detail) {
        setAudioState(customEvent.detail);
        setAutoSpeak(!customEvent.detail.isMuted);
      }
    };

    window.addEventListener("schemesetu_audio_state", handleAudioEvent);
    return () => {
      window.removeEventListener("schemesetu_audio_state", handleAudioEvent);
    };
  }, []);

  const [dialogState, setDialogState] = useState<DialogState>({
    currentStep: "GREETING",
    collectedProfile: {},
    language: "en-IN",
    autoSpeak: true,
  });

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef<boolean>(true);

  // Auto-scroll only inside message container after user interactions, never scrolling window
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = 0;
      }
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      return;
    }

    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isProcessing]);

  // Initial Query Handler
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      submitMessage(initialQuery.trim());
    } else if (initialScheme) {
      submitMessage(`Tell me about ${initialScheme} scheme`);
    }
  }, [initialQuery, initialScheme]);

  const handleAudioPlayback = (text: string, lang: AssistantLanguage) => {
    if (onReplayAudio) {
      onReplayAudio(text, lang);
    } else {
      speakText(text, lang);
    }
  };

  const handleLanguageToggle = () => {
    const nextLang: AssistantLanguage = language === "en-IN" ? "hi-IN" : "en-IN";
    setLanguage(nextLang);
    setDialogState((prev) => ({ ...prev, language: nextLang }));

    if (messages.length <= 1) {
      setMessages(INITIAL_MESSAGES[nextLang]);
      setPrompts(DIALOG_PROMPTS[nextLang].GREETING.quickPrompts);
      if (autoSpeak) {
        handleAudioPlayback(DIALOG_PROMPTS[nextLang].GREETING.promptText, nextLang);
      }
    }
  };

  const handleResetChat = () => {
    cancelSpeech();
    setMessages(INITIAL_MESSAGES[language]);
    setPrompts(DIALOG_PROMPTS[language].GREETING.quickPrompts);
    setDialogState({
      currentStep: "GREETING",
      collectedProfile: {},
      language: language,
      autoSpeak: autoSpeak,
    });
  };

  const submitMessage = async (text: string) => {
    if (!text.trim() || isProcessing) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: "USER",
      text: text.trim(),
      timestamp: "Just now",
      type: "TEXT",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsProcessing(true);

    try {
      const response = advanceDialog(
        { ...dialogState, language },
        text.trim()
      );

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-bot`,
        sender: "ASSISTANT",
        text: response.assistantReply,
        timestamp: "Just now",
        type: response.widgetData ? "SCHEME_WIDGET" : "TEXT",
        widgetData: response.widgetData,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setPrompts(response.newPrompts);
      setDialogState(response.nextState);

      if (autoSpeak && response.assistantReply) {
        handleAudioPlayback(response.assistantReply, language);
      }
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now()}-err`,
        sender: "ASSISTANT",
        text:
          language === "hi-IN"
            ? "क्षमा करें, एक तकनीकी त्रुटि हुई। कृपया पुनः प्रयास करें।"
            : "Sorry, I encountered a technical error. Please try again.",
        timestamp: "Just now",
        type: "TEXT",
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
    submitMessage(transcript);
  };

  return (
    <div className="flex flex-col h-[75vh] min-h-[500px] max-h-[850px] bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Chat Sub-Header Controls */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-3 bg-slate-50/90 border-b border-slate-200 text-xs gap-2">
        <div className="flex items-center space-x-2 text-slate-700 shrink-0">
          <MessageSquare className="h-4 w-4 text-amber-600" />
          <span className="font-bold text-slate-900">
            {language === "hi-IN" ? "योजना सेतु सहायक" : "SchemeSetu Advisor"}
          </span>
        </div>

        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* Bilingual Switcher */}
          <button
            type="button"
            onClick={handleLanguageToggle}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold transition-colors cursor-pointer shadow-2xs"
          >
            <Languages className="h-3.5 w-3.5 text-slate-500" />
            <span>{language === "hi-IN" ? "हिंदी" : "EN"}</span>
          </button>

          {/* Reset Conversation */}
          <button
            type="button"
            onClick={handleResetChat}
            className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer shadow-2xs"
            title="Clear Chat Conversation"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Message Stream */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40"
      >
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
          <div className="flex items-center space-x-2 text-xs text-slate-500 bg-white p-3 rounded-2xl w-fit border border-slate-200">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span>
              {language === "hi-IN"
                ? "योजना सेतु आपकी पात्रता की गणना कर रहा है..."
                : "Evaluating affirmative action rules..."}
            </span>
          </div>
        )}
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

          <Button
            type="submit"
            disabled={!inputText.trim() || isProcessing}
            className="rounded-xl px-4 font-bold"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
