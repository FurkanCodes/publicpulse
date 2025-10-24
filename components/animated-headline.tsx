"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

interface AnimatedHeadlineProps {
  phrases: string[];
  interval?: number;
  className?: string;
  gradientClassName?: string;
}

export function AnimatedHeadline({
  phrases,
  interval = 2600,
  className,
  gradientClassName,
}: AnimatedHeadlineProps) {
  const [index, setIndex] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(true);
  const [reduceMotion, setReduceMotion] = React.useState(false);

  React.useEffect(() => {
    if (phrases.length <= 1 || typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateReduceMotion = (event: MediaQueryListEvent) => {
      setReduceMotion(event.matches);
    };

    setReduceMotion(mediaQuery.matches);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateReduceMotion);
    } else if (typeof mediaQuery.addListener === "function") {
      mediaQuery.addListener(updateReduceMotion);
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", updateReduceMotion);
      } else if (typeof mediaQuery.removeListener === "function") {
        mediaQuery.removeListener(updateReduceMotion);
      }
    };
  }, [phrases.length]);

  React.useEffect(() => {
    if (phrases.length <= 1 || reduceMotion) {
      return;
    }

    let changeTimeout: ReturnType<typeof setTimeout>;
    let fadeTimeout: ReturnType<typeof setTimeout>;

    const cycle = () => {
      changeTimeout = setTimeout(() => {
        setIsVisible(false);
        fadeTimeout = setTimeout(() => {
          setIndex((prev) => (prev + 1) % phrases.length);
          setIsVisible(true);
          cycle();
        }, 220);
      }, interval);
    };

    cycle();

    return () => {
      clearTimeout(changeTimeout);
      clearTimeout(fadeTimeout);
    };
  }, [phrases, interval, reduceMotion]);

  const currentPhrase = phrases[index] ?? "";

  return (
    <span
      className={cn(
        "relative inline-flex min-w-[8ch] items-baseline justify-start",
        className,
      )}
      aria-live="polite"
    >
      <span
        aria-hidden={!reduceMotion}
        className={cn(
          "rounded-sm bg-gradient-to-r from-primary via-[var(--accent-blue)] to-primary/80 bg-clip-text text-transparent transition-all duration-500 ease-out",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1",
          gradientClassName,
        )}
      >
        {currentPhrase}
      </span>
      {reduceMotion ? (
        <span className="sr-only">{currentPhrase}</span>
      ) : null}
    </span>
  );
}
