import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type BadgeTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';

export interface StudentBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: BadgeTier;
  unlockedAt: string; // ISO date
}

export interface LessonProgressEntry {
  moduleId: string;
  lessonId: string;
  completed: boolean;
  completedAt?: string;
}

export interface ModuleProgressEntry {
  moduleId: string;
  progressPercent: number; // 0..100
  completedLessons: number;
  totalLessons: number;
  isCompleted: boolean;
  lastAccessedAt?: string;
}

export interface StudentProfileState {
  userId: string | null;
  xp: number;
  level: number;
  progressToNextLevel: number; // 0..100
  badges: StudentBadge[];
  lessonProgress: Record<string, LessonProgressEntry>; // key: lessonId
  moduleProgress: Record<string, ModuleProgressEntry>; // key: moduleId
  streakDays: number;

  // actions
  setUser: (userId: string | null) => void;
  addXP: (amount: number) => void;
  addBadge: (badge: StudentBadge) => void;
  setModuleProgress: (entry: ModuleProgressEntry) => void;
  setLessonProgress: (entry: LessonProgressEntry) => void;
  markModuleCompleted: (moduleId: string) => void;
  incrementStreak: () => void;
  reset: () => void;
}

const BASE_LEVEL_XP = 1000;
const LEVEL_SCALING = 1.5;

function getLevelXP(level: number): number {
  if (level <= 1) return 0;
  let total = 0;
  let req = BASE_LEVEL_XP;
  for (let i = 2; i <= level; i++) {
    total += req;
    req = Math.floor(req * LEVEL_SCALING);
  }
  return total;
}

function computeLevelAndProgress(totalXP: number): { level: number; progressToNextLevel: number } {
  let level = 1;
  let req = BASE_LEVEL_XP;
  let remaining = totalXP;
  while (remaining >= req) {
    remaining -= req;
    level += 1;
    req = Math.floor(req * LEVEL_SCALING);
  }
  const currentLevelXP = getLevelXP(level);
  const nextLevelXP = getLevelXP(level + 1);
  const denom = Math.max(1, nextLevelXP - currentLevelXP);
  const progress = Math.min(100, Math.max(0, Math.round(((totalXP - currentLevelXP) / denom) * 100)));
  return { level, progressToNextLevel: progress };
}

export const useStudentProfileStore = create<StudentProfileState>()(
  persist(
    (set, get) => ({
      userId: null,
      xp: 0,
      level: 1,
      progressToNextLevel: 0,
      badges: [],
      lessonProgress: {},
      moduleProgress: {},
      streakDays: 0,

      setUser: (userId) => set({ userId }),

      addXP: (amount) => {
        const xp = Math.max(0, get().xp + Math.max(0, amount));
        const { level, progressToNextLevel } = computeLevelAndProgress(xp);
        set({ xp, level, progressToNextLevel });
      },

      addBadge: (badge) => {
        const existing = get().badges.find((b) => b.id === badge.id);
        if (existing) return;
        set({ badges: [...get().badges, badge] });
      },

      setModuleProgress: (entry) => {
        set({
          moduleProgress: {
            ...get().moduleProgress,
            [entry.moduleId]: entry,
          },
        });
      },

      setLessonProgress: (entry) => {
        set({
          lessonProgress: {
            ...get().lessonProgress,
            [entry.lessonId]: entry,
          },
        });
      },

      markModuleCompleted: (moduleId) => {
        const existing = get().moduleProgress[moduleId];
        const updated: ModuleProgressEntry = existing
          ? { ...existing, isCompleted: true, progressPercent: 100 }
          : { moduleId, isCompleted: true, progressPercent: 100, completedLessons: 0, totalLessons: 0 };
        set({
          moduleProgress: {
            ...get().moduleProgress,
            [moduleId]: updated,
          },
        });
      },

      incrementStreak: () => set({ streakDays: get().streakDays + 1 }),

      reset: () => set({
        xp: 0,
        level: 1,
        progressToNextLevel: 0,
        badges: [],
        lessonProgress: {},
        moduleProgress: {},
        streakDays: 0,
      }),
    }),
    {
      name: 'student-profile-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        userId: state.userId,
        xp: state.xp,
        level: state.level,
        progressToNextLevel: state.progressToNextLevel,
        badges: state.badges,
        lessonProgress: state.lessonProgress,
        moduleProgress: state.moduleProgress,
        streakDays: state.streakDays,
      }),
    }
  )
);


