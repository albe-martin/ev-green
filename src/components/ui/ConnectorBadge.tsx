import { Zap } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

interface ConnectorBadgeProps {
  type: string
  className?: string
}

export function ConnectorBadge({ type, className }: ConnectorBadgeProps) {
  return (
    <Badge variant="secondary" className={className}>
      <Zap className="w-3 h-3 mr-1" />
      {type}
    </Badge>
  )
}
