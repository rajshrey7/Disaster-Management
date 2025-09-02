import { db } from './db';

export interface UserStats {
  userId: string;
  overallScore: number;
  moduleProgress: ModuleProgress[];
  drillPerformance: DrillPerformance[];
  achievements: Achievement[];
  badges: Badge[];
  level: number;
  experiencePoints: number;
  nextLevelXP: number;
  progressToNextLevel: number;
}

export interface ModuleProgress {
  moduleId: string;
  moduleTitle: string;
  category: string;
  difficulty: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  isCompleted: boolean;
  lastAccessed: Date;
  score: number;
}

export interface DrillPerformance {
  drillId: string;
  drillTitle: string;
  type: string;
  difficulty: string;
  bestScore: number;
  maxScore: number;
  attempts: number;
  averageScore: number;
  lastAttempt: Date;
  passed: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'LEARNING' | 'DRILL' | 'STREAK' | 'SPECIAL';
  unlockedAt: Date;
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  unlockedAt: Date;
  category: string;
}

export interface GamificationConfig {
  // XP multipliers
  moduleCompletionXP: number;
  lessonCompletionXP: number;
  drillPassXP: number;
  perfectDrillXP: number;
  streakBonusXP: number;
  
  // Level thresholds
  baseLevelXP: number;
  levelScalingFactor: number;
  
  // Achievement thresholds
  moduleCompletionThreshold: number;
  drillPassThreshold: number;
  perfectScoreThreshold: number;
  streakThreshold: number;
}

// Default gamification configuration
export const defaultConfig: GamificationConfig = {
  moduleCompletionXP: 100,
  lessonCompletionXP: 10,
  drillPassXP: 50,
  perfectDrillXP: 100,
  streakBonusXP: 25,
  baseLevelXP: 1000,
  levelScalingFactor: 1.5,
  moduleCompletionThreshold: 5,
  drillPassThreshold: 10,
  perfectScoreThreshold: 5,
  streakThreshold: 7
};

export class GamificationService {
  private config: GamificationConfig;

  constructor(config: GamificationConfig = defaultConfig) {
    this.config = config;
  }

  /**
   * Calculate user's overall preparedness score and statistics
   */
  async calculateUserStats(userId: string): Promise<UserStats> {
    try {
      // Fetch user progress and drill results
      const [userProgress, drillResults, achievements, badges] = await Promise.all([
        this.getUserProgress(userId),
        this.getUserDrillResults(userId),
        this.getUserAchievements(userId),
        this.getUserBadges(userId)
      ]);

      // Calculate overall score
      const overallScore = this.calculateOverallScore(userProgress, drillResults);

      // Calculate level and XP
      const { level, experiencePoints, nextLevelXP, progressToNextLevel } = 
        this.calculateLevelAndXP(userProgress, drillResults);

      return {
        userId,
        overallScore,
        moduleProgress: userProgress,
        drillPerformance: drillResults,
        achievements,
        badges,
        level,
        experiencePoints,
        nextLevelXP,
        progressToNextLevel
      };
    } catch (error) {
      console.error('Error calculating user stats:', error);
      throw new Error('Failed to calculate user statistics');
    }
  }

  /**
   * Get user's module progress with detailed information
   */
  private async getUserProgress(userId: string): Promise<ModuleProgress[]> {
    const progress = await db.userProgress.findMany({
      where: { userId },
      include: {
        module: {
          include: {
            lessons: true
          }
        },
        lesson: true
      }
    });

    return progress.map(p => ({
      moduleId: p.moduleId,
      moduleTitle: p.module.title,
      category: p.module.category,
      difficulty: p.module.difficulty,
      progress: p.progress,
      completedLessons: p.completedLessons,
      totalLessons: p.module.lessons.length,
      isCompleted: p.isCompleted,
      lastAccessed: p.lastAccessed || p.updatedAt,
      score: this.calculateModuleScore(p)
    }));
  }

  /**
   * Get user's drill performance with aggregated statistics
   */
  private async getUserDrillResults(userId: string): Promise<DrillPerformance[]> {
    const results = await db.drillResult.findMany({
      where: { userId },
      include: {
        drill: true
      },
      orderBy: { completedAt: 'desc' }
    });

    // Group results by drill and calculate statistics
    const drillStats = new Map<string, DrillPerformance>();
    
    results.forEach(result => {
      const drillId = result.drillId;
      const existing = drillStats.get(drillId);
      
      if (existing) {
        existing.attempts++;
        existing.averageScore = (existing.averageScore + result.score) / 2;
        existing.bestScore = Math.max(existing.bestScore, result.score);
        existing.lastAttempt = result.completedAt;
        existing.passed = existing.passed || result.passed;
      } else {
        drillStats.set(drillId, {
          drillId,
          drillTitle: result.drill.title,
          type: result.drill.type,
          difficulty: result.drill.difficulty,
          bestScore: result.score,
          maxScore: result.maxScore,
          attempts: 1,
          averageScore: result.score,
          lastAttempt: result.completedAt,
          passed: result.passed
        });
      }
    });

    return Array.from(drillStats.values());
  }

