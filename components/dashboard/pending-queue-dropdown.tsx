"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ExternalLink, Sparkles, ThumbsUp, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SuggestionPreview = {
  id: string;
  title: string;
  description: string | null;
  createdAt: string | Date;
};

type PendingQueueDropdownProps = {
  pendingCount: number;
  approvedCount: number;
  dismissedCount: number;
  suggestions: SuggestionPreview[];
};

export function PendingQueueDropdown({
  pendingCount,
  approvedCount,
  dismissedCount,
  suggestions,
}: PendingQueueDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const numberFormatter = new Intl.NumberFormat();
  const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const stats = [
    {
      label: "Pending",
      value: pendingCount,
      icon: Sparkles,
      tone: "text-primary",
    },
    {
      label: "Approved",
      value: approvedCount,
      icon: ThumbsUp,
      tone: "text-emerald-500 dark:text-emerald-400",
    },
    {
      label: "Dismissed",
      value: dismissedCount,
      icon: XCircle,
      tone: "text-muted-foreground",
    },
  ];

  return (
    <div ref={containerRef} className="space-y-3">
      <Button
        type="button"
        variant="outline"
        className={cn(
          "w-full justify-center gap-2 transition-all duration-200",
          open && "border-primary/60 bg-primary/10 text-primary",
        )}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((previous) => !previous)}
      >
        <span>Open full queue</span>
        <motion.span
          initial={false}
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="flex items-center"
        >
          <ChevronDown className="h-4 w-4" aria-hidden />
        </motion.span>
      </Button>
      <AnimatePresence>
        {open ? (
          <motion.div
            key="pending-dropdown"
            layout
            initial={{ opacity: 0, y: -8, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(12px)" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="rounded-3xl border border-[color:var(--outline-soft)] bg-[color:var(--surface-floating)]/90 p-5 shadow-[0_16px_32px_rgba(17,24,39,0.1)] backdrop-blur-xl"
          >
            <motion.div
              initial={{ opacity: 0, y: -6, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -6, filter: "blur(10px)" }}
              transition={{ duration: 0.32, ease: "easeOut" }}
              className="flex flex-wrap items-center justify-between gap-2"
            >
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Queue snapshot
              </p>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {numberFormatter.format(pendingCount)} awaiting review
              </span>
            </motion.div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: -6, filter: "blur(12px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.36, ease: "easeOut", delay: 0.08 * index }}
                    className="rounded-2xl border border-dashed border-[color:var(--outline-soft)] bg-background/70 px-4 py-3 shadow-[0_4px_0_var(--shadow-color)]"
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      <Icon className={cn("h-3.5 w-3.5", stat.tone)} aria-hidden />
                      <span>{stat.label}</span>
                    </div>
                    <p className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                      {numberFormatter.format(stat.value)}
                    </p>
                  </motion.div>
                );
              })}
            </div>
            {suggestions.length > 0 ? (
              <div className="mt-4 space-y-3">
                <motion.p
                  initial={{ opacity: 0, y: -4, filter: "blur(12px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.32, ease: "easeOut", delay: 0.18 }}
                  className="text-xs uppercase tracking-[0.24em] text-muted-foreground"
                >
                  Recent submissions
                </motion.p>
                <ul className="space-y-3">
                  {suggestions.map((suggestion, index) => (
                    <motion.li
                      key={suggestion.id}
                      initial={{ opacity: 0, y: 6, filter: "blur(12px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ duration: 0.36, ease: "easeOut", delay: 0.1 * index + 0.22 }}
                      className="rounded-2xl border border-[color:var(--outline-soft)] bg-card/80 px-4 py-3 shadow-[0_4px_0_var(--shadow-color)]"
                    >
                      <p className="text-sm font-semibold text-foreground">{suggestion.title}</p>
                      {suggestion.description ? (
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                          {suggestion.description}
                        </p>
                      ) : null}
                      <p className="mt-3 text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
                        Submitted {dateFormatter.format(new Date(suggestion.createdAt))}
                      </p>
                    </motion.li>
                  ))}
                </ul>
              </div>
            ) : (
              <motion.p
                initial={{ opacity: 0, y: -4, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.32, ease: "easeOut", delay: 0.16 }}
                className="mt-4 text-xs text-muted-foreground"
              >
                Share your public board to gather feedback. New suggestions will appear here for quick
                moderation.
              </motion.p>
            )}
            <motion.div
              initial={{ opacity: 0, y: 6, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.32, ease: "easeOut", delay: 0.26 }}
              className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="text-xs text-muted-foreground">
                Need more detail? Head to the full queue to approve or dismiss submissions.
              </p>
              <Button asChild size="sm" className="gap-2">
                <Link href="/dashboard/workspaces#community">
                  Review suggestions
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
