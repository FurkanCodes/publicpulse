import Link from "next/link";

type SuggestionBannerProps = {
  requireAccount: boolean;
  isSignedIn: boolean;
  remaining: number | null;
  signInHref: string;
};

export function SuggestionBanner({
  requireAccount,
  isSignedIn,
  remaining,
  signInHref,
}: SuggestionBannerProps) {
  if (!requireAccount && remaining === null) {
    return null;
  }

  if (requireAccount && !isSignedIn) {
    return (
      <div className="rounded-2xl border border-[color:var(--outline-soft)] bg-[color:var(--surface-floating)] px-4 py-3 text-sm text-muted-foreground">
        Sign in to share a suggestion. Once the workspace owner approves it, your idea will appear on the public
        board. <Link href={signInHref} className="font-semibold text-primary underline-offset-4 hover:underline">Sign in</Link>
      </div>
    );
  }

  if (remaining !== null && remaining <= 0) {
    return (
      <div className="rounded-2xl border border-[color:var(--outline-soft)] bg-[color:var(--surface-floating)] px-4 py-3 text-sm text-muted-foreground">
        You&apos;ve reached the suggestion limit for this workspace. Remove or wait for moderation before sending
        another idea.
      </div>
    );
  }

  return null;
}