  /**
   * Calculate module score based on progress and completion
   */
  private calculateModuleScore(progress: any): number {
    const baseScore = progress.progress;
    const completionBonus = progress.isCompleted ? 20 : 0;
    const difficultyMultiplier = this.getDifficultyMultiplier(progress.module.difficulty);
    
    return Math.round((baseScore + completionBonus) * difficultyMultiplier);
  }

  /**
   * Get difficulty multiplier for scoring
   */
  private getDifficultyMultiplier(difficulty: string): number {
    switch (difficulty) {
      case 'BEGINNER': return 1.0;
      case 'INTERMEDIATE': return 1.2;
      case 'ADVANCED': return 1.5;
      default: return 1.0;
    }
  }

  /**
   * Calculate overall preparedness score
   */
  private calculateOverallScore(moduleProgress: ModuleProgress[], drillPerformance: DrillPerformance[]): number {
    const moduleScore = this.calculateModuleScore(moduleProgress);
    const drillScore = this.calculateDrillScore(drillPerformance);
    
    // Weighted combination: 70% modules, 30% drills
    return Math.round(moduleScore * 0.7 + drillScore * 0.3);
  }

  /**
   * Calculate module-based score
   */
  private calculateModuleScore(moduleProgress: ModuleProgress[]): number {
    if (moduleProgress.length === 0) return 0;
    
    const totalScore = moduleProgress.reduce((sum, module) => {
      return sum + module.score;
    }, 0);
    
    return Math.round(totalScore / moduleProgress.length);
  }

  /**
   * Calculate drill-based score
   */
  private calculateDrillScore(drillPerformance: DrillPerformance[]): number {
    if (drillPerformance.length === 0) return 0;
    
    const totalScore = drillPerformance.reduce((sum, drill) => {
      const accuracy = drill.bestScore / drill.maxScore;
      const difficultyMultiplier = this.getDifficultyMultiplier(drill.difficulty);
      const attemptBonus = Math.max(0, 10 - drill.attempts); // Bonus for fewer attempts
      
      return sum + (accuracy * 100 * difficultyMultiplier + attemptBonus);
    }, 0);
    
    return Math.round(totalScore / drillPerformance.length);
  }

