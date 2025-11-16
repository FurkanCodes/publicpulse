"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { CreateWorkspaceForm } from "@/components/dashboard/create-workspace-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CreateWorkspacePanelProps = {
  planName: string;
  companiesUsed: number;
  companyLimit: number | null;
  companiesRemaining: number | null;
};

export function CreateWorkspacePanel({
  planName,
  companiesUsed,
  companyLimit,
  companiesRemaining,
}: CreateWorkspacePanelProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const usageLabel =
    companyLimit === null
      ? `${companiesUsed} workspace${companiesUsed === 1 ? "" : "s"} live`
      : `${companiesUsed}/${companyLimit} workspace${companyLimit === 1 ? "" : "s"} used`;

  const remainingLabel =
    companiesRemaining === null
      ? "Unlimited remaining"
      : `${companiesRemaining} remaining`;

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
          <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">Create workspace</p>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">{planName} plan</h2>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center rounded-full border border-[color:var(--outline-soft)] bg-[color:var(--surface-elevated)] px-2 py-1 font-medium uppercase tracking-[0.18em]">
              {usageLabel}
            </span>
            <span className="uppercase tracking-[0.18em] text-muted-foreground/90">
              {remainingLabel}
            </span>
          </div>
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
          <span>{open ? "Hide form" : "New workspace"}</span>
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
            key="workspace-form"
            layout
            initial={{ opacity: 0, y: -10, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(12px)" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="rounded-xl border border-[color:var(--outline-soft)] bg-[color:var(--surface-floating)]/95 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.16)] backdrop-blur-xl"
          >
            <CreateWorkspaceForm
              planName={planName}
              companiesUsed={companiesUsed}
              companyLimit={companyLimit}
              companiesRemaining={companiesRemaining}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
