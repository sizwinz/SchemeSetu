"use client";

import { AssistantLanguage } from "@/lib/chat/types";

export function checkSpeechSynthesisSupported(): boolean {
  if (typeof window === "undefined") return false;
  return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

export function stripMarkdown(text: string): string {
  return text
    .replace(/[*_~`#]/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/•|\-/g, "")
    .replace(/\n+/g, ". ")
    .trim();
}

function findBestVoice(lang: AssistantLanguage): SpeechSynthesisVoice | null {
  if (!checkSpeechSynthesisSupported()) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const targetPrefix = lang === "hi-IN" ? "hi" : "en";
  const exactMatch = voices.find((v) => v.lang.toLowerCase() === lang.toLowerCase());
  if (exactMatch) return exactMatch;

  const prefixMatch = voices.find((v) => v.lang.toLowerCase().startsWith(targetPrefix));
  return prefixMatch || voices[0] || null;
}

export function speakText(
  text: string,
  lang: AssistantLanguage = "en-IN",
  onEnd?: () => void
): void {
  if (!checkSpeechSynthesisSupported()) return;

  cancelSpeech();

  const cleanText = stripMarkdown(text);
  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = lang;
  utterance.rate = 0.95; // slightly slower for maximum vernacular clarity
  utterance.pitch = 1.0;

  const voice = findBestVoice(lang);
  if (voice) {
    utterance.voice = voice;
  }

  if (onEnd) {
    utterance.onend = () => onEnd();
    utterance.onerror = () => onEnd();
  }

  window.speechSynthesis.speak(utterance);
}

export function cancelSpeech(): void {
  if (!checkSpeechSynthesisSupported()) return;
  window.speechSynthesis.cancel();
}
