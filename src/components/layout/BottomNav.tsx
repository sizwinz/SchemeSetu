"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Calculator, MapPin, MessageSquareText } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: "Schemes", href: "/", icon: BookOpen },
  { label: "AI Assistant", href: "/assistant", icon: MessageSquareText },
  { label: "Calculator", href: "/calculator", icon: Calculator },
  { label: "Locator", href: "/locator", icon: MapPin },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 md:hidden pb-safe print:hidden shadow-xs">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                isActive
                  ? "text-slate-900 font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[11px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
