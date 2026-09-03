"use client";

import { AssistantLanguage } from "@/lib/chat/types";

export interface AudioPlaybackState {
  isSpeaking: boolean;
  isPaused: boolean;
  isMuted: boolean;
}

let globalMuted = false;

export function checkSpeechSynthesisSupported(): boolean {
  if (typeof window === "undefined") return false;
  return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

export function isAudioMuted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const saved = localStorage.getItem("schemesetu_audio_muted");
    if (saved !== null) {
      globalMuted = saved === "true";
    }
  } catch {}
  return globalMuted;
}

export function setAudioMuted(muted: boolean): void {
  globalMuted = muted;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("schemesetu_audio_muted", String(muted));
    } catch {}
    if (muted) {
      cancelSpeech();
    }
    broadcastAudioState();
  }
}

export function broadcastAudioState(): void {
  if (typeof window === "undefined") return;
  const state: AudioPlaybackState = {
    isSpeaking: checkSpeechSynthesisSupported() ? window.speechSynthesis.speaking : false,
    isPaused: checkSpeechSynthesisSupported() ? window.speechSynthesis.paused : false,
    isMuted: isAudioMuted(),
  };
  window.dispatchEvent(new CustomEvent("schemesetu_audio_state", { detail: state }));
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
  if (isAudioMuted()) return;

  cancelSpeech();

  const cleanText = stripMarkdown(text);
  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = lang;
  utterance.rate = 0.95; // Vernacular speech clarity pace
  utterance.pitch = 1.0;

  const voice = findBestVoice(lang);
  if (voice) {
    utterance.voice = voice;
  }

  utterance.onstart = () => {
    broadcastAudioState();
  };

  utterance.onpause = () => {
    broadcastAudioState();
  };

  utterance.onresume = () => {
    broadcastAudioState();
  };

  utterance.onend = () => {
    broadcastAudioState();
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    broadcastAudioState();
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
  broadcastAudioState();
}

export function pauseSpeech(): void {
  if (!checkSpeechSynthesisSupported()) return;
  if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
    window.speechSynthesis.pause();
    broadcastAudioState();
  }
}

export function resumeSpeech(): void {
  if (!checkSpeechSynthesisSupported()) return;
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
    broadcastAudioState();
  }
}

export function cancelSpeech(): void {
  if (!checkSpeechSynthesisSupported()) return;
  window.speechSynthesis.cancel();
  broadcastAudioState();
}
