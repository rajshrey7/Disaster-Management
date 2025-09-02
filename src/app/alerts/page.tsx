"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { 
  AlertTriangle, 
  MapPin, 
  Clock, 
  Bell, 
  Eye,
  Filter,
  Search,
  Navigation,
  Cloud,
  Zap,
  Waves,
  Wind,
  Thermometer,
  Phone,
  Users,
  Home,
  Calendar,
  CheckCircle,
  XCircle,
  Info
} from "lucide-react"

export default function AlertsPage() {
  const router = useRouter()
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [alertType, setAlertType] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date())

  const navigateToDashboard = () => {
    router.push('/dashboard')
  }

  const navigateToContacts = () => {
    router.push('/contacts')
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute
    return () => clearInterval(timer)
  }, [])

  const regions = [
    { id: "all", name: "All Regions", icon: MapPin },
    { id: "mumbai", name: "Mumbai", icon: MapPin },
    { id: "delhi", name: "Delhi NCR", icon: MapPin },
    { id: "bangalore", name: "Bangalore", icon: MapPin },
    { id: "chennai", name: "Chennai", icon: MapPin },
    { id: "kolkata", name: "Kolkata", icon: MapPin },
    { id: "hyderabad", name: "Hyderabad", icon: MapPin },
    { id: "pune", name: "Pune", icon: MapPin },
    { id: "ahmedabad", name: "Ahmedabad", icon: MapPin }
  ]

  const alerts = [
    {
      id: 1,
      title: "Heavy Rainfall Warning",
      description: "Heavy to very heavy rainfall expected over the next 48 hours. Possible waterlogging in low-lying areas.",
      type: "weather",
      severity: "high",
      region: "mumbai",
      issued: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      expires: new Date(Date.now() + 46 * 60 * 60 * 1000), // 46 hours from now
      status: "active",
      icon: Cloud,
      color: "blue",
      actions: [
        "Avoid unnecessary travel",
        "Stay indoors during heavy rain",
        "Keep emergency contacts ready",
        "Move to higher ground if in low-lying areas"
      ],
      source: "India Meteorological Department",
      contact: "022-26793222"
    },
    {
      id: 2,
      title: "Thunderstorm Alert",
      description: "Thunderstorms with lightning and strong winds expected this evening. Take necessary precautions.",
      type: "weather",
      severity: "medium",
      region: "delhi",
      issued: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      expires: new Date(Date.now() + 7 * 60 * 60 * 1000), // 7 hours from now
      status: "active",
      icon: Zap,
      color: "yellow",
      actions: [
        "Unplug electrical appliances",
        "Avoid open areas",
        "Stay away from tall structures",
        "Keep vehicles parked safely"
      ],
      source: "Regional Meteorological Centre",
      contact: "011-26793222"
    },
    {
      id: 3,
      title: "Air Quality Warning",
      description: "Air quality index has reached hazardous levels. Sensitive groups should avoid outdoor activities.",
      type: "environmental",
      severity: "high",
      region: "delhi",
      issued: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      expires: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
      status: "active",
      icon: Wind,
      color: "orange",
      actions: [
        "Wear N95 masks outdoors",
        "Keep windows closed",
        "Use air purifiers indoors",
        "Avoid strenuous outdoor activities"
      ],
      source: "Central Pollution Control Board",
      contact: "011-26701727"
    },
    {
      id: 4,
      title: "Heat Wave Alert",
      description: "Severe heat wave conditions expected. Maximum temperature may reach 45°C.",
      type: "weather",
      severity: "high",
      region: "ahmedabad",
      issued: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      expires: new Date(Date.now() + 16 * 60 * 60 * 1000), // 16 hours from now
      status: "active",
      icon: Thermometer,
      color: "red",
      actions: [
        "Stay hydrated",
        "Avoid direct sun exposure",
        "Wear light-colored clothing",
        "Check on elderly neighbors"
      ],
      source: "India Meteorological Department",
      contact: "079-26793222"
    },
    {
      id: 5,
      title: "Flood Watch",
      description: "River levels are rising due to heavy rainfall. Monitor situation closely.",
      type: "flood",
      severity: "medium",
      region: "kolkata",
      issued: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      expires: new Date(Date.now() + 18 * 60 * 60 * 1000), // 18 hours from now
      status: "active",
      icon: Waves,
      color: "blue",
      actions: [
        "Monitor river levels",
        "Prepare evacuation plans",
        "Keep emergency kit ready",
        "Stay informed through official channels"
      ],
      source: "State Disaster Management Authority",
      contact: "033-22143226"
    },
    {
      id: 6,
      title: "Cyclone Watch",
      description: "Cyclonic storm developing in Bay of Bengal. Monitor weather updates regularly.",
      type: "weather",
      severity: "high",
      region: "chennai",
      issued: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
      expires: new Date(Date.now() + 72 * 60 * 60 * 1000), // 72 hours from now
      status: "active",
      icon: Wind,
      color: "purple",
      actions: [
        "Secure loose objects",
        "Stock emergency supplies",
        "Plan evacuation routes",
        "Keep important documents safe"
      ],
      source: "India Meteorological Department",
      contact: "044-25384520"
    },
    {
      id: 7,
      title: "Earthquake Preparedness",
      description: "Seismic activity detected in the region. Review earthquake safety procedures.",
      type: "seismic",
      severity: "low",
      region: "pune",
      issued: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      expires: new Date(Date.now() + 23 * 60 * 60 * 1000), // 23 hours from now
      status: "active",
      icon: AlertTriangle,
      color: "orange",
      actions: [
        "Identify safe spots in your building",
        "Practice drop, cover, and hold",
        "Secure heavy furniture",
        "Prepare emergency kit"
      ],
      source: "National Centre for Seismology",
      contact: "011-26701700"
    },
    {
      id: 8,
      title: "Power Outage Alert",
      description: "Scheduled maintenance work may cause power interruptions in your area.",
      type: "utility",
      severity: "low",
      region: "bangalore",
      issued: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      expires: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours from now
      status: "active",
      icon: Zap,
      color: "yellow",
      actions: [
        "Charge electronic devices",
        "Keep flashlights ready",
        "Plan alternative power sources",
        "Save work on computers"
      ],
      source: "Bangalore Electricity Supply Company",
      contact: "080-22873333"
    }
  ]

  const filteredAlerts = alerts.filter(alert => {
    const matchesRegion = selectedRegion === "all" || alert.region === selectedRegion
    const matchesType = alertType === "all" || alert.type === alertType
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesRegion && matchesType && matchesSearch
  })

  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    } else {
      return "Just now"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "destructive"
      case "medium": return "default"
      case "low": return "secondary"
      default: return "outline"
    }
  }

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case "weather": return Cloud
      case "environmental": return Wind
      case "flood": return Waves
      case "seismic": return AlertTriangle
      case "utility": return Zap
      default: return Info
    }
  }

  const markAsRead = (alertId: number) => {
    // In a real app, this would update the alert status
    console.log(`Marked alert ${alertId} as read`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Emergency Alerts</h1>
                <p className="text-sm text-gray-600">Region-specific emergency notifications</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium">{currentTime.toLocaleTimeString()}</div>
                <div className="text-xs text-gray-600">{currentTime.toLocaleDateString()}</div>
              </div>
              <Button variant="outline" onClick={navigateToDashboard}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Active Alerts Banner */}
        <div className="bg-red-600 text-white rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Bell className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  {filteredAlerts.filter(a => a.status === "active").length} Active Alerts
                </h2>
                <p className="text-red-100">Stay informed about emergencies in your region</p>
              </div>
            </div>
            <Button 
              size="lg" 
              variant="secondary" 
              className="bg-white text-red-600 hover:bg-gray-100"
              onClick={navigateToContacts}
            >
              <Phone className="w-5 h-5 mr-2" />
              Emergency Contacts
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                placeholder="Search alerts by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </select>
              <select
                value={alertType}
                onChange={(e) => setAlertType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="weather">Weather</option>
                <option value="environmental">Environmental</option>
                <option value="flood">Flood</option>
                <option value="seismic">Seismic</option>
                <option value="utility">Utility</option>
              </select>
            </div>
          </div>
        </div>

        {/* Alert Statistics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredAlerts.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Priority</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {filteredAlerts.filter(a => a.severity === "high").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Region</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredAlerts.filter(a => a.region === selectedRegion || selectedRegion === "all").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredAlerts.length > 0 ? getTimeAgo(Math.min(...filteredAlerts.map(a => a.issued.getTime()))) : 'N/A'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Active Alerts ({filteredAlerts.filter(a => a.status === "active").length})
            </h2>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {filteredAlerts.length} alerts found
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {filteredAlerts
              .filter(alert => alert.status === "active")
              .sort((a, b) => b.severity.localeCompare(a.severity))
              .map((alert) => {
                const AlertIcon = getAlertTypeIcon(alert.type)
                const isExpiringSoon = alert.expires.getTime() - currentTime.getTime() < 24 * 60 * 60 * 1000 // Less than 24 hours
                
                return (
                  <Card key={alert.id} className={`hover:shadow-lg transition-shadow ${
                    alert.severity === "high" ? "border-l-4 border-l-red-500" :
                    alert.severity === "medium" ? "border-l-4 border-l-yellow-500" :
                    "border-l-4 border-l-green-500"
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="flex-shrink-0">
                            <div className={`w-12 h-12 bg-${alert.color}-100 rounded-lg flex items-center justify-center`}>
                              <AlertIcon className={`w-6 h-6 text-${alert.color}-600`} />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                              <Badge variant={getSeverityColor(alert.severity)}>
                                {alert.severity.toUpperCase()}
                              </Badge>
                              {isExpiringSoon && (
                                <Badge variant="outline" className="text-orange-600 border-orange-600">
                                  Expiring Soon
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-600 mb-2">{alert.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>{regions.find(r => r.id === alert.region)?.name}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{getTimeAgo(alert.issued)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>Expires: {alert.expires.toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAsRead(alert.id)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Mark Read
                          </Button>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h4 className="font-medium mb-2">Recommended Actions:</h4>
                        <div className="grid md:grid-cols-2 gap-2">
                          {alert.actions.map((action, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm">{action}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Source Information */}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div>
                          <span className="font-medium">Source:</span> {alert.source}
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="font-medium">Contact:</span> {alert.contact}
                          <Button variant="outline" size="sm" onClick={() => window.open(`tel:${alert.contact}`, '_self')}>
                            <Phone className="w-4 h-4 mr-2" />
                            Call
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </div>

          {/* Expired/Resolved Alerts Section */}
          {filteredAlerts.filter(a => a.status !== "active").length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Resolved Alerts</h3>
              <div className="space-y-4">
                {filteredAlerts
                  .filter(alert => alert.status !== "active")
                  .map((alert) => {
                    const AlertIcon = getAlertTypeIcon(alert.type)
                    
                    return (
                      <Card key={alert.id} className="opacity-60">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                <AlertIcon className="w-5 h-5 text-gray-500" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium text-gray-700">{alert.title}</h4>
                                <Badge variant="outline">
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Resolved
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500">{alert.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
              </div>
            </div>
          )}

          {filteredAlerts.length === 0 && (
            <div className="text-center py-12">
              <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No alerts found</h3>
              <p className="text-gray-600 mb-6">No active alerts match your current filters</p>
              <Button onClick={() => {
                setSearchTerm("")
                setSelectedRegion("all")
                setAlertType("all")
              }}>
                Clear All Filters
              </Button>
            </div>
          )}
        </div>

        {/* Alert Subscription */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Get Real-time Alerts:</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• SMS notifications for critical alerts</li>
                <li>• Email updates for your region</li>
                <li>• Push notifications on mobile app</li>
                <li>• Weather alerts and warnings</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Alert Preferences:</h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Bell className="w-4 h-4 mr-2" />
                  Configure Alert Settings
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <MapPin className="w-4 h-4 mr-2" />
                  Update Location Preferences
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}