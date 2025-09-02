import { useState, useEffect, useCallback } from 'react';
import { 
  UserStats, 
  ModuleProgress, 
  DrillPerformance, 
  Achievement, 
  Badge 
} from '@/lib/gamification';

interface UseGamificationOptions {
  userId: string;
  autoFetch?: boolean;
  refreshInterval?: number;
}

interface UseGamificationReturn {
  // Data
  stats: UserStats | null;
  moduleProgress: ModuleProgress[];
  drillPerformance: DrillPerformance[];
  achievements: Achievement[];
  badges: Badge[];
  
  // State
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchStats: () => Promise<void>;
  refreshStats: () => Promise<void>;
  updateProgress: (action: 'module_complete' | 'drill_complete' | 'lesson_complete') => Promise<void>;
  
  // Computed values
  overallScore: number;
  level: number;
  experiencePoints: number;
  progressToNextLevel: number;
  unlockedAchievements: Achievement[];
  unlockedBadges: Badge[];
}

export const useGamification = (options: UseGamificationOptions): UseGamificationReturn => {
  const { userId, autoFetch = true, refreshInterval = 30000 } = options;
  
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user statistics from the API
  const fetchStats = useCallback(async () => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/dashboard/stats?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch stats');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user statistics';
      setError(errorMessage);
      console.error('Error fetching gamification stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Update user progress
  const updateProgress = useCallback(async (action: 'module_complete' | 'drill_complete' | 'lesson_complete') => {
    if (!userId) return;
    
    try {
      const response = await fetch('/api/dashboard/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, action }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data);
      } else {
        throw new Error(result.error || 'Failed to update progress');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user progress';
      setError(errorMessage);
      console.error('Error updating user progress:', err);
    }
  }, [userId]);

  // Refresh stats (same as fetch but doesn't show loading state)
  const refreshStats = useCallback(async () => {
    if (!userId) return;
    
    try {
      const response = await fetch(`/api/dashboard/stats?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data);
      }
    } catch (err) {
      console.error('Error refreshing gamification stats:', err);
    }
  }, [userId]);

  // Auto-fetch on mount and when userId changes
  useEffect(() => {
    if (autoFetch && userId) {
      fetchStats();
    }
  }, [autoFetch, userId, fetchStats]);

  // Set up auto-refresh interval
  useEffect(() => {
    if (!autoFetch || !userId || refreshInterval <= 0) return;
    
    const interval = setInterval(refreshStats, refreshInterval);
    
    return () => clearInterval(interval);
  }, [autoFetch, userId, refreshInterval, refreshStats]);

  // Computed values
  const moduleProgress = stats?.moduleProgress || [];
  const drillPerformance = stats?.drillPerformance || [];
  const achievements = stats?.achievements || [];
  const badges = stats?.badges || [];
  
  const overallScore = stats?.overallScore || 0;
  const level = stats?.level || 1;
  const experiencePoints = stats?.experiencePoints || 0;
  const progressToNextLevel = stats?.progressToNextLevel || 0;
  
  const unlockedAchievements = achievements.filter(a => a.isUnlocked);
  const unlockedBadges = badges.filter(b => b.unlockedAt);

  return {
    // Data
    stats,
    moduleProgress,
    drillPerformance,
    achievements,
    badges,
    
    // State
    isLoading,
    error,
    
    // Actions
    fetchStats,
    refreshStats,
    updateProgress,
    
    // Computed values
    overallScore,
    level,
    experiencePoints,
    progressToNextLevel,
    unlockedAchievements,
    unlockedBadges,
  };
};
