"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type FadeInProps = React.HTMLAttributes<HTMLDivElement> & {
  delay?: number;
  once?: boolean;
  threshold?: number;
};

export function FadeIn({
  children,
  className,
  delay = 0,
  once = true,
  threshold = 0.2,
  style,
  ...props
}: FadeInProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      { threshold, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [once, threshold]);

  return (
    <div
      ref={ref}
      className={cn(
        "will-change-transform",
        "transition-all duration-700 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        className,
      )}
      style={{ transitionDelay: `${delay}ms`, ...style }}
      {...props}
    >
      {children}
    </div>
  );
}
