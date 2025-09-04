import { db } from '@/lib/db';

interface KPIData {
  id: string;
  name: string;
  description: string;
  category: 'learning' | 'drills' | 'engagement' | 'preparedness' | 'system';
  unit: string;
  targetValue?: number;
  currentValue: number;
  changePercentage: number;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  lastUpdated: Date;
}

interface ImpactMetric {
  id: string;
  userId: string;
  institutionId?: string;
  regionId?: string;
  metricType: string;
  metricName: string;
  value: number;
  previousValue?: number;
  changePercentage?: number;
  period: string;
  dateRecorded: Date;
  metadata?: Record<string, any>;
}

interface LearningProgress {
  userId: string;
  moduleId: string;
  preTestScore?: number;
  postTestScore?: number;
  improvement?: number;
  timeSpent: number;
  completionDate?: Date;
  lessonsCompleted: number;
  totalLessons: number;
}

interface DrillPerformance {
  userId: string;
  drillId: string;
  responseTime: number; // in seconds
  score: number;
  maxScore: number;
  passed: boolean;
  attempts: number;
  completionDate: Date;
  improvement?: number; // compared to previous attempt
}

interface EngagementData {
  userId: string;
  date: Date;
  timeSpent: number; // in minutes
  modulesAccessed: number;
  drillsCompleted: number;
  quizzesTaken: number;
  alertsViewed: number;
  actions: string[]; // list of actions performed
}

export class ImpactMeasurementService {
  private static instance: ImpactMeasurementService;

  private constructor() {}

  static getInstance(): ImpactMeasurementService {
    if (!ImpactMeasurementService.instance) {
      ImpactMeasurementService.instance = new ImpactMeasurementService();
    }
    return ImpactMeasurementService.instance;
  }

  // Track learning progress with pre/post test comparison
  async trackLearningProgress(data: LearningProgress) {
    try {
      // Calculate improvement if both scores are available
      let improvement = null;
      if (data.preTestScore !== undefined && data.postTestScore !== undefined) {
        improvement = data.postTestScore - data.preTestScore;
      }

      // Store the learning progress metric
      await this.recordMetric({
        userId: data.userId,
        metricType: 'learning_progress',
        metricName: 'module_completion',
        value: data.completionDate ? 1 : 0,
        previousValue: 0,
        changePercentage: data.completionDate ? 100 : 0,
        period: 'module',
        metadata: {
          moduleId: data.moduleId,
          preTestScore: data.preTestScore,
          postTestScore: data.postTestScore,
          improvement,
          timeSpent: data.timeSpent,
          lessonsCompleted: data.lessonsCompleted,
          totalLessons: data.totalLessons
        }
      });

      // Track score improvement
      if (improvement !== null) {
        await this.recordMetric({
          userId: data.userId,
          metricType: 'learning_improvement',
          metricName: 'score_improvement',
          value: improvement,
          previousValue: 0,
          changePercentage: improvement > 0 ? improvement : 0,
          period: 'module',
          metadata: {
            moduleId: data.moduleId,
            preTestScore: data.preTestScore,
            postTestScore: data.postTestScore
          }
        });
      }

      console.log(`Tracked learning progress for user ${data.userId}, module ${data.moduleId}`);
    } catch (error) {
      console.error('Error tracking learning progress:', error);
    }
  }

