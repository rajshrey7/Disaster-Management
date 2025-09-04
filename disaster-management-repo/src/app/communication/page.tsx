"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { 
  MessageSquare, 
  Users, 
  Phone, 
  Video, 
  Send, 
  Paperclip,
  Search,
  Bell,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Building,
  Shield,
  Heart,
  Zap,
  MoreVertical,
  PhoneCall,
  VideoCamera,
  Mic,
  MicOff,
  PhoneOff
} from "lucide-react"

interface Message {
  id: string
  sender: string
  senderType: 'student' | 'teacher' | 'admin' | 'emergency'
  content: string
  timestamp: Date
  type: 'text' | 'emergency' | 'alert' | 'system'
  priority?: 'low' | 'medium' | 'high' | 'critical'
}

interface User {
  id: string
  name: string
  role: 'student' | 'teacher' | 'admin' | 'emergency_responder'
  status: 'online' | 'offline' | 'busy' | 'emergency'
  location?: string
  lastSeen?: Date
}

export default function CommunicationPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("chat")
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [isInCall, setIsInCall] = useState(false)
  const [callType, setCallType] = useState<'audio' | 'video' | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const navigateToDashboard = () => {
    router.push('/dashboard')
  }

  const navigateToAlerts = () => {
    router.push('/alerts')
  }

  const navigateToContacts = () => {
    router.push('/contacts')
  }

  // Mock users
  const users: User[] = [
    {
      id: "1",
      name: "Rajesh Kumar",
      role: "student",
      status: "online",
      location: "Classroom A-101",
      lastSeen: new Date()
    },
    {
      id: "2",
      name: "Priya Sharma",
      role: "teacher",
      status: "online",
      location: "Staff Room",
      lastSeen: new Date()
    },
    {
      id: "3",
      name: "Dr. Anand Patel",
      role: "admin",
      status: "busy",
      location: "Principal Office",
      lastSeen: new Date()
    },
    {
      id: "4",
      name: "Emergency Response Team",
      role: "emergency_responder",
      status: "online",
      location: "Command Center",
      lastSeen: new Date()
    },
    {
      id: "5",
      name: "Sunita Reddy",
      role: "student",
      status: "offline",
      location: "Library",
      lastSeen: new Date(Date.now() - 30 * 60 * 1000)
    }
  ]

  // Initialize with some messages
  useEffect(() => {
    const initialMessages: Message[] = [
      {
        id: "1",
        sender: "System",
        senderType: "system",
        content: "Emergency communication system activated. All users can now communicate in real-time.",
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        type: "system"
      },
      {
        id: "2",
        sender: "Priya Sharma",
        senderType: "teacher",
        content: "All students please report to your designated assembly points immediately.",
        timestamp: new Date(Date.now() - 8 * 60 * 1000),
        type: "text"
      },
      {
        id: "3",
        sender: "Emergency Response Team",
        senderType: "emergency",
        content: "🚨 EMERGENCY ALERT: Earthquake drill in progress. Follow safety protocols.",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        type: "emergency",
        priority: "high"
      },
      {
        id: "4",
        sender: "Rajesh Kumar",
        senderType: "student",
        content: "I'm in classroom A-101 with 15 students. Everyone is safe and following procedures.",
        timestamp: new Date(Date.now() - 3 * 60 * 1000),
        type: "text"
      },
      {
        id: "5",
        sender: "Dr. Anand Patel",
        senderType: "admin",
        content: "Good response team. Continue to monitor and report any issues.",
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        type: "text"
      }
    ]
    setMessages(initialMessages)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const sendMessage = () => {
    if (newMessage.trim() === "") return

    const message: Message = {
      id: Date.now().toString(),
      sender: "You",
      senderType: "student",
      content: newMessage,
      timestamp: new Date(),
      type: "text"
    }

    setMessages([...messages, message])
    setNewMessage("")

    // Simulate response after a delay
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        sender: "Emergency Response Team",
        senderType: "emergency",
        content: "Message received. We are monitoring the situation.",
        timestamp: new Date(),
        type: "text"
      }
      setMessages(prev => [...prev, response])
    }, 2000)
  }

  const sendEmergencyAlert = () => {
    const alert: Message = {
      id: Date.now().toString(),
      sender: "You",
      senderType: "student",
      content: "🚨 EMERGENCY: Need immediate assistance!",
      timestamp: new Date(),
      type: "emergency",
      priority: "critical"
    }
    setMessages([...messages, alert])
  }

  const startCall = (type: 'audio' | 'video') => {
    setCallType(type)
    setIsInCall(true)
  }

  const endCall = () => {
    setIsInCall(false)
    setCallType(null)
    setIsMuted(false)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'busy': return 'bg-yellow-500'
      case 'emergency': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getRoleIcon = (role: User['role']) => {
    switch (role) {
      case 'student': return User
      case 'teacher': return Users
      case 'admin': return Building
      case 'emergency_responder': return Shield
      default: return User
    }
  }

  const getMessageColor = (type: Message['type']) => {
    switch (type) {
      case 'emergency': return 'bg-red-50 border-red-200'
      case 'alert': return 'bg-yellow-50 border-yellow-200'
      case 'system': return 'bg-blue-50 border-blue-200'
      default: return 'bg-white border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Emergency Communication</h1>
                <p className="text-sm text-gray-600">Real-time coordination during emergencies</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">System Active</span>
              </div>
              <Button variant="outline" onClick={navigateToDashboard}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Call Overlay */}
        {isInCall && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                {callType === 'video' ? (
                  <VideoCamera className="w-12 h-12" />
                ) : (
                  <PhoneCall className="w-12 h-12" />
                )}
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {callType === 'video' ? 'Video Call' : 'Audio Call'}
              </h2>
              <p className="text-gray-300 mb-8">Connected to Emergency Response Team</p>
              
              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={toggleMute}
                  className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                >
                  {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </Button>
                <Button
                  variant="destructive"
                  size="lg"
                  onClick={endCall}
                >
                  <PhoneOff className="w-6 h-6 mr-2" />
                  End Call
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Communication Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u => u.status === 'online').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{messages.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Emergency Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {messages.filter(m => m.type === 'emergency').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Active</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Users List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Active Users
                  <Badge variant="secondary">
                    {users.filter(u => u.status !== 'offline').length}
                  </Badge>
                </CardTitle>
                <CardDescription>Online and available users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {users.filter(u => u.status !== 'offline').map((user) => {
                  const RoleIcon = getRoleIcon(user.role)
                  return (
                    <div
                      key={user.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 ${
                        selectedUser === user.id ? 'bg-blue-50 border border-blue-200' : ''
                      }`}
                      onClick={() => setSelectedUser(user.id)}
                    >
                      <div className="relative">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <RoleIcon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(user.status)}`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.location}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm" onClick={(e) => {
                          e.stopPropagation()
                          startCall('audio')
                        }}>
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={(e) => {
                          e.stopPropagation()
                          startCall('video')
                        }}>
                          <Video className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Communication Area */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="chat">Group Chat</TabsTrigger>
                <TabsTrigger value="emergency">Emergency</TabsTrigger>
                <TabsTrigger value="calls">Calls</TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Emergency Group Chat</CardTitle>
                    <CardDescription>
                      Real-time communication with all users in the emergency network
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Messages */}
                      <div className="h-96 overflow-y-auto space-y-3 border rounded-lg p-4">
                        {messages.map((message) => {
                          const isEmergency = message.type === 'emergency'
                          const isSystem = message.type === 'system'
                          
                          return (
                            <div
                              key={message.id}
                              className={`p-3 rounded-lg border ${getMessageColor(message.type)} ${
                                message.sender === 'You' ? 'ml-12' : 'mr-12'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-sm">
                                    {message.sender}
                                  </span>
                                  {message.senderType === 'emergency' && (
                                    <Shield className="w-3 h-3 text-red-500" />
                                  )}
                                  {isEmergency && (
                                    <Badge variant="destructive" className="text-xs">
                                      EMERGENCY
                                    </Badge>
                                  )}
                                  {isSystem && (
                                    <Badge variant="outline" className="text-xs">
                                      SYSTEM
                                    </Badge>
                                  )}
                                </div>
                                <span className="text-xs text-gray-500">
                                  {formatTime(message.timestamp)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">{message.content}</p>
                            </div>
                          )
                        })}
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Input Area */}
                      <div className="flex items-center space-x-2">
                        <Input
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          className="flex-1"
                        />
                        <Button variant="outline" size="sm">
                          <Paperclip className="w-4 h-4" />
                        </Button>
                        <Button onClick={sendMessage}>
                          <Send className="w-4 h-4 mr-2" />
                          Send
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="emergency" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                        Emergency Protocols
                      </CardTitle>
                      <CardDescription>
                        Quick access to emergency procedures
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="p-3 border border-red-200 rounded-lg bg-red-50">
                        <h4 className="font-medium text-red-800 mb-1">Active Shooter</h4>
                        <p className="text-sm text-red-700">Run, Hide, Fight protocol</p>
                        <Button size="sm" variant="outline" className="mt-2">
                          View Protocol
                        </Button>
                      </div>
                      <div className="p-3 border border-orange-200 rounded-lg bg-orange-50">
                        <h4 className="font-medium text-orange-800 mb-1">Fire Emergency</h4>
                        <p className="text-sm text-orange-700">Evacuation procedures</p>
                        <Button size="sm" variant="outline" className="mt-2">
                          View Protocol
                        </Button>
                      </div>
                      <div className="p-3 border border-blue-200 rounded-lg bg-blue-50">
                        <h4 className="font-medium text-blue-800 mb-1">Medical Emergency</h4>
                        <p className="text-sm text-blue-700">First aid response</p>
                        <Button size="sm" variant="outline" className="mt-2">
                          View Protocol
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Emergency Actions</CardTitle>
                      <CardDescription>
                        Quick actions for emergency situations
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button
                        variant="destructive"
                        className="w-full justify-start"
                        onClick={sendEmergencyAlert}
                      >
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Send Emergency Alert
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => startCall('audio')}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call Emergency Services
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={navigateToAlerts}
                      >
                        <Bell className="w-4 h-4 mr-2" />
                        View Active Alerts
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={navigateToContacts}
                      >
                        <PhoneCall className="w-4 h-4 mr-2" />
                        Emergency Contacts
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Emergency Broadcast</CardTitle>
                    <CardDescription>
                      Send emergency notifications to all users
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Broadcast Type</label>
                          <select className="w-full p-2 border border-gray-300 rounded-lg">
                            <option>General Emergency</option>
                            <option>Evacuation Notice</option>
                            <option>Lockdown Alert</option>
                            <option>Weather Emergency</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Priority Level</label>
                          <select className="w-full p-2 border border-gray-300 rounded-lg">
                            <option>High</option>
                            <option>Critical</option>
                            <option>Medium</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Message</label>
                        <textarea
                          className="w-full p-3 border border-gray-300 rounded-lg h-24"
                          placeholder="Enter emergency broadcast message..."
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="destructive">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Send Broadcast
                        </Button>
                        <Button variant="outline">
                          Test Message
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="calls" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Call Actions</CardTitle>
                      <CardDescription>
                        Start emergency calls with key contacts
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button
                        size="lg"
                        className="w-full justify-start"
                        onClick={() => startCall('audio')}
                      >
                        <Phone className="w-5 h-5 mr-2" />
                        Audio Call to Emergency Team
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => startCall('video')}
                      >
                        <Video className="w-5 h-5 mr-2" />
                        Video Call to Emergency Team
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => window.open('tel:112', '_self')}
                      >
                        <PhoneCall className="w-5 h-5 mr-2" />
                        Call National Emergency (112)
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Call History</CardTitle>
                      <CardDescription>
                        Recent emergency calls and communications
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Phone className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">Emergency Response Team</p>
                            <p className="text-sm text-gray-500">Audio call • 5 min ago</p>
                          </div>
                        </div>
                        <Badge variant="secondary">Completed</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Video className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">Dr. Anand Patel</p>
                            <p className="text-sm text-gray-500">Video call • 1 hour ago</p>
                          </div>
                        </div>
                        <Badge variant="secondary">Completed</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <Phone className="w-5 h-5 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium">Fire Department</p>
                            <p className="text-sm text-gray-500">Emergency call • 2 hours ago</p>
                          </div>
                        </div>
                        <Badge variant="destructive">Emergency</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Conference Call</CardTitle>
                    <CardDescription>
                      Start a group conference call with multiple participants
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Select Participants</label>
                        <div className="space-y-2">
                          {users.filter(u => u.status !== 'offline').map((user) => (
                            <div key={user.id} className="flex items-center space-x-3 p-2 border rounded-lg">
                              <input type="checkbox" className="rounded" />
                              <div className="flex-1">
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.role}</p>
                              </div>
                              <Badge variant="outline">{user.status}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button>
                          <Video className="w-4 h-4 mr-2" />
                          Start Video Conference
                        </Button>
                        <Button variant="outline">
                          <Phone className="w-4 h-4 mr-2" />
                          Start Audio Conference
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}