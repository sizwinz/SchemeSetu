"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { setPreferredSpeechLocale } from "@/lib/audio/speechSynthesis";

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  speechLocale: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English", speechLocale: "en-IN" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", speechLocale: "hi-IN" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", speechLocale: "mr-IN" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", speechLocale: "ta-IN" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", speechLocale: "te-IN" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", speechLocale: "bn-IN" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", speechLocale: "gu-IN" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", speechLocale: "kn-IN" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", speechLocale: "pa-IN" },
];

interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (langCode: string) => void;
  supportedLanguages: LanguageOption[];
  currentLanguageOption: LanguageOption;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "schemesetu_language";

function triggerGoogleTranslate(langCode: string) {
  if (typeof window === "undefined") return;

  if (langCode === "en") {
    // Clear Google Translate cookies
    const hostname = window.location.hostname;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${hostname};`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname};`;

    const selectEl = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
    if (selectEl) {
      selectEl.value = "en";
      selectEl.dispatchEvent(new Event("change"));
    } else {
      window.location.reload();
    }
    return;
  }

  // Set Google Translate cookie for chosen language
  const hostname = window.location.hostname;
  document.cookie = `googtrans=/en/${langCode}; path=/;`;
  document.cookie = `googtrans=/en/${langCode}; path=/; domain=.${hostname};`;
  document.cookie = `googtrans=/auto/${langCode}; path=/;`;

  const selectEl = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
  if (selectEl) {
    selectEl.value = langCode;
    selectEl.dispatchEvent(new Event("change"));
  } else {
    // If combo isn't yet in DOM, reload so the cookie translates on mount
    window.location.reload();
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<string>("en");

  // Read saved language on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
        setCurrentLanguage(saved);
        const opt = SUPPORTED_LANGUAGES.find((l) => l.code === saved);
        if (opt) {
          setPreferredSpeechLocale(opt.speechLocale);
        }
      }
    }
  }, []);

  const changeLanguage = (langCode: string) => {
    const opt = SUPPORTED_LANGUAGES.find((l) => l.code === langCode);
    if (!opt) return;

    setCurrentLanguage(langCode);

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, langCode);
      document.documentElement.lang = langCode;
      setPreferredSpeechLocale(opt.speechLocale);
      triggerGoogleTranslate(langCode);
    }
  };

  const currentLanguageOption =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        changeLanguage,
        supportedLanguages: SUPPORTED_LANGUAGES,
        currentLanguageOption,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
