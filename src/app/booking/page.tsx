"use client"

import type React from "react"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Battery, ArrowLeft, MapPin, Clock, Zap, Car, CreditCard, Calendar, AlertCircle, CheckCircle } from 'lucide-react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ProtectedRoute } from '@/components/auth/protected-route'

// Mock data (same as map page)
const chargingStations = [
  {
    id: 1,
    name: "Lulu Mall Charging Hub",
    location: "Edappally, Kochi",
    connectorTypes: ["CCS2", "AC001", "CHAdeMO"],
    pricePerUnit: 12,
    availableChargers: 3,
    totalChargers: 8,
  },
  {
    id: 2,
    name: "Technopark EV Station",
    location: "Thiruvananthapuram",
    connectorTypes: ["CCS2", "AC001"],
    pricePerUnit: 10,
    availableChargers: 0,
    totalChargers: 6,
  },
  {
    id: 3,
    name: "Infopark Charging Point",
    location: "Kakkanad, Kochi",
    connectorTypes: ["AC001", "Type 2"],
    pricePerUnit: 11,
    availableChargers: 2,
    totalChargers: 4,
  },
]

const vehicleTypes = [
  { id: "2w", name: "Two Wheeler", icon: "🛵" },
  { id: "3w", name: "Three Wheeler", icon: "🛺" },
  { id: "4w", name: "Four Wheeler", icon: "🚗" },
]

