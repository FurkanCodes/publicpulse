"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useAction } from "next-safe-action/hooks";
import { Check, ChevronDown } from "lucide-react";

import type { OwnedWorkspace } from "@/data-access/companies-list";
import { setActiveWorkspaceAction } from "@/app/actions/set-active-workspace";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

type WorkspaceSwitcherProps = {
  workspaces: OwnedWorkspace[];
  activeWorkspaceId: string;
};

export function WorkspaceSwitcher({ workspaces, activeWorkspaceId }: WorkspaceSwitcherProps) {
  const router = useRouter();

  const activeWorkspace = useMemo(
    () => workspaces.find((workspace) => workspace.id === activeWorkspaceId) ?? workspaces[0],
    [workspaces, activeWorkspaceId],
  );

  const { execute, status } = useAction(setActiveWorkspaceAction, {
    onSuccess() {
      router.refresh();
    },
    onError({ error }) {
      const message =
        error?.thrownError?.message ??
        error?.serverError ??
        "We couldn’t switch workspaces.";
      toast.error(message);
    },
  });

  if (!activeWorkspace) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <span className="truncate max-w-[160px] text-left">{activeWorkspace.name}</span>
          <ChevronDown className="h-4 w-4" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[220px]">
        {workspaces.map((workspace) => (
          <DropdownMenuItem
            key={workspace.id}
            disabled={status === "executing"}
            onSelect={() => execute({ workspaceId: workspace.id })}
            className="flex items-center justify-between gap-3"
          >
            <span className="truncate">{workspace.name}</span>
            {workspace.id === activeWorkspace.id ? <Check className="h-4 w-4" aria-hidden /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