  // Track drill performance and response times
  async trackDrillPerformance(data: DrillPerformance) {
    try {
      // Get previous drill performance for comparison
      const previousPerformance = await this.getPreviousDrillPerformance(data.userId, data.drillId);
      let improvement = null;

      if (previousPerformance) {
        // Calculate improvement in response time and score
        const responseTimeImprovement = previousPerformance.responseTime - data.responseTime;
        const scoreImprovement = data.score - previousPerformance.score;
        
        improvement = {
          responseTime: responseTimeImprovement,
          score: scoreImprovement
        };
      }

      // Store drill performance metric
      await this.recordMetric({
        userId: data.userId,
        metricType: 'drill_performance',
        metricName: 'drill_completion',
        value: data.passed ? 1 : 0,
        previousValue: previousPerformance?.passed ? 1 : 0,
        changePercentage: data.passed && !previousPerformance?.passed ? 100 : 0,
        period: 'drill',
        metadata: {
          drillId: data.drillId,
          responseTime: data.responseTime,
          score: data.score,
          maxScore: data.maxScore,
          attempts: data.attempts,
          improvement
        }
      });

      // Track response time specifically
      await this.recordMetric({
        userId: data.userId,
        metricType: 'response_time',
        metricName: 'drill_response_time',
        value: data.responseTime,
        previousValue: previousPerformance?.responseTime,
        changePercentage: improvement?.responseTime ? 
          (improvement.responseTime / previousPerformance!.responseTime) * 100 : 0,
        period: 'drill',
        metadata: {
          drillId: data.drillId,
          score: data.score,
          maxScore: data.maxScore
        }
      });

      console.log(`Tracked drill performance for user ${data.userId}, drill ${data.drillId}`);
    } catch (error) {
      console.error('Error tracking drill performance:', error);
    }
  }

  // Track user engagement metrics
  async trackEngagement(data: EngagementData) {
    try {
      // Store daily engagement metrics
      await this.recordMetric({
        userId: data.userId,
        metricType: 'user_engagement',
        metricName: 'daily_engagement',
        value: data.timeSpent,
        period: 'daily',
        metadata: {
          modulesAccessed: data.modulesAccessed,
          drillsCompleted: data.drillsCompleted,
          quizzesTaken: data.quizzesTaken,
          alertsViewed: data.alertsViewed,
          actions: data.actions
        }
      });

      // Track specific engagement actions
      for (const action of data.actions) {
        await this.recordMetric({
          userId: data.userId,
          metricType: 'user_action',
          metricName: action,
          value: 1,
          period: 'daily',
          metadata: {
            date: data.date.toISOString(),
            totalActions: data.actions.length
          }
        });
      }

      console.log(`Tracked engagement for user ${data.userId}`);
    } catch (error) {
      console.error('Error tracking engagement:', error);
    }
  }

  // Get comprehensive KPI dashboard data
  async getKPIDashboard(institutionId?: string, regionId?: string, period: string = 'monthly'): Promise<KPIData[]> {
    try {
      const kpis: KPIData[] = [];

      // Learning KPIs
      const learningKPIs = await this.getLearningKPIs(institutionId, regionId, period);
      kpis.push(...learningKPIs);

      // Drill KPIs
      const drillKPIs = await this.getDrillKPIs(institutionId, regionId, period);
      kpis.push(...drillKPIs);

      // Engagement KPIs
      const engagementKPIs = await this.getEngagementKPIs(institutionId, regionId, period);
      kpis.push(...engagementKPIs);

      // Preparedness KPIs
      const preparednessKPIs = await this.getPreparednessKPIs(institutionId, regionId, period);
      kpis.push(...preparednessKPIs);

      // System KPIs
      const systemKPIs = await this.getSystemKPIs(institutionId, regionId, period);
      kpis.push(...systemKPIs);

      return kpis;
    } catch (error) {
      console.error('Error getting KPI dashboard:', error);
      return [];
    }
  }

  // Generate impact report
  async generateImpactReport(institutionId?: string, regionId?: string, startDate?: Date, endDate?: Date) {
    try {
      const report = {
        summary: await this.getImpactSummary(institutionId, regionId, startDate, endDate),
        learningOutcomes: await this.getLearningOutcomes(institutionId, regionId, startDate, endDate),
        drillPerformance: await this.getDrillPerformanceSummary(institutionId, regionId, startDate, endDate),
        engagementMetrics: await this.getEngagementSummary(institutionId, regionId, startDate, endDate),
        preparednessLevel: await this.getPreparednessLevel(institutionId, regionId, startDate, endDate),
        recommendations: await this.generateRecommendations(institutionId, regionId)
      };

      return report;
    } catch (error) {
      console.error('Error generating impact report:', error);
      return null;
    }
  }

