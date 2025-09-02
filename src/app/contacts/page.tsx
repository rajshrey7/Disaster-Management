"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { 
  Phone, 
  MapPin, 
  Users, 
  Shield, 
  AlertTriangle, 
  Ambulance,
  Search,
  Star,
  Clock,
  Navigation,
  Home,
  Building,
  Heart,
  Truck,
  Droplet,
  Zap,
  Radio,
  User,
  PhoneCall,
  Copy,
  ExternalLink
} from "lucide-react"

export default function ContactsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const navigateToDashboard = () => {
    router.push('/dashboard')
  }

  const emergencyContacts = [
    {
      id: 1,
      name: "National Emergency",
      number: "112",
      category: "national",
      description: "All-in-one emergency number for police, fire, and ambulance",
      icon: Phone,
      color: "red",
      available24x7: true,
      location: "Pan India",
      website: "https://www.112.gov.in"
    },
    {
      id: 2,
      name: "Police",
      number: "100",
      category: "police",
      description: "For police assistance and emergency reporting",
      icon: Shield,
      color: "blue",
      available24x7: true,
      location: "Pan India",
      website: ""
    },
    {
      id: 3,
      name: "Fire Department",
      number: "101",
      category: "fire",
      description: "For fire emergencies and rescue operations",
      icon: AlertTriangle,
      color: "orange",
      available24x7: true,
      location: "Pan India",
      website: ""
    },
    {
      id: 4,
      name: "Ambulance",
      number: "108",
      category: "medical",
      description: "Emergency medical services and ambulance",
      icon: Ambulance,
      color: "green",
      available24x7: true,
      location: "Pan India",
      website: "https://www.108ambulance.in"
    },
    {
      id: 5,
      name: "Disaster Management",
      number: "011-26701700",
      category: "disaster",
      description: "National Disaster Management Authority",
      icon: AlertTriangle,
      color: "purple",
      available24x7: true,
      location: "Delhi",
      website: "https://www.ndma.gov.in"
    },
    {
      id: 6,
      name: "Women Helpline",
      number: "1091",
      category: "special",
      description: "24/7 helpline for women in distress",
      icon: Users,
      color: "pink",
      available24x7: true,
      location: "Pan India",
      website: ""
    },
    {
      id: 7,
      name: "Child Helpline",
      number: "1098",
      category: "special",
      description: "24/7 helpline for children in need of care and protection",
      icon: Users,
      color: "yellow",
      available24x7: true,
      location: "Pan India",
      website: "https://www.childlineindia.org.in"
    },
    {
      id: 8,
      name: "Poison Control",
      number: "1800-116-117",
      category: "medical",
      description: "24/7 poison emergency helpline",
      icon: Heart,
      color: "red",
      available24x7: true,
      location: "Pan India",
      website: ""
    },
    {
      id: 9,
      name: "Blood Bank",
      number: "1910",
      category: "medical",
      description: "24/7 blood bank helpline",
      icon: Droplet,
      color: "red",
      available24x7: true,
      location: "Pan India",
      website: "https://www.eraktkosh.in"
    },
    {
      id: 10,
      name: "Electricity Emergency",
      number: "1912",
      category: "utility",
      description: "For electricity-related emergencies",
      icon: Zap,
      color: "yellow",
      available24x7: true,
      location: "Pan India",
      website: ""
    },
    {
      id: 11,
      name: "Gas Leakage",
      number: "1906",
      category: "utility",
      description: "For gas leakage emergencies",
      icon: Radio,
      color: "orange",
      available24x7: true,
      location: "Pan India",
      website: ""
    },
    {
      id: 12,
      name: "Railway Emergency",
      number: "182",
      category: "transport",
      description: "For railway emergencies and assistance",
      icon: Truck,
      color: "blue",
      available24x7: true,
      location: "Pan India",
      website: "https://www.indianrail.gov.in"
    }
  ]

  const regionalContacts = [
    {
      id: 1,
      name: "Mumbai Disaster Management",
      number: "022-22694777",
      category: "regional",
      description: "Mumbai Municipal Corporation - Disaster Management Cell",
      icon: Building,
      color: "blue",
      available24x7: true,
      location: "Mumbai, Maharashtra",
      website: "https://www.mcgm.gov.in"
    },
    {
      id: 2,
      name: "Delhi Disaster Management",
      number: "011-23390212",
      category: "regional",
      description: "Delhi Disaster Management Authority",
      icon: Building,
      color: "orange",
      available24x7: true,
      location: "Delhi NCR",
      website: "https://delhi.gov.in"
    },
    {
      id: 3,
      name: "Bangalore Emergency",
      number: "080-22943222",
      category: "regional",
      description: "BBMP Disaster Management Cell",
      icon: Building,
      color: "green",
      available24x7: true,
      location: "Bangalore, Karnataka",
      website: "https://bbmp.gov.in"
    },
    {
      id: 4,
      name: "Chennai Corporation",
      number: "044-25384520",
      category: "regional",
      description: "Greater Chennai Corporation Emergency",
      icon: Building,
      color: "purple",
      available24x7: true,
      location: "Chennai, Tamil Nadu",
      website: "https://www.chennaicorporation.gov.in"
    },
    {
      id: 5,
      name: "Kolkata Emergency",
      number: "033-22143226",
      category: "regional",
      description: "Kolkata Municipal Corporation Emergency",
      icon: Building,
      color: "red",
      available24x7: true,
      location: "Kolkata, West Bengal",
      website: "https://www.kmcgov.in"
    },
    {
      id: 6,
      name: "Hyderabad Disaster",
      number: "040-21111111",
      category: "regional",
      description: "GHMC Disaster Management Cell",
      icon: Building,
      color: "teal",
      available24x7: true,
      location: "Hyderabad, Telangana",
      website: "https://www.ghmc.gov.in"
    }
  ]

  const allContacts = [...emergencyContacts, ...regionalContacts]

  const filteredContacts = allContacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.number.includes(searchTerm) ||
                         contact.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || contact.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const makeCall = (number: string) => {
    window.open(`tel:${number}`, '_self')
  }

  const copyNumber = (number: string) => {
    navigator.clipboard.writeText(number)
    alert(`Number ${number} copied to clipboard!`)
  }

  const categories = [
    { id: "all", name: "All Contacts", icon: Phone },
    { id: "national", name: "National", icon: MapPin },
    { id: "police", name: "Police", icon: Shield },
    { id: "fire", name: "Fire", icon: AlertTriangle },
    { id: "medical", name: "Medical", icon: Heart },
    { id: "disaster", name: "Disaster", icon: AlertTriangle },
    { id: "special", name: "Special", icon: Users },
    { id: "utility", name: "Utility", icon: Zap },
    { id: "transport", name: "Transport", icon: Truck },
    { id: "regional", name: "Regional", icon: Building }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Emergency Contacts</h1>
                <p className="text-sm text-gray-600">Quick access to emergency services</p>
              </div>
            </div>
            <Button variant="outline" onClick={navigateToDashboard}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Emergency Banner */}
        <div className="bg-red-600 text-white rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">In Emergency? Call 112</h2>
              <p className="text-red-100">National Emergency Number - Available 24/7</p>
            </div>
            <Button 
              size="lg" 
              variant="secondary" 
              className="bg-white text-red-600 hover:bg-gray-100"
              onClick={() => makeCall("112")}
            >
              <PhoneCall className="w-5 h-5 mr-2" />
              Call Now
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search contacts by name, number, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center space-x-2"
                >
                  <category.icon className="w-4 h-4" />
                  <span>{category.name}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Access Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {emergencyContacts.slice(0, 6).map((contact) => (
            <Card key={contact.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <contact.icon className={`w-8 h-8 text-${contact.color}-600 mx-auto mb-2`} />
                <h3 className="font-medium text-sm mb-1">{contact.name}</h3>
                <p className="text-lg font-bold text-gray-900 mb-2">{contact.number}</p>
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => makeCall(contact.number)}
                >
                  Call
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contacts List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {filteredContacts.length} Emergency Contacts
            </h2>
            <div className="text-sm text-gray-600">
              {filteredContacts.filter(c => c.available24x7).length} available 24/7
            </div>
          </div>

          <div className="grid gap-4">
            {filteredContacts.map((contact) => (
              <Card key={contact.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 bg-${contact.color}-100 rounded-lg flex items-center justify-center`}>
                          <contact.icon className={`w-6 h-6 text-${contact.color}-600`} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">{contact.name}</h3>
                          <Badge variant={contact.available24x7 ? "default" : "secondary"}>
                            {contact.available24x7 ? "24/7" : "Limited Hours"}
                          </Badge>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 mb-2">{contact.number}</p>
                        <p className="text-gray-600 mb-2">{contact.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{contact.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{contact.available24x7 ? "Always Available" : "Check Hours"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyNumber(contact.number)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => makeCall(contact.number)}
                      >
                        <PhoneCall className="w-4 h-4 mr-2" />
                        Call
                      </Button>
                      {contact.website && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(contact.website, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredContacts.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No contacts found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
              <Button onClick={() => {
                setSearchTerm("")
                setSelectedCategory("all")
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Important Information */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Important Emergency Information</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">When to Call Emergency Services:</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Life-threatening situations</li>
                <li>• Serious injuries or medical emergencies</li>
                <li>• Fires or explosions</li>
                <li>• Crimes in progress</li>
                <li>• Natural disasters</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">What to Do When Calling:</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Stay calm and speak clearly</li>
                <li>• State your name and location</li>
                <li>• Describe the emergency situation</li>
                <li>• Follow the operator's instructions</li>
                <li>• Don't hang up until told to do so</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}