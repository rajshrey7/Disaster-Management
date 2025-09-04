'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Target, 
  MapPin, 
  Globe,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Volume2,
  VolumeX
} from 'lucide-react';

interface DrillChoice {
  id: string;
  text: string;
  isCorrect?: boolean;
  feedback?: string;
  consequences?: string;
  nextStep?: number;
}

interface DrillStep {
  id: string;
  title: string;
  description: string;
  choices: DrillChoice[];
  correctChoice?: number;
  points: number;
  order: number;
  scenarioText?: string;
  mediaContent?: any[];
  feedback?: string[];
  consequences?: string[];
  nextStepLogic?: any;
  conditionalSteps?: any[];
}

interface InteractiveDrillProps {
  drillId: string;
  userId: string;
  onComplete?: (result: DrillResult) => void;
  onExit?: () => void;
  className?: string;
}

interface DrillResult {
  drillId: string;
  userId: string;
  score: number;
  maxScore: number;
  timeTaken: number;
  passed: boolean;
  decisionPath: any[];
  learningOutcomes: string[];
  improvementAreas: string[];
}

export const InteractiveDrill: React.FC<InteractiveDrillProps> = ({
  drillId,
  userId,
  onComplete,
  onExit,
  className = ''
}) => {
  // State management
  const [currentStep, setCurrentStep] = useState(0);
  const [drillData, setDrillData] = useState<any>(null);
  const [userResponses, setUserResponses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<any>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isStarted && !isPaused && !isCompleted) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isStarted, isPaused, isCompleted]);

  // Load drill data
  useEffect(() => {
    const loadDrill = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/drills/${drillId}?includeSteps=true`);
        
        if (!response.ok) {
          throw new Error('Failed to load drill');
        }

        const data = await response.json();
        setDrillData(data);
        setMaxScore(data.steps.reduce((sum: number, step: DrillStep) => sum + step.points, 0));
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load drill');
        setIsLoading(false);
      }
    };

    loadDrill();
  }, [drillId]);

  // Handle choice selection
  const handleChoiceSelect = useCallback((choiceId: string) => {
    setSelectedChoice(choiceId);
  }, []);

  // Handle step submission
  const handleStepSubmit = useCallback(async () => {
    if (!selectedChoice || !drillData) return;

    const currentStepData = drillData.steps[currentStep];
    const selectedChoiceData = currentStepData.choices.find((c: DrillChoice) => c.id === selectedChoice);
    
    if (!selectedChoiceData) return;

    // Calculate points
    const isCorrect = selectedChoiceData.isCorrect || 
                     (currentStepData.correctChoice !== undefined && 
                      currentStepData.choices.indexOf(selectedChoiceData) === currentStepData.correctChoice);
    
    const stepScore = isCorrect ? currentStepData.points : 0;
    setScore(prev => prev + stepScore);

    // Record response
    const response = {
      stepId: currentStepData.id,
      stepOrder: currentStepData.order,
      choiceId: selectedChoice,
      choiceText: selectedChoiceData.text,
      isCorrect,
      points: stepScore,
      timeSpent: 0, // Could track per-step time
      timestamp: new Date().toISOString()
    };

    setUserResponses(prev => [...prev, response]);

    // Show feedback
    setCurrentFeedback({
      choice: selectedChoiceData,
      isCorrect,
      feedback: selectedChoiceData.feedback,
      consequences: selectedChoiceData.consequences,
      points: stepScore
    });
    setShowFeedback(true);

    // Auto-advance after feedback delay
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedChoice(null);
      
      if (currentStep < drillData.steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        // Drill completed
        handleDrillComplete();
      }
    }, 3000);
  }, [selectedChoice, currentStep, drillData, score]);

  // Handle drill completion
  const handleDrillComplete = useCallback(async () => {
    if (!drillData) return;

    const timeTaken = timeElapsed;
    const passed = score >= (drillData.passingScore || 70);
    
    const result: DrillResult = {
      drillId,
      userId,
      score,
      maxScore,
      timeTaken,
      passed,
      decisionPath: userResponses,
      learningOutcomes: generateLearningOutcomes(userResponses, drillData),
      improvementAreas: generateImprovementAreas(userResponses, drillData)
    };

    setIsCompleted(true);
    
    // Save result to database
    try {
      await fetch('/api/progress/drill-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result)
      });
    } catch (err) {
      console.error('Failed to save drill result:', err);
    }

    // Call completion callback
    if (onComplete) {
      onComplete(result);
    }
  }, [drillId, userId, score, maxScore, timeElapsed, userResponses, drillData, onComplete]);

  // Generate learning outcomes
  const generateLearningOutcomes = (responses: any[], drill: any): string[] => {
    const outcomes: string[] = [];
    
    responses.forEach(response => {
      if (response.isCorrect) {
        outcomes.push(`Successfully completed step ${response.stepOrder}: ${response.choiceText}`);
      }
    });

    if (responses.length > 0) {
      const correctPercentage = (responses.filter(r => r.isCorrect).length / responses.length) * 100;
      outcomes.push(`Overall accuracy: ${correctPercentage.toFixed(1)}%`);
    }

    return outcomes;
  };

  // Generate improvement areas
  const generateImprovementAreas = (responses: any[], drill: any): string[] => {
    const areas: string[] = [];
    
    responses.forEach(response => {
      if (!response.isCorrect) {
        areas.push(`Review step ${response.stepOrder}: Consider alternative approaches`);
      }
    });

    if (responses.length > 0) {
      const incorrectCount = responses.filter(r => !r.isCorrect).length;
      if (incorrectCount > 0) {
        areas.push(`Focus on improving decision-making in ${incorrectCount} areas`);
      }
    }

    return areas;
  };

  // Format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress
  const progress = drillData ? ((currentStep + 1) / drillData.steps.length) * 100 : 0;

  if (isLoading) {
    return (
      <Card className={`w-full max-w-4xl mx-auto ${className}`}>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading interactive drill...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`w-full max-w-4xl mx-auto ${className}`}>
        <CardContent className="p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Drill</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  if (!drillData) {
    return (
      <Card className={`w-full max-w-4xl mx-auto ${className}`}>
        <CardContent className="p-8 text-center">
          <p>No drill data available</p>
        </CardContent>
      </Card>
    );
  }

  if (!isStarted) {
    return (
      <Card className={`w-full max-w-4xl mx-auto ${className}`}>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl mb-2">{drillData.title}</CardTitle>
          <CardDescription className="text-lg">{drillData.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Regional Context */}
          {drillData.regionalContext && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-blue-800">Regional Context</span>
              </div>
              <p className="text-blue-700">
                This drill is tailored for: <strong>{drillData.regionalContext.region}</strong>
              </p>
            </div>
          )}

          {/* Drill Information */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Target className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <p className="text-sm text-gray-600">Type</p>
              <p className="font-semibold">{drillData.type}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="h-6 w-6 mx-auto mb-2 text-orange-600">⚡</div>
              <p className="text-sm text-gray-600">Difficulty</p>
              <p className="font-semibold">{drillData.difficulty}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Clock className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <p className="text-sm text-gray-600">Duration</p>
              <p className="font-semibold">{drillData.duration} min</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="h-6 w-6 mx-auto mb-2 text-purple-600">📚</div>
              <p className="text-sm text-gray-600">Steps</p>
              <p className="font-semibold">{drillData.steps.length}</p>
            </div>
          </div>

          {/* Interactive Features */}
          {drillData.interactiveFeatures && (
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-800">Interactive Features</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {drillData.interactiveFeatures.branchingScenarios?.length > 0 && (
                  <Badge variant="secondary">Branching Scenarios</Badge>
                )}
                {drillData.interactiveFeatures.multimediaContent?.length > 0 && (
                  <Badge variant="secondary">Multimedia Content</Badge>
                )}
                {drillData.interactiveFeatures.accessibility?.length > 0 && (
                  <Badge variant="secondary">Accessibility Features</Badge>
                )}
              </div>
            </div>
          )}

          {/* Start Button */}
          <div className="text-center">
            <Button 
              size="lg" 
              onClick={() => setIsStarted(true)}
              className="px-8 py-3 text-lg"
            >
              <Play className="h-5 w-5 mr-2" />
              Start Interactive Drill
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isCompleted) {
    return (
      <Card className={`w-full max-w-4xl mx-auto ${className}`}>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl mb-2">Drill Completed!</CardTitle>
          <CardDescription>Great job completing the interactive scenario</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Results Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{score}</div>
              <p className="text-sm text-gray-600">Score</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{maxScore}</div>
              <p className="text-sm text-gray-600">Max Score</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{formatTime(timeElapsed)}</div>
              <p className="text-sm text-gray-600">Time Taken</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {score >= (drillData.passingScore || 70) ? 'PASSED' : 'FAILED'}
              </div>
              <p className="text-sm text-gray-600">Result</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button onClick={() => window.location.reload()}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Retry Drill
            </Button>
            {onExit && (
              <Button variant="outline" onClick={onExit}>
                Exit to Dashboard
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentStepData = drillData.steps[currentStep];

  return (
    <Card className={`w-full max-w-4xl mx-auto ${className}`}>
      <CardHeader>
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Step {currentStep + 1} of {drillData.steps.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Header Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPaused(!isPaused)}
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAudioEnabled(!audioEnabled)}
            >
              {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{formatTime(timeElapsed)}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Step */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Step {currentStep + 1}</Badge>
            <Badge variant="secondary">{currentStepData.points} points</Badge>
          </div>

          <h3 className="text-xl font-semibold">{currentStepData.title}</h3>
          <p className="text-gray-700">{currentStepData.description}</p>

          {/* Scenario Text */}
          {currentStepData.scenarioText && (
            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">Scenario Context</p>
                  <p className="text-yellow-700 mt-1">{currentStepData.scenarioText}</p>
                </div>
              </div>
            </div>
          )}

          {/* Media Content */}
          {currentStepData.mediaContent && currentStepData.mediaContent.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium mb-2">Supporting Media</p>
              <div className="flex gap-2">
                {currentStepData.mediaContent.map((media: any, index: number) => (
                  <div key={index} className="text-sm text-gray-600">
                    {media.type === 'image' && '🖼️'}
                    {media.type === 'video' && '🎥'}
                    {media.type === 'audio' && '🔊'}
                    {media.caption || `Media ${index + 1}`}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Choices */}
        <div className="space-y-3">
          <h4 className="font-medium">What would you do in this situation?</h4>
          <div className="grid gap-3">
            {currentStepData.choices.map((choice: DrillChoice, index: number) => (
              <Button
                key={choice.id}
                variant={selectedChoice === choice.id ? "default" : "outline"}
                className={`justify-start h-auto p-4 text-left ${
                  selectedChoice === choice.id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => handleChoiceSelect(choice.id)}
                disabled={showFeedback}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-sm font-medium">
                    {String.fromCharCode(65 + index)} {/* A, B, C, D */}
                  </div>
                  <span>{choice.text}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <Button
            size="lg"
            onClick={handleStepSubmit}
            disabled={!selectedChoice || showFeedback}
            className="px-8 py-3"
          >
            {currentStep === drillData.steps.length - 1 ? 'Complete Drill' : 'Continue to Next Step'}
          </Button>
        </div>

        {/* Feedback Display */}
        {showFeedback && currentFeedback && (
          <div className={`p-4 rounded-lg border-l-4 ${
            currentFeedback.isCorrect 
              ? 'bg-green-50 border-green-400' 
              : 'bg-red-50 border-red-400'
          }`}>
            <div className="flex items-start gap-2">
              {currentFeedback.isCorrect ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`font-medium ${
                    currentFeedback.isCorrect ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {currentFeedback.isCorrect ? 'Correct!' : 'Incorrect'}
                  </span>
                  <Badge variant="outline">
                    +{currentFeedback.points} points
                  </Badge>
                </div>
                
                {currentFeedback.feedback && (
                  <p className={`text-sm ${
                    currentFeedback.isCorrect ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {currentFeedback.feedback}
                  </p>
                )}
                
                {currentFeedback.consequences && (
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Consequences:</strong> {currentFeedback.consequences}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
