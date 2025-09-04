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
  CheckCircle,
  Clock,
  Play,
  ArrowRight,
  Star
} from "lucide-react"

export default function LearningPage() {
  const router = useRouter()
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [currentLesson, setCurrentLesson] = useState(0)

  const navigateToDashboard = () => {
    router.push('/dashboard')
  }

  const modules = [
    {
      id: "earthquake",
      title: "Earthquake Safety",
      description: "Learn essential earthquake preparedness and response",
      difficulty: "Beginner",
      duration: "45 min",
      lessons: 5,
      completedLessons: 3,
      progress: 60,
      icon: AlertTriangle,
      color: "red",
      lessonsList: [
        { title: "Understanding Earthquakes", duration: "8 min", completed: true },
        { title: "Before an Earthquake", duration: "10 min", completed: true },
        { title: "During an Earthquake", duration: "12 min", completed: true },
        { title: "After an Earthquake", duration: "10 min", completed: false },
        { title: "Practice Scenarios", duration: "5 min", completed: false }
      ]
    },
    {
      id: "flood",
      title: "Flood Safety",
      description: "Understanding flood risks and safety measures",
      difficulty: "Intermediate",
      duration: "60 min",
      lessons: 6,
      completedLessons: 2,
      progress: 33,
      icon: Shield,
      color: "blue",
      lessonsList: [
        { title: "Types of Floods", duration: "10 min", completed: true },
        { title: "Flood Warning Systems", duration: "8 min", completed: true },
        { title: "Preparation Before Floods", duration: "12 min", completed: false },
        { title: "During a Flood", duration: "15 min", completed: false },
        { title: "After Flood Safety", duration: "10 min", completed: false },
        { title: "Flood Recovery", duration: "5 min", completed: false }
      ]
    },
    {
      id: "fire",
      title: "Fire Safety",
      description: "Fire prevention and emergency evacuation procedures",
      difficulty: "Beginner",
      duration: "50 min",
      lessons: 5,
      completedLessons: 5,
      progress: 100,
      icon: AlertTriangle,
      color: "orange",
      lessonsList: [
        { title: "Fire Basics", duration: "8 min", completed: true },
        { title: "Fire Prevention", duration: "10 min", completed: true },
        { title: "Evacuation Procedures", duration: "15 min", completed: true },
        { title: "Fire Extinguishers", duration: "12 min", completed: true },
        { title: "Emergency Response", duration: "5 min", completed: true }
      ]
    },
    {
      id: "firstaid",
      title: "First Aid",
      description: "Basic first aid and medical emergency response",
      difficulty: "Beginner",
      duration: "55 min",
      lessons: 6,
      completedLessons: 1,
      progress: 17,
      icon: Users,
      color: "green",
      lessonsList: [
        { title: "First Aid Basics", duration: "10 min", completed: true },
        { title: "CPR Essentials", duration: "15 min", completed: false },
        { title: "Bleeding Control", duration: "8 min", completed: false },
        { title: "Burn Treatment", duration: "10 min", completed: false },
        { title: "Fractures & Sprains", duration: "7 min", completed: false },
        { title: "Medical Emergencies", duration: "5 min", completed: false }
      ]
    },
    {
      id: "regional",
      title: "Regional Hazards",
      description: "Location-specific disaster risks and protocols",
      difficulty: "Advanced",
      duration: "40 min",
      lessons: 4,
      completedLessons: 0,
      progress: 0,
      icon: MapPin,
      color: "purple",
      lessonsList: [
        { title: "Local Risk Assessment", duration: "12 min", completed: false },
        { title: "Regional Emergency Plans", duration: "10 min", completed: false },
        { title: "Local Resources", duration: "10 min", completed: false },
        { title: "Community Coordination", duration: "8 min", completed: false }
      ]
    },
    {
      id: "communication",
      title: "Emergency Communication",
      description: "Effective communication during disasters",
      difficulty: "Intermediate",
      duration: "35 min",
      lessons: 4,
      completedLessons: 0,
      progress: 0,
      icon: Phone,
      color: "teal",
      lessonsList: [
        { title: "Communication Basics", duration: "8 min", completed: false },
        { title: "Emergency Protocols", duration: "10 min", completed: false },
        { title: "Using Technology", duration: "10 min", completed: false },
        { title: "Coordination Strategies", duration: "7 min", completed: false }
      ]
    }
  ]

  const currentModule = modules.find(m => m.id === selectedModule)

  const startModule = (moduleId: string) => {
    setSelectedModule(moduleId)
    setCurrentLesson(0)
  }

  const nextLesson = () => {
    if (currentModule && currentLesson < currentModule.lessonsList.length - 1) {
      setCurrentLesson(currentLesson + 1)
    }
  }

  const prevLesson = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1)
    }
  }

  const exitModule = () => {
    setSelectedModule(null)
    setCurrentLesson(0)
  }

  if (selectedModule && currentModule) {
    const lesson = currentModule.lessonsList[currentLesson]
    
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" onClick={exitModule}>
                  <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                  Back to Modules
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{currentModule.title}</h1>
                  <p className="text-sm text-gray-600">Lesson {currentLesson + 1} of {currentModule.lessonsList.length}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant={currentModule.difficulty === "Beginner" ? "secondary" : "default"}>
                  {currentModule.difficulty}
                </Badge>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Module Progress</span>
                <span className="text-sm text-gray-600">{currentModule.progress}%</span>
              </div>
              <Progress value={currentModule.progress} className="h-2" />
            </div>

            {/* Lesson Content */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{lesson.title}</CardTitle>
                    <CardDescription className="text-lg mt-2">
                      Duration: {lesson.duration}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    {lesson.completed ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <Clock className="w-6 h-6 text-orange-500" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div className="bg-gray-100 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">Lesson Content</h3>
                    <div className="space-y-4">
                      <p>
                        This interactive lesson will teach you essential skills and knowledge for 
                        {currentModule.title.toLowerCase()}. You'll learn through a combination of 
                        text, images, and interactive elements.
                      </p>
                      <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                        <h4 className="font-medium mb-2">Learning Objectives:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Understand the fundamental concepts</li>
                          <li>Learn practical safety procedures</li>
                          <li>Practice emergency response techniques</li>
                          <li>Apply knowledge to real-world scenarios</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Content Area */}
                  <div className="bg-blue-50 rounded-lg p-6 mb-6">
                    <h4 className="font-medium mb-4">Interactive Exercise</h4>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-700">
                        This section contains interactive elements to reinforce your learning. 
                        In a real implementation, this would include quizzes, simulations, 
                        and hands-on activities.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button variant="outline" className="h-20 flex-col">
                          <Play className="w-6 h-6 mb-2" />
                          Watch Demo
                        </Button>
                        <Button variant="outline" className="h-20 flex-col">
                          <Star className="w-6 h-6 mb-2" />
                          Take Quiz
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Key Points */}
                  <div className="bg-yellow-50 rounded-lg p-6">
                    <h4 className="font-medium mb-4">Key Points to Remember:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Always stay calm during emergencies</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Follow established procedures</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Help others when safe to do so</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Practice makes perfect</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                onClick={prevLesson}
                disabled={currentLesson === 0}
              >
                Previous Lesson
              </Button>
              
              <div className="flex items-center space-x-2">
                {currentModule.lessonsList.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index === currentLesson 
                        ? 'bg-blue-500' 
                        : index < currentLesson 
                          ? 'bg-green-500' 
                          : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <Button onClick={nextLesson}>
                {currentLesson === currentModule.lessonsList.length - 1 
                  ? 'Complete Module' 
                  : 'Next Lesson'
                }
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Interactive Learning Modules</h1>
                <p className="text-sm text-gray-600">Master disaster management skills</p>
              </div>
            </div>
            <Button variant="outline" onClick={navigateToDashboard}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Overview Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Modules</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{modules.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {modules.filter(m => m.progress === 100).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {modules.filter(m => m.progress > 0 && m.progress < 100).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {modules.reduce((sum, m) => sum + m.lessons, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Module Filters */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList>
            <TabsTrigger value="all">All Modules</TabsTrigger>
            <TabsTrigger value="beginner">Beginner</TabsTrigger>
            <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module) => (
                <Card key={module.id} className="hover:shadow-lg transition-shadow cursor-pointer">
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
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{module.duration}</span>
                        <span>{module.lessons} lessons</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{module.progress}%</span>
                        </div>
                        <Progress value={module.progress} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {module.completedLessons}/{module.lessons} completed
                        </span>
                        {module.progress === 100 ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Clock className="w-5 h-5 text-orange-500" />
                        )}
                      </div>

                      <Button 
                        className="w-full" 
                        onClick={() => startModule(module.id)}
                      >
                        {module.progress === 0 ? 'Start Learning' : 
                         module.progress === 100 ? 'Review' : 'Continue'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="beginner" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.filter(m => m.difficulty === "Beginner").map((module) => (
                <Card key={module.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <module.icon className={`w-10 h-10 text-${module.color}-600 mb-2`} />
                      <Badge variant="secondary">Beginner</Badge>
                    </div>
                    <CardTitle>{module.title}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{module.duration}</span>
                        <span>{module.lessons} lessons</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{module.progress}%</span>
                        </div>
                        <Progress value={module.progress} className="h-2" />
                      </div>

                      <Button 
                        className="w-full" 
                        onClick={() => startModule(module.id)}
                      >
                        {module.progress === 0 ? 'Start Learning' : 'Continue'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="intermediate" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.filter(m => m.difficulty === "Intermediate").map((module) => (
                <Card key={module.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <module.icon className={`w-10 h-10 text-${module.color}-600 mb-2`} />
                      <Badge variant="default">Intermediate</Badge>
                    </div>
                    <CardTitle>{module.title}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{module.duration}</span>
                        <span>{module.lessons} lessons</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{module.progress}%</span>
                        </div>
                        <Progress value={module.progress} className="h-2" />
                      </div>

                      <Button 
                        className="w-full" 
                        onClick={() => startModule(module.id)}
                      >
                        {module.progress === 0 ? 'Start Learning' : 'Continue'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.filter(m => m.difficulty === "Advanced").map((module) => (
                <Card key={module.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <module.icon className={`w-10 h-10 text-${module.color}-600 mb-2`} />
                      <Badge variant="destructive">Advanced</Badge>
                    </div>
                    <CardTitle>{module.title}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{module.duration}</span>
                        <span>{module.lessons} lessons</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{module.progress}%</span>
                        </div>
                        <Progress value={module.progress} className="h-2" />
                      </div>

                      <Button 
                        className="w-full" 
                        onClick={() => startModule(module.id)}
                      >
                        {module.progress === 0 ? 'Start Learning' : 'Continue'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}