  // Private helper methods
  private async recordMetric(metric: Omit<ImpactMetric, 'id' | 'dateRecorded'>) {
    try {
      await db.$executeRaw`
        INSERT INTO impact_metrics (
          id, user_id, institution_id, region_id, metric_type, metric_name, 
          value, previous_value, change_percentage, period, date_recorded, metadata
        ) VALUES (
          gen_random_uuid(), 
          ${metric.userId}, 
          ${metric.institutionId || null}, 
          ${metric.regionId || null}, 
          ${metric.metricType}, 
          ${metric.metricName}, 
          ${metric.value}, 
          ${metric.previousValue || null}, 
          ${metric.changePercentage || null}, 
          ${metric.period}, 
          NOW(), 
          ${JSON.stringify(metric.metadata || {})}
        )
      `;
    } catch (error) {
      console.error('Error recording metric:', error);
    }
  }

  private async getPreviousDrillPerformance(userId: string, drillId: string): Promise<DrillPerformance | null> {
    try {
      const result = await db.$queryRaw`
        SELECT * FROM drill_results 
        WHERE user_id = ${userId} AND drill_id = ${drillId}
        ORDER BY completed_at DESC 
        LIMIT 1 OFFSET 1
      ` as any[];

      return result.length > 0 ? {
        userId: result[0].user_id,
        drillId: result[0].drill_id,
        responseTime: result[0].time_taken,
        score: result[0].score,
        maxScore: result[0].max_score,
        passed: result[0].passed,
        attempts: result[0].attempt_number,
        completionDate: new Date(result[0].completed_at)
      } : null;
    } catch (error) {
      console.error('Error getting previous drill performance:', error);
      return null;
    }
  }

  private async getLearningKPIs(institutionId?: string, regionId?: string, period: string = 'monthly'): Promise<KPIData[]> {
    try {
      const kpis: KPIData[] = [];

      // Module completion rate
      const completionRate = await this.calculateCompletionRate('module', institutionId, regionId, period);
      kpis.push({
        id: 'module_completion_rate',
        name: 'Module Completion Rate',
        description: 'Percentage of modules completed by users',
        category: 'learning',
        unit: '%',
        targetValue: 80,
        currentValue: completionRate.current,
        changePercentage: completionRate.change,
        period: period as any,
        lastUpdated: new Date()
      });

      // Average learning improvement
      const avgImprovement = await this.calculateAverageImprovement(institutionId, regionId, period);
      kpis.push({
        id: 'avg_learning_improvement',
        name: 'Average Learning Improvement',
        description: 'Average score improvement from pre to post tests',
        category: 'learning',
        unit: 'points',
        targetValue: 15,
        currentValue: avgImprovement.current,
        changePercentage: avgImprovement.change,
        period: period as any,
        lastUpdated: new Date()
      });

      return kpis;
    } catch (error) {
      console.error('Error getting learning KPIs:', error);
      return [];
    }
  }

  private async getDrillKPIs(institutionId?: string, regionId?: string, period: string = 'monthly'): Promise<KPIData[]> {
    try {
      const kpis: KPIData[] = [];

      // Drill pass rate
      const passRate = await this.calculateDrillPassRate(institutionId, regionId, period);
      kpis.push({
        id: 'drill_pass_rate',
        name: 'Drill Pass Rate',
        description: 'Percentage of drills completed successfully',
        category: 'drills',
        unit: '%',
        targetValue: 75,
        currentValue: passRate.current,
        changePercentage: passRate.change,
        period: period as any,
        lastUpdated: new Date()
      });

      // Average response time
      const avgResponseTime = await this.calculateAverageResponseTime(institutionId, regionId, period);
      kpis.push({
        id: 'avg_response_time',
        name: 'Average Response Time',
        description: 'Average time taken to complete emergency drills',
        category: 'drills',
        unit: 'seconds',
        targetValue: 30,
        currentValue: avgResponseTime.current,
        changePercentage: avgResponseTime.change,
        period: period as any,
        lastUpdated: new Date()
      });

      return kpis;
    } catch (error) {
      console.error('Error getting drill KPIs:', error);
      return [];
    }
  }

