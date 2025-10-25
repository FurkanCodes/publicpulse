"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

import { moderateSuggestionAction } from "@/app/(dashboard)/dashboard/settings/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { SelectCommunitySuggestion } from "@/db/schema";

type CommunitySuggestionQueueProps = {
  companyId: string;
  suggestions: SelectCommunitySuggestion[];
};

export function CommunitySuggestionQueue({
  companyId,
  suggestions,
}: CommunitySuggestionQueueProps) {
  const [notes, setNotes] = useState<Record<string, string>>({});
  const router = useRouter();
  const { execute, status } = useAction(moderateSuggestionAction, {
    onSuccess({ data }) {
      if (data?.decision === "approve") {
        toast.success("Suggestion approved and added to the backlog.");
      } else {
        toast.success("Suggestion dismissed.");
      }
      router.refresh();
    },
    onError({ error }) {
      const message =
        error?.thrownError?.message ??
        error?.serverError ??
        "We couldn’t update that suggestion.";
      toast.error(message);
    },
  });

  const handleModeration = (suggestionId: string, decision: "approve" | "dismiss") => {
    execute({
      companyId,
      suggestionId,
      decision,
      note: notes[suggestionId],
    });
  };

  return (
    <div className="space-y-5">
      {suggestions.map((suggestion) => (
        <div
          key={suggestion.id}
          className="rounded-2xl border border-[color:var(--outline-soft)] bg-[color:var(--surface-floating)] px-5 py-4 shadow-[0_6px_0_var(--shadow-color)]"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">{suggestion.title}</h3>
              {suggestion.description ? (
                <p className="text-sm text-muted-foreground">{suggestion.description}</p>
              ) : null}
              <p className="text-xs text-muted-foreground">
                Submitted {new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(suggestion.createdAt))}
                {suggestion.submitterName ? ` · ${suggestion.submitterName}` : null}
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <Textarea
              placeholder="Optional moderation note"
              value={notes[suggestion.id] ?? ""}
              onChange={(event) =>
                setNotes((prev) => ({
                  ...prev,
                  [suggestion.id]: event.target.value,
                }))
              }
              maxLength={360}
              disabled={status === "executing"}
            />
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="secondary"
                disabled={status === "executing"}
                onClick={() => handleModeration(suggestion.id, "approve")}
              >
                Approve & add to backlog
              </Button>
              <Button
                variant="outline"
                disabled={status === "executing"}
                onClick={() => handleModeration(suggestion.id, "dismiss")}
              >
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
