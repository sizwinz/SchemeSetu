"use client";

export interface AudioPlaybackState {
  isSpeaking: boolean;
  isPaused: boolean;
  isMuted: boolean;
}

let globalMuted = false;
let globalPreferredLocale = "en-IN";

// Cache voices once loaded
let cachedVoices: SpeechSynthesisVoice[] = [];

function loadVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return [];
  const voices = window.speechSynthesis.getVoices();
  if (voices && voices.length > 0) {
    cachedVoices = voices;
  }
  return cachedVoices;
}

// Attach listener as soon as client mounts
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    loadVoices();
  };
}

export function setPreferredSpeechLocale(locale: string): void {
  globalPreferredLocale = locale;
}

export function getPreferredSpeechLocale(): string {
  return globalPreferredLocale;
}

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
    .replace(/[•\-\–]/g, " ")
    .replace(/\n+/g, ". ")
    .replace(/\s+/g, " ")
    .trim();
}

const LANGUAGE_NAME_KEYWORDS: Record<string, string[]> = {
  hi: ["hindi", "हिन्दी", "kalpana", "hemant", "madhur", "swara"],
  mr: ["marathi", "मराठी", "aarohi", "manohar"],
  gu: ["gujarati", "ગુજરાતી", "dhwani", "niranjan"],
  ta: ["tamil", "தமிழ்", "valluvar", "pallavi"],
  te: ["telugu", "తెలుగు", "mohan", "chitra"],
  bn: ["bengali", "bangla", "বাংলা", "bashkar", "tapan"],
  kn: ["kannada", "ಕನ್ನಡ", "gagan", "sapna"],
  pa: ["punjabi", "ਪੰਜਾਬੀ", "raavi", "gurmukhi"],
  en: ["india", "indian", "heera", "neerja", "en-in", "en_in"],
};

export function findBestVoice(lang: string): SpeechSynthesisVoice | null {
  if (!checkSpeechSynthesisSupported()) return null;
  const voices = loadVoices();
  if (!voices || voices.length === 0) return null;

  const targetLang = (lang || globalPreferredLocale || "en-IN").toLowerCase();
  const normalizedTarget = targetLang.replace("_", "-");
  const prefix = normalizedTarget.split("-")[0];

  // 1. Exact match on language tag (e.g. "hi-IN" or "gu-IN")
  const exactMatch = voices.find(
    (v) => v.lang.toLowerCase().replace("_", "-") === normalizedTarget
  );
  if (exactMatch) return exactMatch;

  // 2. Prefix match on primary language (e.g. starts with "hi" or "mr" or "gu")
  const prefixMatch = voices.find((v) =>
    v.lang.toLowerCase().replace("_", "-").startsWith(prefix)
  );
  if (prefixMatch) return prefixMatch;

  // 3. Keyword match on voice name (e.g. voice named "Google हिन्दी" or "Microsoft Aarohi")
  const keywords = LANGUAGE_NAME_KEYWORDS[prefix] || [];
  for (const kw of keywords) {
    const nameMatch = voices.find(
      (v) =>
        v.name.toLowerCase().includes(kw) || v.lang.toLowerCase().includes(kw)
    );
    if (nameMatch) return nameMatch;
  }

  // 4. Indic Fallback: If regional voice is not installed on OS, look for an Indian voice (Hindi or Indian English)
  if (prefix !== "en") {
    const indianVoice = voices.find(
      (v) =>
        v.lang.toLowerCase().includes("in") ||
        v.name.toLowerCase().includes("india") ||
        v.lang.toLowerCase().startsWith("hi")
    );
    if (indianVoice) return indianVoice;
  }

  // 5. Default voice or first available voice
  return voices.find((v) => v.default) || voices[0] || null;
}

export function speakText(
  text: string,
  lang?: string,
  onEnd?: () => void
): void {
  if (!checkSpeechSynthesisSupported()) return;
  if (isAudioMuted()) return;

  cancelSpeech();

  const cleanText = stripMarkdown(text);
  if (!cleanText) return;

  const targetLang = lang || globalPreferredLocale || "en-IN";
  const utterance = new SpeechSynthesisUtterance(cleanText);

  // Set the target speech locale for browser cloud synthesis engine
  utterance.lang = targetLang;
  utterance.rate = 0.92; // Measured pace for statutory and vernacular clarity
  utterance.pitch = 1.0;

  const voice = findBestVoice(targetLang);
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
