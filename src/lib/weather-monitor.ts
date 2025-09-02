import { db } from './db';

// Punjab major cities with their coordinates and districts
const PUNJAB_CITIES = [
  {
    name: 'Ludhiana',
    district: 'Ludhiana',
    state: 'Punjab',
    lat: 30.9010,
    lon: 75.8573,
    region: 'Indo-Gangetic Plain'
  },
  {
    name: 'Amritsar',
    district: 'Amritsar',
    state: 'Punjab',
    lat: 31.6340,
    lon: 74.8723,
    region: 'Indo-Gangetic Plain'
  },
  {
    name: 'Chandigarh',
    district: 'Chandigarh',
    state: 'Chandigarh',
    lat: 30.7333,
    lon: 76.7794,
    region: 'Himalayan Foothills'
  },
  {
    name: 'Jalandhar',
    district: 'Jalandhar',
    state: 'Punjab',
    lat: 31.3260,
    lon: 75.5762,
    region: 'Indo-Gangetic Plain'
  },
  {
    name: 'Patiala',
    district: 'Patiala',
    state: 'Punjab',
    lat: 30.3398,
    lon: 76.3869,
    region: 'Indo-Gangetic Plain'
  },
  {
    name: 'Bathinda',
    district: 'Bathinda',
    state: 'Punjab',
    lat: 30.2070,
    lon: 74.9455,
    region: 'Thar Desert Region'
  },
  {
    name: 'Mohali',
    district: 'SAS Nagar',
    state: 'Punjab',
    lat: 30.7046,
    lon: 76.7179,
    region: 'Himalayan Foothills'
  },
  {
    name: 'Ferozepur',
    district: 'Ferozepur',
    state: 'Punjab',
    lat: 30.9258,
    lon: 74.6133,
    region: 'Indo-Gangetic Plain'
  }
];

// Weather condition thresholds for alerts
const WEATHER_THRESHOLDS = {
  HEAT_WAVE: {
    temperature: 40, // Celsius
    humidity: 30,    // Percentage
    description: 'Heat wave conditions detected'
  },
  COLD_WAVE: {
    temperature: 4,  // Celsius
    humidity: 80,    // Percentage
    description: 'Cold wave conditions detected'
  },
  HEAVY_RAINFALL: {
    rainfall: 64.5,  // mm in 24 hours
    description: 'Heavy rainfall warning'
  },
  DUST_STORM: {
    windSpeed: 50,   // km/h
    visibility: 5,   // km
    description: 'Dust storm conditions'
  },
  FLOOD_WARNING: {
    rainfall: 100,   // mm in 24 hours
    description: 'Flood warning due to heavy rainfall'
  },
  THUNDERSTORM: {
    windSpeed: 40,   // km/h
    rainfall: 20,    // mm
    description: 'Thunderstorm warning'
  }
};

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

interface WeatherAlert {
  city: string;
  district: string;
  alertType: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  weatherData: WeatherData;
}

export class WeatherMonitor {
  private isRunning: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;
  private lastCheck: Date | null = null;

  constructor() {
    console.log('🌤️ Weather Monitor initialized for Punjab cities');
  }

  /**
   * Start weather monitoring
   */
  async startMonitoring(intervalMinutes: number = 15) {
    if (this.isRunning) {
      console.log('Weather monitoring is already running');
      return;
    }

    this.isRunning = true;
    console.log(`🌤️ Starting weather monitoring every ${intervalMinutes} minutes`);

    // Initial check
    await this.checkAllCities();

    // Set up interval
    this.intervalId = setInterval(async () => {
      await this.checkAllCities();
    }, intervalMinutes * 60 * 1000);

    console.log('✅ Weather monitoring started successfully');
  }

  /**
   * Stop weather monitoring
   */
  stopMonitoring() {
    if (!this.isRunning) {
      console.log('Weather monitoring is not running');
      return;
    }

    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    console.log('⏹️ Weather monitoring stopped');
  }