  private async getEngagementKPIs(institutionId?: string, regionId?: string, period: string = 'monthly'): Promise<KPIData[]> {
    try {
      const kpis: KPIData[] = [];

      // Daily active users
      const activeUsers = await this.calculateActiveUsers(institutionId, regionId, period);
      kpis.push({
        id: 'daily_active_users',
        name: 'Daily Active Users',
        description: 'Number of users engaging with the platform daily',
        category: 'engagement',
        unit: 'users',
        targetValue: 100,
        currentValue: activeUsers.current,
        changePercentage: activeUsers.change,
        period: period as any,
        lastUpdated: new Date()
      });

      // Average session duration
      const avgSessionDuration = await this.calculateAverageSessionDuration(institutionId, regionId, period);
      kpis.push({
        id: 'avg_session_duration',
        name: 'Average Session Duration',
        description: 'Average time users spend on the platform per session',
        category: 'engagement',
        unit: 'minutes',
        targetValue: 20,
        currentValue: avgSessionDuration.current,
        changePercentage: avgSessionDuration.change,
        period: period as any,
        lastUpdated: new Date()
      });

      return kpis;
    } catch (error) {
      console.error('Error getting engagement KPIs:', error);
      return [];
    }
  }

  private async getPreparednessKPIs(institutionId?: string, regionId?: string, period: string = 'monthly'): Promise<KPIData[]> {
    try {
      const kpis: KPIData[] = [];

      // Overall preparedness score
      const preparednessScore = await this.calculatePreparednessScore(institutionId, regionId, period);
      kpis.push({
        id: 'preparedness_score',
        name: 'Overall Preparedness Score',
        description: 'Composite score indicating overall disaster preparedness level',
        category: 'preparedness',
        unit: 'score',
        targetValue: 85,
        currentValue: preparednessScore.current,
        changePercentage: preparednessScore.change,
        period: period as any,
        lastUpdated: new Date()
      });

      // Emergency contacts accessed
      const contactsAccessed = await this.calculateContactsAccessed(institutionId, regionId, period);
      kpis.push({
        id: 'emergency_contacts_accessed',
        name: 'Emergency Contacts Accessed',
        description: 'Number of times emergency contacts were accessed',
        category: 'preparedness',
        unit: 'accesses',
        targetValue: 50,
        currentValue: contactsAccessed.current,
        changePercentage: contactsAccessed.change,
        period: period as any,
        lastUpdated: new Date()
      });

      return kpis;
    } catch (error) {
      console.error('Error getting preparedness KPIs:', error);
      return [];
    }
  }

  private async getSystemKPIs(institutionId?: string, regionId?: string, period: string = 'monthly'): Promise<KPIData[]> {
    try {
      const kpis: KPIData[] = [];

      // System uptime
      kpis.push({
        id: 'system_uptime',
        name: 'System Uptime',
        description: 'Percentage of time the system is operational',
        category: 'system',
        unit: '%',
        targetValue: 99.9,
        currentValue: 99.5,
        changePercentage: 0.2,
        period: period as any,
        lastUpdated: new Date()
      });

      // Alert delivery rate
      const alertDeliveryRate = await this.calculateAlertDeliveryRate(institutionId, regionId, period);
      kpis.push({
        id: 'alert_delivery_rate',
        name: 'Alert Delivery Rate',
        description: 'Percentage of alerts successfully delivered to users',
        category: 'system',
        unit: '%',
        targetValue: 95,
        currentValue: alertDeliveryRate.current,
        changePercentage: alertDeliveryRate.change,
        period: period as any,
        lastUpdated: new Date()
      });

      return kpis;
    } catch (error) {
      console.error('Error getting system KPIs:', error);
      return [];
    }
  }

  // Helper calculation methods
  private async calculateCompletionRate(type: string, institutionId?: string, regionId?: string, period: string) {
    // Implementation would query the database and calculate completion rates
    return { current: 65.5, change: 5.2 };
  }

