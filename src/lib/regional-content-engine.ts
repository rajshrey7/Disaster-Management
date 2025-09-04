import { db } from '@/lib/db';
import { ModuleCategory, ModuleDifficulty, UserRole } from '@prisma/client';

interface HazardProfile {
  id: string;
  regionId: string;
  primaryHazards: ModuleCategory[];
  secondaryHazards: ModuleCategory[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  seasonalVariations: {
    season: string;
    hazards: ModuleCategory[];
    severity: 'low' | 'medium' | 'high';
  }[];
  recommendedModules: string[];
  priorityOrder: ModuleCategory[];
}

interface ContentRecommendation {
  moduleId: string;
  title: string;
  category: ModuleCategory;
  difficulty: ModuleDifficulty;
  priority: number;
  reason: string;
  estimatedDuration: number;
  prerequisites?: string[];
}

export class RegionalContentEngine {
  private static instance: RegionalContentEngine;
  private hazardProfiles: Map<string, HazardProfile> = new Map();

  private constructor() {}

  static getInstance(): RegionalContentEngine {
    if (!RegionalContentEngine.instance) {
      RegionalContentEngine.instance = new RegionalContentEngine();
    }
    return RegionalContentEngine.instance;
  }

  async initialize() {
    await this.loadHazardProfiles();
    console.log('Regional Content Engine initialized');
  }

  private async loadHazardProfiles() {
    try {
      const regions = await db.geographicRegion.findMany({
        include: {
          modules: true,
          alerts: {
            where: {
              status: 'ACTIVE'
            },
            orderBy: {
              issuedAt: 'desc'
            },
            take: 10
          }
        }
      });

      for (const region of regions) {
        const profile = await this.createHazardProfile(region);
        this.hazardProfiles.set(region.id, profile);
      }

      console.log(`Loaded ${this.hazardProfiles.size} hazard profiles`);
    } catch (error) {
      console.error('Error loading hazard profiles:', error);
    }
  }

  private async createHazardProfile(region: any): Promise<HazardProfile> {
    const hazards = JSON.parse(region.hazards || '[]');
    const climate = JSON.parse(region.climate || '{}');
    
    // Determine primary and secondary hazards based on region data
    const primaryHazards = this.categorizeHazards(hazards, 'primary');
    const secondaryHazards = this.categorizeHazards(hazards, 'secondary');
    
    // Calculate risk level based on hazard frequency and severity
    const riskLevel = this.calculateRiskLevel(hazards, region.alerts);
    
    // Create seasonal variations
    const seasonalVariations = this.createSeasonalVariations(climate, hazards);
    
    // Get recommended modules for this region
    const recommendedModules = await this.getRecommendedModules(region.id, primaryHazards);
    
    // Determine priority order
    const priorityOrder = this.determinePriorityOrder(primaryHazards, riskLevel);

    return {
      id: `${region.id}-profile`,
      regionId: region.id,
      primaryHazards,
      secondaryHazards,
      riskLevel,
      seasonalVariations,
      recommendedModules,
      priorityOrder
    };
  }

  private categorizeHazards(hazards: string[], type: 'primary' | 'secondary'): ModuleCategory[] {
    const hazardMapping: Record<string, ModuleCategory> = {
      'earthquake': ModuleCategory.EARTHQUAKE,
      'flood': ModuleCategory.FLOOD,
      'cyclone': ModuleCategory.CYCLONE,
      'fire': ModuleCategory.FIRE,
      'landslide': ModuleCategory.LANDSLIDE,
      'drought': ModuleCategory.DROUGHT,
      'heatwave': ModuleCategory.HEATWAVE,
      'cold_wave': ModuleCategory.COLD_WAVE,
      'biological': ModuleCategory.BIOLOGICAL_HAZARD,
      'chemical': ModuleCategory.CHEMICAL_HAZARD,
      'nuclear': ModuleCategory.NUCLEAR_HAZARD
    };

    return hazards
      .filter(hazard => hazardMapping[hazard])
      .map(hazard => hazardMapping[hazard])
      .slice(0, type === 'primary' ? 3 : 5); // Limit primary to 3, secondary to 5
  }

  private calculateRiskLevel(hazards: string[], recentAlerts: any[]): 'low' | 'medium' | 'high' | 'critical' {
    let riskScore = 0;
    
    // Base risk from number of hazards
    riskScore += hazards.length * 10;
    
    // Additional risk from recent alerts
    riskScore += recentAlerts.length * 15;
    
    // High-risk hazards add more points
    const highRiskHazards = ['earthquake', 'flood', 'cyclone'];
    riskScore += hazards.filter(h => highRiskHazards.includes(h)).length * 20;
    
    if (riskScore >= 80) return 'critical';
    if (riskScore >= 60) return 'high';
    if (riskScore >= 30) return 'medium';
    return 'low';
  }

