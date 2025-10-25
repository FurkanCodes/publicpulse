"use client";

import { useTransition, type ComponentProps } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

type ButtonProps = ComponentProps<typeof Button>;

type SignOutButtonProps = {
  redirectTo?: string;
} & ButtonProps;

export function SignOutButton({
  redirectTo = "/sign-in",
  children,
  ...buttonProps
}: SignOutButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      try {
        await signOut();
        toast.success("Signed out successfully.");
        router.push(redirectTo);
        router.refresh();
      } catch (error) {
        console.error("[sign-out] failed", error);
        toast.error("We couldn't sign you out. Try again.");
      }
    });
  };

  return (
    <Button
      type="button"
      onClick={handleSignOut}
      disabled={isPending}
      {...buttonProps}
    >
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : children ?? "Sign out"}
    </Button>
  );
}
