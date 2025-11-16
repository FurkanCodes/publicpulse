"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import type { OwnedWorkspace } from "@/data-access/companies-list";
import { WorkspaceList } from "@/components/dashboard/workspace-list";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type WorkspaceDirectoryPanelProps = {
  workspaces: OwnedWorkspace[];
};

export function WorkspaceDirectoryPanel({ workspaces }: WorkspaceDirectoryPanelProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
          <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">Workspace directory</p>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {workspaces.length === 0 ? "No workspaces yet" : `${workspaces.length} workspace${workspaces.length === 1 ? "" : "s"}`}
          </h2>
          <p className="text-sm text-muted-foreground">
            Copy a public link or jump into its dashboard.
          </p>
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
          <span>{open ? "Hide list" : "Show workspaces"}</span>
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
            key="workspace-list"
            layout
            initial={{ opacity: 0, y: -8, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(12px)" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="rounded-xl border border-[color:var(--outline-soft)] bg-[color:var(--surface-floating)]/95 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.16)] backdrop-blur-xl"
          >
            <WorkspaceList workspaces={workspaces} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