  private createSeasonalVariations(climate: any, hazards: string[]) {
    const seasons = ['summer', 'monsoon', 'winter', 'post-monsoon'];
    const seasonalHazards: Record<string, ModuleCategory[]> = {
      summer: [ModuleCategory.HEATWAVE, ModuleCategory.FIRE],
      monsoon: [ModuleCategory.FLOOD, ModuleCategory.LANDSLIDE],
      winter: [ModuleCategory.COLD_WAVE],
      'post-monsoon': [ModuleCategory.CYCLONE]
    };

    return seasons.map(season => ({
      season,
      hazards: seasonalHazards[season] || [],
      severity: this.getSeasonalSeverity(season, hazards)
    }));
  }

  private getSeasonalSeverity(season: string, hazards: string[]): 'low' | 'medium' | 'high' {
    const seasonalRisk: Record<string, string[]> = {
      summer: ['heatwave', 'fire'],
      monsoon: ['flood', 'landslide'],
      winter: ['cold_wave'],
      'post-monsoon': ['cyclone']
    };

    const relevantHazards = hazards.filter(h => seasonalRisk[season]?.includes(h));
    if (relevantHazards.length >= 2) return 'high';
    if (relevantHazards.length === 1) return 'medium';
    return 'low';
  }

  private async getRecommendedModules(regionId: string, primaryHazards: ModuleCategory[]): Promise<string[]> {
    try {
      const modules = await db.learningModule.findMany({
        where: {
          geographicRegionId: regionId,
          category: {
            in: primaryHazards
          },
          isActive: true
        },
        orderBy: {
          difficulty: 'asc'
        },
        take: 10
      });

      return modules.map(m => m.id);
    } catch (error) {
      console.error('Error getting recommended modules:', error);
      return [];
    }
  }

  private determinePriorityOrder(primaryHazards: ModuleCategory[], riskLevel: string): ModuleCategory[] {
    // High-risk categories get priority
    const riskPriority: Record<string, ModuleCategory[]> = {
      critical: [
        ModuleCategory.EARTHQUAKE,
        ModuleCategory.FLOOD,
        ModuleCategory.CYCLONE,
        ModuleCategory.FIRE
      ],
      high: [
        ModuleCategory.EARTHQUAKE,
        ModuleCategory.FLOOD,
        ModuleCategory.CYCLONE,
        ModuleCategory.FIRE,
        ModuleCategory.LANDSLIDE
      ],
      medium: [
        ModuleCategory.FIRE,
        ModuleCategory.FLOOD,
        ModuleCategory.EARTHQUAKE,
        ModuleCategory.BIOLOGICAL_HAZARD
      ],
      low: [
        ModuleCategory.FIRE,
        ModuleCategory.FIRST_AID,
        ModuleCategory.EMERGENCY_COMMUNICATION
      ]
    };

    return riskPriority[riskLevel] || riskPriority.medium;
  }

  async getPersonalizedRecommendations(userId: string): Promise<ContentRecommendation[]> {
    try {
      const user = await db.user.findUnique({
        where: { id: userId },
        include: {
          geographicRegion: true,
          progress: {
            include: {
              module: true
            }
          }
        }
      });

      if (!user || !user.geographicRegionId) {
        return this.getDefaultRecommendations();
      }

      const profile = this.hazardProfiles.get(user.geographicRegionId);
      if (!profile) {
        return this.getDefaultRecommendations();
      }

      // Get user's completed modules
      const completedModules = user.progress
        .filter(p => p.isCompleted)
        .map(p => p.moduleId);

      // Get available modules for this region
      const availableModules = await db.learningModule.findMany({
        where: {
          geographicRegionId: user.geographicRegionId,
          isActive: true,
          id: {
            notIn: completedModules
          }
        },
        include: {
          lessons: true
        }
      });

      // Score and rank modules
      const recommendations: ContentRecommendation[] = [];
      
      for (const module of availableModules) {
        const score = this.calculateModuleScore(module, profile, user.role);
        const priority = this.getPriorityLevel(score, profile.priorityOrder.indexOf(module.category));
        
        recommendations.push({
          moduleId: module.id,
          title: module.title,
          category: module.category,
          difficulty: module.difficulty,
          priority,
          reason: this.getRecommendationReason(module, profile),
          estimatedDuration: module.duration,
          prerequisites: module.prerequisites ? JSON.parse(module.prerequisites) : undefined
        });
      }

      // Sort by priority and return top recommendations
      return recommendations
        .sort((a, b) => a.priority - b.priority)
        .slice(0, 10);
    } catch (error) {
      console.error('Error getting personalized recommendations:', error);
      return this.getDefaultRecommendations();
    }
  }

