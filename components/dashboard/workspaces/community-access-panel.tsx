"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import type { SelectCommunitySuggestion } from "@/db/schema";
import { CommunitySuggestionsToggle } from "@/components/dashboard/community-suggestions-toggle";
import { CommunitySuggestionQueue } from "@/components/dashboard/community-suggestion-queue";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CommunityAccessPanelProps = {
  companyId: string;
  planName: string;
  planAllows: boolean;
  enabled: boolean;
  requireAccount: boolean;
  maxPerUser: number;
  pendingSuggestions: SelectCommunitySuggestion[];
  approvedCount: number;
  dismissedCount: number;
};

export function CommunityAccessPanel({
  companyId,
  planName,
  planAllows,
  enabled,
  requireAccount,
  maxPerUser,
  pendingSuggestions,
  approvedCount,
  dismissedCount,
}: CommunityAccessPanelProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const summary = useMemo(() => {
    if (!planAllows) {
      return "Upgrade to unlock community submissions.";
    }

    if (!enabled) {
      return "Public submissions are disabled. Enable them to accept new ideas.";
    }

    return pendingSuggestions.length > 0
      ? `${pendingSuggestions.length} idea${pendingSuggestions.length === 1 ? "" : "s"} waiting in the queue.`
      : "Queue is clear. Approved items go straight to the backlog.";
  }, [enabled, pendingSuggestions.length, planAllows]);

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

  return (
    <div ref={containerRef} className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-[color:var(--outline-soft)] bg-[color:var(--surface-floating)] px-5 py-4 shadow-[0_12px_32px_rgba(15,23,42,0.18)] sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">Community access</p>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">{planName} plan</h2>
          <p className="text-sm text-muted-foreground">{summary}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "group mt-2 flex w-full items-center justify-center gap-2 sm:mt-0 sm:w-auto",
            open && "border-primary/60 bg-primary/10 text-primary",
          )}
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
        >
          <span>{open ? "Hide community controls" : "Manage community access"}</span>
          <motion.span
            initial={false}
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex items-center"
          >
            <ChevronDown className="h-4 w-4 transition-colors group-hover:text-primary" aria-hidden />
          </motion.span>
        </Button>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="community-panel"
            layout
            initial={{ opacity: 0, y: -8, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(12px)" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="space-y-6 rounded-xl border border-[color:var(--outline-soft)] bg-[color:var(--surface-floating)]/95 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.16)] backdrop-blur-xl"
          >
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
              <CommunitySuggestionsToggle
                companyId={companyId}
                enabled={enabled}
                planAllows={planAllows}
                planName={planName}
                requireAccount={requireAccount}
                maxPerUser={maxPerUser}
              />
              <div className="rounded-2xl border border-[color:var(--outline-soft)] bg-[color:var(--surface-floating)] px-4 py-4 text-sm text-muted-foreground">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  Suggestion activity
                </p>
                <p className="mt-2 text-lg font-semibold text-foreground">
                  {pendingSuggestions.length} pending · {approvedCount} approved · {dismissedCount} dismissed
                </p>
                <p className="mt-2 text-xs text-muted-foreground">Per-user limit: {maxPerUser}</p>
              </div>
            </div>
            {pendingSuggestions.length > 0 ? (
              <CommunitySuggestionQueue companyId={companyId} suggestions={pendingSuggestions} />
            ) : (
              <p className="text-sm text-muted-foreground">
                No pending suggestions right now. When new ideas come in, they’ll appear here for review.
              </p>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
