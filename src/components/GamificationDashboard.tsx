'use client';

import React, { useState } from 'react';
import { useGamification } from '@/hooks/use-gamification';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Trophy, 
  Star, 
  Target, 
  BookOpen, 
  TrendingUp, 
  Award,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface GamificationDashboardProps {
  userId: string;
  className?: string;
}

export const GamificationDashboard: React.FC<GamificationDashboardProps> = ({ 
  userId, 
  className = '' 
}) => {
  const {
    stats,
    moduleProgress,
    drillPerformance,
    achievements,
    badges,
    isLoading,
    error,
    fetchStats,
    refreshStats,
    updateProgress,
    overallScore,
    level,
    experiencePoints,
    progressToNextLevel,
    unlockedAchievements,
    unlockedBadges
  } = useGamification({ userId });

  const [activeTab, setActiveTab] = useState<'overview' | 'modules' | 'drills' | 'achievements'>('overview');

  // Handle progress updates (for demo purposes)
  const handleProgressUpdate = async (action: 'module_complete' | 'drill_complete' | 'lesson_complete') => {
    await updateProgress(action);
  };

  if (isLoading && !stats) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading your preparedness profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-8 ${className}`}>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <p className="font-medium">Error loading dashboard</p>
            </div>
            <p className="text-red-700 mt-2">{error}</p>
            <Button 
              onClick={fetchStats} 
              variant="outline" 
              size="sm" 
              className="mt-3"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className={`p-8 ${className}`}>
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-600">No data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with overall stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Preparedness Profile</CardTitle>
              <CardDescription>
                Level {level} • {experiencePoints} XP • {overallScore}% Prepared
              </CardDescription>
            </div>
            <Button onClick={refreshStats} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Overall Score */}
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{overallScore}%</div>
              <div className="text-sm text-blue-800">Overall Score</div>
            </div>
            
            {/* Level */}
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{level}</div>
              <div className="text-sm text-green-800">Current Level</div>
            </div>
            
            {/* Experience Points */}
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">{experiencePoints}</div>
              <div className="text-sm text-purple-800">Experience</div>
            </div>
            
            {/* Achievements */}
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-3xl font-bold text-yellow-600">{unlockedAchievements.length}</div>
              <div className="text-sm text-yellow-800">Achievements</div>
            </div>
          </div>
          
          {/* Level Progress */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress to Level {level + 1}</span>
              <span>{Math.round(progressToNextLevel)}%</span>
            </div>
            <Progress value={progressToNextLevel} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'modules', label: 'Modules', icon: BookOpen },
          { id: 'drills', label: 'Drills', icon: Target },
          { id: 'achievements', label: 'Achievements', icon: Trophy }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {moduleProgress.slice(0, 3).map((module) => (
                  <div key={module.moduleId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{module.moduleTitle}</p>
                      <p className="text-xs text-gray-600">{module.category}</p>
                    </div>
                    <Badge variant={module.isCompleted ? 'default' : 'secondary'}>
                      {module.isCompleted ? 'Completed' : `${module.progress}%`}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Modules Started</span>
                  <span className="font-medium">{moduleProgress.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Modules Completed</span>
                  <span className="font-medium">{moduleProgress.filter(m => m.isCompleted).length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Drills Attempted</span>
                  <span className="font-medium">{drillPerformance.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Drills Passed</span>
                  <span className="font-medium">{drillPerformance.filter(d => d.passed).length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'modules' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Learning Modules
            </CardTitle>
            <CardDescription>
              Track your progress through disaster preparedness modules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {moduleProgress.map((module) => (
                <div key={module.moduleId} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{module.moduleTitle}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {module.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {module.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {module.score}
                      </div>
                      <div className="text-xs text-gray-500">Score</div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{module.completedLessons}/{module.totalLessons} lessons</span>
                    </div>
                    <Progress value={module.progress} className="h-2" />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      Last accessed: {new Date(module.lastAccessed).toLocaleDateString()}
                    </span>
                    {module.isCompleted && (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'drills' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Drill Performance
            </CardTitle>
            <CardDescription>
              Your performance in emergency preparedness drills
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {drillPerformance.map((drill) => (
                <div key={drill.drillId} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{drill.drillTitle}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {drill.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {drill.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        {drill.bestScore}/{drill.maxScore}
                      </div>
                      <div className="text-xs text-gray-500">Best Score</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-blue-600">{drill.attempts}</div>
                      <div className="text-xs text-gray-500">Attempts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-purple-600">
                        {Math.round(drill.averageScore)}
                      </div>
                      <div className="text-xs text-gray-500">Average</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-orange-600">
                        {Math.round((drill.bestScore / drill.maxScore) * 100)}%
                      </div>
                      <div className="text-xs text-gray-500">Accuracy</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      Last attempt: {new Date(drill.lastAttempt).toLocaleDateString()}
                    </span>
                    <Badge variant={drill.passed ? 'default' : 'secondary'}>
                      {drill.passed ? 'Passed' : 'Failed'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'achievements' && (
        <div className="space-y-6">
          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Achievements
              </CardTitle>
              <CardDescription>
                Unlock achievements by completing modules and drills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      achievement.isUnlocked
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${
                          achievement.isUnlocked ? 'text-green-800' : 'text-gray-600'
                        }`}>
                          {achievement.name}
                        </h3>
                        <p className={`text-sm ${
                          achievement.isUnlocked ? 'text-green-700' : 'text-gray-500'
                        }`}>
                          {achievement.description}
                        </p>
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{achievement.progress}/{achievement.maxProgress}</span>
                          </div>
                          <Progress 
                            value={(achievement.progress / achievement.maxProgress) * 100} 
                            className="h-2" 
                          />
                        </div>
                      </div>
                      {achievement.isUnlocked && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Badges
              </CardTitle>
              <CardDescription>
                Earn badges for mastering different categories and difficulty levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="text-center p-4 rounded-lg border bg-white hover:shadow-md transition-shadow"
                  >
                    <div className="text-4xl mb-2">{badge.icon}</div>
                    <h3 className="font-semibold text-gray-800 mb-1">{badge.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{badge.description}</p>
                    <Badge 
                      variant="outline" 
                      className={`${
                        badge.tier === 'GOLD' ? 'border-yellow-400 text-yellow-700' :
                        badge.tier === 'SILVER' ? 'border-gray-400 text-gray-700' :
                        badge.tier === 'BRONZE' ? 'border-amber-600 text-amber-700' :
                        'border-purple-400 text-purple-700'
                      }`}
                    >
                      {badge.tier}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Demo Controls */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-sm text-gray-600">Demo Controls</CardTitle>
          <CardDescription>
            Test the gamification system by simulating user actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button 
              onClick={() => handleProgressUpdate('module_complete')} 
              variant="outline" 
              size="sm"
            >
              Complete Module
            </Button>
            <Button 
              onClick={() => handleProgressUpdate('drill_complete')} 
              variant="outline" 
              size="sm"
            >
              Complete Drill
            </Button>
            <Button 
              onClick={() => handleProgressUpdate('lesson_complete')} 
              variant="outline" 
              size="sm"
            >
              Complete Lesson
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
