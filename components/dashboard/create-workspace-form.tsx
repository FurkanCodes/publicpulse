"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

import { createCompanyAction } from "@/app/actions/create-company";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type CreateWorkspaceFormProps = {
  planName: string;
  companiesUsed: number;
  companyLimit: number | null;
  companiesRemaining: number | null;
};

export function CreateWorkspaceForm({
  planName,
  companiesUsed,
  companyLimit,
  companiesRemaining,
}: CreateWorkspaceFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [limitMessage, setLimitMessage] = useState<string | null>(null);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const isAtLimit =
    companyLimit !== null && (companiesRemaining ?? 0) <= 0;

  const limitLabel =
    companyLimit === null ? "Unlimited" : `${companiesUsed}/${companyLimit}`;

  const { execute, status } = useAction(createCompanyAction, {
    onSuccess({ data }) {
      if (!data) return;

      if ("error" in data) {
        const limitError = data.error;
        if (limitError?.kind === "plan-limit") {
          setLimitMessage(limitError.message);
          toast.error(limitError.message);
          router.refresh();
        }
        return;
      }

      if (!("company" in data)) {
        return;
      }

      setLimitMessage(null);
      formRef.current?.reset();
      toast.success(`Created ${data.company.name}.`);
      router.refresh();
    },
    onError({ error }) {
      const message =
        error?.thrownError?.message ??
        error?.serverError ??
        "We couldn’t create that workspace.";
      toast.error(message);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isAtLimit) {
      setLimitMessage(
        `Your ${planName} plan has reached its workspace limit. Upgrade to add more.`,
      );
      return;
    }

    const formData = new FormData(event.currentTarget);
    const name = (formData.get("name") as string | null) ?? "";
    const description = (formData.get("description") as string | null) ?? "";

    execute({
      name,
      description,
    });
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex flex-col gap-5"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
          Create new workspace
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {companyLimit === null
            ? "You can spin up as many workspaces as you need."
            : `You’re using ${limitLabel} workspaces on the ${planName} plan.`}
        </p>
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="workspace-name">Workspace name</Label>
          <Input
            id="workspace-name"
            name="name"
            placeholder="e.g. Customer Success feedback"
            required
            minLength={2}
            maxLength={80}
            disabled={status === "executing" || isAtLimit}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="workspace-description">Description</Label>
          <Textarea
            id="workspace-description"
            name="description"
            placeholder="Optional. Help teammates understand what belongs in this workspace."
            maxLength={240}
            disabled={status === "executing" || isAtLimit}
            className="min-h-[120px]"
          />
        </div>
      </div>

      {limitMessage ? (
        <div className="rounded-2xl border border-[color:var(--outline-soft)] bg-[color:var(--surface-floating)] px-4 py-3 text-sm text-muted-foreground">
          {limitMessage}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="submit"
          disabled={status === "executing" || isAtLimit}
          className="gap-2"
        >
          {status === "executing" ? "Creating..." : "Create workspace"}
        </Button>
        {isAtLimit ? (
          <Dialog open={upgradeOpen} onOpenChange={setUpgradeOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="outline">
                Explore upgrades
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Upgrades coming soon</DialogTitle>
                <DialogDescription>
                  We&apos;re finalising our billing plans. In the meantime, reach out and we&apos;ll help you
                  unlock additional workspaces.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Email{" "}
                  <a
                    href="mailto:sales@publicpulse.app"
                    className="font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    sales@publicpulse.app
                  </a>{" "}
                  and let us know how many workspaces or seats you need.
                </p>
                <p>
                  Prefer to chat?{" "}
                  <a
                    href="https://cal.com/publicpulse/intro"
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    Book a quick call
                  </a>{" "}
                  and we&apos;ll tailor a plan for your team.
                </p>
              </div>
              <DialogFooter className="sm:justify-start">
                <Button onClick={() => setUpgradeOpen(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <span className="text-xs text-muted-foreground">
            Remaining:{" "}
            {companiesRemaining === null
              ? "Unlimited"
              : `${companiesRemaining} workspace${companiesRemaining === 1 ? "" : "s"}`}
          </span>
        )}
      </div>
    </form>
  );
}
