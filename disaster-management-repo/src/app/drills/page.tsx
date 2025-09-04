"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { 
  Shield, 
  AlertTriangle, 
  Play, 
  Pause, 
  RotateCcw,
  CheckCircle,
  Clock,
  Timer,
  Target,
  Users,
  MapPin,
  Phone,
  Star,
  ArrowRight,
  ArrowLeft
} from "lucide-react"

export default function DrillsPage() {
  const router = useRouter()
  const [activeDrill, setActiveDrill] = useState<string | null>(null)
  const [drillStatus, setDrillStatus] = useState<'ready' | 'running' | 'paused' | 'completed'>('ready')
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [score, setScore] = useState(0)
  const [userChoices, setUserChoices] = useState<string[]>([])

  const navigateToDashboard = () => {
    router.push('/dashboard')
  }

  const drills = [
    {
      id: "earthquake",
      title: "Earthquake Simulation",
      description: "Practice drop, cover, and hold procedures during an earthquake",
      duration: "15 min",
      difficulty: "Beginner",
      icon: AlertTriangle,
      color: "red",
      steps: [
        {
          title: "Initial Tremor Detected",
          description: "You feel the ground shaking. What's your first action?",
          choices: [
            { text: "Drop to the ground immediately", correct: true, points: 10 },
            { text: "Run outside", correct: false, points: 0 },
            { text: "Call for help", correct: false, points: 0 },
            { text: "Stand in doorway", correct: false, points: 5 }
          ],
          feedback: "Drop, cover, and hold is the correct first action during an earthquake."
        },
        {
          title: "Take Cover",
          description: "You've dropped to the ground. Where should you take cover?",
          choices: [
            { text: "Under a sturdy table or desk", correct: true, points: 10 },
            { text: "Next to a window", correct: false, points: 0 },
            { text: "Under a bed", correct: false, points: 5 },
            { text: "In the bathroom", correct: false, points: 5 }
          ],
          feedback: "Under sturdy furniture provides the best protection from falling objects."
        },
        {
          title: "Hold On",
          description: "You're under cover. What should you do now?",
          choices: [
            { text: "Hold on to your shelter and protect your head", correct: true, points: 10 },
            { text: "Try to move to a safer location", correct: false, points: 0 },
            { text: "Call emergency services", correct: false, points: 0 },
            { text: "Check on others", correct: false, points: 5 }
          ],
          feedback: "Hold on to your shelter until the shaking stops completely."
        },
        {
          title: "After Shaking Stops",
          description: "The earthquake has stopped. What's your next action?",
          choices: [
            { text: "Carefully evacuate the building", correct: true, points: 10 },
            { text: "Return to normal activities", correct: false, points: 0 },
            { text: "Use elevators to exit", correct: false, points: 0 },
            { text: "Wait for instructions", correct: false, points: 5 }
          ],
          feedback: "Evacuate carefully using stairs, avoiding elevators and damaged areas."
        }
      ]
    },
    {
      id: "fire",
      title: "Fire Evacuation Drill",
      description: "Learn proper evacuation routes and procedures during a fire",
      duration: "20 min",
      difficulty: "Beginner",
      icon: AlertTriangle,
      color: "orange",
      steps: [
        {
          title: "Fire Alarm Sounds",
          description: "You hear the fire alarm. What's your first action?",
          choices: [
            { text: "Evacuate immediately via nearest exit", correct: true, points: 10 },
            { text: "Collect your belongings", correct: false, points: 0 },
            { text: "Call the fire department", correct: false, points: 0 },
            { text: "Wait for others", correct: false, points: 5 }
          ],
          feedback: "Immediate evacuation is the priority when you hear a fire alarm."
        },
        {
          title: "Checking Doors",
          description: "You reach a closed door. How do you check if it's safe?",
          choices: [
            { text: "Feel the door with the back of your hand", correct: true, points: 10 },
            { text: "Open it immediately", correct: false, points: 0 },
            { text: "Look through the keyhole", correct: false, points: 5 },
            { text: "Wait for help", correct: false, points: 0 }
          ],
          feedback: "Always check doors for heat before opening during a fire."
        },
        {
          title: "Smoke Encounter",
          description: "You encounter heavy smoke. What should you do?",
          choices: [
            { text: "Stay low and crawl to safety", correct: true, points: 10 },
            { text: "Run through quickly", correct: false, points: 0 },
            { text: "Wait for smoke to clear", correct: false, points: 0 },
            { text: "Use a wet cloth to cover face", correct: false, points: 5 }
          ],
          feedback: "Stay low where the air is clearer and crawl to safety."
        },
        {
          title: "Assembly Point",
          description: "You've exited the building. Where should you go?",
          choices: [
            { text: "Go to the designated assembly point", correct: true, points: 10 },
            { text: "Return to get belongings", correct: false, points: 0 },
            { text: "Go home", correct: false, points: 0 },
            { text: "Wait by the entrance", correct: false, points: 5 }
          ],
          feedback: "Always proceed to the designated assembly point for headcount."
        }
      ]
    },
    {
      id: "flood",
      title: "Flood Response Drill",
      description: "Practice flood safety measures and evacuation planning",
      duration: "25 min",
      difficulty: "Intermediate",
      icon: Shield,
      color: "blue",
      steps: [
        {
          title: "Flood Warning Received",
          description: "You receive a flood warning for your area. What's your first action?",
          choices: [
            { text: "Move to higher ground immediately", correct: true, points: 10 },
            { text: "Wait to see if water rises", correct: false, points: 0 },
            { text: "Board up windows", correct: false, points: 0 },
            { text: "Call neighbors", correct: false, points: 5 }
          ],
          feedback: "Move to higher ground immediately when a flood warning is issued."
        },
        {
          title: "Evacuation Preparation",
          description: "What should you take with you when evacuating?",
          choices: [
            { text: "Emergency kit and important documents", correct: true, points: 10 },
            { text: "All your belongings", correct: false, points: 0 },
            { text: "Just your phone", correct: false, points: 0 },
            { text: "Food and water only", correct: false, points: 5 }
          ],
          feedback: "Take your emergency kit, important documents, and essential medications."
        },
        {
          title: "Walking in Flood Water",
          description: "You must walk through flood water. What's important to remember?",
          choices: [
            { text: "Walk slowly and test ground stability", correct: true, points: 10 },
            { text: "Run through quickly", correct: false, points: 0 },
            { text: "Use a stick to test depth", correct: false, points: 5 },
            { text: "Wait for rescue", correct: false, points: 0 }
          ],
          feedback: "Walk slowly and carefully, testing the ground with a stick if possible."
        },
        {
          title: "Vehicle in Flood",
          description: "Your vehicle stalls in flood water. What should you do?",
          choices: [
            { text: "Abandon vehicle and move to higher ground", correct: true, points: 10 },
            { text: "Try to restart the engine", correct: false, points: 0 },
            { text: "Wait for help in the vehicle", correct: false, points: 0 },
            { text: "Push the vehicle", correct: false, points: 0 }
          ],
          feedback: "Abandon the vehicle immediately and move to higher ground."
        }
      ]
    }
  ]

  const currentDrill = drills.find(d => d.id === activeDrill)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (drillStatus === 'running') {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [drillStatus])

  const startDrill = (drillId: string) => {
    setActiveDrill(drillId)
    setDrillStatus('ready')
    setTimeElapsed(0)
    setCurrentStep(0)
    setScore(0)
    setUserChoices([])
  }

  const beginDrill = () => {
    setDrillStatus('running')
  }

  const pauseDrill = () => {
    setDrillStatus('paused')
  }

  const resumeDrill = () => {
    setDrillStatus('running')
  }

  const makeChoice = (choiceIndex: number) => {
    if (!currentDrill) return

    const currentStepData = currentDrill.steps[currentStep]
    const choice = currentStepData.choices[choiceIndex]
    
    setUserChoices([...userChoices, choice.text])
    setScore(prev => prev + choice.points)

    if (currentStep < currentDrill.steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      setDrillStatus('completed')
    }
  }

  const restartDrill = () => {
    setDrillStatus('ready')
    setTimeElapsed(0)
    setCurrentStep(0)
    setScore(0)
    setUserChoices([])
  }

  const exitDrill = () => {
    setActiveDrill(null)
    setDrillStatus('ready')
    setTimeElapsed(0)
    setCurrentStep(0)
    setScore(0)
    setUserChoices([])
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (activeDrill && currentDrill) {
    const currentStepData = currentDrill.steps[currentStep]
    const progress = ((currentStep + 1) / currentDrill.steps.length) * 100

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" onClick={exitDrill}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Exit Drill
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{currentDrill.title}</h1>
                  <p className="text-sm text-gray-600">
                    Step {currentStep + 1} of {currentDrill.steps.length}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant={currentDrill.difficulty === "Beginner" ? "secondary" : "default"}>
                  {currentDrill.difficulty}
                </Badge>
                <div className="flex items-center space-x-2">
                  <Timer className="w-4 h-4" />
                  <span className="text-sm font-medium">{formatTime(timeElapsed)}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Drill Progress</span>
                <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {drillStatus === 'ready' && (
              <Card className="mb-8">
                <CardHeader className="text-center">
                  <currentDrill.icon className={`w-16 h-16 text-${currentDrill.color}-600 mx-auto mb-4`} />
                  <CardTitle className="text-2xl">{currentDrill.title}</CardTitle>
                  <CardDescription className="text-lg">
                    {currentDrill.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-2">
                        {currentDrill.steps.length}
                      </div>
                      <div className="text-sm text-gray-600">Steps</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-2">
                        {currentDrill.duration}
                      </div>
                      <div className="text-sm text-gray-600">Duration</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-2">
                        {currentDrill.difficulty}
                      </div>
                      <div className="text-sm text-gray-600">Difficulty</div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-6 mb-6">
                    <h3 className="font-semibold mb-4">What you'll learn:</h3>
                    <ul className="text-left space-y-2">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Proper emergency response procedures</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Quick decision-making under pressure</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Life-saving safety protocols</span>
                      </li>
                    </ul>
                  </div>

                  <Button size="lg" onClick={beginDrill}>
                    <Play className="w-5 h-5 mr-2" />
                    Start Drill
                  </Button>
                </CardContent>
              </Card>
            )}

            {(drillStatus === 'running' || drillStatus === 'paused') && (
              <Card className="mb-8">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{currentStepData.title}</CardTitle>
                      <CardDescription className="text-lg mt-2">
                        {currentStepData.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      {drillStatus === 'running' ? (
                        <Button variant="outline" size="sm" onClick={pauseDrill}>
                          <Pause className="w-4 h-4 mr-2" />
                          Pause
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" onClick={resumeDrill}>
                          <Play className="w-4 h-4 mr-2" />
                          Resume
                        </Button>
                      )}
                      <div className="text-sm font-medium">
                        Score: {score}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentStepData.choices.map((choice, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full h-auto p-6 text-left justify-start hover:bg-blue-50"
                        onClick={() => makeChoice(index)}
                        disabled={drillStatus === 'paused'}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="text-base">{choice.text}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {drillStatus === 'completed' && (
              <Card className="mb-8">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl">Drill Completed!</CardTitle>
                  <CardDescription className="text-lg">
                    Congratulations on completing the {currentDrill.title}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-2">
                        {score}
                      </div>
                      <div className="text-sm text-gray-600">Final Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-2">
                        {formatTime(timeElapsed)}
                      </div>
                      <div className="text-sm text-gray-600">Time Taken</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-2">
                        {Math.round((score / (currentDrill.steps.length * 10)) * 100)}%
                      </div>
                      <div className="text-sm text-gray-600">Accuracy</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h3 className="font-semibold mb-4">Performance Summary:</h3>
                    <div className="space-y-3">
                      {currentDrill.steps.map((step, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium">
                              {index + 1}
                            </div>
                            <span className="text-sm font-medium">{step.title}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">{userChoices[index]}</span>
                            <Star className="w-4 h-4 text-yellow-500" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-center space-x-4">
                    <Button variant="outline" onClick={restartDrill}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Restart Drill
                    </Button>
                    <Button onClick={exitDrill}>
                      Back to Drills
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
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
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Virtual Emergency Drills</h1>
                <p className="text-sm text-gray-600">Practice life-saving emergency procedures</p>
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
              <CardTitle className="text-sm font-medium">Available Drills</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{drills.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Score</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Practice</CardTitle>
              <Timer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.5h</div>
            </CardContent>
          </Card>
        </div>

        {/* Drill Categories */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList>
            <TabsTrigger value="all">All Drills</TabsTrigger>
            <TabsTrigger value="beginner">Beginner</TabsTrigger>
            <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drills.map((drill) => (
                <Card key={drill.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <drill.icon className={`w-10 h-10 text-${drill.color}-600 mb-2`} />
                      <Badge variant={drill.difficulty === "Beginner" ? "secondary" : "default"}>
                        {drill.difficulty}
                      </Badge>
                    </div>
                    <CardTitle>{drill.title}</CardTitle>
                    <CardDescription>{drill.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{drill.duration}</span>
                        <span>{drill.steps.length} steps</span>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Target className="w-4 h-4" />
                          <span>Interactive scenario-based training</span>
                        </div>
                      </div>

                      <Button 
                        className="w-full" 
                        onClick={() => startDrill(drill.id)}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Drill
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="beginner" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drills.filter(d => d.difficulty === "Beginner").map((drill) => (
                <Card key={drill.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <drill.icon className={`w-10 h-10 text-${drill.color}-600 mb-2`} />
                      <Badge variant="secondary">Beginner</Badge>
                    </div>
                    <CardTitle>{drill.title}</CardTitle>
                    <CardDescription>{drill.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{drill.duration}</span>
                        <span>{drill.steps.length} steps</span>
                      </div>
                      
                      <Button 
                        className="w-full" 
                        onClick={() => startDrill(drill.id)}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Drill
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="intermediate" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drills.filter(d => d.difficulty === "Intermediate").map((drill) => (
                <Card key={drill.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <drill.icon className={`w-10 h-10 text-${drill.color}-600 mb-2`} />
                      <Badge variant="default">Intermediate</Badge>
                    </div>
                    <CardTitle>{drill.title}</CardTitle>
                    <CardDescription>{drill.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{drill.duration}</span>
                        <span>{drill.steps.length} steps</span>
                      </div>
                      
                      <Button 
                        className="w-full" 
                        onClick={() => startDrill(drill.id)}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Drill
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Completed Drills</h3>
              <p className="text-gray-600 mb-6">You haven't completed any drills yet. Start practicing!</p>
              <Button onClick={() => startDrill(drills[0].id)}>
                Start Your First Drill
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}