  private calculateModuleScore(module: any, profile: HazardProfile, userRole: UserRole): number {
    let score = 0;

    // Primary hazard modules get highest score
    if (profile.primaryHazards.includes(module.category)) {
      score += 100;
    }
    // Secondary hazard modules get medium score
    else if (profile.secondaryHazards.includes(module.category)) {
      score += 60;
    }
    // Other modules get base score
    else {
      score += 20;
    }

    // Adjust for risk level
    const riskMultiplier = {
      low: 0.8,
      medium: 1.0,
      high: 1.3,
      critical: 1.5
    };
    score *= riskMultiplier[profile.riskLevel];

    // Adjust for user role
    const roleMultiplier = {
      STUDENT: 1.0,
      TEACHER: 1.2,
      ADMINISTRATOR: 1.1,
      EMERGENCY_RESPONDER: 1.4,
      PARENT: 0.9
    };
    score *= roleMultiplier[userRole];

    // Adjust for difficulty (beginner modules get slight preference)
    const difficultyMultiplier = {
      BEGINNER: 1.1,
      INTERMEDIATE: 1.0,
      ADVANCED: 0.9,
      EXPERT: 0.8
    };
    score *= difficultyMultiplier[module.difficulty];

    return score;
  }

  private getPriorityLevel(score: number, positionInPriority: number): number {
    // Lower number = higher priority
    if (score >= 120) return 1;
    if (score >= 80) return 2;
    if (score >= 50) return 3;
    return 4;
  }

  private getRecommendationReason(module: any, profile: HazardProfile): string {
    if (profile.primaryHazards.includes(module.category)) {
      return `High priority for your region due to ${profile.riskLevel} risk level`;
    } else if (profile.secondaryHazards.includes(module.category)) {
      return `Recommended for your region's secondary hazards`;
    } else {
      return 'General preparedness training';
    }
  }

  private getDefaultRecommendations(): ContentRecommendation[] {
    return [
      {
        moduleId: 'default-fire-safety',
        title: 'Fire Safety Basics',
        category: ModuleCategory.FIRE,
        difficulty: ModuleDifficulty.BEGINNER,
        priority: 1,
        reason: 'Essential safety training for everyone',
        estimatedDuration: 30
      },
      {
        moduleId: 'default-first-aid',
        title: 'First Aid Essentials',
        category: ModuleCategory.FIRST_AID,
        difficulty: ModuleDifficulty.BEGINNER,
        priority: 2,
        reason: 'Basic medical emergency response',
        estimatedDuration: 45
      }
    ];
  }

  async getSeasonalRecommendations(regionId: string, currentSeason: string): Promise<ContentRecommendation[]> {
    try {
      const profile = this.hazardProfiles.get(regionId);
      if (!profile) return [];

      const seasonalVariation = profile.seasonalVariations.find(sv => sv.season === currentSeason);
      if (!seasonalVariation || seasonalVariation.hazards.length === 0) return [];

      const modules = await db.learningModule.findMany({
        where: {
          geographicRegionId: regionId,
          category: {
            in: seasonalVariation.hazards
          },
          isActive: true
        },
        orderBy: {
          difficulty: 'asc'
        },
        take: 5
      });

      return modules.map(module => ({
        moduleId: module.id,
        title: module.title,
        category: module.category,
        difficulty: module.difficulty,
        priority: seasonalVariation.severity === 'high' ? 1 : 2,
        reason: `Seasonal recommendation for ${currentSeason}`,
        estimatedDuration: module.duration
      }));
    } catch (error) {
      console.error('Error getting seasonal recommendations:', error);
      return [];
    }
  }

  async updateHazardProfile(regionId: string, newHazards: string[], climateData?: any) {
    try {
      const region = await db.geographicRegion.findUnique({
        where: { id: regionId }
      });

      if (!region) {
        throw new Error('Region not found');
      }

      // Update region data
      await db.geographicRegion.update({
        where: { id: regionId },
        data: {
          hazards: JSON.stringify(newHazards),
          climate: climateData ? JSON.stringify(climateData) : region.climate
        }
      });

      // Recreate hazard profile
      const updatedRegion = await db.geographicRegion.findUnique({
        where: { id: regionId },
        include: {
          modules: true,
          alerts: {
            where: {
              status: 'ACTIVE'
            },
            orderBy: {
              issuedAt: 'desc'
            },
            take: 10
          }
        }
      });

      if (updatedRegion) {
        const newProfile = await this.createHazardProfile(updatedRegion);
        this.hazardProfiles.set(regionId, newProfile);
      }

      console.log(`Updated hazard profile for region ${regionId}`);
    } catch (error) {
      console.error('Error updating hazard profile:', error);
    }
  }

  getHazardProfile(regionId: string): HazardProfile | undefined {
    return this.hazardProfiles.get(regionId);
  }

  getAllHazardProfiles(): HazardProfile[] {
    return Array.from(this.hazardProfiles.values());
  }
}