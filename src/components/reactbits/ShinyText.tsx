"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  className?: string;
  color?: string;
  shineColor?: string;
}

export function ShinyText({
  text,
  disabled = false,
  className = "",
  color = "#334155",
  shineColor = "#d97706",
}: ShinyTextProps) {
  if (disabled) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span
      className={cn(
        "inline-block font-semibold bg-clip-text text-transparent animate-pulse transition-all",
        className
      )}
      style={{
        backgroundImage: `linear-gradient(120deg, ${color} 0%, ${shineColor} 50%, ${color} 100%)`,
        backgroundSize: "200% auto",
      }}
    >
      {text}
    </span>
  );
}
