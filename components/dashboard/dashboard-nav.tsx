"use client";

import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import { Briefcase, LayoutDashboard, Settings, Sparkles, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type NavIcon = "overview" | "features" | "workspaces" | "settings";

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
  workspaces: Briefcase,
  settings: Settings,
};

export function DashboardNav({ items }: DashboardNavProps) {
  const segments = useSelectedLayoutSegments();

  return (
    <nav className="flex flex-wrap items-center gap-2">
      {items.map((item) => {
        const Icon = iconMap[item.icon];

        const [, targetSegment = ""] = item.href.split("/").filter(Boolean);
        const isActive = targetSegment
          ? segments[0] === targetSegment
          : segments.length === 0;

        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-2 rounded-full border border-transparent px-4 py-2 text-sm font-semibold tracking-tight text-muted-foreground transition-all duration-200 ease-out",
              "hover:-translate-y-[2px] hover:border-[color:var(--outline-strong)] hover:bg-[var(--highlight)] hover:text-foreground",
              isActive &&
                "border-[color:var(--outline-strong)] bg-primary text-primary-foreground shadow-[0_8px_0_var(--shadow-color)]",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <span className="inline-flex size-6 items-center justify-center rounded-full border border-[color:var(--outline-strong)] bg-[color:var(--surface-elevated)] text-[0.7rem] font-semibold uppercase leading-none text-foreground">
              <Icon className="h-3.5 w-3.5" aria-hidden />
            </span>
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
