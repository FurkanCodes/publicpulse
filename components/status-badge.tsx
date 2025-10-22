import { Badge } from "@/components/ui/badge"
import { ClockIcon, Sparkles, CheckCircle2Icon, type LucideIcon } from "lucide-react"

type StatusType = "planned" | "in-progress" | "completed"

interface StatusBadgeProps {
  status: StatusType
  className?: string
}

const statusConfig: Record<
  StatusType,
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
  "in-progress": {
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

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]
  const StatusIcon = config.icon

  return (
    <Badge variant="outline" className={`${config.className} ${className || ""}`}>
      <StatusIcon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  )
}
