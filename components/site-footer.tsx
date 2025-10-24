import Link from "next/link";
import { Sparkles } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/80 bg-background/80">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-between gap-6 text-center text-sm text-muted-foreground md:flex-row md:text-left">
          <div className="flex items-center gap-2 text-foreground">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </span>
            <span className="font-semibold text-base tracking-tight">
              PublicPulse
            </span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link href="#features" className="transition-colors hover:text-foreground">
              Features
            </Link>
            <Link href="#workflow" className="transition-colors hover:text-foreground">
              Workflow
            </Link>
            <Link href="#pricing" className="transition-colors hover:text-foreground">
              Pricing
            </Link>
            <Link href="#faq" className="transition-colors hover:text-foreground">
              FAQ
            </Link>
            <Link href="/sign-in" className="transition-colors hover:text-foreground">
              Sign in
            </Link>
          </nav>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} PublicPulse. Built for product teams who
            listen.
          </p>
        </div>
      </div>
    </footer>
  );
}