export default function BookingPage() {
  const searchParams = useSearchParams()
  const stationId = searchParams.get("station")
  const selectedStation =
    chargingStations.find((s) => s.id === Number.parseInt(stationId || "1")) || chargingStations[0]

  const [formData, setFormData] = useState({
    stationId: selectedStation.id,
    connectorType: "",
    vehicleType: "",
    bookingType: "next-available", // Add this new field
    preferredDate: "",
    preferredTime: "",
    estimatedDuration: 60,
    vehicleModel: "",
    batteryCapacity: "",
    currentCharge: "",
    notes: "",
    manualTimeSelection: false,
    customTime: ""
  })

  const [estimatedCost, setEstimatedCost] = useState(0)

  const handleInputChange = (field: string, value: string | number | boolean) => {
    const newFormData = { ...formData, [field]: value }
    setFormData(newFormData)

    // Calculate estimated cost
    if (newFormData.estimatedDuration && selectedStation) {
      const powerConsumption = (newFormData.estimatedDuration / 60) * 30 // Assume 30kW average
      setEstimatedCost(powerConsumption * selectedStation.pricePerUnit)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the booking data to your backend
    alert("Booking confirmed! Redirecting to My Bookings...")
    window.location.href = "/bookings"
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/map" className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Map
                  </Link>
                </Button>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <Battery className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900">EV Green</span>
                </div>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link href="/bookings">My Bookings</Link>
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Book Charging Slot</h1>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Booking Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Booking Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Station Selection */}
                      <div>
                        <Label htmlFor="station">Charging Station</Label>
                        <Select
                          value={formData.stationId.toString()}
                          onValueChange={(value) => handleInputChange("stationId", Number.parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {chargingStations.map((station) => (
                              <SelectItem key={station.id} value={station.id.toString()}>
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4" />
                                  <span>
                                    {station.name} - {station.location}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Connector Type */}
                      <div>
                        <Label htmlFor="connector">Connector Type</Label>
                        <Select
                          value={formData.connectorType}
                          onValueChange={(value) => handleInputChange("connectorType", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select connector type" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedStation.connectorTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                <div className="flex items-center gap-2">
                                  <Zap className="w-4 h-4" />
                                  <span>{type}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Vehicle Type */}
                      <div>
                        <Label htmlFor="vehicle">Vehicle Type</Label>
                        <Select
                          value={formData.vehicleType}
                          onValueChange={(value) => handleInputChange("vehicleType", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select vehicle type" />
                          </SelectTrigger>
                          <SelectContent>
                            {vehicleTypes.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                <div className="flex items-center gap-2">
                                  <span>{type.icon}</span>
                                  <span>{type.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Booking Type Selection */}
                      <div className="space-y-4">
                        <Label className="text-base font-semibold">Booking Options</Label>

                        {/* Next Available Slot */}
                        <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                          <div className="flex items-start gap-3">
                            <input
                              type="radio"
                              id="next-available"
                              name="bookingType"
                              value="next-available"
                              checked={formData.bookingType === "next-available"}
                              onChange={(e) => handleInputChange("bookingType", e.target.value)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <label htmlFor="next-available" className="font-medium text-green-800 cursor-pointer">
                                Next Available Slot (Recommended)
                              </label>
                              <p className="text-sm text-green-700 mt-1">
                                Get the earliest available slot at this station. No waiting, guaranteed charging.
                              </p>
                              {formData.bookingType === "next-available" && (
                                <div className="mt-3 p-3 bg-white rounded border border-green-200">
                                  <div className="flex items-center gap-2 text-sm">
                                    <Clock className="w-4 h-4 text-green-600" />
                                    <span className="font-medium">Next available: Today, 3:45 PM</span>
                                  </div>
                                  <div className="text-xs text-gray-600 mt-1">
                                    Estimated slot duration: {formData.estimatedDuration} minutes
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Book Later Option */}
                        <div className="border rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <input
                              type="radio"
                              id="book-later"
                              name="bookingType"
                              value="book-later"
                              checked={formData.bookingType === "book-later"}
                              onChange={(e) => handleInputChange("bookingType", e.target.value)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <label htmlFor="book-later" className="font-medium text-gray-900 cursor-pointer">
                                Book for Later
                              </label>
                              <p className="text-sm text-gray-600 mt-1">Choose your preferred date and time slot.</p>

                              {formData.bookingType === "book-later" && (
                                <div className="mt-4 space-y-4">
                                  {/* Date Selection */}
                                  <div>
                                    <Label htmlFor="date">Select Date</Label>
                                    <Input
                                      id="date"
                                      type="date"
                                      value={formData.preferredDate}
                                      onChange={(e) => handleInputChange("preferredDate", e.target.value)}
                                      min={new Date().toISOString().split("T")[0]}
                                      max={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]} // 7 days from now
                                      className="mt-1"
                                    />
                                  </div>

                                  {/* Available Slots Dropdown */}
                                  {formData.preferredDate && (
                                    <div>
                                      <Label htmlFor="available-slots">Available Time Slots</Label>
                                      <Select
                                        value={formData.preferredTime}
                                        onValueChange={(value) => handleInputChange("preferredTime", value)}
                                      >
                                        <SelectTrigger className="mt-1">
                                          <SelectValue placeholder="Choose from available slots" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="09:00">
                                            <div className="flex items-center justify-between w-full">
                                              <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-green-500" />
                                                <span>9:00 AM</span>
                                              </div>
                                              <Badge variant="secondary" className="ml-4 bg-green-100 text-green-800">
                                                Available
                                              </Badge>
                                            </div>
                                          </SelectItem>
                                          <SelectItem value="10:30">
                                            <div className="flex items-center justify-between w-full">
                                              <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-green-500" />
                                                <span>10:30 AM</span>
                                              </div>
                                              <Badge variant="secondary" className="ml-4 bg-green-100 text-green-800">
                                                Available
                                              </Badge>
                                            </div>
                                          </SelectItem>
                                          <SelectItem value="12:00">
                                            <div className="flex items-center justify-between w-full">
                                              <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-yellow-500" />
                                                <span>12:00 PM</span>
                                              </div>
                                              <Badge variant="secondary" className="ml-4 bg-yellow-100 text-yellow-800">
                                                2 slots left
                                              </Badge>
                                            </div>
                                          </SelectItem>
                                          <SelectItem value="14:15">
                                            <div className="flex items-center justify-between w-full">
                                              <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-green-500" />
                                                <span>2:15 PM</span>
                                              </div>
                                              <Badge variant="secondary" className="ml-4 bg-green-100 text-green-800">
                                                Available
                                              </Badge>
                                            </div>
                                          </SelectItem>
                                          <SelectItem value="16:00">
                                            <div className="flex items-center justify-between w-full">
                                              <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-yellow-500" />
                                                <span>4:00 PM</span>
                                              </div>
                                              <Badge variant="secondary" className="ml-4 bg-yellow-100 text-yellow-800">
                                                1 slot left
                                              </Badge>
                                            </div>
                                          </SelectItem>
                                          <SelectItem value="17:30">
                                            <div className="flex items-center justify-between w-full">
                                              <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-green-500" />
                                                <span>5:30 PM</span>
                                              </div>
                                              <Badge variant="secondary" className="ml-4 bg-green-100 text-green-800">
                                                Available
                                              </Badge>
                                            </div>
                                          </SelectItem>
                                          <SelectItem value="19:00">
                                            <div className="flex items-center justify-between w-full">
                                              <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-green-500" />
                                                <span>7:00 PM</span>
                                              </div>
                                              <Badge variant="secondary" className="ml-4 bg-green-100 text-green-800">
                                                Available
                                              </Badge>
                                            </div>
                                          </SelectItem>
                                          <SelectItem disabled value="13:00">
                                            <div className="flex items-center justify-between w-full opacity-50">
                                              <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-red-500" />
                                                <span>1:00 PM</span>
                                              </div>
                                              <Badge variant="secondary" className="ml-4 bg-red-100 text-red-800">
                                                Fully Booked
                                              </Badge>
                                            </div>
                                          </SelectItem>
                                          <SelectItem disabled value="15:00">
                                            <div className="flex items-center justify-between w-full opacity-50">
                                              <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-red-500" />
                                                <span>3:00 PM</span>
                                              </div>
                                              <Badge variant="secondary" className="ml-4 bg-red-100 text-red-800">
                                                Fully Booked
                                              </Badge>
                                            </div>
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <p className="text-xs text-gray-500 mt-1">
                                        Showing available slots for {new Date(formData.preferredDate).toLocaleDateString('en-IN', { 
                                          weekday: 'long', 
                                          year: 'numeric', 
                                          month: 'long', 
                                          day: 'numeric' 
                                        })}
                                      </p>
                                    </div>
                                  )}

                                  {/* Manual Time Selection */}
                                  <div className="border-t pt-4">
                                    <div className="flex items-center gap-2 mb-3">
                                      <input
                                        type="checkbox"
                                        id="manual-time"
                                        checked={formData.manualTimeSelection || false}
                                        onChange={(e) => handleInputChange("manualTimeSelection", e.target.checked)}
                                        className="rounded"
                                      />
                                      <Label htmlFor="manual-time" className="text-sm font-medium cursor-pointer">
                                        Choose custom time (if preferred slot not available above)
                                      </Label>
                                    </div>
                                    
                                    {formData.manualTimeSelection && (
                                      <div>
                                        <Label htmlFor="custom-time">Custom Time</Label>
                                        <Input
                                          id="custom-time"
                                          type="time"
                                          value={formData.customTime || ""}
                                          onChange={(e) => handleInputChange("customTime", e.target.value)}
                                          className="mt-1"
                                        />
                                        <div className="mt-2 p-3 bg-amber-50 rounded border border-amber-200">
                                          <div className="flex items-center gap-2 text-sm text-amber-800">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>
                                              Custom time slots are subject to availability and may require waiting if no charger is free.
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Selected Slot Confirmation */}
                                  {formData.preferredDate && (formData.preferredTime || formData.customTime) && (
                                    <div className="p-3 bg-blue-50 rounded border border-blue-200">
                                      <div className="flex items-center gap-2 text-sm text-blue-800 font-medium">
                                        <CheckCircle className="w-4 h-4" />
                                        <span>
                                          Slot selected: {new Date(formData.preferredDate).toLocaleDateString()} at{" "}
                                          {formData.manualTimeSelection ? 
                                            new Date(`2024-01-01T${formData.customTime}`).toLocaleTimeString('en-IN', { 
                                              hour: '2-digit', 
                                              minute: '2-digit', 
                                              hour12: true 
                                            }) :
                                            new Date(`2024-01-01T${formData.preferredTime}`).toLocaleTimeString('en-IN', { 
                                              hour: '2-digit', 
                                              minute: '2-digit', 
                                              hour12: true 
                                            })
                                          }
                                        </span>
                                      </div>
                                      <div className="text-xs text-blue-700 mt-1">
                                        {formData.manualTimeSelection ? 
                                          "Custom time - availability will be confirmed after booking" :
                                          "Guaranteed slot - no waiting required"
                                        }
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Vehicle Details */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="model">Vehicle Model (Optional)</Label>
                          <Input
                            id="model"
                            placeholder="e.g., Tata Nexon EV"
                            value={formData.vehicleModel}
                            onChange={(e) => handleInputChange("vehicleModel", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="battery">Battery Capacity (kWh)</Label>
                          <Input
                            id="battery"
                            type="number"
                            placeholder="e.g., 30"
                            value={formData.batteryCapacity}
                            onChange={(e) => handleInputChange("batteryCapacity", e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Current Charge & Duration */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="charge">Current Charge (%)</Label>
                          <Input
                            id="charge"
                            type="number"
                            min="0"
                            max="100"
                            placeholder="e.g., 20"
                            value={formData.currentCharge}
                            onChange={(e) => handleInputChange("currentCharge", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="duration">Estimated Duration (minutes)</Label>
                          <Input
                            id="duration"
                            type="number"
                            min="15"
                            max="480"
                            value={formData.estimatedDuration}
                            onChange={(e) => handleInputChange("estimatedDuration", Number.parseInt(e.target.value))}
                          />
                        </div>
                      </div>

                      {/* Notes */}
                      <div>
                        <Label htmlFor="notes">Additional Notes (Optional)</Label>
                        <Textarea
                          id="notes"
                          placeholder="Any special requirements or notes..."
                          value={formData.notes}
                          onChange={(e) => handleInputChange("notes", e.target.value)}
                          rows={3}
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-green-500 hover:bg-green-600 text-lg py-6"
                        disabled={
                          !formData.connectorType ||
                          !formData.vehicleType ||
                          !formData.bookingType ||
                          (formData.bookingType === "book-later" && (
                            !formData.preferredDate || 
                            (!formData.preferredTime && !formData.customTime)
                          ))
                        }
                      >
                        <CreditCard className="w-5 h-5 mr-2" />
                        {formData.bookingType === "next-available" ? "Book Next Available Slot" : "Confirm Booking"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Booking Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Station Info */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">{selectedStation.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedStation.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>
                          {selectedStation.availableChargers}/{selectedStation.totalChargers} Available
                        </span>
                      </div>
                    </div>

                    {/* Selected Options */}
                    {formData.connectorType && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Connector:</span>
                        <Badge variant="secondary">
                          <Zap className="w-3 h-3 mr-1" />
                          {formData.connectorType}
                        </Badge>
                      </div>
                    )}

                    {formData.vehicleType && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Vehicle:</span>
                        <Badge variant="secondary">
                          <Car className="w-3 h-3 mr-1" />
                          {vehicleTypes.find((v) => v.id === formData.vehicleType)?.name}
                        </Badge>
                      </div>
                    )}

                    {formData.bookingType === "next-available" ? (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Booking Type:</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <Clock className="w-3 h-3 mr-1" />
                          Next Available
                        </Badge>
                      </div>
                    ) : (
                      formData.preferredDate &&
                      (formData.preferredTime || formData.customTime) && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Scheduled:</span>
                          <div className="text-sm font-medium text-right">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(formData.preferredDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formData.manualTimeSelection ? 
                                new Date(`2024-01-01T${formData.customTime}`).toLocaleTimeString('en-IN', { 
                                  hour: '2-digit', 
                                  minute: '2-digit', 
                                  hour12: true 
                                }) :
                                new Date(`2024-01-01T${formData.preferredTime}`).toLocaleTimeString('en-IN', { 
                                  hour: '2-digit', 
                                  minute: '2-digit', 
                                  hour12: true 
                                })
                              }
                            </div>
                          </div>
                        </div>
                      )
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Duration:</span>
                      <span className="text-sm font-medium">{formData.estimatedDuration} minutes</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Rate:</span>
                      <span className="text-sm font-medium">₹{selectedStation.pricePerUnit}/kWh</span>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Estimated Cost:</span>
                        <span className="text-lg font-bold text-green-600">₹{estimatedCost.toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">*Final cost may vary based on actual usage</p>
                    </div>

                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-green-800 text-sm font-medium mb-1">
                        <Clock className="w-4 h-4" />
                        {formData.bookingType === "next-available" ? "Next Available Benefits" : "Booking Benefits"}
                      </div>
                      <ul className="text-xs text-green-700 space-y-1">
                        {formData.bookingType === "next-available" ? (
                          <>
                            <li>• Immediate slot assignment</li>
                            <li>• No waiting time</li>
                            <li>• Best available charger</li>
                            <li>• Priority booking</li>
                          </>
                        ) : (
                          <>
                            <li>• Guaranteed charging slot</li>
                            <li>• No waiting in queues</li>
                            <li>• Free cancellation up to 1 hour before</li>
                            <li>• SMS/Email reminders</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
