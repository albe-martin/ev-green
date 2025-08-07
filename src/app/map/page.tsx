// app/map/page.tsx

'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Battery,
  Car,
  Clock,
  Filter,
  LogOut,
  MapPin,
  Search,
  Users,
  Zap,
} from "lucide-react"
import { getStatusColor, getStatusText } from "@/lib/station-utils"
import { getSession } from "@/lib/auth"
import { logout } from "@/lib/actions"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import type { ChargingStation } from "@prisma/client"
import { prisma } from "@/src/generated/prisma"

export default function MapPage() {
  const [stations, setStations] = useState<ChargingStation[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [selectedStation, setSelectedStation] = useState<number | null>(null)
  const [user, setUser] = useState<any>(null)

  const filteredStations = stations.filter((station) => {
    const matchesSearch = station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterType === "all"
      || (filterType === "available" && station.availableChargers > 0)
      || (filterType === "fast" && station.connectorTypes.includes("CCS2"))

    return matchesSearch && matchesFilter
  })

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/stations")
      const data = await res.json()
      setStations(data)
      const session = await getSession()
      setUser(session?.user)
    }
    fetchData()
  }, [])

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/" className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Link>
                </Button>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <Battery className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900">EV Green</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
                {user?.role === 'admin' && (
                  <Button asChild size="sm" variant="outline">
                    <Link href="/admin">Admin Panel</Link>
                  </Button>
                )}
                <Button asChild size="sm" className="bg-green-500 hover:bg-green-600">
                  <Link href="/bookings">My Bookings</Link>
                </Button>
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6">
          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search stations or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter stations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stations</SelectItem>
                  <SelectItem value="available">Available Now</SelectItem>
                  <SelectItem value="fast">Fast Charging</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Map Placeholder */}
            <div className="order-2 lg:order-1">
              <Card className="h-[600px] bg-gray-100 border-2 border-dashed border-gray-300">
                <CardContent className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">Interactive Map</h3>
                    <p className="text-sm">Map integration with charging station markers</p>
                    <p className="text-xs mt-2">Click on stations in the list to see them on map</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Station List */}
            <div className="order-1 lg:order-2 space-y-4 max-h-[600px] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Charging Stations ({filteredStations.length})</h2>

              {filteredStations.map((station) => (
                <Card
                  key={station.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedStation === station.id ? "ring-2 ring-green-500 shadow-lg" : ""
                  }`}
                  onClick={() => setSelectedStation(station.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-bold text-gray-900 mb-1">{station.name}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <MapPin className="w-4 h-4" />
                          <span>{station.location}</span>
                          <span>•</span>
                          <span>{station.distance}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">₹{station.pricePerUnit}/kWh</div>
                        <div className="text-sm text-gray-600">⭐ {station.rating}</div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {/* Status */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${getStatusColor(station.availableChargers, station.totalChargers)}`}
                        ></div>
                        <span className="font-semibold text-sm">
                          {getStatusText(station.availableChargers, station.totalChargers)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">{station.totalChargers} total chargers</div>
                    </div>

                    {/* Wait Time & Queue */}
                    {station.estimatedWaitTime > 0 && (
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
                            <span className="text-sm text-yellow-800">{station.currentQueue} in queue</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Connector Types */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {station.connectorTypes.map((type) => (
                        <Badge key={type} variant="secondary" className="text-xs">
                          <Zap className="w-3 h-3 mr-1" />
                          {type}
                        </Badge>
                      ))}
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {station.amenities.map((amenity) => (
                        <Badge key={amenity} variant="outline" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>

                    {/* Action Button */}
                    <Button
                      asChild
                      className="w-full bg-green-500 hover:bg-green-600"
                      disabled={station.availableChargers === 0 && station.currentQueue >= 3}
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
              ))}

              {filteredStations.length === 0 && (
                <Card className="p-8 text-center">
                  <div className="text-gray-500">
                    <Search className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">No stations found</h3>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
