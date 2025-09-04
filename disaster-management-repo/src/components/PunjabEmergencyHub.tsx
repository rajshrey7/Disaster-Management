'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Cloud, 
  AlertTriangle, 
  Phone, 
  MapPin, 
  Clock, 
  Thermometer,
  Droplets,
  Wind,
  Eye,
  Activity,
  Play,
  Pause,
  RotateCcw,
  RefreshCw
} from 'lucide-react';

interface WeatherData {
  city: string;
  district: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainfall: number;
  visibility: number;
  condition: string;
  timestamp: Date;
}

interface EmergencyContact {
  id: string;
  name: string;
  number: string;
  category: string;
  description: string;
  available24x7: boolean;
  location: string;
  website: string;
  state: string;
  district: string;
  city: string;
  responseTime: string;
  coverageArea: string;
  specializations: string[];
}

interface Alert {
  id: string;
  title: string;
  description: string;
  type: string;
  severity: string;
  region: string;
  issuedAt: string;
  expiresAt: string;
  actions: string;
  source: string;
  contact: string;
  affectedAreas: string;
  evacuationRoutes: string;
  shelterLocations: string;
}

interface WeatherMonitorStatus {
  isRunning: boolean;
  lastCheck: string | null;
  citiesMonitored: number;
  thresholds: any;
}

