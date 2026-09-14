import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  stripMarkdown,
  setPreferredSpeechLocale,
  getPreferredSpeechLocale,
  checkSpeechSynthesisSupported,
  findBestVoice,
} from "@/lib/audio/speechSynthesis";

describe("Audio Speech Synthesis Module", () => {
  describe("stripMarkdown", () => {
    it("removes markdown formatting symbols (*, _, ~, `, #)", () => {
      const raw = "# Title\n**Bold text** and *italic text* with `code block` and ~strikethrough~.";
      const cleaned = stripMarkdown(raw);
      expect(cleaned).not.toContain("#");
      expect(cleaned).not.toContain("*");
      expect(cleaned).not.toContain("`");
      expect(cleaned).not.toContain("~");
      expect(cleaned).toContain("Bold text and italic text with code block and strikethrough");
    });

    it("converts markdown links [text](url) to plain text", () => {
      const raw = "Visit [MoSJE Official Portal](https://socialjustice.gov.in) for details.";
      const cleaned = stripMarkdown(raw);
      expect(cleaned).toBe("Visit MoSJE Official Portal for details.");
    });

    it("replaces bullet points and hyphens with spaces", () => {
      const raw = "• Point 1\n• Point 2\n- Point 3\n– Point 4";
      const cleaned = stripMarkdown(raw);
      expect(cleaned).not.toContain("•");
      expect(cleaned).not.toContain("–");
      expect(cleaned).toContain("Point 1");
      expect(cleaned).toContain("Point 2");
    });

    it("normalizes consecutive newlines into sentence periods", () => {
      const raw = "First paragraph.\n\nSecond paragraph.\n\nThird paragraph.";
      const cleaned = stripMarkdown(raw);
      expect(cleaned).toBe("First paragraph.. Second paragraph.. Third paragraph.");
    });

    it("trims excess whitespace", () => {
      const raw = "   Hello from SchemeSetu       ";
      const cleaned = stripMarkdown(raw);
      expect(cleaned).toBe("Hello from SchemeSetu");
    });
  });

  describe("Locale Management", () => {
    it("gets and sets global preferred speech locale", () => {
      setPreferredSpeechLocale("hi-IN");
      expect(getPreferredSpeechLocale()).toBe("hi-IN");

      setPreferredSpeechLocale("mr-IN");
      expect(getPreferredSpeechLocale()).toBe("mr-IN");

      setPreferredSpeechLocale("en-IN");
      expect(getPreferredSpeechLocale()).toBe("en-IN");
    });
  });

  describe("Voice Selection Cascade & Fallbacks", () => {
    const mockVoices = [
      {
        name: "Google हिन्दी",
        lang: "hi-IN",
        default: false,
        localService: true,
        voiceURI: "Google हिन्दी",
      },
      {
        name: "Microsoft Heera - English (India)",
        lang: "en-IN",
        default: true,
        localService: true,
        voiceURI: "Microsoft Heera",
      },
      {
        name: "Microsoft Aarohi - Marathi (India)",
        lang: "mr-IN",
        default: false,
        localService: true,
        voiceURI: "Microsoft Aarohi",
      },
      {
        name: "Google US English",
        lang: "en-US",
        default: false,
        localService: false,
        voiceURI: "Google US English",
      },
    ] as SpeechSynthesisVoice[];

    beforeEach(() => {
      vi.stubGlobal("window", {
        speechSynthesis: {
          getVoices: () => mockVoices,
          speaking: false,
          paused: false,
          speak: vi.fn(),
          cancel: vi.fn(),
          pause: vi.fn(),
          resume: vi.fn(),
        },
        SpeechSynthesisUtterance: class {
          text = "";
          lang = "";
          rate = 1;
          pitch = 1;
          voice = null;
          constructor(text: string) {
            this.text = text;
          }
        },
        dispatchEvent: vi.fn(),
        CustomEvent: class {
          type: string;
          detail: unknown;
          constructor(type: string, opts?: { detail: unknown }) {
            this.type = type;
            this.detail = opts?.detail;
          }
        },
      });
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it("verifies speech synthesis supported when window objects exist", () => {
      expect(checkSpeechSynthesisSupported()).toBe(true);
    });

    it("matches voice by exact language tag", () => {
      const voice = findBestVoice("hi-IN");
      expect(voice).toBeDefined();
      expect(voice?.lang).toBe("hi-IN");
      expect(voice?.name).toBe("Google हिन्दी");
    });

    it("matches voice by language prefix", () => {
      const voice = findBestVoice("mr");
      expect(voice).toBeDefined();
      expect(voice?.lang).toBe("mr-IN");
      expect(voice?.name).toBe("Microsoft Aarohi - Marathi (India)");
    });

    it("falls back to Indian voice for regional language without exact match", () => {
      const voice = findBestVoice("gu-IN");
      expect(voice).toBeDefined();
      expect(voice?.lang.toLowerCase().includes("in") || voice?.lang.startsWith("hi")).toBe(true);
    });

    it("falls back to default voice when English dialect has no exact match", () => {
      const voice = findBestVoice("en-AU");
      expect(voice).toBeDefined();
      expect(voice?.default).toBe(true);
      expect(voice?.name).toBe("Microsoft Heera - English (India)");
    });
  });
});