  /**
   * Check weather for all Punjab cities
   */
  private async checkAllCities() {
    console.log(`🌤️ Checking weather for ${PUNJAB_CITIES.length} cities...`);
    this.lastCheck = new Date();

    const alerts: WeatherAlert[] = [];

    for (const city of PUNJAB_CITIES) {
      try {
        const weatherData = await this.fetchWeatherData(city);
        const cityAlerts = this.analyzeWeatherConditions(weatherData);
        alerts.push(...cityAlerts);
      } catch (error) {
        console.error(`❌ Error checking weather for ${city.name}:`, error);
      }
    }

    // Process alerts
    if (alerts.length > 0) {
      await this.processAlerts(alerts);
    }

    console.log(`✅ Weather check completed. Generated ${alerts.length} alerts.`);
  }

  /**
   * Fetch weather data from OpenWeatherMap API
   */
  private async fetchWeatherData(city: any): Promise<WeatherData> {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      throw new Error('OpenWeather API key not configured');
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${apiKey}&units=metric`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      city: city.name,
      district: city.district,
      temperature: data.main.temp,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed * 3.6, // Convert m/s to km/h
      rainfall: data.rain?.['1h'] || 0,
      visibility: data.visibility / 1000, // Convert m to km
      condition: data.weather[0].main,
      timestamp: new Date()
    };
  }

  /**
   * Analyze weather conditions and generate alerts
   */
  private analyzeWeatherConditions(weatherData: WeatherData): WeatherAlert[] {
    const alerts: WeatherAlert[] = [];

    // Check heat wave conditions
    if (weatherData.temperature >= WEATHER_THRESHOLDS.HEAT_WAVE.temperature &&
        weatherData.humidity <= WEATHER_THRESHOLDS.HEAT_WAVE.humidity) {
      alerts.push({
        city: weatherData.city,
        district: weatherData.district,
        alertType: 'HEAT',
        severity: this.calculateHeatWaveSeverity(weatherData.temperature),
        description: WEATHER_THRESHOLDS.HEAT_WAVE.description,
        weatherData
      });
    }

    // Check cold wave conditions
    if (weatherData.temperature <= WEATHER_THRESHOLDS.COLD_WAVE.temperature &&
        weatherData.humidity >= WEATHER_THRESHOLDS.COLD_WAVE.humidity) {
      alerts.push({
        city: weatherData.city,
        district: weatherData.district,
        alertType: 'COLD_WAVE',
        severity: this.calculateColdWaveSeverity(weatherData.temperature),
        description: WEATHER_THRESHOLDS.COLD_WAVE.description,
        weatherData
      });
    }

    // Check heavy rainfall
    if (weatherData.rainfall >= WEATHER_THRESHOLDS.HEAVY_RAINFALL.rainfall) {
      alerts.push({
        city: weatherData.city,
        district: weatherData.district,
        alertType: 'FLOOD',
        severity: this.calculateRainfallSeverity(weatherData.rainfall),
        description: WEATHER_THRESHOLDS.HEAVY_RAINFALL.description,
        weatherData
      });
    }

    // Check dust storm conditions
    if (weatherData.windSpeed >= WEATHER_THRESHOLDS.DUST_STORM.windSpeed &&
        weatherData.visibility <= WEATHER_THRESHOLDS.DUST_STORM.visibility) {
      alerts.push({
        city: weatherData.city,
        district: weatherData.district,
        alertType: 'ENVIRONMENTAL',
        severity: 'HIGH',
        description: WEATHER_THRESHOLDS.DUST_STORM.description,
        weatherData
      });
    }

    // Check thunderstorm conditions
    if (weatherData.windSpeed >= WEATHER_THRESHOLDS.THUNDERSTORM.windSpeed &&
        weatherData.rainfall >= WEATHER_THRESHOLDS.THUNDERSTORM.rainfall) {
      alerts.push({
        city: weatherData.city,
        district: weatherData.district,
        alertType: 'WEATHER',
        severity: 'MEDIUM',
        description: WEATHER_THRESHOLDS.THUNDERSTORM.description,
        weatherData
      });
    }

    return alerts;
  }

  /**
   * Calculate heat wave severity
   */
  private calculateHeatWaveSeverity(temperature: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (temperature >= 47) return 'CRITICAL';
    if (temperature >= 45) return 'HIGH';
    if (temperature >= 42) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Calculate cold wave severity
   */
  private calculateColdWaveSeverity(temperature: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (temperature <= -2) return 'CRITICAL';
    if (temperature <= 0) return 'HIGH';
    if (temperature <= 2) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Calculate rainfall severity
   */
  private calculateRainfallSeverity(rainfall: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (rainfall >= 200) return 'CRITICAL';
    if (rainfall >= 150) return 'HIGH';
    if (rainfall >= 100) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Process weather alerts and create database entries
   */
  private async processAlerts(alerts: WeatherAlert[]) {
    console.log(`🚨 Processing ${alerts.length} weather alerts...`);

    for (const alert of alerts) {
      try {
        // Check if similar alert already exists (within last 2 hours)
        const existingAlert = await db.alert.findFirst({
          where: {
            title: {
              contains: `${alert.alertType} Alert - ${alert.city}`
            },
            createdAt: {
              gte: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
            }
          }
        });

        if (existingAlert) {
          console.log(`⚠️ Similar alert already exists for ${alert.city} - ${alert.alertType}`);
          continue;
        }

        // Get geographic region
        const region = await db.geographicRegion.findFirst({
          where: {
            states: {
              contains: alert.weatherData.district
            }
          }
        });

        // Create alert in database
        const newAlert = await db.alert.create({
          data: {
            title: `${alert.alertType} Alert - ${alert.city}`,
            description: `${alert.description} in ${alert.city}, ${alert.district}. Current conditions: Temperature: ${alert.weatherData.temperature}°C, Humidity: ${alert.weatherData.humidity}%, Wind Speed: ${alert.weatherData.windSpeed} km/h, Rainfall: ${alert.weatherData.rainfall} mm.`,
            type: this.mapAlertType(alert.alertType),
            severity: alert.severity,
            region: `${alert.district}, ${alert.weatherData.state}`,
            issuedAt: new Date(),
            expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
            status: 'ACTIVE',
            actions: JSON.stringify(this.generateEmergencyActions(alert)),
            source: 'PSDMA Weather Monitoring System',
            contact: 'PSDMA Emergency Control Room: 1070',
            geographicRegionId: region?.id || null,
            affectedAreas: JSON.stringify([alert.city, alert.district]),
            evacuationRoutes: JSON.stringify(this.generateEvacuationRoutes(alert)),
            shelterLocations: JSON.stringify(this.generateShelterLocations(alert))
          }
        });

        console.log(`✅ Created alert: ${newAlert.title} (ID: ${newAlert.id})`);

        // Broadcast alert via WebSocket
        await this.broadcastAlert(newAlert);

      } catch (error) {
        console.error(`❌ Error processing alert for ${alert.city}:`, error);
      }
    }
  }

  /**
   * Map weather alert type to system alert type
   */
  private mapAlertType(weatherType: string): string {
    const typeMap: { [key: string]: string } = {
      'HEAT': 'HEAT',
      'COLD_WAVE': 'HEALTH',
      'FLOOD': 'FLOOD',
      'ENVIRONMENTAL': 'ENVIRONMENTAL',
      'WEATHER': 'WEATHER'
    };
    return typeMap[weatherType] || 'WEATHER';
  }

  /**
   * Generate emergency actions based on alert type
   */
  private generateEmergencyActions(alert: WeatherAlert): string[] {
    const actions: { [key: string]: string[] } = {
      'HEAT': [
        'Stay indoors during peak hours (12 PM - 4 PM)',
        'Drink plenty of water and avoid strenuous activities',
        'Wear light, loose-fitting clothing',
        'Check on elderly and vulnerable individuals',
        'Keep windows and doors closed during peak heat'
      ],
      'COLD_WAVE': [
        'Wear warm clothing and cover extremities',
        'Stay indoors and maintain room temperature above 18°C',
        'Avoid outdoor activities during extreme cold',
        'Check on elderly and vulnerable individuals',
        'Keep emergency supplies ready'
      ],
      'FLOOD': [
        'Move to higher ground immediately',
        'Avoid walking or driving through floodwaters',
        'Follow evacuation orders from authorities',
        'Keep emergency kit and important documents ready',
        'Stay tuned to local news and weather updates'
      ],
      'ENVIRONMENTAL': [
        'Stay indoors and close windows and doors',
        'Use air purifiers if available',
        'Avoid outdoor activities',
        'Wear masks if venturing outside',
        'Follow local authority instructions'
      ],
      'WEATHER': [
        'Stay indoors during severe weather',
        'Avoid open areas and tall structures',
        'Keep emergency supplies ready',
        'Follow local authority instructions',
        'Stay tuned to weather updates'
      ]
    };

    return actions[alert.alertType] || actions['WEATHER'];
  }

  /**
   * Generate evacuation routes for the district
   */
  private generateEvacuationRoutes(alert: WeatherAlert): string[] {
    const routes: { [key: string]: string[] } = {
      'Ludhiana': [
        'Route 1: Ludhiana → Jalandhar → Amritsar (NH-1)',
        'Route 2: Ludhiana → Chandigarh → Shimla (NH-95)',
        'Route 3: Ludhiana → Patiala → Delhi (NH-64)'
      ],
      'Amritsar': [
        'Route 1: Amritsar → Jalandhar → Ludhiana (NH-1)',
        'Route 2: Amritsar → Pathankot → Jammu (NH-1A)',
        'Route 3: Amritsar → Tarn Taran → Ferozepur'
      ],
      'Chandigarh': [
        'Route 1: Chandigarh → Shimla → Manali (NH-5)',
        'Route 2: Chandigarh → Ludhiana → Amritsar (NH-95)',
        'Route 3: Chandigarh → Panchkula → Dehradun'
      ]
    };

    return routes[alert.district] || [
      'Follow designated evacuation routes',
      'Listen to local authorities for specific instructions',
      'Move to nearest designated shelter'
    ];
  }

  /**
   * Generate shelter locations for the district
   */
  private generateShelterLocations(alert: WeatherAlert): string[] {
    const shelters: { [key: string]: string[] } = {
      'Ludhiana': [
        'Government Senior Secondary School, Civil Lines',
        'Ludhiana Municipal Corporation Building',
        'Guru Nanak Stadium',
        'Punjab Agricultural University Campus'
      ],
      'Amritsar': [
        'Government College for Girls, Mall Road',
        'Amritsar Municipal Corporation Building',
        'Guru Nanak Dev University Campus',
        'Khalsa College Campus'
      ],
      'Chandigarh': [
        'Government Model Senior Secondary School, Sector 16',
        'Chandigarh Municipal Corporation Building',
        'Panjab University Campus',
        'Government Medical College and Hospital'
      ]
    };

    return shelters[alert.district] || [
      'Nearest government school or college',
      'Municipal corporation building',
      'Community center or public hall',
      'Religious institutions (if designated)'
    ];
  }

  /**
   * Broadcast alert via WebSocket
   */
  private async broadcastAlert(alert: any) {
    try {
      const broadcastAlert = (global as any).broadcastAlert;
      if (broadcastAlert && typeof broadcastAlert === 'function') {
        broadcastAlert({
          id: alert.id,
          title: alert.title,
          description: alert.description,
          type: alert.type,
          severity: alert.severity,
          region: alert.region,
          issuedAt: alert.issuedAt.toISOString(),
          expiresAt: alert.expiresAt.toISOString(),
          actions: alert.actions,
          source: alert.source,
          contact: alert.contact,
          affectedAreas: alert.affectedAreas,
          evacuationRoutes: alert.evacuationRoutes,
          shelterLocations: alert.shelterLocations
        });
        console.log('📡 Alert broadcasted via WebSocket');
      } else {
        console.log('⚠️ WebSocket broadcast function not available');
      }
    } catch (error) {
      console.error('❌ Error broadcasting alert:', error);
    }
  }

  /**
   * Get monitoring status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      lastCheck: this.lastCheck,
      citiesMonitored: PUNJAB_CITIES.length,
      thresholds: WEATHER_THRESHOLDS
    };
  }

  /**
   * Manual weather check for a specific city
   */
  async checkCityWeather(cityName: string): Promise<WeatherData | null> {
    const city = PUNJAB_CITIES.find(c => c.name.toLowerCase() === cityName.toLowerCase());
    if (!city) {
      throw new Error(`City ${cityName} not found in monitoring list`);
    }

    try {
      const weatherData = await this.fetchWeatherData(city);
      console.log(`🌤️ Weather data for ${cityName}:`, weatherData);
      return weatherData;
    } catch (error) {
      console.error(`❌ Error fetching weather for ${cityName}:`, error);
      return null;
    }
  }
}

// Export singleton instance
export const weatherMonitor = new WeatherMonitor();