  /**
   * Calculate user level and experience points
   */
  private calculateLevelAndXP(moduleProgress: ModuleProgress[], drillPerformance: DrillPerformance[]): {
    level: number;
    experiencePoints: number;
    nextLevelXP: number;
    progressToNextLevel: number;
  } {
    let totalXP = 0;
    
    // XP from module completions
    moduleProgress.forEach(module => {
      if (module.isCompleted) {
        totalXP += this.config.moduleCompletionXP;
      }
      totalXP += Math.floor(module.progress / 10) * this.config.lessonCompletionXP;
    });
    
    // XP from drill performance
    drillPerformance.forEach(drill => {
      if (drill.passed) {
        totalXP += this.config.drillPassXP;
        if (drill.bestScore === drill.maxScore) {
          totalXP += this.config.perfectDrillXP;
        }
      }
    });
    
    // Calculate level
    const level = this.calculateLevel(totalXP);
    const currentLevelXP = this.getLevelXP(level);
    const nextLevelXP = this.getLevelXP(level + 1);
    const progressToNextLevel = nextLevelXP > currentLevelXP 
      ? ((totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100
      : 100;
    
    return {
      level,
      experiencePoints: totalXP,
      nextLevelXP,
      progressToNextLevel: Math.min(100, Math.max(0, progressToNextLevel))
    };
  }

  /**
   * Calculate level based on total XP
   */
  private calculateLevel(totalXP: number): number {
    let level = 1;
    let requiredXP = this.config.baseLevelXP;
    
    while (totalXP >= requiredXP) {
      totalXP -= requiredXP;
      level++;
      requiredXP = Math.floor(requiredXP * this.config.levelScalingFactor);
    }
    
    return level;
  }

  /**
   * Get XP required for a specific level
   */
  private getLevelXP(level: number): number {
    if (level <= 1) return 0;
    
    let totalXP = 0;
    let requiredXP = this.config.baseLevelXP;
    
    for (let i = 2; i <= level; i++) {
      totalXP += requiredXP;
      requiredXP = Math.floor(requiredXP * this.config.levelScalingFactor);
    }
    
    return totalXP;
  }

  /**
   * Get user's achievements
   */
  private async getUserAchievements(userId: string): Promise<Achievement[]> {
    const [moduleProgress, drillPerformance] = await Promise.all([
      this.getUserProgress(userId),
      this.getUserDrillResults(userId)
    ]);

    const achievements: Achievement[] = [];
    
    // Module completion achievements
    const completedModules = moduleProgress.filter(m => m.isCompleted).length;
    achievements.push({
      id: 'module_master',
      name: 'Module Master',
      description: `Complete ${this.config.moduleCompletionThreshold} modules`,
      icon: '📚',
      category: 'LEARNING',
      unlockedAt: new Date(),
      progress: Math.min(completedModules, this.config.moduleCompletionThreshold),
      maxProgress: this.config.moduleCompletionThreshold,
      isUnlocked: completedModules >= this.config.moduleCompletionThreshold
    });

    // Drill achievements
    const passedDrills = drillPerformance.filter(d => d.passed).length;
    achievements.push({
      id: 'drill_expert',
      name: 'Drill Expert',
      description: `Pass ${this.config.drillPassThreshold} drills`,
      icon: '🎯',
      category: 'DRILL',
      unlockedAt: new Date(),
      progress: Math.min(passedDrills, this.config.drillPassThreshold),
      maxProgress: this.config.drillPassThreshold,
      isUnlocked: passedDrills >= this.config.drillPassThreshold
    });

    // Perfect score achievements
    const perfectDrills = drillPerformance.filter(d => d.bestScore === d.maxScore).length;
    achievements.push({
      id: 'perfect_score',
      name: 'Perfect Score',
      description: `Get perfect scores on ${this.config.perfectScoreThreshold} drills`,
      icon: '⭐',
      category: 'DRILL',
      unlockedAt: new Date(),
      progress: Math.min(perfectDrills, this.config.perfectScoreThreshold),
      maxProgress: this.config.perfectScoreThreshold,
      isUnlocked: perfectDrills >= this.config.perfectScoreThreshold
    });

    return achievements;
  }

  /**
   * Get user's badges
   */
  private async getUserBadges(userId: string): Promise<Badge[]> {
    const [moduleProgress, drillPerformance] = await Promise.all([
      this.getUserProgress(userId),
      this.getUserDrillResults(userId)
    ]);

    const badges: Badge[] = [];
    
    // Category-based badges
    const categories = [...new Set(moduleProgress.map(m => m.category))];
    categories.forEach(category => {
      const categoryModules = moduleProgress.filter(m => m.category === category);
      const completed = categoryModules.filter(m => m.isCompleted).length;
      
      if (completed >= 2) {
        badges.push({
          id: `badge_${category.toLowerCase()}`,
          name: `${category} Specialist`,
          description: `Complete multiple ${category} modules`,
          icon: this.getCategoryIcon(category),
          tier: completed >= 5 ? 'GOLD' : completed >= 3 ? 'SILVER' : 'BRONZE',
          unlockedAt: new Date(),
          category
        });
      }
    });

    // Difficulty-based badges
    const difficulties = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
    difficulties.forEach(difficulty => {
      const difficultyModules = moduleProgress.filter(m => m.difficulty === difficulty);
      const completed = difficultyModules.filter(m => m.isCompleted).length;
      
      if (completed >= 2) {
        badges.push({
          id: `badge_${difficulty.toLowerCase()}`,
          name: `${difficulty} Challenger`,
          description: `Master ${difficulty.toLowerCase()} level content`,
          icon: this.getDifficultyIcon(difficulty),
          tier: completed >= 5 ? 'GOLD' : completed >= 3 ? 'SILVER' : 'BRONZE',
          unlockedAt: new Date(),
          category: 'DIFFICULTY'
        });
      }
    });

    return badges;
  }

  /**
   * Get category icon
   */
  private getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'EARTHQUAKE': '🌋',
      'FLOOD': '🌊',
      'FIRE': '🔥',
      'FIRST_AID': '🏥',
      'REGIONAL_HAZARDS': '⚠️',
      'EMERGENCY_COMMUNICATION': '📡'
    };
    return icons[category] || '📚';
  }

  /**
   * Get difficulty icon
   */
  private getDifficultyIcon(difficulty: string): string {
    const icons: { [key: string]: string } = {
      'BEGINNER': '🌱',
      'INTERMEDIATE': '🌿',
      'ADVANCED': '🌳'
    };
    return icons[difficulty] || '📚';
  }

  /**
   * Update user's gamification data (call this after completing modules/drills)
   */
  async updateUserProgress(userId: string, action: 'module_complete' | 'drill_complete' | 'lesson_complete'): Promise<void> {
    // This method can be used to trigger real-time updates or notifications
    // when users earn achievements or level up
    console.log(`User ${userId} performed action: ${action}`);
  }
}

// Export singleton instance
export const gamificationService = new GamificationService();
