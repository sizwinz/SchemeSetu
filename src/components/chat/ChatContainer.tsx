"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ChatMessage,
  QuickPrompt,
  AssistantLanguage,
  DialogStep,
} from "@/lib/chat/types";
import { ChatMessageItem } from "./ChatMessageItem";
import { QuickReplyChips } from "./QuickReplyChips";
import {
  Send,
  RotateCcw,
  Volume2,
  VolumeX,
  Languages,
  MessageSquare,
} from "lucide-react";

const INITIAL_PROMPTS: Record<AssistantLanguage, QuickPrompt[]> = {
  "en-IN": [
    { id: "p1", label: "Small Retail Shop", value: "I want to start a small grocery retail shop", iconName: "store" },
    { id: "p2", label: "Tailoring & Boutique", value: "I want to start a tailoring and boutique enterprise", iconName: "scissors" },
    { id: "p3", label: "Dairy & Husbandry", value: "I need finance for dairy farming and cattle", iconName: "milk" },
    { id: "p4", label: "Higher Education Loan", value: "I need an education loan for professional studies", iconName: "graduation" },
  ],
  "hi-IN": [
    { id: "p1", label: "किराना दुकान", value: "मैं एक छोटी किराना दुकान शुरू करना चाहता हूँ", iconName: "store" },
    { id: "p2", label: "सिलाई और बुटीक", value: "मुझे सिलाई और बुटीक केंद्र के लिए ऋण चाहिए", iconName: "scissors" },
    { id: "p3", label: "डेयरी फार्मिंग", value: "मुझे दुग्ध व्यवसाय और पशुपालन के लिए सहायता चाहिए", iconName: "milk" },
    { id: "p4", label: "उच्च शिक्षा ऋण", value: "मुझे उच्च शिक्षा और डिग्री के लिए शिक्षा ऋण चाहिए", iconName: "graduation" },
  ],
};

const INITIAL_MESSAGES: Record<AssistantLanguage, ChatMessage[]> = {
  "en-IN": [
    {
      id: "msg-welcome-en",
      sender: "ASSISTANT",
      text: "Namaste! I am your SchemeSetu Concessional Credit Advisor. I help Scheduled Caste entrepreneurs and students find up to 90% government concessional financing at 4.0% to 8.0% interest rates.\n\nWhat kind of business enterprise or educational program are you planning to start?",
      timestamp: "Just now",
      type: "TEXT",
    },
  ],
  "hi-IN": [
    {
      id: "msg-welcome-hi",
      sender: "ASSISTANT",
      text: "नमस्ते! मैं आपका स्कीमसेतु रियायती ऋण सलाहकार हूँ। मैं अनुसूचित जाति के उद्यमियों और विद्यार्थियों को 4.0% से 8.0% ब्याज दर पर 90% तक सरकारी ऋण प्राप्त करने में सहायता करता हूँ।\n\nआप किस प्रकार का व्यवसाय या शिक्षा कार्यक्रम शुरू करना चाहते हैं?",
      timestamp: "अभी",
      type: "TEXT",
    },
  ],
};

interface ChatContainerProps {
  onReplayAudio?: (text: string, lang: AssistantLanguage) => void;
  voiceInputSlot?: React.ReactNode;
  renderWidget?: (message: ChatMessage) => React.ReactNode;
  onSendMessage?: (
    text: string,
    currentLanguage: AssistantLanguage
  ) => Promise<{ assistantReply: string; newPrompts?: QuickPrompt[]; widgetData?: any }>;
}

export function ChatContainer({
  onReplayAudio,
  voiceInputSlot,
  renderWidget,
  onSendMessage,
}: ChatContainerProps) {
  const [language, setLanguage] = useState<AssistantLanguage>("en-IN");
  const [autoSpeak, setAutoSpeak] = useState<boolean>(true);
  const [inputText, setInputText] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>(() => INITIAL_MESSAGES["en-IN"]);
  const [prompts, setPrompts] = useState<QuickPrompt[]>(() => INITIAL_PROMPTS["en-IN"]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleLanguageToggle = () => {
    const nextLang: AssistantLanguage = language === "en-IN" ? "hi-IN" : "en-IN";
    setLanguage(nextLang);
    setMessages(INITIAL_MESSAGES[nextLang]);
    setPrompts(INITIAL_PROMPTS[nextLang]);
  };

  const handleResetChat = () => {
    const confirmed = window.confirm(
      language === "hi-IN"
        ? "क्या आप अपनी पिछली बातचीत मिटाकर नई शुरुआत करना चाहते हैं?"
        : "Clear Conversation: Are you sure you want to reset the chat and clear your inputs?"
    );
    if (confirmed) {
      setMessages(INITIAL_MESSAGES[language]);
      setPrompts(INITIAL_PROMPTS[language]);
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

    if (onSendMessage) {
      try {
        const response = await onSendMessage(trimmed, language);
        const assistantMsg: ChatMessage = {
          id: `asst-${Date.now()}`,
          sender: "ASSISTANT",
          text: response.assistantReply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: response.widgetData ? "SCHEME_WIDGET" : "TEXT",
          widgetData: response.widgetData,
        };
        setMessages((prev) => [...prev, assistantMsg]);
        if (response.newPrompts) {
          setPrompts(response.newPrompts);
        }
        if (autoSpeak && onReplayAudio) {
          onReplayAudio(response.assistantReply, language);
        }
      } catch {
        const errorMsg: ChatMessage = {
          id: `err-${Date.now()}`,
          sender: "SYSTEM",
          text:
            language === "hi-IN"
              ? "संदेश संसाधित करने में त्रुटि। कृपया पुनः प्रयास करें।"
              : "Unable to process message. Please enter valid criteria or choose a suggested prompt.",
          timestamp: "Now",
          type: "ERROR",
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsProcessing(false);
      }
    } else {
      setTimeout(() => {
        const sampleReply: ChatMessage = {
          id: `asst-${Date.now()}`,
          sender: "ASSISTANT",
          text:
            language === "hi-IN"
              ? `धन्यवाद। आपने उल्लेख किया: "${trimmed}"। इस परियोजना के लिए आपकी अनुमानित लागत क्या है?`
              : `Thank you. You mentioned: "${trimmed}". What is your estimated project or equipment cost?`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "TEXT",
        };
        setMessages((prev) => [...prev, sampleReply]);
        if (autoSpeak && onReplayAudio) {
          onReplayAudio(sampleReply.text, language);
        }
        setIsProcessing(false);
      }, 500);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMessage(inputText);
  };

  const handlePromptSelect = (prompt: QuickPrompt) => {
    submitMessage(prompt.value);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] sm:h-[680px] max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200/90 shadow-md overflow-hidden">
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
            onReplayAudio={(text) => onReplayAudio && onReplayAudio(text, language)}
            renderWidget={renderWidget}
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
          {voiceInputSlot}

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
