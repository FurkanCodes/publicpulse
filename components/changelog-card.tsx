import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ChangelogCardProps {
  title: string
  description: string
  date: string
  isNew?: boolean
  link?: string
}

export function ChangelogCard({ title, description, date, isNew = true, link }: ChangelogCardProps) {
  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          {isNew && <Badge className="bg-primary text-primary-foreground">NEW</Badge>}
          <span className="text-sm text-muted-foreground">{date}</span>
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="mt-2">{description}</CardDescription>
      </CardHeader>
      {link && (
        <CardContent>
          <Button variant="link" className="p-0 h-auto text-primary" asChild>
            <a href={link}>Read full changelog →</a>
          </Button>
        </CardContent>
      )}
    </Card>
  )
}
