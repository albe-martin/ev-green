import { MapPin, Clock, Users, Car } from 'lucide-react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusIndicator } from "./StatusIndicator"
import { ConnectorBadge } from "./ConnectorBadge"
import { AmenityBadge } from "./AmenityBadge"
import type { Station } from "@/types/station"

interface StationCardProps {
  station: Station
  isSelected?: boolean
  onClick?: () => void
  className?: string
}

export function StationCard({ station, isSelected = false, onClick, className }: StationCardProps) {
  const hasWaitTime = station.estimatedWaitTime > 0
  const isFullyBooked = station.availableChargers === 0 && station.currentQueue >= 3

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-lg ${
        isSelected ? "ring-2 ring-green-500 shadow-lg" : ""
      } ${className}`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-gray-900 mb-1">
              {station.name}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <MapPin className="w-4 h-4" />
              <span>{station.location}</span>
              <span>•</span>
              <span>{station.distance}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">
              ₹{station.pricePerUnit}/kWh
            </div>
            <div className="text-sm text-gray-600">⭐ {station.rating}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Status */}
        <div className="flex items-center gap-3 mb-4">
          <StatusIndicator 
            available={station.availableChargers} 
            total={station.totalChargers} 
          />
          <div className="text-sm text-gray-600">
            {station.totalChargers} total chargers
          </div>
        </div>

        {/* Wait Time & Queue */}
        {hasWaitTime && (
          <div className="flex items-center gap-4 mb-4 p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">
                ~{station.estimatedWaitTime} min wait
              </span>
            </div>
            {station.currentQueue > 0 && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-yellow-800">
                  {station.currentQueue} in queue
                </span>
              </div>
            )}
          </div>
        )}

        {/* Connector Types */}
        <div className="flex flex-wrap gap-2 mb-4">
          {station.connectorTypes.map((type) => (
            <ConnectorBadge key={type} type={type} className="text-xs" />
          ))}
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-4">
          {station.amenities.map((amenity) => (
            <AmenityBadge key={amenity} amenity={amenity} className="text-xs" />
          ))}
        </div>

        {/* Action Button */}
        <Button
          asChild
          className="w-full bg-green-500 hover:bg-green-600"
          disabled={isFullyBooked}
        >
          <Link href={`/booking?station=${station.id}`}>
            {station.availableChargers > 0 ? (
              <>
                <Car className="w-4 h-4 mr-2" />
                Book Now
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 mr-2" />
                Join Queue
              </>
            )}
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
