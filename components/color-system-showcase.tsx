import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function ColorSystemShowcase() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Color System</h2>
          <p className="text-muted-foreground">Professional color palette designed for feedback management</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Primary</CardTitle>
              <CardDescription>Brand color for CTAs and key actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-20 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-mono text-sm">Primary</span>
                </div>
                <Button className="w-full">Primary Button</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status Colors</CardTitle>
              <CardDescription>Roadmap status indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-12 flex-1 bg-status-planned rounded-lg" />
                  <span className="text-sm font-mono">Planned</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-12 flex-1 bg-status-progress rounded-lg" />
                  <span className="text-sm font-mono">In Progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-12 flex-1 bg-status-completed rounded-lg" />
                  <span className="text-sm font-mono">Completed</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Neutrals</CardTitle>
              <CardDescription>Background and text colors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-12 bg-background border border-border rounded-lg flex items-center justify-center">
                  <span className="text-foreground font-mono text-sm">Background</span>
                </div>
                <div className="h-12 bg-card border border-border rounded-lg flex items-center justify-center">
                  <span className="text-card-foreground font-mono text-sm">Card</span>
                </div>
                <div className="h-12 bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground font-mono text-sm">Muted</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
