"use client";

import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

type NavIcon = "overview" | "features" | "feedback" | "settings";

export type NavItem = {
  name: string;
  href: string;
  icon: NavIcon;
};

type DashboardNavProps = {
  items: NavItem[];
};

const iconMap: Record<NavIcon, LucideIcon> = {
  overview: LayoutDashboard,
  features: Sparkles,
  feedback: MessageSquare,
  settings: Settings,
};

export function DashboardNav({ items }: DashboardNavProps) {
  const segments = useSelectedLayoutSegments();

  return (
    <nav className="space-y-1">
      {items.map((item) => {
        const Icon = iconMap[item.icon];

        const isActive =
          segments[0] === item.href.replace("/dashboard", "").slice(1) ||
          (item.href === "/dashboard" && segments.length === 0);

        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              "text-muted-foreground hover:bg-primary/10 hover:text-foreground",
              isActive && "bg-primary/10 text-primary",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon className="h-4 w-4" aria-hidden />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
