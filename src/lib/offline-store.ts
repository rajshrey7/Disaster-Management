import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface OfflineModule {
  id: string;
  title: string;
  content: string;
  category: string;
  difficulty: string;
  duration: number;
  downloadedAt: Date;
  lastAccessed: Date;
  isComplete: boolean;
  progress: number;
  lessons: OfflineLesson[];
}

interface OfflineLesson {
  id: string;
  moduleId: string;
  title: string;
  content: string;
  order: number;
  isComplete: boolean;
  progress: number;
  timeSpent: number;
  quizResults: QuizResult[];
}

interface QuizResult {
  quizId: string;
  score: number;
  maxScore: number;
  passed: boolean;
  completedAt: Date;
  answers: Record<string, any>;
}

interface OfflineDrill {
  id: string;
  title: string;
  type: string;
  difficulty: string;
  scenario: string;
  downloadedAt: Date;
  isComplete: boolean;
  progress: number;
  results: DrillResult[];
}

interface DrillResult {
  drillId: string;
  score: number;
  maxScore: number;
  timeTaken: number;
  passed: boolean;
  completedAt: Date;
  responses: Record<string, any>;
}

interface OfflineAlert {
  id: string;
  title: string;
  description: string;
  type: string;
  severity: string;
  area: string;
  issuedAt: Date;
  expiresAt: Date;
  isRead: boolean;
}

interface OfflineContact {
  id: string;
  name: string;
  number: string;
  category: string;
  description: string;
  isFavorite: boolean;
}

interface SyncOperation {
  id: string;
  type: 'module_progress' | 'drill_result' | 'quiz_result' | 'user_profile';
  data: any;
  timestamp: Date;
  retryCount: number;
  lastSyncAttempt?: Date;
}

interface OfflineState {
  // Data storage
  modules: Map<string, OfflineModule>;
  drills: Map<string, OfflineDrill>;
  alerts: Map<string, OfflineAlert>;
  contacts: Map<string, OfflineContact>;
  
  // Sync queue
  syncQueue: SyncOperation[];
  
  // Settings
  isOnline: boolean;
  lastSync: Date | null;
  autoSync: boolean;
  storageLimit: number; // in MB
  
  // Actions
  // Module actions
  downloadModule: (module: any) => Promise<void>;
  updateModuleProgress: (moduleId: string, progress: number, lessonId?: string) => void;
  completeLesson: (moduleId: string, lessonId: string, timeSpent: number) => void;
  completeModule: (moduleId: string) => void;
  
  // Drill actions
  downloadDrill: (drill: any) => Promise<void>;
  updateDrillProgress: (drillId: string, progress: number) => void;
  completeDrill: (drillId: string, result: DrillResult) => void;
  
  // Alert actions
  addAlert: (alert: any) => void;
  markAlertAsRead: (alertId: string) => void;
  expireOldAlerts: () => void;
  
  // Contact actions
  addContact: (contact: any) => void;
  toggleContactFavorite: (contactId: string) => void;
  
  // Sync actions
  addToSyncQueue: (operation: SyncOperation) => void;
  processSyncQueue: () => Promise<void>;
  clearSyncQueue: () => void;
  
  // Utility actions
  setOnlineStatus: (isOnline: boolean) => void;
  clearOldData: () => void;
  getStorageUsage: () => number;
}

