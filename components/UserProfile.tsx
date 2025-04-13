'use client';

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Define badge types
type BadgeType = {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
};

// Define level progression
const LEVELS = [
  { level: 1, name: "Interview Novice", xpRequired: 0 },
  { level: 2, name: "Interview Apprentice", xpRequired: 100 },
  { level: 3, name: "Interview Explorer", xpRequired: 300 },
  { level: 4, name: "Interview Strategist", xpRequired: 600 },
  { level: 5, name: "Interview Tactician", xpRequired: 1000 },
  { level: 6, name: "Interview Specialist", xpRequired: 1500 },
  { level: 7, name: "Interview Expert", xpRequired: 2100 },
  { level: 8, name: "Interview Master", xpRequired: 2800 },
  { level: 9, name: "Interview Grandmaster", xpRequired: 3600 },
  { level: 10, name: "Technical Expert", xpRequired: 4500 },
];

// Define badges
const BADGES: BadgeType[] = [
  {
    id: "first-interview",
    name: "First Interview",
    description: "Completed your first interview",
    icon: "🎯",
    unlocked: false
  },
  {
    id: "perfect-score",
    name: "Perfect Score",
    description: "Achieved a perfect score in an interview",
    icon: "🏆",
    unlocked: false
  },
  {
    id: "consistent-learner",
    name: "Consistent Learner",
    description: "Used the platform for 7 consecutive days",
    icon: "📚",
    unlocked: false
  },
  {
    id: "technical-master",
    name: "Technical Master",
    description: "Mastered a technical topic",
    icon: "💻",
    unlocked: false
  },
  {
    id: "chat-expert",
    name: "Chat Expert",
    description: "Had 10 conversations with the AI assistant",
    icon: "💬",
    unlocked: false
  },
  {
    id: "course-completer",
    name: "Course Completer",
    description: "Completed an interview course",
    icon: "🎓",
    unlocked: false
  }
];

// Mock user data - in a real app, this would come from your database
const mockUserData = {
  xp: 250,
  level: 2,
  badges: BADGES.map(badge => {
    // Randomly unlock some badges for demo purposes
    const unlocked = Math.random() > 0.5;
    return {
      ...badge,
      unlocked,
      unlockedAt: unlocked ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : undefined
    };
  })
};

export default function UserProfile() {
  const [userData, setUserData] = useState(mockUserData);
  
  // Calculate current level and progress
  const currentLevel = LEVELS.find(level => userData.xp >= level.xpRequired) || LEVELS[0];
  const nextLevel = LEVELS.find(level => level.xpRequired > userData.xp) || LEVELS[LEVELS.length - 1];
  const xpForCurrentLevel = currentLevel.xpRequired;
  const xpForNextLevel = nextLevel.xpRequired;
  const xpProgress = ((userData.xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;
  
  // Count unlocked badges
  const unlockedBadges = userData.badges.filter(badge => badge.unlocked).length;
  
  return (
    <div className="space-y-6">
      {/* Level and XP */}
      <Card className="p-6 bg-gray-900/50 backdrop-blur-md border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">{currentLevel.name}</h2>
            <p className="text-gray-400">Level {currentLevel.level}</p>
          </div>
          <div className="text-right">
            <p className="text-white font-medium">{userData.xp} XP</p>
            <p className="text-sm text-gray-400">
              {xpForNextLevel - userData.xp} XP to {nextLevel.name}
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-400">
            <span>{xpForCurrentLevel} XP</span>
            <span>{xpForNextLevel} XP</span>
          </div>
          <Progress value={xpProgress} className="h-2 bg-gray-800" />
        </div>
      </Card>
      
      {/* Badges */}
      <Card className="p-6 bg-gray-900/50 backdrop-blur-md border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Achievements</h2>
          <Badge variant="outline" className="bg-blue-600/20 text-blue-400 border-blue-600/30">
            {unlockedBadges}/{userData.badges.length} Badges
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {userData.badges.map((badge) => (
            <TooltipProvider key={badge.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
                    badge.unlocked 
                      ? 'bg-gray-800 border-gray-700' 
                      : 'bg-gray-900/50 border-gray-800 opacity-50'
                  }`}>
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <p className="text-sm font-medium text-center text-white">{badge.name}</p>
                    {badge.unlocked && badge.unlockedAt && (
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(badge.unlockedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{badge.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </Card>
    </div>
  );
} 