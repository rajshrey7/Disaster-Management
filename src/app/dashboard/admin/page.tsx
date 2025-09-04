"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  BookOpen, 
  Shield, 
  AlertTriangle,
  Download,
  RefreshCw,
  Calendar,
  MapPin,
  Target,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react"
import { ImpactMeasurementService } from "@/lib/impact-measurement"
import { RegionalContentEngine } from "@/lib/regional-content-engine"
import { WeatherAlertService } from "@/lib/weather-service"

interface KPIData {
  id: string
  name: string
  description: string
  category: 'learning' | 'drills' | 'engagement' | 'preparedness' | 'system'
  unit: string
  targetValue?: number
  currentValue: number
  changePercentage: number
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  lastUpdated: Date
}

interface ImpactReport {
  summary: any
  learningOutcomes: any
  drillPerformance: any
  engagementMetrics: any
  preparednessLevel: any
  recommendations: any[]
}

export default function AdminDashboard() {
  const [kpis, setKpis] = useState<KPIData[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState<string>("monthly")
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [selectedInstitution, setSelectedInstitution] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [impactReport, setImpactReport] = useState<ImpactReport | null>(null)
  const [weatherStatus, setWeatherStatus] = useState<any>(null)

  const impactService = ImpactMeasurementService.getInstance()
  const contentEngine = RegionalContentEngine.getInstance()
  const weatherService = WeatherAlertService.getInstance()

  useEffect(() => {
    loadDashboardData()
    loadWeatherStatus()
  }, [selectedPeriod, selectedRegion, selectedInstitution])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      const kpiData = await impactService.getKPIDashboard(
        selectedInstitution === "all" ? undefined : selectedInstitution,
        selectedRegion === "all" ? undefined : selectedRegion,
        selectedPeriod
      )
      setKpis(kpiData)

      const report = await impactService.generateImpactReport(
        selectedInstitution === "all" ? undefined : selectedInstitution,
        selectedRegion === "all" ? undefined : selectedRegion
      )
      setImpactReport(report)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadWeatherStatus = () => {
    const status = weatherService.getMonitoringStatus()
    setWeatherStatus(status)
  }

  const startWeatherMonitoring = async () => {
    weatherService.startMonitoring(15)
    loadWeatherStatus()
  }

  const stopWeatherMonitoring = () => {
    weatherService.stopMonitoring()
    loadWeatherStatus()
  }

  const exportReport = async () => {
    if (!impactReport) return
    
    const reportData = {
      kpis,
      impactReport,
      generatedAt: new Date().toISOString(),
      period: selectedPeriod,
      region: selectedRegion,
      institution: selectedInstitution
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json'
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `impact-report-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getKPIIcon = (category: string) => {
    switch (category) {
      case 'learning': return <BookOpen className="h-4 w-4" />
      case 'drills': return <Shield className="h-4 w-4" />
      case 'engagement': return <Users className="h-4 w-4" />
      case 'preparedness': return <Target className="h-4 w-4" />
      case 'system': return <Activity className="h-4 w-4" />
      default: return <BarChart3 className="h-4 w-4" />
    }
  }

  const getKPIColor = (changePercentage: number) => {
    if (changePercentage > 0) return 'text-green-600'
    if (changePercentage < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const getProgressColor = (current: number, target?: number) => {
    if (!target) return 'bg-blue-600'
    const percentage = (current / target) * 100
    if (percentage >= 90) return 'bg-green-600'
    if (percentage >= 70) return 'bg-yellow-600'
    return 'bg-red-600'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading dashboard...</span>
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
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Impact Measurement & Analytics</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={exportReport}>
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button onClick={loadDashboardData}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="north">North Region</SelectItem>
              <SelectItem value="south">South Region</SelectItem>
              <SelectItem value="east">East Region</SelectItem>
              <SelectItem value="west">West Region</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedInstitution} onValueChange={setSelectedInstitution}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select institution" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Institutions</SelectItem>
              <SelectItem value="school-1">School 1</SelectItem>
              <SelectItem value="school-2">School 2</SelectItem>
              <SelectItem value="college-1">College 1</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="learning">Learning</TabsTrigger>
            <TabsTrigger value="drills">Drills</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Summary Cards */}
            {impactReport && (
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{impactReport.summary.totalUsers.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      +12% from last period
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Modules Completed</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{impactReport.summary.totalModulesCompleted.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      +8% from last period
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Drills Completed</CardTitle>
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{impactReport.summary.totalDrillsCompleted.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      +15% from last period
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Improvement</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+{impactReport.summary.averageImprovement}%</div>
                    <p className="text-xs text-muted-foreground">
                      Learning outcomes
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Preparedness Score</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{impactReport.summary.overallPreparednessScore}/100</div>
                    <p className="text-xs text-muted-foreground">
                      +4.6% from last period
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* KPI Overview */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {kpis.slice(0, 6).map((kpi) => (
                <Card key={kpi.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      {getKPIIcon(kpi.category)}
                      <span className="ml-2">{kpi.name}</span>
                    </CardTitle>
                    <Badge variant="outline">{kpi.period}</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {kpi.currentValue}{kpi.unit === '%' ? '%' : kpi.unit}
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      {kpi.changePercentage !== 0 && (
                        <>
                          {kpi.changePercentage > 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                          <span className={`text-xs ${getKPIColor(kpi.changePercentage)}`}>
                            {kpi.changePercentage > 0 ? '+' : ''}{kpi.changePercentage.toFixed(1)}%
                          </span>
                        </>
                      )}
                    </div>
                    {kpi.targetValue && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Progress</span>
                          <span>{Math.round((kpi.currentValue / kpi.targetValue) * 100)}%</span>
                        </div>
                        <Progress 
                          value={(kpi.currentValue / kpi.targetValue) * 100} 
                          className="h-2"
                        />
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {kpi.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recommendations */}
            {impactReport && impactReport.recommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Recommendations
                  </CardTitle>
                  <CardDescription>Data-driven insights for improvement</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {impactReport.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0">
                        <Badge variant={rec.priority === 'High' ? 'destructive' : rec.priority === 'Medium' ? 'default' : 'secondary'}>
                          {rec.priority}
                        </Badge>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium">{rec.category}</span>
                        </div>
                        <p className="text-sm text-gray-900 mb-2">{rec.recommendation}</p>
                        <p className="text-xs text-gray-600">{rec.impact}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="learning" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {impactReport && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Learning Outcomes</CardTitle>
                      <CardDescription>Pre and post test performance</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Pre-test Average</span>
                        <span className="font-bold">{impactReport.learningOutcomes.preTestAverage}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Post-test Average</span>
                        <span className="font-bold text-green-600">{impactReport.learningOutcomes.postTestAverage}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Improvement</span>
                        <span className="font-bold text-green-600">+{impactReport.learningOutcomes.improvement}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Completion Rate</span>
                        <span className="font-bold">{impactReport.learningOutcomes.completionRate}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Avg Time Spent</span>
                        <span className="font-bold">{impactReport.learningOutcomes.timeSpentAverage} min</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Module Performance</CardTitle>
                      <CardDescription>Top performing modules</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {kpis.filter(k => k.category === 'learning').map((kpi) => (
                        <div key={kpi.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getKPIIcon(kpi.category)}
                            <span className="text-sm">{kpi.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold">{kpi.currentValue}{kpi.unit}</span>
                            {kpi.changePercentage > 0 && (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="drills" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {impactReport && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Drill Performance</CardTitle>
                      <CardDescription>Emergency drill effectiveness</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Pass Rate</span>
                        <span className="font-bold text-green-600">{impactReport.drillPerformance.passRate}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Avg Response Time</span>
                        <span className="font-bold">{impactReport.drillPerformance.averageResponseTime}s</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Avg Score</span>
                        <span className="font-bold">{impactReport.drillPerformance.averageScore}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Improvement Rate</span>
                        <span className="font-bold text-green-600">+{impactReport.drillPerformance.improvementRate}%</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Weather Monitoring</CardTitle>
                      <CardDescription>National alert system status</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Status</span>
                        <Badge variant={weatherStatus?.isMonitoring ? "default" : "secondary"}>
                          {weatherStatus?.isMonitoring ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Interval</span>
                        <span className="font-bold">{weatherStatus?.interval || 'N/A'}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          onClick={startWeatherMonitoring}
                          disabled={weatherStatus?.isMonitoring}
                        >
                          Start Monitoring
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={stopWeatherMonitoring}
                          disabled={!weatherStatus?.isMonitoring}
                        >
                          Stop Monitoring
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {impactReport && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>User Engagement</CardTitle>
                      <CardDescription>Platform usage metrics</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Daily Active Users</span>
                        <span className="font-bold">{impactReport.engagementMetrics.dailyActiveUsers}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Avg Session Duration</span>
                        <span className="font-bold">{impactReport.engagementMetrics.averageSessionDuration} min</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Total Actions</span>
                        <span className="font-bold">{impactReport.engagementMetrics.totalActions.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Peak Activity Time</span>
                        <span className="font-bold">{impactReport.engagementMetrics.mostActiveTime}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Preparedness Level</CardTitle>
                      <CardDescription>Overall disaster readiness</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Overall Score</span>
                        <span className="font-bold">{impactReport.preparednessLevel.overallScore}/100</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Learning Score</span>
                        <span className="font-bold">{impactReport.preparednessLevel.learningScore}/100</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Drill Score</span>
                        <span className="font-bold">{impactReport.preparednessLevel.drillScore}/100</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Awareness Score</span>
                        <span className="font-bold">{impactReport.preparednessLevel.awarenessScore}/100</span>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {kpis.filter(k => k.category === 'system').map((kpi) => (
                <Card key={kpi.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      {getKPIIcon(kpi.category)}
                      <span className="ml-2">{kpi.name}</span>
                    </CardTitle>
                    <Badge variant="outline">{kpi.period}</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {kpi.currentValue}{kpi.unit === '%' ? '%' : kpi.unit}
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      {kpi.changePercentage !== 0 && (
                        <>
                          {kpi.changePercentage > 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                          <span className={`text-xs ${getKPIColor(kpi.changePercentage)}`}>
                            {kpi.changePercentage > 0 ? '+' : ''}{kpi.changePercentage.toFixed(1)}%
                          </span>
                        </>
                      )}
                    </div>
                    {kpi.targetValue && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Target: {kpi.targetValue}{kpi.unit}</span>
                          <span>{Math.round((kpi.currentValue / kpi.targetValue) * 100)}%</span>
                        </div>
                        <Progress 
                          value={(kpi.currentValue / kpi.targetValue) * 100} 
                          className="h-2"
                        />
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {kpi.description}
                    </p>
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