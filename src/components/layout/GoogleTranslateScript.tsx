"use client";

import React, { useEffect } from "react";

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages?: string;
            autoDisplay?: boolean;
            layout?: unknown;
          },
          elementId: string
        ) => void;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

export function GoogleTranslateScript() {
  useEffect(() => {
    // Check if saved language exists and set cookie before script loads
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("schemesetu_language");
      if (saved && saved !== "en") {
        document.cookie = `googtrans=/en/${saved}; path=/;`;
        document.cookie = `googtrans=/auto/${saved}; path=/;`;
      }
    }

    // Define initialization callback
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,hi,mr,ta,te,bn,gu,kn,pa",
            autoDisplay: false,
          },
          "google_translate_element"
        );
      }
    };

    // Prevent duplicate script injection
    const existingScript = document.getElementById("google-translate-script");
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return <div id="google_translate_element" className="hidden" aria-hidden="true" />;
}
