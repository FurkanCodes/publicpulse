import { Card, CardContent } from "@/components/ui/card"

export function TypographyShowcase() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Typography</h2>
          <p className="text-muted-foreground">Geist Sans for UI, Geist Mono for code</p>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-6">
            <div>
              <h1 className="text-5xl font-bold mb-2">Heading 1</h1>
              <p className="text-sm text-muted-foreground font-mono">text-5xl font-bold</p>
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-2">Heading 2</h2>
              <p className="text-sm text-muted-foreground font-mono">text-4xl font-bold</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-2">Heading 3</h3>
              <p className="text-sm text-muted-foreground font-mono">text-3xl font-bold</p>
            </div>
            <div>
              <p className="text-base mb-2 leading-relaxed">
                Body text with optimal line height for readability. This design system uses leading-relaxed for
                comfortable reading.
              </p>
              <p className="text-sm text-muted-foreground font-mono">text-base leading-relaxed</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Secondary text for descriptions and metadata</p>
              <p className="text-sm text-muted-foreground font-mono">text-sm text-muted-foreground</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
