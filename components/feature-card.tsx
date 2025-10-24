"use client";

import { useMemo, useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import {
  ArrowUpIcon,
  CheckCircle2Icon,
  ClockIcon,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { upvoteFeatureAction } from "@/app/actions/upvote-feature";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type FeatureStatus = "planned" | "in_progress" | "completed";

interface FeatureCardProps {
  feature: {
    id: number;
    title: string;
    description?: string | null;
    status?: string | null;
    upvotes?: number | null;
    createdAt?: Date | string | null;
  };
  slug?: string;
  disableVoting?: boolean;
}

const statusConfig: Record<
  FeatureStatus,
  {
    label: string;
    icon: LucideIcon;
    className: string;
  }
> = {
  planned: {
    label: "Planned",
    icon: ClockIcon,
    className: "border-status-planned text-status-planned",
  },
  in_progress: {
    label: "In Progress",
    icon: Sparkles,
    className: "border-status-progress text-status-progress",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2Icon,
    className: "border-status-completed text-status-completed",
  },
};

export function FeatureCard({ feature, slug, disableVoting }: FeatureCardProps) {
  const [votes, setVotes] = useState(feature.upvotes ?? 0);
  const [hasVoted, setHasVoted] = useState(false);

  const statusKey = (feature.status ?? "planned").toLowerCase() as FeatureStatus;
  const config =
    statusConfig[statusKey] ?? {
      label: feature.status ?? "Planned",
      icon: Sparkles,
      className: "border-status-planned text-status-planned",
    };
  const StatusIcon = config.icon;

  const createdLabel = useMemo(() => {
    if (!feature.createdAt) return null;

    try {
      const date = new Date(feature.createdAt);
      return new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date);
    } catch {
      return null;
    }
  }, [feature.createdAt]);

  const { execute, status } = useAction(upvoteFeatureAction, {
    onSuccess({ data }) {
      if (typeof data?.upvotes === "number") {
        setVotes(data.upvotes);
      }
    },
    onError({ error }) {
      setVotes((prev) => Math.max(prev - 1, 0));
      setHasVoted(false);
      const message =
        error?.serverError ??
        error?.thrownError?.message ??
        "We couldn’t register your upvote.";
      toast.error(message);
    },
  });

  const handleVote = () => {
    if (disableVoting || hasVoted || status === "executing") {
      return;
    }

    setHasVoted(true);
    setVotes((prev) => prev + 1);
    execute({
      featureId: feature.id,
      slug,
    });
  };

  return (
    <Card className="transition-colors hover:border-primary/50">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <Badge variant="outline" className={config.className}>
              <StatusIcon className="mr-1 h-3 w-3" aria-hidden />
              {config.label}
            </Badge>
            <CardTitle className="text-xl">{feature.title}</CardTitle>
            {feature.description ? (
              <CardDescription className="text-sm text-muted-foreground">
                {feature.description}
              </CardDescription>
            ) : null}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex h-auto flex-col gap-1 bg-transparent px-3 py-2"
            onClick={handleVote}
            disabled={disableVoting || hasVoted || status === "executing"}
            aria-label="Upvote feature"
          >
            <ArrowUpIcon className="h-4 w-4" aria-hidden />
            <span className="text-xs font-semibold">{votes}</span>
          </Button>
        </div>
      </CardHeader>
      {createdLabel ? (
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Posted {createdLabel}
          </p>
        </CardContent>
      ) : null}
    </Card>
  );
}
