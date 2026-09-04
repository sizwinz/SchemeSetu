"use client";

import { useEffect, useRef } from "react";

interface CountUpProps {
  to: number;
  from?: number;
  direction?: "up" | "down";
  delay?: number;
  duration?: number;
  className?: string;
  startWhen?: boolean;
  separator?: string;
  prefix?: string;
  suffix?: string;
  onStart?: () => void;
  onEnd?: () => void;
}

export function CountUp({
  to,
  from = 0,
  direction = "up",
  delay = 0,
  duration = 1.2,
  className = "",
  startWhen = true,
  prefix = "",
  suffix = "",
  onStart,
  onEnd,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !startWhen) return;

    const startVal = direction === "down" ? to : from;
    const endVal = direction === "down" ? from : to;

    const format = (n: number) => {
      const rounded = Math.round(n);
      return `${prefix}${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(rounded)}${suffix}`;
    };

    el.textContent = format(startVal);

    let animationFrame: number;
    let delayTimer: NodeJS.Timeout;
    let hasStarted = false;

    const runAnimation = () => {
      if (hasStarted) return;
      hasStarted = true;
      onStart?.();

      const startTime = performance.now();
      const durationMs = duration * 1000;

      const tick = (now: number) => {
        const elapsed = Math.min(now - startTime, durationMs);
        const progress = elapsed / durationMs;
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = startVal + (endVal - startVal) * ease;
        if (el) el.textContent = format(current);

        if (progress < 1) {
          animationFrame = requestAnimationFrame(tick);
        } else {
          if (el) el.textContent = format(endVal);
          onEnd?.();
        }
      };

      animationFrame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          delayTimer = setTimeout(runAnimation, delay * 1000);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      clearTimeout(delayTimer);
      cancelAnimationFrame(animationFrame);
    };
  }, [to, from, direction, delay, duration, startWhen, prefix, suffix, onStart, onEnd]);

  return (
    <span className={className} ref={ref}>
      {prefix}{to.toLocaleString("en-IN")}{suffix}
    </span>
  );
}
