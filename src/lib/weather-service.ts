import axios from 'axios';
import { db } from '@/lib/db';
import { AlertType, AlertSeverity, AlertStatus } from '@prisma/client';

interface IMDWeatherAlert {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'moderate' | 'high' | 'severe';
  area: string;
  issuedAt: string;
  expiresAt: string;
  alertType: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface NDMACapAlert {
  identifier: string;
  sender: string;
  sent: string;
  status: string;
  msgType: string;
  scope: string;
  info: {
    event: string;
    urgency: string;
    severity: string;
    certainty: string;
    area: {
      areaDesc: string;
      polygon?: string;
      circle?: string;
    };
  }[];
}

export class WeatherAlertService {
  private static instance: WeatherAlertService;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private isMonitoring = false;

  private constructor() {}

  static getInstance(): WeatherAlertService {
    if (!WeatherAlertService.instance) {
      WeatherAlertService.instance = new WeatherAlertService();
    }
    return WeatherAlertService.instance;
  }

  async fetchIMDAlerts(): Promise<IMDWeatherAlert[]> {
    try {
      // Note: These are example endpoints. You'll need to get actual API access from IMD
      const response = await axios.get('https://mausam.imd.gov.in/api/weather/alerts', {
        headers: {
          'Authorization': `Bearer ${process.env.IMD_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.alerts || [];
    } catch (error) {
      console.error('Error fetching IMD alerts:', error);
      return [];
    }
  }

  async fetchNDMAAlerts(): Promise<NDMACapAlert[]> {
    try {
      // Note: These are example endpoints. You'll need to get actual API access from NDMA
      const response = await axios.get('https://ndma.gov.in/api/cap/alerts', {
        headers: {
          'Authorization': `Bearer ${process.env.NDMA_API_KEY}`,
          'Content-Type': 'application/cap+xml'
        }
      });

      return response.data.alerts || [];
    } catch (error) {
      console.error('Error fetching NDMA alerts:', error);
      return [];
    }
  }

  async processAndStoreAlerts() {
    try {
      const [imdAlerts, ndmaAlerts] = await Promise.all([
        this.fetchIMDAlerts(),
        this.fetchNDMAAlerts()
      ]);

      // Process IMD alerts
      for (const alert of imdAlerts) {
        await this.storeAlert({
          title: alert.title,
          description: alert.description,
          type: this.mapAlertType(alert.alertType),
          severity: this.mapSeverity(alert.severity),
          status: AlertStatus.ACTIVE,
          area: alert.area,
          issuedAt: new Date(alert.issuedAt),
          expiresAt: new Date(alert.expiresAt),
          source: 'IMD',
          externalId: alert.id,
          coordinates: alert.coordinates ? JSON.stringify(alert.coordinates) : null
        });
      }

      // Process NDMA alerts
      for (const alert of ndmaAlerts) {
        for (const info of alert.info) {
          await this.storeAlert({
            title: info.event,
            description: `Alert from ${alert.sender}: ${info.event}`,
            type: this.mapAlertType(info.event),
            severity: this.mapSeverity(info.severity),
            status: AlertStatus.ACTIVE,
            area: info.area.areaDesc,
            issuedAt: new Date(alert.sent),
            expiresAt: this.calculateExpiryDate(info.urgency),
            source: 'NDMA',
            externalId: alert.identifier,
            coordinates: info.area.polygon || info.area.circle || null
          });
        }
      }

      console.log(`Processed ${imdAlerts.length} IMD alerts and ${ndmaAlerts.length} NDMA alerts`);
    } catch (error) {
      console.error('Error processing alerts:', error);
    }
  }

  private async storeAlert(alertData: {
    title: string;
    description: string;
    type: AlertType;
    severity: AlertSeverity;
    status: AlertStatus;
    area: string;
    issuedAt: Date;
    expiresAt: Date;
    source: string;
    externalId: string;
    coordinates?: string | null;
  }) {
    try {
      // Check if alert already exists
      const existingAlert = await db.alert.findFirst({
        where: {
          externalId: alertData.externalId,
          source: alertData.source
        }
      });

      if (existingAlert) {
        // Update existing alert
        await db.alert.update({
          where: { id: existingAlert.id },
          data: {
            status: alertData.status,
            expiresAt: alertData.expiresAt,
            updatedAt: new Date()
          }
        });
      } else {
        // Create new alert
        await db.alert.create({
          data: {
            title: alertData.title,
            description: alertData.description,
            type: alertData.type,
            severity: alertData.severity,
            status: alertData.status,
            area: alertData.area,
            issuedAt: alertData.issuedAt,
            expiresAt: alertData.expiresAt,
            source: alertData.source,
            externalId: alertData.externalId,
            coordinates: alertData.coordinates,
            geographicRegionId: await this.getGeographicRegionId(alertData.area)
          }
        });
      }
    } catch (error) {
      console.error('Error storing alert:', error);
    }
  }

  private mapAlertType(alertType: string): AlertType {
    const typeMap: Record<string, AlertType> = {
      'rain': AlertType.WEATHER,
      'flood': AlertType.FLOOD,
      'cyclone': AlertType.WEATHER,
      'earthquake': AlertType.SEISMIC,
      'heat': AlertType.WEATHER,
      'cold': AlertType.WEATHER,
      'storm': AlertType.WEATHER,
      'fire': AlertType.ENVIRONMENTAL,
      'chemical': AlertType.ENVIRONMENTAL,
      'biological': AlertType.HEALTH
    };

    return typeMap[alertType.toLowerCase()] || AlertType.WEATHER;
  }

  private mapSeverity(severity: string): AlertSeverity {
    const severityMap: Record<string, AlertSeverity> = {
      'low': AlertSeverity.LOW,
      'moderate': AlertSeverity.MEDIUM,
      'high': AlertSeverity.HIGH,
      'severe': AlertSeverity.CRITICAL,
      'minor': AlertSeverity.LOW,
      'moderate': AlertSeverity.MEDIUM,
      'extreme': AlertSeverity.CRITICAL,
      'unknown': AlertSeverity.MEDIUM
    };

    return severityMap[severity.toLowerCase()] || AlertSeverity.MEDIUM;
  }

  private calculateExpiryDate(urgency: string): Date {
    const now = new Date();
    const hours = urgency === 'immediate' ? 6 : urgency === 'expected' ? 24 : 48;
    return new Date(now.getTime() + hours * 60 * 60 * 1000);
  }

  private async getGeographicRegionId(area: string): Promise<string | null> {
    try {
      // Simple area to region mapping - in production, this would be more sophisticated
      const region = await db.geographicRegion.findFirst({
        where: {
          OR: [
            {
              states: {
                contains: area
              }
            },
            {
              districts: {
                contains: area
              }
            }
          ]
        }
      });

      return region?.id || null;
    } catch (error) {
      console.error('Error getting geographic region:', error);
      return null;
    }
  }

  startMonitoring(intervalMinutes: number = 15) {
    if (this.isMonitoring) {
      console.log('Weather monitoring is already active');
      return;
    }

    console.log(`Starting weather monitoring with ${intervalMinutes} minute intervals`);
    this.isMonitoring = true;

    // Initial fetch
    this.processAndStoreAlerts();

    // Set up interval
    this.monitoringInterval = setInterval(() => {
      this.processAndStoreAlerts();
    }, intervalMinutes * 60 * 1000);
  }

  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.isMonitoring = false;
    console.log('Weather monitoring stopped');
  }

  getMonitoringStatus() {
    return {
      isMonitoring: this.isMonitoring,
      interval: this.monitoringInterval ? 'Active' : 'Inactive'
    };
  }

  async getActiveAlertsForRegion(regionId: string) {
    try {
      return await db.alert.findMany({
        where: {
          geographicRegionId: regionId,
          status: AlertStatus.ACTIVE,
          expiresAt: {
            gte: new Date()
          }
        },
        orderBy: {
          issuedAt: 'desc'
        }
      });
    } catch (error) {
      console.error('Error getting active alerts for region:', error);
      return [];
    }
  }

  async expireOldAlerts() {
    try {
      const result = await db.alert.updateMany({
        where: {
          status: AlertStatus.ACTIVE,
          expiresAt: {
            lt: new Date()
          }
        },
        data: {
          status: AlertStatus.EXPIRED,
          updatedAt: new Date()
        }
      });

      console.log(`Expired ${result.count} old alerts`);
      return result.count;
    } catch (error) {
      console.error('Error expiring old alerts:', error);
      return 0;
    }
  }
}