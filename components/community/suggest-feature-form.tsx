"use client";

import { useRef } from "react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

import { submitCommunitySuggestionAction } from "@/app/actions/submit-community-suggestion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type SuggestFeatureFormProps = {
  companySlug: string;
  remaining?: number | null;
  requireAccount?: boolean;
  isSignedIn?: boolean;
};

export function SuggestFeatureForm({
  companySlug,
  remaining = null,
  requireAccount = false,
  isSignedIn = false,
}: SuggestFeatureFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const { execute, status } = useAction(submitCommunitySuggestionAction, {
    onSuccess({ data }) {
      if (data?.message) {
        toast.success(data.message);
      } else {
        toast.success("Thanks! Your idea is waiting for moderation.");
      }
      formRef.current?.reset();
    },
    onError({ error }) {
      const message =
        error?.thrownError?.message ??
        error?.serverError ??
        "We couldn’t submit that suggestion.";
      toast.error(message);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const title = (data.get("title") as string | null) ?? "";
    const description = (data.get("description") as string | null) ?? undefined;
    const submitterName = (data.get("submitterName") as string | null) ?? undefined;
    const submitterEmail = (data.get("submitterEmail") as string | null) ?? undefined;

    execute({
      companySlug,
      title,
      description,
      submitterName,
      submitterEmail,
    });
  };

  const isDisabled = (requireAccount && !isSignedIn) || (remaining !== null && remaining <= 0);

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Your idea</Label>
        <Input
          id="title"
          name="title"
          placeholder="e.g. Automated weekly digest"
          required
          minLength={4}
          maxLength={180}
          disabled={status === "executing" || isDisabled}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Details</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="How would this help you?"
          maxLength={600}
          className="min-h-[140px]"
          disabled={status === "executing" || isDisabled}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="submitterName">Your name</Label>
          <Input
            id="submitterName"
            name="submitterName"
            placeholder="Optional"
            maxLength={120}
            disabled={status === "executing" || isDisabled}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="submitterEmail">Email for follow-up</Label>
          <Input
            id="submitterEmail"
            name="submitterEmail"
            type="email"
            placeholder="Optional"
            maxLength={180}
            disabled={status === "executing" || isDisabled}
          />
        </div>
      </div>
      <Button
        type="submit"
        disabled={status === "executing" || isDisabled}
        className="gap-2"
      >
        {status === "executing"
          ? "Sending..."
          : remaining !== null
            ? `Send suggestion (${Math.max(remaining, 0)} left)`
            : "Send suggestion"}
      </Button>
    </form>
  );
}
