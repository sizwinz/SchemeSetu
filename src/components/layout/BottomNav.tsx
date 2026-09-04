"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Calculator, MapPin, MessageSquareText, FileText } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: "Schemes", href: "/", icon: BookOpen },
  { label: "AI Chat", href: "/assistant", icon: MessageSquareText },
  { label: "Calculator", href: "/calculator", icon: Calculator },
  { label: "Locator", href: "/locator", icon: MapPin },
  { label: "Dossier", href: "/dossier", icon: FileText },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 md:hidden print:hidden shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
      <div className="grid grid-cols-5 h-[4.25rem] pb-safe-bottom">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`relative flex flex-col items-center justify-center gap-0.5 transition-colors active:scale-95 ${
                isActive
                  ? "text-amber-700"
                  : "text-slate-400 hover:text-slate-700"
              }`}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-b-full bg-amber-600" />
              )}
              <Icon className={`h-[1.35rem] w-[1.35rem] ${isActive ? "stroke-[2.5]" : ""}`} />
              <span className={`text-[10px] leading-tight ${isActive ? "font-bold" : "font-medium"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
