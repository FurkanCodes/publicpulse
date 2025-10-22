"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpIcon, MessageSquareIcon, ClockIcon, Sparkles, CheckCircle2Icon, type LucideIcon } from "lucide-react"
import { useState } from "react"

type FeatureStatus = "planned" | "in_progress" | "completed"

interface FeatureCardProps {
  title: string
  description: string
  status: FeatureStatus
  votes: number
  comments: number
  postedDate: string
  onVote?: () => void
}

const statusConfig: Record<
  FeatureStatus,
  {
    label: string
    icon: LucideIcon
    className: string
  }
> = {
  planned: {
    label: "Planned",
    icon: ClockIcon,
    className: "border-status-planned text-status-planned",
  },
  "in_progress": {
    label: "In Progress",
    icon: Sparkles,
    className: "border-status-progress text-status-progress",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2Icon,
    className: "border-status-completed text-status-completed",
  },
}

export function FeatureCard({
  title,
  description,
  status,
  votes: initialVotes,
  comments,
  postedDate,
  onVote,
}: FeatureCardProps) {
  const [votes, setVotes] = useState(initialVotes)
  const [hasVoted, setHasVoted] = useState(false)

  const config = statusConfig[status]
  console.log("Status config:", config)
  const StatusIcon = config.icon

  const handleVote = () => {
    if (!hasVoted) {
      setVotes((prev) => prev + 1)
      setHasVoted(true)
      onVote?.()
    }
  }

  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className={config.className}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {config.label}
              </Badge>
            </div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription className="mt-2">{description}</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex-col h-auto py-2 px-3 gap-1 bg-transparent"
            onClick={handleVote}
            disabled={hasVoted}
          >
            <ArrowUpIcon className="w-4 h-4" />
            <span className="text-xs font-semibold">{votes}</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MessageSquareIcon className="w-4 h-4" />
            <span>{comments} comments</span>
          </div>
          <span>•</span>
          <span>{postedDate}</span>
        </div>
      </CardContent>
    </Card>
  )
}
