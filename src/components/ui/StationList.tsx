import { Search } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { StationCard } from "./StationCard"
import type { Station } from "@/types/station"

interface StationListProps {
  stations: Station[]
  selectedStationId?: number | null
  onStationSelect?: (stationId: number) => void
  title?: string
  className?: string
}

export function StationList({ 
  stations, 
  selectedStationId, 
  onStationSelect,
  title = "Charging Stations",
  className 
}: StationListProps) {
  if (stations.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-gray-500">
          <Search className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">No stations found</h3>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      </Card>
    )
  }

  return (
    <div className={`space-y-4 max-h-[600px] overflow-y-auto ${className}`}>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        {title} ({stations.length})
      </h2>
      
      {stations.map((station) => (
        <StationCard
          key={station.id}
          station={station}
          isSelected={selectedStationId === station.id}
          onClick={() => onStationSelect?.(station.id)}
        />
      ))}
    </div>
  )
}
