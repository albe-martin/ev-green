"use client"

import { useState } from 'react'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { useAuth } from '@/lib/auth'
import { HeaderBar } from '@/components/ui/HeaderBar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Edit, Trash2, MapPin, Zap, Users, BarChart3, Save, X } from 'lucide-react'
import Link from 'next/link'
import type { Station } from '@/types/station'

// Mock stations data with more details for admin
const initialStations: Station[] = [
  {
    id: 1,
    name: "Lulu Mall Charging Hub",
    location: "Edappally, Kochi",
    address: "34/1, NH Bypass, Edappally, Kochi, Kerala 682024",
    coordinates: { lat: 10.0261, lng: 76.3105 },
    distance: "2.3 km",
    totalChargers: 8,
    availableChargers: 3,
    connectorTypes: ["CCS2", "AC001", "CHAdeMO"],
    pricePerUnit: 12,
    estimatedWaitTime: 0,
    currentQueue: 0,
    rating: 4.8,
    operatingHours: "24/7",
    operator: "KSEB",
    amenities: ["Parking", "Restroom", "Food Court", "WiFi"],
    status: "active",
  },
  {
    id: 2,
    name: "Technopark EV Station",
    location: "Thiruvananthapuram",
    address: "Technopark Campus, Thiruvananthapuram, Kerala 695581",
    coordinates: { lat: 8.5241, lng: 76.9366 },
    distance: "45.2 km",
    totalChargers: 6,
    availableChargers: 0,
    connectorTypes: ["CCS2", "AC001"],
    pricePerUnit: 10,
    estimatedWaitTime: 25,
    currentQueue: 2,
    rating: 4.6,
    operatingHours: "6:00 AM - 10:00 PM",
    operator: "Tata Power",
    amenities: ["Parking", "WiFi", "Cafe", "Security"],
    status: "active",
  }
]

