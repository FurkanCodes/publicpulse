import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function ButtonShowcase() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Buttons</h2>
          <p className="text-muted-foreground">Various button styles and sizes</p>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-medium">Variants</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium">Sizes</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
