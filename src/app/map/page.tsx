"use client"

import { useState } from "react"
import { ProtectedRoute } from '@/components/auth/protected-route'
import { useAuth } from '@/lib/auth'
import { Button } from "@/components/ui/button"
import { HeaderBar } from "@/components/ui/HeaderBar"
import { SearchBar } from "@/components/ui/SearchBar"
import { StationFilter } from "@/components/ui/StationFilter"
import { MapPlaceholder } from "@/components/ui/MapPlaceholder"
import { StationList } from "@/components/ui/StationList"
import { useStationFilters } from "@/hooks/useStationFilters"
import Link from "next/link"
import type { Station } from "@/types/station"

// Mock data - this will be replaced with API calls
const mockStations: Station[] = [
  {
    id: 1,
    name: "Lulu Mall Charging Hub",
    location: "Edappally, Kochi",
    distance: "2.3 km",
    totalChargers: 8,
    availableChargers: 3,
    connectorTypes: ["CCS2", "AC001", "CHAdeMO"],
    pricePerUnit: 12,
    estimatedWaitTime: 0,
    currentQueue: 0,
    rating: 4.8,
    amenities: ["Parking", "Restroom", "Food Court"],
    coordinates: { lat: 10.0261, lng: 76.3105 },
  },
  {
    id: 2,
    name: "Technopark EV Station",
    location: "Thiruvananthapuram",
    distance: "45.2 km",
    totalChargers: 6,
    availableChargers: 0,
    connectorTypes: ["CCS2", "AC001"],
    pricePerUnit: 10,
    estimatedWaitTime: 25,
    currentQueue: 2,
    rating: 4.6,
    amenities: ["Parking", "WiFi", "Cafe"],
    coordinates: { lat: 8.5241, lng: 76.9366 },
  },
  {
    id: 3,
    name: "Infopark Charging Point",
    location: "Kakkanad, Kochi",
    distance: "8.7 km",
    totalChargers: 4,
    availableChargers: 2,
    connectorTypes: ["AC001", "Type 2"],
    pricePerUnit: 11,
    estimatedWaitTime: 0,
    currentQueue: 0,
    rating: 4.5,
    amenities: ["Parking", "Security"],
    coordinates: { lat: 10.0176, lng: 76.3517 },
  },
  {
    id: 4,
    name: "Kozhikode Beach Station",
    location: "Kozhikode",
    distance: "195 km",
    totalChargers: 5,
    availableChargers: 1,
    connectorTypes: ["CCS2", "CHAdeMO"],
    pricePerUnit: 13,
    estimatedWaitTime: 15,
    currentQueue: 1,
    rating: 4.7,
    amenities: ["Parking", "Beach View", "Restroom"],
    coordinates: { lat: 11.2588, lng: 75.7804 },
  },
  {
    id: 5,
    name: "Thrissur Cultural Center",
    location: "Thrissur",
    distance: "58 km",
    totalChargers: 3,
    availableChargers: 3,
    connectorTypes: ["AC001", "Type 2"],
    pricePerUnit: 9,
    estimatedWaitTime: 0,
    currentQueue: 0,
    rating: 4.4,
    amenities: ["Parking", "Cultural Center"],
    coordinates: { lat: 10.5276, lng: 76.2144 },
  },
]

interface MapPageProps {
  // These props will be populated by API calls in the future
  stations?: Station[]
}

export default function MapPage({ stations = mockStations }: MapPageProps) {
  const { user, logout } = useAuth()
  const [selectedStationId, setSelectedStationId] = useState<number | null>(null)
  
  const {
    filters,
    filteredStations,
    updateQuery,
    updateType
  } = useStationFilters(stations)

  const headerActions = (
    <>
      {user?.role === 'admin' && (
        <Button asChild size="sm" variant="outline">
          <Link href="/admin">Admin Panel</Link>
        </Button>
      )}
      <Button asChild size="sm" className="bg-green-500 hover:bg-green-600">
        <Link href="/bookings">My Bookings</Link>
      </Button>
    </>
  )

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <HeaderBar
          user={user}
          onLogout={logout}
          showBackButton
          backHref="/"
          backLabel="Back"
          actions={headerActions}
        />

        <div className="container mx-auto px-4 py-6">
          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <SearchBar
                value={filters.query}
                onChange={updateQuery}
                placeholder="Search stations or locations..."
              />
              <StationFilter
                value={filters.type}
                onChange={updateType}
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Map Placeholder */}
            <div className="order-2 lg:order-1">
              <MapPlaceholder selectedStationId={selectedStationId} />
            </div>

            {/* Station List */}
            <div className="order-1 lg:order-2">
              <StationList
                stations={filteredStations}
                selectedStationId={selectedStationId}
                onStationSelect={setSelectedStationId}
                title="Charging Stations"
              />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
