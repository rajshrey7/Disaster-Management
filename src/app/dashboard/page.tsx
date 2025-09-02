"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { 
  BookOpen, 
  Shield, 
  AlertTriangle, 
  Users, 
  Phone, 
  MapPin, 
  TrendingUp,
  Clock,
  CheckCircle,
  Bell,
  Calendar
} from "lucide-react"

export default function Dashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

  const navigateToAlerts = () => {
    router.push('/alerts')
  }

  const navigateToCommunication = () => {
    router.push('/communication')
  }

  const navigateToLearning = () => {
    router.push('/learning')
  }

  const navigateToDrills = () => {
    router.push('/drills')
  }

  const navigateToContacts = () => {
    router.push('/contacts')
  }

  // Mock data for demonstration
  const userProgress = {
    completedModules: 8,
    totalModules: 12,
    completedDrills: 3,
    totalDrills: 5,
    overallProgress: 67
  }

  const recentActivities = [
    { id: 1, type: "module", title: "Earthquake Safety Basics", completed: true, date: "2 hours ago" },
    { id: 2, type: "drill", title: "Fire Evacuation Drill", completed: true, date: "1 day ago" },
    { id: 3, type: "alert", title: "Flood Warning - Your Region", completed: false, date: "2 days ago" },
    { id: 4, type: "module", title: "First Aid Essentials", completed: false, date: "3 days ago" }
  ]

  const upcomingDrills = [
    { id: 1, title: "Earthquake Simulation", date: "Tomorrow, 10:00 AM", type: "scheduled" },
    { id: 2, title: "Fire Safety Practice", date: "Next Week, 2:00 PM", type: "practice" }
  ]

  const regionalAlerts = [
    { id: 1, type: "flood", severity: "moderate", area: "Your District", message: "Heavy rainfall expected", time: "2 hours ago" },
    { id: 2, type: "weather", severity: "low", area: "City Wide", message: "Thunderstorm warning", time: "5 hours ago" }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Disaster Management Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, Student</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={navigateToAlerts}>
                <Bell className="w-4 h-4 mr-2" />
                Alerts
              </Button>
              <Button size="sm" onClick={navigateToCommunication}>
                <Phone className="w-4 h-4 mr-2" />
                Emergency
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="learning">Learning</TabsTrigger>
            <TabsTrigger value="drills">Drills</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Progress Overview */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userProgress.overallProgress}%</div>
                  <Progress value={userProgress.overallProgress} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    Keep up the great work!
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Modules Completed</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {userProgress.completedModules}/{userProgress.totalModules}
                  </div>
                  <Progress 
                    value={(userProgress.completedModules / userProgress.totalModules) * 100} 
                    className="mt-2" 
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Drills Completed</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {userProgress.completedDrills}/{userProgress.totalDrills}
                  </div>
                  <Progress 
                    value={(userProgress.completedDrills / userProgress.totalDrills) * 100} 
                    className="mt-2" 
                  />
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities & Upcoming Drills */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Your latest learning and drill activities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg border">
                      <div className="flex-shrink-0">
                        {activity.type === "module" && <BookOpen className="w-5 h-5 text-blue-500" />}
                        {activity.type === "drill" && <Shield className="w-5 h-5 text-green-500" />}
                        {activity.type === "alert" && <AlertTriangle className="w-5 h-5 text-red-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-500">{activity.date}</p>
                      </div>
                      <div className="flex-shrink-0">
                        {activity.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Clock className="w-5 h-5 text-orange-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Drills</CardTitle>
                  <CardDescription>Scheduled virtual drills and practices</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingDrills.map((drill) => (
                    <div key={drill.id} className="flex items-center space-x-4 p-3 rounded-lg border">
                      <div className="flex-shrink-0">
                        <Calendar className="w-5 h-5 text-purple-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {drill.title}
                        </p>
                        <p className="text-sm text-gray-500">{drill.date}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <Badge variant={drill.type === "scheduled" ? "default" : "secondary"}>
                          {drill.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Regional Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                  Regional Alerts
                </CardTitle>
                <CardDescription>Important alerts for your area</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {regionalAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center space-x-4 p-4 rounded-lg border-l-4 border-l-red-500 bg-red-50">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant={alert.severity === "moderate" ? "destructive" : "outline"}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-gray-600">{alert.area}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                      <p className="text-xs text-gray-500">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="learning" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <BookOpen className="w-10 h-10 text-blue-600 mb-2" />
                  <CardTitle>Earthquake Safety</CardTitle>
                  <CardDescription>Learn essential earthquake preparedness and response</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Beginner</Badge>
                    <Button size="sm" onClick={navigateToLearning}>Start</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <Shield className="w-10 h-10 text-green-600 mb-2" />
                  <CardTitle>Flood Safety</CardTitle>
                  <CardDescription>Understanding flood risks and safety measures</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Intermediate</Badge>
                    <Button size="sm" onClick={navigateToLearning}>Continue</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <AlertTriangle className="w-10 h-10 text-red-600 mb-2" />
                  <CardTitle>Fire Safety</CardTitle>
                  <CardDescription>Fire prevention and emergency evacuation procedures</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Beginner</Badge>
                    <Button size="sm" onClick={navigateToLearning}>Start</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <Users className="w-10 h-10 text-purple-600 mb-2" />
                  <CardTitle>First Aid</CardTitle>
                  <CardDescription>Basic first aid and medical emergency response</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Beginner</Badge>
                    <Button size="sm" onClick={navigateToLearning}>Start</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <MapPin className="w-10 h-10 text-teal-600 mb-2" />
                  <CardTitle>Regional Hazards</CardTitle>
                  <CardDescription>Location-specific disaster risks and protocols</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Advanced</Badge>
                    <Button size="sm" onClick={navigateToLearning}>Start</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <Phone className="w-10 h-10 text-orange-600 mb-2" />
                  <CardTitle>Emergency Communication</CardTitle>
                  <CardDescription>Effective communication during disasters</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Intermediate</Badge>
                    <Button size="sm" onClick={navigateToLearning}>Start</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="drills" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Available Virtual Drills</CardTitle>
                  <CardDescription>Practice your emergency response skills</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Earthquake Simulation</h4>
                      <Badge variant="outline">15 min</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Practice drop, cover, and hold procedures during an earthquake
                    </p>
                    <Button size="sm" className="w-full" onClick={navigateToDrills}>Start Drill</Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Fire Evacuation</h4>
                      <Badge variant="outline">20 min</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Learn proper evacuation routes and procedures during a fire
                    </p>
                    <Button size="sm" className="w-full" onClick={navigateToDrills}>Start Drill</Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Flood Response</h4>
                      <Badge variant="outline">25 min</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Practice flood safety measures and evacuation planning
                    </p>
                    <Button size="sm" className="w-full" onClick={navigateToDrills}>Start Drill</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Drill History</CardTitle>
                  <CardDescription>Your completed virtual drills</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg bg-green-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Earthquake Drill</h4>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Completed: 2 days ago</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span>Score: 85%</span>
                      <Badge variant="secondary">Passed</Badge>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg bg-green-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Fire Safety Drill</h4>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Completed: 1 week ago</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span>Score: 92%</span>
                      <Badge variant="secondary">Passed</Badge>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg bg-yellow-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">First Aid Practice</h4>
                      <Clock className="w-5 h-5 text-yellow-500" />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">In Progress</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span>Progress: 60%</span>
                      <Button size="sm" variant="outline">Continue</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Alerts</CardTitle>
                  <CardDescription>Current emergency alerts for your region</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border-l-4 border-l-red-500 bg-red-50 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-red-800">Heavy Rainfall Warning</h4>
                      <Badge variant="destructive">High</Badge>
                    </div>
                    <p className="text-sm text-red-700 mb-2">
                      Heavy rainfall expected in your area. Stay indoors and avoid travel.
                    </p>
                    <p className="text-xs text-red-600">Issued: 2 hours ago</p>
                  </div>

                  <div className="p-4 border-l-4 border-l-yellow-500 bg-yellow-50 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-yellow-800">Thunderstorm Alert</h4>
                      <Badge variant="outline">Medium</Badge>
                    </div>
                    <p className="text-sm text-yellow-700 mb-2">
                      Thunderstorms expected this evening. Secure outdoor items.
                    </p>
                    <p className="text-xs text-yellow-600">Issued: 5 hours ago</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Emergency Contacts</CardTitle>
                  <CardDescription>Quick access to emergency services</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">National Emergency</h4>
                        <p className="text-sm text-gray-600">112</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={navigateToContacts}>Call</Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Fire Department</h4>
                        <p className="text-sm text-gray-600">101</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={navigateToContacts}>Call</Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Ambulance</h4>
                        <p className="text-sm text-gray-600">108</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={navigateToContacts}>Call</Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Disaster Management</h4>
                        <p className="text-sm text-gray-600">011-26701700</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={navigateToContacts}>Call</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}