export const useOfflineStore = create<OfflineState>()(
  persist(
    (set, get) => ({
      // Initial state
      modules: new Map(),
      drills: new Map(),
      alerts: new Map(),
      contacts: new Map(),
      syncQueue: [],
      isOnline: navigator.onLine,
      lastSync: null,
      autoSync: true,
      storageLimit: 100, // 100MB default limit

      // Module actions
      downloadModule: async (moduleData) => {
        const state = get();
        const offlineModule: OfflineModule = {
          id: moduleData.id,
          title: moduleData.title,
          content: moduleData.content || JSON.stringify({}),
          category: moduleData.category,
          difficulty: moduleData.difficulty,
          duration: moduleData.duration,
          downloadedAt: new Date(),
          lastAccessed: new Date(),
          isComplete: false,
          progress: 0,
          lessons: moduleData.lessons?.map((lesson: any) => ({
            id: lesson.id,
            moduleId: moduleData.id,
            title: lesson.title,
            content: lesson.content || JSON.stringify({}),
            order: lesson.order,
            isComplete: false,
            progress: 0,
            timeSpent: 0,
            quizResults: []
          })) || []
        };

        const newModules = new Map(state.modules);
        newModules.set(moduleData.id, offlineModule);
        
        set({ modules: newModules });

        // Add to sync queue
        get().addToSyncQueue({
          id: `module_download_${moduleData.id}_${Date.now()}`,
          type: 'module_progress',
          data: { moduleId: moduleData.id, action: 'downloaded' },
          timestamp: new Date(),
          retryCount: 0
        });

        // Try to sync if online
        if (state.isOnline && state.autoSync) {
          get().processSyncQueue();
        }
      },

      updateModuleProgress: (moduleId, progress, lessonId) => {
        const state = get();
        const module = state.modules.get(moduleId);
        
        if (module) {
          const updatedModule = { ...module };
          updatedModule.progress = progress;
          updatedModule.lastAccessed = new Date();
          
          if (lessonId) {
            const lesson = updatedModule.lessons.find(l => l.id === lessonId);
            if (lesson) {
              lesson.progress = Math.min(100, lesson.progress + 10);
            }
          }
          
          const newModules = new Map(state.modules);
          newModules.set(moduleId, updatedModule);
          
          set({ modules: newModules });

          // Add to sync queue
          get().addToSyncQueue({
            id: `module_progress_${moduleId}_${Date.now()}`,
            type: 'module_progress',
            data: { moduleId, progress, lessonId },
            timestamp: new Date(),
            retryCount: 0
          });
        }
      },

      completeLesson: (moduleId, lessonId, timeSpent) => {
        const state = get();
        const module = state.modules.get(moduleId);
        
        if (module) {
          const updatedModule = { ...module };
          const lesson = updatedModule.lessons.find(l => l.id === lessonId);
          
          if (lesson) {
            lesson.isComplete = true;
            lesson.progress = 100;
            lesson.timeSpent = timeSpent;
            
            // Update module progress
            const completedLessons = updatedModule.lessons.filter(l => l.isComplete).length;
            updatedModule.progress = Math.round((completedLessons / updatedModule.lessons.length) * 100);
            updatedModule.lastAccessed = new Date();
            
            const newModules = new Map(state.modules);
            newModules.set(moduleId, updatedModule);
            
            set({ modules: newModules });

            // Add to sync queue
            get().addToSyncQueue({
              id: `lesson_complete_${moduleId}_${lessonId}_${Date.now()}`,
              type: 'module_progress',
              data: { moduleId, lessonId, timeSpent, isComplete: true },
              timestamp: new Date(),
              retryCount: 0
            });
          }
        }
      },

      completeModule: (moduleId) => {
        const state = get();
        const module = state.modules.get(moduleId);
        
        if (module) {
          const updatedModule = { ...module };
          updatedModule.isComplete = true;
          updatedModule.progress = 100;
          updatedModule.lastAccessed = new Date();
          
          const newModules = new Map(state.modules);
          newModules.set(moduleId, updatedModule);
          
          set({ modules: newModules });

          // Add to sync queue
          get().addToSyncQueue({
            id: `module_complete_${moduleId}_${Date.now()}`,
            type: 'module_progress',
            data: { moduleId, isComplete: true, completedAt: new Date() },
            timestamp: new Date(),
            retryCount: 0
          });
        }
      },

      // Drill actions
      downloadDrill: async (drillData) => {
        const state = get();
        const offlineDrill: OfflineDrill = {
          id: drillData.id,
          title: drillData.title,
          type: drillData.type,
          difficulty: drillData.difficulty,
          scenario: drillData.scenario,
          downloadedAt: new Date(),
          isComplete: false,
          progress: 0,
          results: []
        };

        const newDrills = new Map(state.drills);
        newDrills.set(drillData.id, offlineDrill);
        
        set({ drills: newDrills });
      },

      updateDrillProgress: (drillId, progress) => {
        const state = get();
        const drill = state.drills.get(drillId);
        
        if (drill) {
          const updatedDrill = { ...drill, progress };
          const newDrills = new Map(state.drills);
          newDrills.set(drillId, updatedDrill);
          
          set({ drills: newDrills });
        }
      },

      completeDrill: (drillId, result) => {
        const state = get();
        const drill = state.drills.get(drillId);
        
        if (drill) {
          const updatedDrill = { 
            ...drill, 
            isComplete: true, 
            progress: 100,
            results: [...drill.results, result]
          };
          
          const newDrills = new Map(state.drills);
          newDrills.set(drillId, updatedDrill);
          
          set({ drills: newDrills });

          // Add to sync queue
          get().addToSyncQueue({
            id: `drill_complete_${drillId}_${Date.now()}`,
            type: 'drill_result',
            data: { drillId, result },
            timestamp: new Date(),
            retryCount: 0
          });
        }
      },

      // Alert actions
      addAlert: (alertData) => {
        const state = get();
        const offlineAlert: OfflineAlert = {
          id: alertData.id,
          title: alertData.title,
          description: alertData.description,
          type: alertData.type,
          severity: alertData.severity,
          area: alertData.area,
          issuedAt: new Date(alertData.issuedAt),
          expiresAt: new Date(alertData.expiresAt),
          isRead: false
        };

        const newAlerts = new Map(state.alerts);
        newAlerts.set(alertData.id, offlineAlert);
        
        set({ alerts: newAlerts });
      },

      markAlertAsRead: (alertId) => {
        const state = get();
        const alert = state.alerts.get(alertId);
        
        if (alert) {
          const updatedAlert = { ...alert, isRead: true };
          const newAlerts = new Map(state.alerts);
          newAlerts.set(alertId, updatedAlert);
          
          set({ alerts: newAlerts });
        }
      },

      expireOldAlerts: () => {
        const state = get();
        const now = new Date();
        const newAlerts = new Map();
        
        state.alerts.forEach((alert, id) => {
          if (alert.expiresAt > now) {
            newAlerts.set(id, alert);
          }
        });
        
        set({ alerts: newAlerts });
      },

      // Contact actions
      addContact: (contactData) => {
        const state = get();
        const offlineContact: OfflineContact = {
          id: contactData.id,
          name: contactData.name,
          number: contactData.number,
          category: contactData.category,
          description: contactData.description || '',
          isFavorite: false
        };

        const newContacts = new Map(state.contacts);
        newContacts.set(contactData.id, offlineContact);
        
        set({ contacts: newContacts });
      },

      toggleContactFavorite: (contactId) => {
        const state = get();
        const contact = state.contacts.get(contactId);
        
        if (contact) {
          const updatedContact = { ...contact, isFavorite: !contact.isFavorite };
          const newContacts = new Map(state.contacts);
          newContacts.set(contactId, updatedContact);
          
          set({ contacts: newContacts });
        }
      },

      // Sync actions
      addToSyncQueue: (operation) => {
        const state = get();
        const newQueue = [...state.syncQueue, operation];
        
        // Limit queue size to prevent storage issues
        if (newQueue.length > 1000) {
          newQueue.splice(0, newQueue.length - 1000);
        }
        
        set({ syncQueue: newQueue });
      },

      processSyncQueue: async () => {
        const state = get();
        
        if (!state.isOnline || state.syncQueue.length === 0) {
          return;
        }

        const processedOperations: string[] = [];
        const failedOperations: SyncOperation[] = [];

        for (const operation of state.syncQueue) {
          try {
            await this.syncOperation(operation);
            processedOperations.push(operation.id);
          } catch (error) {
            console.error('Sync operation failed:', error);
            
            // Retry logic
            if (operation.retryCount < 3) {
              failedOperations.push({
                ...operation,
                retryCount: operation.retryCount + 1,
                lastSyncAttempt: new Date()
              });
            }
          }
        }

        // Update queue
        const remainingQueue = state.syncQueue.filter(
          op => !processedOperations.includes(op.id)
        );

        set({ 
          syncQueue: [...failedOperations, ...remainingQueue],
          lastSync: new Date()
        });
      },

      clearSyncQueue: () => {
        set({ syncQueue: [] });
      },

      // Utility actions
      setOnlineStatus: (isOnline) => {
        set({ isOnline });
        
        // Auto-sync when coming back online
        if (isOnline) {
          get().processSyncQueue();
        }
      },

      clearOldData: () => {
        const state = get();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Clear old modules
        const newModules = new Map();
        state.modules.forEach((module, id) => {
          if (module.downloadedAt > thirtyDaysAgo) {
            newModules.set(id, module);
          }
        });

        // Clear old drills
        const newDrills = new Map();
        state.drills.forEach((drill, id) => {
          if (drill.downloadedAt > thirtyDaysAgo) {
            newDrills.set(id, drill);
          }
        });

        // Clear old alerts
        const newAlerts = new Map();
        state.alerts.forEach((alert, id) => {
          if (alert.issuedAt > thirtyDaysAgo) {
            newAlerts.set(id, alert);
          }
        });

        set({ 
          modules: newModules,
          drills: newDrills,
          alerts: newAlerts
        });
      },

      getStorageUsage: () => {
        const state = get();
        const data = {
          modules: Array.from(state.modules.values()),
          drills: Array.from(state.drills.values()),
          alerts: Array.from(state.alerts.values()),
          contacts: Array.from(state.contacts.values()),
          syncQueue: state.syncQueue
        };
        
        const sizeInBytes = new Blob([JSON.stringify(data)]).size;
        return Math.round(sizeInBytes / (1024 * 1024) * 100) / 100; // Convert to MB
      },

      // Helper method for sync operations
      syncOperation: async (operation: SyncOperation) => {
        // This would be implemented to call your actual API endpoints
        switch (operation.type) {
          case 'module_progress':
            // Call API to sync module progress
            break;
          case 'drill_result':
            // Call API to sync drill results
            break;
          case 'quiz_result':
            // Call API to sync quiz results
            break;
          case 'user_profile':
            // Call API to sync user profile
            break;
        }
      }
    }),
    {
      name: 'disaster-management-offline-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        modules: Array.from(state.modules.entries()),
        drills: Array.from(state.drills.entries()),
        alerts: Array.from(state.alerts.entries()),
        contacts: Array.from(state.contacts.entries()),
        syncQueue: state.syncQueue,
        lastSync: state.lastSync,
        autoSync: state.autoSync,
        storageLimit: state.storageLimit
      }),
      onRehydrateStorage: () => (state) => {
        // Convert arrays back to Maps after rehydration
        if (state) {
          state.modules = new Map(state.modules as any);
          state.drills = new Map(state.drills as any);
          state.alerts = new Map(state.alerts as any);
          state.contacts = new Map(state.contacts as any);
        }
      }
    }
  )
);

// Hook for online/offline status
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      useOfflineStore.getState().setOnlineStatus(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
      useOfflineStore.getState().setOnlineStatus(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}