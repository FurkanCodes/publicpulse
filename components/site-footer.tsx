import { Sparkles } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">HyperLog</span>
          </div>
          <p className="text-sm text-muted-foreground">Built with transparency in mind</p>
        </div>
      </div>
    </footer>
  )
}
