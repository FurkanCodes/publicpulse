"use client";

import Link from "next/link";
import { CopyIcon, ExternalLink } from "lucide-react";

import type { OwnedWorkspace } from "@/data-access/companies-list";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

type WorkspaceListProps = {
  workspaces: OwnedWorkspace[];
};

export function WorkspaceList({ workspaces }: WorkspaceListProps) {
  if (workspaces.length === 0) {
    return (
      <Card className="border-dashed border-[color:var(--outline-soft)] bg-[color:var(--surface-floating)] px-6 py-8 text-sm text-muted-foreground">
        Create your first workspace to start collecting feedback and feature requests.
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {workspaces.map((workspace) => {
        const publicUrl = `/c/${workspace.slug}`;

        const handleCopy = async () => {
          try {
            await navigator.clipboard.writeText(`${window.location.origin}${publicUrl}`);
            toast.success("Public board link copied.");
          } catch (error) {
            console.error("[workspace-list] copy failed", error);
            toast.error("Couldn’t copy the link. Try again.");
          }
        };

        return (
          <Card
            key={workspace.id}
            className="flex flex-col gap-4 rounded-2xl border border-[color:var(--outline-soft)] bg-[color:var(--surface-floating)] px-5 py-4 shadow-[0_6px_0_var(--shadow-color)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{workspace.name}</h3>
                <p className="text-xs text-muted-foreground">
                  Created {new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(workspace.createdAt))}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  <CopyIcon className="h-4 w-4" aria-hidden /> Copy public link
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={publicUrl} prefetch={false}>
                    <ExternalLink className="h-4 w-4" aria-hidden /> View board
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/overview">
                    <ExternalLink className="h-4 w-4" aria-hidden /> Open dashboard
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
