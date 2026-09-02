"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AssistantLanguage } from "@/lib/chat/types";

export function checkSpeechRecognitionSupported(): boolean {
  if (typeof window === "undefined") return false;
  return (
    "SpeechRecognition" in window ||
    "webkitSpeechRecognition" in window ||
    "mozSpeechRecognition" in window
  );
}

interface UseSpeechRecognitionOptions {
  language: AssistantLanguage;
  onResult?: (transcript: string) => void;
  onError?: (error: string) => void;
}

export function useSpeechRecognition({
  language,
  onResult,
  onError,
}: UseSpeechRecognitionOptions) {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsSupported(checkSpeechRecognitionSupported());
  }, []);

  const resetSilenceTimeout = useCallback(() => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
    silenceTimeoutRef.current = setTimeout(() => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore already stopped recognition
        }
      }
    }, 3500);
  }, []);

  const stopListening = useCallback(() => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore already stopped
      }
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(() => {
    if (!checkSpeechRecognitionSupported()) {
      const msg = "Web Speech API is not supported on this browser.";
      setError(msg);
      onError?.(msg);
      return;
    }

    try {
      const SpeechRecognitionClass =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition ||
        (window as any).mozSpeechRecognition;

      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
        setTranscript("");
        resetSilenceTimeout();
      };

      recognition.onresult = (event: any) => {
        resetSilenceTimeout();
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);

        if (event.results[0]?.isFinal) {
          onResult?.(currentTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        const errorType = event.error || "speech_recognition_error";
        let message = "Voice input error.";
        if (errorType === "not-allowed") {
          message = "Microphone access was denied. Please allow microphone permissions in your browser.";
        } else if (errorType === "no-speech") {
          message = "No speech was detected. Please try speaking again.";
        }
        setError(message);
        onError?.(message);
        stopListening();
      };

      recognition.onend = () => {
        setIsListening(false);
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
          silenceTimeoutRef.current = null;
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      const msg = err?.message || "Failed to start speech recognition.";
      setError(msg);
      onError?.(msg);
      setIsListening(false);
    }
  }, [language, onError, onResult, resetSilenceTimeout, stopListening]);

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return {
    isListening,
    isSupported,
    transcript,
    error,
    startListening,
    stopListening,
  };
}
