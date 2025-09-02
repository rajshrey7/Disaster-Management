"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Shield, 
  BookOpen, 
  AlertTriangle, 
  Users, 
  Phone, 
  MapPin, 
  TrendingUp,
  Clock,
  CheckCircle,
  Bell,
  Calendar,
  MessageSquare,
  Video,
  Play,
  Star,
  Navigation,
  Zap,
  Waves,
  Thermometer,
  Wind,
  PhoneCall,
  ExternalLink,
  Cloud
} from "lucide-react"

export default function PreviewPage() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data for demonstration
  const stats = {
    totalModules: 6,
    completedModules: 4,
    totalDrills: 3,
    completedDrills: 2,
    overallProgress: 67,
    activeUsers: 156,
    emergencyContacts: 12,
    activeAlerts: 3
  }

  const modules = [
    {
      title: "Earthquake Safety",
      description: "Learn essential earthquake preparedness",
      difficulty: "Beginner",
      progress: 100,
      icon: AlertTriangle,
      color: "red"
    },
    {
      title: "Fire Safety",
      description: "Fire prevention and evacuation procedures",
      difficulty: "Beginner", 
      progress: 100,
      icon: AlertTriangle,
      color: "orange"
    },
    {
      title: "Flood Safety",
      description: "Understanding flood risks and safety measures",
      difficulty: "Intermediate",
      progress: 60,
      icon: Shield,
      color: "blue"
    },
    {
      title: "First Aid",
      description: "Basic first aid and medical emergency response",
      difficulty: "Beginner",
      progress: 80,
      icon: Users,
      color: "green"
    }
  ]

  const drills = [
    {
      title: "Earthquake Simulation",
      description: "Practice drop, cover, and hold procedures",
      duration: "15 min",
      difficulty: "Beginner",
      icon: AlertTriangle,
      color: "red"
    },
    {
      title: "Fire Evacuation",
      description: "Learn proper evacuation routes",
      duration: "20 min", 
      difficulty: "Beginner",
      icon: AlertTriangle,
      color: "orange"
    },
    {
      title: "Flood Response",
      description: "Practice flood safety measures",
      duration: "25 min",
      difficulty: "Intermediate",
      icon: Waves,
      color: "blue"
    }
  ]

  const alerts = [
    {
      title: "Heavy Rainfall Warning",
      description: "Heavy rainfall expected in Mumbai area",
      severity: "High",
      region: "Mumbai",
      time: "2 hours ago",
      icon: Cloud,
      color: "blue"
    },
    {
      title: "Thunderstorm Alert",
      description: "Thunderstorms expected in Delhi",
      severity: "Medium",
      region: "Delhi",
      time: "5 hours ago",
      icon: Zap,
      color: "yellow"
    },
    {
      title: "Heat Wave Alert",
      description: "Severe heat wave in Ahmedabad",
      severity: "High",
      region: "Ahmedabad",
      time: "8 hours ago",
      icon: Thermometer,
      color: "red"
    }
  ]

  const contacts = [
    {
      name: "National Emergency",
      number: "112",
      category: "National",
      description: "All-in-one emergency number"
    },
    {
      name: "Police",
      number: "100", 
      category: "Police",
      description: "Police assistance"
    },
    {
      name: "Fire Department",
      number: "101",
      category: "Fire",
      description: "Fire emergencies"
    },
    {
      name: "Ambulance",
      number: "108",
      category: "Medical",
      description: "Emergency medical services"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Disaster Management Platform</h1>
                <p className="text-sm text-gray-600">Platform Preview - All Features Working</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-600 border-green-600">
                ✅ System Active
              </Badge>
              <Button onClick={() => window.location.href = '/'}>
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Learning Progress</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.overallProgress}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.activeAlerts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Emergency Contacts</CardTitle>
              <Phone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.emergencyContacts}</div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="learning">Learning</TabsTrigger>
            <TabsTrigger value="drills">Drills</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <BookOpen className="w-10 h-10 text-blue-600 mb-2" />
                  <CardTitle>Interactive Learning</CardTitle>
                  <CardDescription>
                    Comprehensive disaster education modules with progress tracking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Modules: {stats.totalModules}</span>
                      <span>Completed: {stats.completedModules}</span>
                    </div>
                    <Progress value={(stats.completedModules / stats.totalModules) * 100} className="h-2" />
                  </div>
                  <Button className="w-full mt-4" onClick={() => setActiveTab("learning")}>
                    View Learning
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Shield className="w-10 h-10 text-green-600 mb-2" />
                  <CardTitle>Virtual Drills</CardTitle>
                  <CardDescription>
                    Interactive emergency simulations with real-time feedback
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Drills: {stats.totalDrills}</span>
                      <span>Completed: {stats.completedDrills}</span>
                    </div>
                    <Progress value={(stats.completedDrills / stats.totalDrills) * 100} className="h-2" />
                  </div>
                  <Button className="w-full mt-4" onClick={() => setActiveTab("drills")}>
                    Start Drills
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <AlertTriangle className="w-10 h-10 text-red-600 mb-2" />
                  <CardTitle>Emergency Alerts</CardTitle>
                  <CardDescription>
                    Real-time alerts and warnings for your region
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Active Alerts: {stats.activeAlerts}</span>
                      <Badge variant="destructive">Live</Badge>
                    </div>
                  </div>
                  <Button className="w-full mt-4" onClick={() => setActiveTab("alerts")}>
                    View Alerts
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Phone className="w-10 h-10 text-purple-600 mb-2" />
                  <CardTitle>Emergency Contacts</CardTitle>
                  <CardDescription>
                    Quick access to emergency services and contacts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm">
                      {stats.emergencyContacts} contacts available 24/7
                    </div>
                  </div>
                  <Button className="w-full mt-4" onClick={() => window.location.href = '/contacts'}>
                    View Contacts
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <MessageSquare className="w-10 h-10 text-teal-600 mb-2" />
                  <CardTitle>Communication</CardTitle>
                  <CardDescription>
                    Real-time messaging and emergency coordination
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm">
                      Group chat, calls, and emergency broadcasts
                    </div>
                  </div>
                  <Button className="w-full mt-4" onClick={() => setActiveTab("communication")}>
                    Start Chat
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Navigation className="w-10 h-10 text-indigo-600 mb-2" />
                  <CardTitle>Regional Focus</CardTitle>
                  <CardDescription>
                    Location-specific disaster management strategies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm">
                      Tailored for Indian geography and risks
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="learning" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Interactive Learning Modules</h2>
              <p className="text-lg text-gray-600">Master disaster management skills through structured learning</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <module.icon className={`w-10 h-10 text-${module.color}-600 mb-2`} />
                      <Badge variant={module.difficulty === "Beginner" ? "secondary" : "default"}>
                        {module.difficulty}
                      </Badge>
                    </div>
                    <CardTitle>{module.title}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{module.progress}%</span>
                        </div>
                        <Progress value={module.progress} className="h-2" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {module.progress === 100 ? "Completed" : "In Progress"}
                        </span>
                        {module.progress === 100 ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Clock className="w-5 h-5 text-orange-500" />
                        )}
                      </div>
                      <Button className="w-full">
                        {module.progress === 100 ? "Review" : "Continue"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="drills" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Virtual Emergency Drills</h2>
              <p className="text-lg text-gray-600">Practice life-saving emergency procedures in a safe environment</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drills.map((drill, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <drill.icon className={`w-10 h-10 text-${drill.color}-600 mb-2`} />
                      <Badge variant="outline">{drill.duration}</Badge>
                    </div>
                    <CardTitle>{drill.title}</CardTitle>
                    <CardDescription>{drill.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Difficulty: {drill.difficulty}</span>
                        <Badge variant={drill.difficulty === "Beginner" ? "secondary" : "default"}>
                          {drill.difficulty}
                        </Badge>
                      </div>
                      <Button className="w-full">
                        <Play className="w-4 h-4 mr-2" />
                        Start Drill
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Real-time Emergency Alerts</h2>
              <p className="text-lg text-gray-600">Stay informed about emergencies in your region</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {alerts.map((alert, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow border-l-4 border-l-red-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <alert.icon className={`w-8 h-8 text-${alert.color}-600`} />
                      <Badge variant={alert.severity === "High" ? "destructive" : "default"}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{alert.title}</CardTitle>
                    <CardDescription>{alert.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{alert.region}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{alert.time}</span>
                      </div>
                    </div>
                    <Button className="w-full mt-4" variant="outline">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="communication" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Emergency Communication</h2>
              <p className="text-lg text-gray-600">Real-time coordination during emergencies</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                    Group Chat
                  </CardTitle>
                  <CardDescription>
                    Real-time messaging with emergency responders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium">Emergency Response Team</div>
                      <div className="text-xs text-gray-600">All students report to assembly points</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm font-medium">You</div>
                      <div className="text-xs text-gray-600">On my way to assembly point</div>
                    </div>
                    <Button className="w-full">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Open Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Video className="w-5 h-5 mr-2 text-green-600" />
                    Emergency Calls
                  </CardTitle>
                  <CardDescription>
                    Audio/video calls with emergency services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Emergency Response Team</div>
                        <div className="text-sm text-gray-600">Available for call</div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Video className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <Button className="w-full">
                      <PhoneCall className="w-4 h-4 mr-2" />
                      Start Emergency Call
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Feature Summary */}
        <div className="mt-12 bg-white rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Platform Features Summary</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">6 Learning Modules</h3>
              <p className="text-sm text-gray-600">Comprehensive disaster education</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">3 Virtual Drills</h3>
              <p className="text-sm text-gray-600">Interactive emergency simulations</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="font-semibold mb-2">Real-time Alerts</h3>
              <p className="text-sm text-gray-600">Region-specific emergency notifications</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">12 Emergency Contacts</h3>
              <p className="text-sm text-gray-600">Quick access to emergency services</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Experience the complete disaster management platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => window.location.href = '/'}>
              Go to Home Page
            </Button>
            <Button size="lg" variant="outline" onClick={() => window.location.href = '/dashboard'}>
              View Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}