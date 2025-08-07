"use client"

import { useState } from "react"
import { Battery, ArrowLeft, MapPin, Clock, Calendar, Car, MoreHorizontal, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ProtectedRoute } from '@/components/auth/protected-route'

// Mock booking data
const mockBookings = [
  {
    id: "BK001",
    stationName: "Lulu Mall Charging Hub",
    location: "Edappally, Kochi",
    date: "2024-01-15",
    time: "14:30",
    duration: 60,
    connectorType: "CCS2",
    vehicleType: "4W",
    status: "active",
    estimatedCost: 360,
    actualCost: null,
    bookingTime: "2024-01-14T10:30:00Z",
    chargerNumber: "CH-03",
  },
  {
    id: "BK002",
    stationName: "Infopark Charging Point",
    location: "Kakkanad, Kochi",
    date: "2024-01-18",
    time: "09:00",
    duration: 45,
    connectorType: "AC001",
    vehicleType: "4W",
    status: "upcoming",
    estimatedCost: 248,
    actualCost: null,
    bookingTime: "2024-01-13T16:45:00Z",
    chargerNumber: "CH-02",
  },
  {
    id: "BK003",
    stationName: "Technopark EV Station",
    location: "Thiruvananthapuram",
    date: "2024-01-12",
    time: "11:15",
    duration: 90,
    connectorType: "CCS2",
    vehicleType: "4W",
    status: "completed",
    estimatedCost: 540,
    actualCost: 520,
    bookingTime: "2024-01-11T14:20:00Z",
    chargerNumber: "CH-01",
  },
  {
    id: "BK004",
    stationName: "Thrissur Cultural Center",
    location: "Thrissur",
    date: "2024-01-10",
    time: "16:00",
    duration: 30,
    connectorType: "Type 2",
    vehicleType: "4W",
    status: "cancelled",
    estimatedCost: 135,
    actualCost: null,
    bookingTime: "2024-01-09T12:30:00Z",
    chargerNumber: null,
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return <AlertCircle className="w-4 h-4 text-blue-500" />
    case "upcoming":
      return <Clock className="w-4 h-4 text-orange-500" />
    case "completed":
      return <CheckCircle className="w-4 h-4 text-green-500" />
    case "cancelled":
      return <XCircle className="w-4 h-4 text-red-500" />
    default:
      return null
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-blue-100 text-blue-800"
    case "upcoming":
      return "bg-orange-100 text-orange-800"
    case "completed":
      return "bg-green-100 text-green-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

const formatTime = (timeString: string) => {
  return new Date(`2024-01-01T${timeString}`).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState("all")

  const filterBookings = (status?: string) => {
    if (!status || status === "all") return mockBookings
    return mockBookings.filter((booking) => booking.status === status)
  }

  const handleCancelBooking = (bookingId: string) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      alert(`Booking ${bookingId} cancelled successfully!`)
      // Here you would typically update the booking status in your backend
    }
  }

  const handleRescheduleBooking = (bookingId: string) => {
    alert(`Redirecting to reschedule booking ${bookingId}...`)
    // Here you would typically redirect to a reschedule form
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
                  <Link href="/" className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Home
                  </Link>
                </Button>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <Battery className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900">EV Green</span>
                </div>
              </div>
              <Button asChild size="sm" className="bg-green-500 hover:bg-green-600">
                <Link href="/map">Find Stations</Link>
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
              <Button asChild className="bg-green-500 hover:bg-green-600">
                <Link href="/map">
                  <Car className="w-4 h-4 mr-2" />
                  New Booking
                </Link>
              </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All ({mockBookings.length})</TabsTrigger>
                <TabsTrigger value="active">Active ({filterBookings("active").length})</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming ({filterBookings("upcoming").length})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({filterBookings("completed").length})</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled ({filterBookings("cancelled").length})</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4">
                {filterBookings(activeTab === "all" ? undefined : activeTab).map((booking) => (
                  <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-lg font-bold text-gray-900">{booking.stationName}</CardTitle>
                            <Badge className={getStatusColor(booking.status)}>
                              {getStatusIcon(booking.status)}
                              <span className="ml-1 capitalize">{booking.status}</span>
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{booking.location}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600 mb-1">Booking ID</div>
                          <div className="font-mono text-sm font-semibold">{booking.id}</div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <div>
                            <div className="text-sm font-medium">{formatDate(booking.date)}</div>
                            <div className="text-xs text-gray-600">Date</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <div>
                            <div className="text-sm font-medium">{formatTime(booking.time)}</div>
                            <div className="text-xs text-gray-600">{booking.duration} minutes</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Car className="w-4 h-4 text-gray-500" />
                          <div>
                            <div className="text-sm font-medium">{booking.connectorType}</div>
                            <div className="text-xs text-gray-600">{booking.vehicleType} Vehicle</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 text-gray-500">₹</div>
                          <div>
                            <div className="text-sm font-medium">₹{booking.actualCost || booking.estimatedCost}</div>
                            <div className="text-xs text-gray-600">{booking.actualCost ? "Final Cost" : "Estimated"}</div>
                          </div>
                        </div>
                      </div>

                      {booking.chargerNumber && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm text-gray-600">
                            Assigned Charger: <span className="font-semibold text-gray-900">{booking.chargerNumber}</span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          Booked on {new Date(booking.bookingTime).toLocaleDateString("en-IN")}
                        </div>

                        <div className="flex items-center gap-2">
                          {booking.status === "upcoming" && (
                            <>
                              <Button variant="outline" size="sm" onClick={() => handleRescheduleBooking(booking.id)}>
                                Reschedule
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCancelBooking(booking.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                Cancel
                              </Button>
                            </>
                          )}

                          {booking.status === "active" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-600 hover:text-blue-700 bg-transparent"
                            >
                              View Live Status
                            </Button>
                          )}

                          {booking.status === "completed" && (
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/booking?station=${booking.id}`}>Book Again</Link>
                            </Button>
                          )}

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Download Receipt</DropdownMenuItem>
                              {booking.status === "completed" && <DropdownMenuItem>Rate Experience</DropdownMenuItem>}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filterBookings(activeTab === "all" ? undefined : activeTab).length === 0 && (
                  <Card className="p-12 text-center">
                    <div className="text-gray-500">
                      <Car className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-semibold mb-2">
                        {activeTab === "all" ? "No bookings yet" : `No ${activeTab} bookings`}
                      </h3>
                      <p className="text-sm mb-6">
                        {activeTab === "all"
                          ? "Start by booking your first charging slot"
                          : `You don't have any ${activeTab} bookings at the moment`}
                      </p>
                      <Button asChild className="bg-green-500 hover:bg-green-600">
                        <Link href="/map">
                          <MapPin className="w-4 h-4 mr-2" />
                          Find Charging Stations
                        </Link>
                      </Button>
                    </div>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