export default function AdminPage() {
  const { user, logout } = useAuth()
  const [stations, setStations] = useState(initialStations)
  const [editingStation, setEditingStation] = useState<any>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newStation, setNewStation] = useState({
    name: '',
    location: '',
    address: '',
    coordinates: { lat: '', lng: '' },
    totalChargers: '',
    connectorTypes: [] as string[],
    pricePerUnit: '',
    operatingHours: '',
    operator: '',
    amenities: [] as string[],
    status: 'active'
  })

  const connectorOptions = ["CCS2", "AC001", "CHAdeMO", "Type 2"]
  const amenityOptions = ["Parking", "Restroom", "Food Court", "WiFi", "Cafe", "Security", "Covered Area", "Beach View", "Garden", "Cultural Center"]

  const handleAddStation = () => {
    const station: Station = {
      id: Math.max(...stations.map(s => s.id)) + 1,
      ...newStation,
      coordinates: {
        lat: parseFloat(newStation.coordinates.lat),
        lng: parseFloat(newStation.coordinates.lng)
      },
      distance: "0 km", // This would be calculated based on user location
      totalChargers: parseInt(newStation.totalChargers),
      availableChargers: parseInt(newStation.totalChargers),
      pricePerUnit: parseFloat(newStation.pricePerUnit),
      estimatedWaitTime: 0,
      currentQueue: 0,
      rating: 4.0,
    }
    
    setStations([...stations, station])
    setNewStation({
      name: '',
      location: '',
      address: '',
      coordinates: { lat: '', lng: '' },
      totalChargers: '',
      connectorTypes: [],
      pricePerUnit: '',
      operatingHours: '',
      operator: '',
      amenities: [],
      status: 'active'
    })
    setShowAddForm(false)
  }

  const handleEditStation = (station: Station) => {
    setEditingStation({
      ...station,
      coordinates: {
        lat: station.coordinates.lat.toString(),
        lng: station.coordinates.lng.toString()
      },
      totalChargers: station.totalChargers.toString(),
      pricePerUnit: station.pricePerUnit.toString()
    })
  }

  const handleUpdateStation = () => {
    const updatedStation: Station = {
      ...editingStation,
      coordinates: {
        lat: parseFloat(editingStation.coordinates.lat),
        lng: parseFloat(editingStation.coordinates.lng)
      },
      totalChargers: parseInt(editingStation.totalChargers),
      pricePerUnit: parseFloat(editingStation.pricePerUnit),
    }
    
    setStations(stations.map(s => s.id === updatedStation.id ? updatedStation : s))
    setEditingStation(null)
  }

  const handleDeleteStation = (id: number) => {
    if (confirm('Are you sure you want to delete this station?')) {
      setStations(stations.filter(s => s.id !== id))
    }
  }

  const toggleArrayItem = (array: string[], item: string, setter: (arr: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item))
    } else {
      setter([...array, item])
    }
  }

  const headerActions = (
    <Button asChild variant="outline" size="sm">
      <Link href="/">View Site</Link>
    </Button>
  )

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-gray-50">
        <HeaderBar
          user={user}
          onLogout={logout}
          title="EV Green Admin"
          actions={headerActions}
        />

        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage charging stations and monitor platform activity</p>
          </div>

          <Tabs defaultValue="stations" className="space-y-6">
            <TabsList>
              <TabsTrigger value="stations">Charging Stations</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
            </TabsList>

            <TabsContent value="stations" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{stations.length}</div>
                        <div className="text-sm text-gray-600">Total Stations</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{stations.reduce((acc, s) => acc + s.totalChargers, 0)}</div>
                        <div className="text-sm text-gray-600">Total Chargers</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{stations.reduce((acc, s) => acc + s.availableChargers, 0)}</div>
                        <div className="text-sm text-gray-600">Available Now</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">
                          {Math.round((stations.reduce((acc, s) => acc + s.availableChargers, 0) / stations.reduce((acc, s) => acc + s.totalChargers, 0)) * 100)}%
                        </div>
                        <div className="text-sm text-gray-600">Availability</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Add Station Button */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Charging Stations</h2>
                <Button 
                  onClick={() => setShowAddForm(true)}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Station
                </Button>
              </div>

              {/* Add Station Form */}
              {showAddForm && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Add New Charging Station</CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Station Name</Label>
                        <Input
                          value={newStation.name}
                          onChange={(e) => setNewStation({...newStation, name: e.target.value})}
                          placeholder="Enter station name"
                        />
                      </div>
                      <div>
                        <Label>Location</Label>
                        <Input
                          value={newStation.location}
                          onChange={(e) => setNewStation({...newStation, location: e.target.value})}
                          placeholder="City, State"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Full Address</Label>
                      <Textarea
                        value={newStation.address}
                        onChange={(e) => setNewStation({...newStation, address: e.target.value})}
                        placeholder="Complete address"
                        rows={2}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Latitude</Label>
                        <Input
                          type="number"
                          step="any"
                          value={newStation.coordinates.lat}
                          onChange={(e) => setNewStation({...newStation, coordinates: {...newStation.coordinates, lat: e.target.value}})}
                          placeholder="10.0261"
                        />
                      </div>
                      <div>
                        <Label>Longitude</Label>
                        <Input
                          type="number"
                          step="any"
                          value={newStation.coordinates.lng}
                          onChange={(e) => setNewStation({...newStation, coordinates: {...newStation.coordinates, lng: e.target.value}})}
                          placeholder="76.3105"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label>Total Chargers</Label>
                        <Input
                          type="number"
                          value={newStation.totalChargers}
                          onChange={(e) => setNewStation({...newStation, totalChargers: e.target.value})}
                          placeholder="8"
                        />
                      </div>
                      <div>
                        <Label>Price per kWh (₹)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={newStation.pricePerUnit}
                          onChange={(e) => setNewStation({...newStation, pricePerUnit: e.target.value})}
                          placeholder="12.00"
                        />
                      </div>
                      <div>
                        <Label>Operator</Label>
                        <Input
                          value={newStation.operator}
                          onChange={(e) => setNewStation({...newStation, operator: e.target.value})}
                          placeholder="KSEB"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Operating Hours</Label>
                      <Input
                        value={newStation.operatingHours}
                        onChange={(e) => setNewStation({...newStation, operatingHours: e.target.value})}
                        placeholder="24/7 or 6:00 AM - 10:00 PM"
                      />
                    </div>

                    <div>
                      <Label>Connector Types</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {connectorOptions.map(connector => (
                          <Badge
                            key={connector}
                            variant={newStation.connectorTypes.includes(connector) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => toggleArrayItem(newStation.connectorTypes, connector, (arr) => setNewStation({...newStation, connectorTypes: arr}))}
                          >
                            {connector}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Amenities</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {amenityOptions.map(amenity => (
                          <Badge
                            key={amenity}
                            variant={newStation.amenities.includes(amenity) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => toggleArrayItem(newStation.amenities, amenity, (arr) => setNewStation({...newStation, amenities: arr}))}
                          >
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleAddStation} className="bg-green-500 hover:bg-green-600">
                        <Save className="w-4 h-4 mr-2" />
                        Add Station
                      </Button>
                      <Button variant="outline" onClick={() => setShowAddForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Stations List */}
              <div className="space-y-4">
                {stations.map(station => (
                  <Card key={station.id}>
                    <CardContent className="p-6">
                      {editingStation?.id === station.id ? (
                        // Edit Form
                        <div className="space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label>Station Name</Label>
                              <Input
                                value={editingStation.name}
                                onChange={(e) => setEditingStation({...editingStation, name: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label>Location</Label>
                              <Input
                                value={editingStation.location}
                                onChange={(e) => setEditingStation({...editingStation, location: e.target.value})}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label>Address</Label>
                            <Textarea
                              value={editingStation.address}
                              onChange={(e) => setEditingStation({...editingStation, address: e.target.value})}
                              rows={2}
                            />
                          </div>

                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <Label>Total Chargers</Label>
                              <Input
                                type="number"
                                value={editingStation.totalChargers}
                                onChange={(e) => setEditingStation({...editingStation, totalChargers: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label>Price per kWh (₹)</Label>
                              <Input
                                type="number"
                                step="0.01"
                                value={editingStation.pricePerUnit}
                                onChange={(e) => setEditingStation({...editingStation, pricePerUnit: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label>Status</Label>
                              <Select
                                value={editingStation.status}
                                onValueChange={(value) => setEditingStation({...editingStation, status: value})}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="maintenance">Maintenance</SelectItem>
                                  <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button onClick={handleUpdateStation} className="bg-green-500 hover:bg-green-600">
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </Button>
                            <Button variant="outline" onClick={() => setEditingStation(null)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // Display Mode
                        <div>
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{station.name}</h3>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                <MapPin className="w-4 h-4" />
                                <span>{station.location}</span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{station.address}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={station.status === 'active' ? 'default' : 'secondary'}>
                                {station.status}
                              </Badge>
                              <Button variant="outline" size="sm" onClick={() => handleEditStation(station)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleDeleteStation(station.id)}>
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-4 gap-4 mb-4">
                            <div className="text-sm">
                              <span className="text-gray-600">Chargers:</span>
                              <span className="font-medium ml-1">{station.availableChargers}/{station.totalChargers}</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-600">Price:</span>
                              <span className="font-medium ml-1">₹{station.pricePerUnit}/kWh</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-600">Operator:</span>
                              <span className="font-medium ml-1">{station.operator}</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-600">Hours:</span>
                              <span className="font-medium ml-1">{station.operatingHours}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className="text-sm text-gray-600">Connectors:</span>
                            {station.connectorTypes.map(type => (
                              <Badge key={type} variant="outline" className="text-xs">
                                <Zap className="w-3 h-3 mr-1" />
                                {type}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <span className="text-sm text-gray-600">Amenities:</span>
                            {station.amenities.map(amenity => (
                              <Badge key={amenity} variant="outline" className="text-xs">
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
                    <p>Detailed analytics and reporting features coming soon...</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500">
                    <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold mb-2">Booking Management</h3>
                    <p>Booking management and monitoring features coming soon...</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
