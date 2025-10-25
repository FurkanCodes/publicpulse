"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { toast } from "sonner";

import { updateCommunitySettingsAction } from "@/app/(dashboard)/dashboard/settings/actions";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

type CommunitySuggestionsToggleProps = {
  companyId: string;
  enabled: boolean;
  planAllows: boolean;
  planName: string;
  requireAccount: boolean;
  maxPerUser: number;
};

export function CommunitySuggestionsToggle({
  companyId,
  enabled,
  planAllows,
  planName,
  requireAccount,
  maxPerUser,
}: CommunitySuggestionsToggleProps) {
  const [pending, setPending] = useState(false);
  const [value, setValue] = useState(enabled);
  const [requireAuth, setRequireAuth] = useState(requireAccount);
  const [limit, setLimit] = useState(maxPerUser);
  const router = useRouter();

  const { execute } = useAction(updateCommunitySettingsAction, {
    onExecute: () => setPending(true),
    onSuccess({ data }) {
      if (data?.settings) {
        setValue(data.settings.enablePublicSuggestions);
        setRequireAuth(data.settings.requireAccountForSuggestions);
        setLimit(data.settings.maxPublicSuggestionsPerUser);
        toast.success(
          data.settings.enablePublicSuggestions
            ? "Community suggestions updated."
            : "Community suggestions disabled.",
        );
      }
      setPending(false);
      router.refresh();
    },
    onError({ error }) {
      const message =
        error?.thrownError?.message ??
        error?.serverError ??
        "We couldn’t update this setting.";
      toast.error(message);
      setValue(enabled);
      setPending(false);
    },
  });

  const handleChange = (checked: boolean) => {
    if (!planAllows) {
      toast.info(`Upgrade to unlock community suggestions on ${planName}.`);
      return;
    }

    setValue(checked);
    execute({ companyId, enable: checked });
  };

  const handleRequireAccount = (checked: boolean) => {
    if (!planAllows) {
      toast.info(`Upgrade to unlock community suggestions on ${planName}.`);
      return;
    }
    setRequireAuth(checked);
    execute({ companyId, requireAccount: checked });
  };

  const handleLimitBlur = () => {
    if (!planAllows) {
      setLimit(maxPerUser);
      toast.info(`Upgrade to unlock community suggestions on ${planName}.`);
      return;
    }
    const normalized = Number.isFinite(limit) ? limit : maxPerUser;
    const safe = Math.min(50, Math.max(1, normalized));
    setLimit(safe);
    execute({ companyId, maxSuggestions: safe });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">
            Allow public feature suggestions
          </p>
          <p className="text-sm text-muted-foreground">
            Let anyone on your public board propose new ideas. Suggestions land in a moderation queue
            before they go live.
          </p>
        </div>
        <Switch
          checked={value && planAllows}
          disabled={!planAllows || pending}
          onCheckedChange={handleChange}
          aria-label="Toggle public suggestions"
        />
      </div>
      {!planAllows ? (
        <div className="rounded-2xl border border-dashed border-[color:var(--outline-soft)] bg-[color:var(--surface-floating)] px-4 py-3 text-sm text-muted-foreground">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-foreground">Locked</span>
            <span>
              Upgrade to the <strong>Community Pro</strong> plan to collect incoming ideas directly from
              your public board.
            </span>
            <Button asChild size="sm" variant="outline">
              <Link href="/dashboard/settings#upgrade">See community plans</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 rounded-2xl border border-[color:var(--outline-soft)] bg-[color:var(--surface-floating)] px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Require sign-in to submit
              </p>
              <p className="text-xs text-muted-foreground">
                Only authenticated users can suggest ideas when this is on.
              </p>
            </div>
            <Switch
              checked={requireAuth}
              disabled={pending || !value}
              onCheckedChange={handleRequireAccount}
              aria-label="Require account to submit suggestions"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground" htmlFor="suggestion-limit">
              Suggestions per user
            </label>
            <div className="flex items-center gap-3">
              <Input
                id="suggestion-limit"
                type="number"
                min={1}
                max={50}
                value={limit}
                onChange={(event) => setLimit(Number(event.target.value))}
                onBlur={handleLimitBlur}
                disabled={pending || !value}
                className="w-24"
              />
              <span className="text-xs text-muted-foreground">
                Users can have at most {limit} active suggestions.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
