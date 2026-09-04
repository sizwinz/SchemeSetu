"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/languageContext";
import { Globe, ChevronDown, Check } from "lucide-react";

export function LanguageDropdown() {
  const { currentLanguage, changeLanguage, supportedLanguages, currentLanguageOption } =
    useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (code: string) => {
    changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Dropdown Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex items-center space-x-1.5 px-2 sm:px-3 py-1.5 min-h-[32px] rounded-full border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-amber-500/40 shrink-0"
        title="Change interface language / भाषा बदलें"
      >
        <Globe className="h-3.5 w-3.5 text-slate-500 shrink-0" />
        <span className="truncate max-w-[65px] xs:max-w-[90px] sm:max-w-none">
          {currentLanguageOption.nativeName}
          {currentLanguageOption.code !== "en" && (
            <span className="hidden sm:inline text-[10px] text-slate-400 font-normal ml-1">
              ({currentLanguageOption.name})
            </span>
          )}
        </span>
        <ChevronDown
          className={`h-3 w-3 text-slate-400 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu Popover */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute right-0 mt-1.5 w-52 sm:w-56 rounded-2xl bg-white border border-slate-200/90 shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Select Language / भाषा चुनें
          </div>

          <div className="max-h-64 overflow-y-auto py-1">
            {supportedLanguages.map((lang) => {
              const isSelected = lang.code === currentLanguage;
              return (
                <button
                  key={lang.code}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full text-left px-3 py-2.5 min-h-[40px] text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-amber-50/70 text-amber-950 font-bold"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold">{lang.nativeName}</span>
                    {lang.code !== "en" && (
                      <span className="text-[11px] text-slate-400 font-normal">
                        ({lang.name})
                      </span>
                    )}
                  </div>

                  {isSelected && (
                    <Check className="h-3.5 w-3.5 text-amber-600 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
