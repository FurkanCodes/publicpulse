import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface HeroSectionProps {
  badge?: string
  title: string
  description: string
  primaryCta?: string
  secondaryCta?: string
}

export function HeroSection({
  badge = "Design System Showcase",
  title,
  description,
  primaryCta = "Start Free Trial",
  secondaryCta = "View Demo",
}: HeroSectionProps) {
  return (
    <section className="container mx-auto px-4 py-24">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <Badge variant="secondary" className="mb-4">
          {badge}
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-balance">{title}</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">{description}</p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <Button size="lg" className="gap-2">
            {primaryCta}
          </Button>
          <Button size="lg" variant="outline">
            {secondaryCta}
          </Button>
        </div>
      </div>
    </section>
  )
}
