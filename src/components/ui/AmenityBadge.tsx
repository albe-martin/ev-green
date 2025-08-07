import { Badge } from "@/components/ui/badge"

interface AmenityBadgeProps {
  amenity: string
  className?: string
}

export function AmenityBadge({ amenity, className }: AmenityBadgeProps) {
  return (
    <Badge variant="outline" className={className}>
      {amenity}
    </Badge>
  )
}