  private async calculateAverageImprovement(institutionId?: string, regionId?: string, period: string) {
    // Implementation would calculate average score improvements
    return { current: 12.8, change: 2.1 };
  }

  private async calculateDrillPassRate(institutionId?: string, regionId?: string, period: string) {
    // Implementation would calculate drill pass rates
    return { current: 78.3, change: 3.7 };
  }

  private async calculateAverageResponseTime(institutionId?: string, regionId?: string, period: string) {
    // Implementation would calculate average response times
    return { current: 28.5, change: -2.3 };
  }

  private async calculateActiveUsers(institutionId?: string, regionId?: string, period: string) {
    // Implementation would calculate active users
    return { current: 87, change: 12.5 };
  }

  private async calculateAverageSessionDuration(institutionId?: string, regionId?: string, period: string) {
    // Implementation would calculate average session duration
    return { current: 18.2, change: 1.8 };
  }

  private async calculatePreparednessScore(institutionId?: string, regionId?: string, period: string) {
    // Implementation would calculate composite preparedness score
    return { current: 72.4, change: 4.6 };
  }

  private async calculateContactsAccessed(institutionId?: string, regionId?: string, period: string) {
    // Implementation would calculate emergency contacts accessed
    return { current: 43, change: 8.9 };
  }

  private async calculateAlertDeliveryRate(institutionId?: string, regionId?: string, period: string) {
    // Implementation would calculate alert delivery rates
    return { current: 97.2, change: 1.1 };
  }

  // Report generation methods
  private async getImpactSummary(institutionId?: string, regionId?: string, startDate?: Date, endDate?: Date) {
    // Implementation would generate impact summary
    return {
      totalUsers: 1250,
      totalModulesCompleted: 3420,
      totalDrillsCompleted: 1890,
      averageImprovement: 12.8,
      overallPreparednessScore: 72.4
    };
  }

  private async getLearningOutcomes(institutionId?: string, regionId?: string, startDate?: Date, endDate?: Date) {
    // Implementation would generate learning outcomes report
    return {
      preTestAverage: 58.3,
      postTestAverage: 71.1,
      improvement: 12.8,
      completionRate: 65.5,
      timeSpentAverage: 45.2
    };
  }

  private async getDrillPerformanceSummary(institutionId?: string, regionId?: string, startDate?: Date, endDate?: Date) {
    // Implementation would generate drill performance summary
    return {
      passRate: 78.3,
      averageResponseTime: 28.5,
      averageScore: 82.4,
      improvementRate: 15.2
    };
  }

  private async getEngagementSummary(institutionId?: string, regionId?: string, startDate?: Date, endDate?: Date) {
    // Implementation would generate engagement summary
    return {
      dailyActiveUsers: 87,
      averageSessionDuration: 18.2,
      totalActions: 15420,
      mostActiveTime: '14:00-16:00'
    };
  }

  private async getPreparednessLevel(institutionId?: string, regionId?: string, startDate?: Date, endDate?: Date) {
    // Implementation would generate preparedness level report
    return {
      overallScore: 72.4,
      learningScore: 68.5,
      drillScore: 78.3,
      awarenessScore: 70.2,
      recommendations: ['Focus on earthquake preparedness', 'Increase drill frequency']
    };
  }

  private async generateRecommendations(institutionId?: string, regionId?: string) {
    // Implementation would generate data-driven recommendations
    return [
      {
        category: 'Learning',
        priority: 'High',
        recommendation: 'Increase focus on earthquake safety modules',
        impact: 'Expected 15% improvement in earthquake response times'
      },
      {
        category: 'Drills',
        priority: 'Medium',
        recommendation: 'Schedule more frequent fire evacuation drills',
        impact: 'Expected 10% improvement in fire safety preparedness'
      },
      {
        category: 'Engagement',
        priority: 'Low',
        recommendation: 'Add gamification elements to increase user engagement',
        impact: 'Expected 20% increase in daily active users'
      }
    ];
  }
}