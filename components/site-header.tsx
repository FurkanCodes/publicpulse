import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-xl">HyperLog</span>
        </div>
        <nav className="flex items-center gap-6">
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Roadmap
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Changelog
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Docs
          </a>
          <ThemeToggle />
          <Button size="sm">Get Started</Button>
        </nav>
      </div>
    </header>
  )
}
