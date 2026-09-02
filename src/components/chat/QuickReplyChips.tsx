import React from "react";
import { QuickPrompt } from "@/lib/chat/types";
import {
  Sparkles,
  Store,
  Scissors,
  Milk,
  Truck,
  GraduationCap,
  Briefcase,
  IndianRupee,
} from "lucide-react";

interface QuickReplyChipsProps {
  prompts: QuickPrompt[];
  onSelect: (prompt: QuickPrompt) => void;
  disabled?: boolean;
}

const iconMap: Record<string, React.ElementType> = {
  store: Store,
  scissors: Scissors,
  milk: Milk,
  truck: Truck,
  graduation: GraduationCap,
  briefcase: Briefcase,
  rupee: IndianRupee,
};

export function QuickReplyChips({
  prompts,
  onSelect,
  disabled = false,
}: QuickReplyChipsProps) {
  if (!prompts || prompts.length === 0) return null;

  return (
    <div className="py-2 overflow-x-auto no-scrollbar">
      <div className="flex items-center space-x-2 pb-1">
        <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-amber-600" />
          Suggested:
        </span>
        {prompts.map((prompt) => {
          const Icon = prompt.iconName ? iconMap[prompt.iconName] : null;
          return (
            <button
              key={prompt.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(prompt)}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium bg-white text-slate-800 border border-slate-300 hover:border-amber-500 hover:bg-amber-50/50 active:scale-95 transition-all shadow-2xs shrink-0 disabled:opacity-50 disabled:pointer-events-none"
            >
              {Icon && <Icon className="h-3.5 w-3.5 text-amber-600" />}
              <span>{prompt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
