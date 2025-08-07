import { MapPin } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"

interface MapPlaceholderProps {
  selectedStationId?: number | null
  className?: string
}

export function MapPlaceholder({ selectedStationId, className }: MapPlaceholderProps) {
  return (
    <Card className={`h-[600px] bg-gray-100 border-2 border-dashed border-gray-300 ${className}`}>
      <CardContent className="h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">Interactive Map</h3>
          <p className="text-sm">Map integration with charging station markers</p>
          <p className="text-xs mt-2">Click on stations in the list to see them on map</p>
          {selectedStationId && (
            <p className="text-xs mt-2 text-green-600">
              Selected Station ID: {selectedStationId}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