export const PunjabEmergencyHub: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [weatherStatus, setWeatherStatus] = useState<WeatherMonitorStatus | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Punjab districts
  const punjabDistricts = [
    'Ludhiana', 'Amritsar', 'Chandigarh', 'Jalandhar', 'Patiala', 
    'Bathinda', 'Mohali', 'Ferozepur', 'Moga', 'Sangrur'
  ];

  // Fetch weather monitor status
  const fetchWeatherStatus = async () => {
    try {
      const response = await fetch('/api/weather/monitor?action=status');
      if (response.ok) {
        const data = await response.json();
        setWeatherStatus(data.data);
      }
    } catch (error) {
      console.error('Error fetching weather status:', error);
    }
  };

  // Control weather monitoring
  const controlWeatherMonitoring = async (action: string, intervalMinutes?: number) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/weather/monitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, intervalMinutes })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        await fetchWeatherStatus();
      }
    } catch (error) {
      console.error(`Error ${action}ing weather monitoring:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch emergency contacts
  const fetchEmergencyContacts = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedDistrict !== 'all') {
        params.append('district', selectedDistrict);
      }
      params.append('state', 'Punjab');
      
      const response = await fetch(`/api/contacts?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setEmergencyContacts(data.data);
      }
    } catch (error) {
      console.error('Error fetching emergency contacts:', error);
    }
  };

  // Fetch recent alerts
  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/alerts?region=Punjab&limit=10');
      if (response.ok) {
        const data = await response.json();
        setAlerts(data.data);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  // Fetch weather data for a specific city
  const fetchCityWeather = async (cityName: string) => {
    try {
      const response = await fetch(`/api/weather/monitor?action=check-city&city=${cityName}`);
      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          setWeatherData(prev => {
            const filtered = prev.filter(w => w.city !== cityName);
            return [...filtered, data.data];
          });
        }
      }
    } catch (error) {
      console.error(`Error fetching weather for ${cityName}:`, error);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchWeatherStatus();
    fetchEmergencyContacts();
    fetchAlerts();
  }, [selectedDistrict]);

  // Auto-refresh weather status every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchWeatherStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // Auto-refresh alerts every 2 minutes
  useEffect(() => {
    const interval = setInterval(fetchAlerts, 120000);
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity.toUpperCase()) {
      case 'CRITICAL': return 'bg-red-500 text-white';
      case 'HIGH': return 'bg-orange-500 text-white';
      case 'MEDIUM': return 'bg-yellow-500 text-black';
      case 'LOW': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toUpperCase()) {
      case 'POLICE': return '🚔';
      case 'FIRE': return '🚒';
      case 'AMBULANCE': return '🚑';
      case 'HOSPITAL': return '🏥';
      case 'STATE_DISASTER_MANAGEMENT': return '🏛️';
      case 'DISTRICT_EMERGENCY_OPERATIONS': return '🏢';
      case 'CIVIL_DEFENSE': return '🛡️';
      case 'UTILITY_SERVICES': return '⚡';
      case 'TRANSPORT': return '🚌';
      case 'COMMUNICATION': return '📡';
      case 'VOLUNTEER_ORGANIZATIONS': return '🤝';
      default: return '📞';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🚨 Punjab Emergency Hub
          </h1>
          <p className="text-xl text-gray-600">
            Real-time emergency monitoring and response coordination for Punjab State
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <Badge variant="outline" className="text-lg px-4 py-2">
              <MapPin className="h-4 w-4 mr-2" />
              Punjab State
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Clock className="h-4 w-4 mr-2" />
              24/7 Monitoring
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Activity className="h-4 w-4 mr-2" />
              Real-time Alerts
            </Badge>
          </div>
        </div>

        {/* Weather Monitor Control */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-6 w-6" />
              Weather Monitoring System
            </CardTitle>
            <CardDescription>
              Control the automated weather monitoring system for Punjab cities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Status: {weatherStatus?.isRunning ? '🟢 Running' : '🔴 Stopped'}
                </p>
                <p className="text-sm text-gray-600">
                  Cities Monitored: {weatherStatus?.citiesMonitored || 0}
                </p>
                <p className="text-sm text-gray-600">
                  Last Check: {weatherStatus?.lastCheck ? new Date(weatherStatus.lastCheck).toLocaleString() : 'Never'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => controlWeatherMonitoring('start', 15)}
                  disabled={isLoading || weatherStatus?.isRunning}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </Button>
                <Button
                  onClick={() => controlWeatherMonitoring('stop')}
                  disabled={isLoading || !weatherStatus?.isRunning}
                  variant="destructive"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Stop
                </Button>
                <Button
                  onClick={() => controlWeatherMonitoring('restart', 15)}
                  disabled={isLoading}
                  variant="outline"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Restart
                </Button>
                <Button
                  onClick={fetchWeatherStatus}
                  disabled={isLoading}
                  variant="outline"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="weather">Weather</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="contacts">Emergency Contacts</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Weather Status Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Cloud className="h-5 w-5" />
                    Weather Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Monitoring:</span>
                      <Badge variant={weatherStatus?.isRunning ? "default" : "secondary"}>
                        {weatherStatus?.isRunning ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Cities:</span>
                      <span className="font-medium">{weatherStatus?.citiesMonitored || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Last Check:</span>
                      <span className="text-xs text-gray-500">
                        {weatherStatus?.lastCheck ? new Date(weatherStatus.lastCheck).toLocaleTimeString() : 'Never'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Active Alerts Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Active Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    {alerts.filter(a => a.status === 'ACTIVE').length}
                  </div>
                  <p className="text-sm text-gray-600">Current emergency alerts</p>
                </CardContent>
              </Card>

              {/* Emergency Contacts Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Emergency Contacts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {emergencyContacts.length}
                  </div>
                  <p className="text-sm text-gray-600">Available emergency services</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common emergency response actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2"
                    onClick={() => setActiveTab('contacts')}
                  >
                    <Phone className="h-6 w-6" />
                    <span>Emergency Contacts</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2"
                    onClick={() => setActiveTab('weather')}
                  >
                    <Cloud className="h-6 w-6" />
                    <span>Weather Check</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2"
                    onClick={() => setActiveTab('alerts')}
                  >
                    <AlertTriangle className="h-6 w-6" />
                    <span>View Alerts</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Weather Tab */}
          <TabsContent value="weather" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Real-time Weather Data</CardTitle>
                <CardDescription>
                  Current weather conditions for major Punjab cities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {['Ludhiana', 'Amritsar', 'Chandigarh', 'Jalandhar', 'Patiala', 'Bathinda'].map(city => {
                    const cityWeather = weatherData.find(w => w.city === city);
                    return (
                      <Card key={city} className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold">{city}</h3>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => fetchCityWeather(city)}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                        {cityWeather ? (
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Thermometer className="h-4 w-4 text-red-500" />
                              <span>{cityWeather.temperature}°C</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Droplets className="h-4 w-4 text-blue-500" />
                              <span>{cityWeather.humidity}%</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Wind className="h-4 w-4 text-gray-500" />
                              <span>{cityWeather.windSpeed} km/h</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Eye className="h-4 w-4 text-purple-500" />
                              <span>{cityWeather.visibility} km</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(cityWeather.timestamp).toLocaleTimeString()}
                            </div>
                          </div>
                        ) : (
                          <div className="text-gray-500 text-sm">
                            No data available
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Emergency Alerts</CardTitle>
                <CardDescription>
                  Real-time emergency alerts and warnings
                </CardDescription>
              </CardHeader>
              <CardContent>
                {alerts.length > 0 ? (
                  <div className="space-y-4">
                    {alerts.map(alert => (
                      <Card key={alert.id} className="border-l-4 border-orange-500">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold">{alert.title}</h3>
                            <Badge className={getSeverityColor(alert.severity)}>
                              {alert.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{alert.description}</p>
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <strong>Region:</strong> {alert.region}
                            </div>
                            <div>
                              <strong>Source:</strong> {alert.source}
                            </div>
                            <div>
                              <strong>Issued:</strong> {new Date(alert.issuedAt).toLocaleString()}
                            </div>
                            <div>
                              <strong>Expires:</strong> {new Date(alert.expiresAt).toLocaleString()}
                            </div>
                          </div>
                          {alert.actions && (
                            <div className="mt-3 p-3 bg-blue-50 rounded">
                              <strong className="text-blue-800">Recommended Actions:</strong>
                              <div className="text-sm text-blue-700 mt-1">
                                {JSON.parse(alert.actions).map((action: string, index: number) => (
                                  <div key={index}>• {action}</div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    No active alerts at the moment
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Emergency Contacts Tab */}
          <TabsContent value="contacts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Emergency Contacts</CardTitle>
                <CardDescription>
                  District-specific emergency contact information
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* District Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by District
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Districts</option>
                    {punjabDistricts.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>

                {/* Contacts Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {emergencyContacts.map(contact => (
                    <Card key={contact.id} className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="text-2xl">
                          {getCategoryIcon(contact.category)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm">{contact.name}</h3>
                          <p className="text-xs text-gray-600">{contact.category.replace(/_/g, ' ')}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-green-600" />
                          <span className="font-mono">{contact.number}</span>
                        </div>
                        
                        {contact.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-blue-600" />
                            <span className="text-xs">{contact.location}</span>
                          </div>
                        )}
                        
                        {contact.responseTime && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-orange-600" />
                            <span className="text-xs">{contact.responseTime}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                          <Badge variant={contact.available24x7 ? "default" : "secondary"} className="text-xs">
                            {contact.available24x7 ? '24/7' : 'Business Hours'}
                          </Badge>
                        </div>
                        
                        {contact.description && (
                          <p className="text-xs text-gray-600 mt-2">{contact.description}</p>
                        )}
                        
                        {contact.website && (
                          <a
                            href={contact.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline block mt-2"
                          >
                            Visit Website
                          </a>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
