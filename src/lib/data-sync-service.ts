import { db } from '@/lib/db';
import { useOfflineStore } from './offline-store';

interface SyncResult {
  success: boolean;
  processed: number;
  failed: number;
  errors: string[];
  timestamp: Date;
}

interface SyncOperation {
  id: string;
  type: 'module_progress' | 'drill_result' | 'quiz_result' | 'user_profile' | 'alert_view' | 'contact_access';
  data: any;
  timestamp: Date;
  retryCount: number;
  lastSyncAttempt?: Date;
}

export class DataSyncService {
  private static instance: DataSyncService;
  private syncInProgress = false;
  private maxRetries = 3;
  private syncInterval: NodeJS.Timeout | null = null;

  private constructor() {}

  static getInstance(): DataSyncService {
    if (!DataSyncService.instance) {
      DataSyncService.instance = new DataSyncService();
    }
    return DataSyncService.instance;
  }

  async initialize() {
    // Start periodic sync when online
    this.startPeriodicSync();
    
    // Listen for online/offline events
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleOnline());
      window.addEventListener('offline', () => this.handleOffline());
    }

    console.log('Data Sync Service initialized');
  }

  private startPeriodicSync() {
    // Sync every 5 minutes when online
    this.syncInterval = setInterval(() => {
      if (navigator.onLine && !this.syncInProgress) {
        this.syncAllData();
      }
    }, 5 * 60 * 1000);
  }

  private stopPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  private handleOnline() {
    console.log('Device came online - starting sync');
    // Immediate sync when coming online
    setTimeout(() => this.syncAllData(), 1000);
  }

  private handleOffline() {
    console.log('Device went offline - stopping periodic sync');
  }

  async syncAllData(): Promise<SyncResult> {
    if (this.syncInProgress) {
      return {
        success: false,
        processed: 0,
        failed: 0,
        errors: ['Sync already in progress'],
        timestamp: new Date()
      };
    }

    this.syncInProgress = true;
    
    try {
      const store = useOfflineStore.getState();
      const operations = store.syncQueue;
      
      if (operations.length === 0) {
        return {
          success: true,
          processed: 0,
          failed: 0,
          errors: [],
          timestamp: new Date()
        };
      }

      console.log(`Starting sync of ${operations.length} operations`);
      
      const result: SyncResult = {
        success: true,
        processed: 0,
        failed: 0,
        errors: [],
        timestamp: new Date()
      };

      // Process operations in batches
      const batchSize = 10;
      for (let i = 0; i < operations.length; i += batchSize) {
        const batch = operations.slice(i, i + batchSize);
        const batchResult = await this.syncBatch(batch);
        
        result.processed += batchResult.processed;
        result.failed += batchResult.failed;
        result.errors.push(...batchResult.errors);
        
        if (batchResult.failed > 0) {
          result.success = false;
        }
      }

      // Clean up successfully synced operations
      await this.cleanupSyncedOperations();

      console.log(`Sync completed: ${result.processed} processed, ${result.failed} failed`);
      return result;
    } catch (error) {
      console.error('Error during sync:', error);
      return {
        success: false,
        processed: 0,
        failed: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        timestamp: new Date()
      };
    } finally {
      this.syncInProgress = false;
    }
  }

  private async syncBatch(operations: SyncOperation[]): Promise<SyncResult> {
    const result: SyncResult = {
      success: true,
      processed: 0,
      failed: 0,
      errors: [],
      timestamp: new Date()
    };

    for (const operation of operations) {
      try {
        await this.processSyncOperation(operation);
        result.processed++;
      } catch (error) {
        result.failed++;
        result.errors.push(`Failed to sync ${operation.type}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        
        // Update retry count
        const store = useOfflineStore.getState();
        const updatedQueue = store.syncQueue.map(op => 
          op.id === operation.id 
            ? { ...op, retryCount: op.retryCount + 1, lastSyncAttempt: new Date() }
            : op
        );
        
        // Update store
        useOfflineStore.setState({ syncQueue: updatedQueue });
        
        result.success = false;
      }
    }

    return result;
  }

  private async processSyncOperation(operation: SyncOperation): Promise<void> {
    switch (operation.type) {
      case 'module_progress':
        await this.syncModuleProgress(operation.data);
        break;
      case 'drill_result':
        await this.syncDrillResult(operation.data);
        break;
      case 'quiz_result':
        await this.syncQuizResult(operation.data);
        break;
      case 'user_profile':
        await this.syncUserProfile(operation.data);
        break;
      case 'alert_view':
        await this.syncAlertView(operation.data);
        break;
      case 'contact_access':
        await this.syncContactAccess(operation.data);
        break;
      default:
        throw new Error(`Unknown operation type: ${operation.type}`);
    }
  }

  private async syncModuleProgress(data: any) {
    if (data.action === 'downloaded') {
      // Track module download
      await db.$executeRaw`
        INSERT INTO module_downloads (user_id, module_id, downloaded_at, is_offline)
        VALUES (${data.userId}, ${data.moduleId}, ${operation.timestamp}, true)
        ON CONFLICT (user_id, module_id) DO UPDATE SET
          downloaded_at = EXCLUDED.downloaded_at,
          is_offline = EXCLUDED.is_offline
      `;
    } else if (data.isComplete) {
      // Track module completion
      await db.userProgress.upsert({
        where: {
          userId_moduleId: {
            userId: data.userId,
            moduleId: data.moduleId
          }
        },
        update: {
          progress: 100,
          isCompleted: true,
          completionDate: data.completedAt,
          lastAccessed: new Date()
        },
        create: {
          userId: data.userId,
          moduleId: data.moduleId,
          progress: 100,
          isCompleted: true,
          completionDate: data.completedAt,
          lastAccessed: new Date(),
          completedLessons: data.totalLessons || 0,
          totalLessons: data.totalLessons || 0
        }
      });
    } else if (data.lessonId) {
      // Track lesson progress
      await db.lessonProgress.upsert({
        where: {
          userId_lessonId: {
            userId: data.userId,
            lessonId: data.lessonId
          }
        },
        update: {
          progress: data.progress,
          timeSpent: data.timeSpent || 0,
          isCompleted: data.isComplete || false,
          lastAccessed: new Date()
        },
        create: {
          userId: data.userId,
          lessonId: data.lessonId,
          progress: data.progress,
          timeSpent: data.timeSpent || 0,
          isCompleted: data.isComplete || false,
          lastAccessed: new Date()
        }
      });
    }
  }

  private async syncDrillResult(data: any) {
    await db.drillResult.create({
      data: {
        userId: data.userId,
        drillId: data.drillId,
        userResponses: JSON.stringify(data.result.responses),
        score: data.result.score,
        maxScore: data.result.maxScore,
        timeTaken: data.result.timeTaken,
        passed: data.result.passed,
        completedAt: new Date(data.result.completedAt),
        attemptNumber: data.result.attemptNumber || 1,
        decisionPath: JSON.stringify(data.result.decisionPath || []),
        learningOutcomes: JSON.stringify(data.result.learningOutcomes || []),
        improvementAreas: JSON.stringify(data.result.improvementAreas || [])
      }
    });
  }

  private async syncQuizResult(data: any) {
    await db.quizAttempt.create({
      data: {
        userId: data.userId,
        quizId: data.quizId,
        score: data.score,
        maxScore: data.maxScore,
        passed: data.passed,
        completedAt: new Date(data.completedAt),
        answers: JSON.stringify(data.answers),
        timeSpent: data.timeSpent || 0
      }
    });
  }

  private async syncUserProfile(data: any) {
    await db.userProfile.upsert({
      where: {
        userId: data.userId
      },
      update: {
        ...data.updates,
        updatedAt: new Date()
      },
      create: {
        userId: data.userId,
        ...data.updates,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
  }

  private async syncAlertView(data: any) {
    await db.alertView.create({
      data: {
        userId: data.userId,
        alertId: data.alertId,
        viewedAt: new Date(data.viewedAt),
        isOffline: true
      }
    });
  }

  private async syncContactAccess(data: any) {
    await db.contactAccess.create({
      data: {
        userId: data.userId,
        contactId: data.contactId,
        accessedAt: new Date(data.accessedAt),
        isOffline: true,
        action: data.action || 'viewed'
      }
    });
  }

  private async cleanupSyncedOperations() {
    const store = useOfflineStore.getState();
    
    // Remove operations that were successfully synced (retryCount === 0 means they were just processed)
    const remainingQueue = store.syncQueue.filter(op => op.retryCount > 0);
    
    // Remove operations that have exceeded max retries
    const finalQueue = remainingQueue.filter(op => op.retryCount <= this.maxRetries);
    
    useOfflineStore.setState({ syncQueue: finalQueue });
  }

  // Download data for offline use
  async downloadUserData(userId: string): Promise<void> {
    try {
      console.log(`Downloading user data for offline use: ${userId}`);
      
      // Get user's modules
      const modules = await db.learningModule.findMany({
        where: {
          OR: [
            {
              userProgress: {
                some: {
                  userId: userId
                }
              }
            },
            {
              geographicRegion: {
                users: {
                  some: {
                    id: userId
                  }
                }
              }
            }
          ],
          isActive: true
        },
        include: {
          lessons: true,
          quizzes: {
            include: {
              questions: true
            }
          }
        }
      });

      // Download modules to offline store
      const store = useOfflineStore.getState();
      for (const module of modules) {
        await store.downloadModule(module);
      }

      // Get user's drills
      const drills = await db.virtualDrill.findMany({
        where: {
          OR: [
            {
              drillResults: {
                some: {
                  userId: userId
                }
              }
            },
            {
              geographicRegion: {
                users: {
                  some: {
                    id: userId
                  }
                }
              }
            }
          ],
          isActive: true
        }
      });

      // Download drills to offline store
      for (const drill of drills) {
        await store.downloadDrill(drill);
      }

      // Get emergency contacts for user's region
      const user = await db.user.findUnique({
        where: { id: userId },
        include: {
          geographicRegion: {
            include: {
              contacts: true
            }
          }
        }
      });

      if (user?.geographicRegion?.contacts) {
        for (const contact of user.geographicRegion.contacts) {
          store.addContact(contact);
        }
      }

      // Get active alerts for user's region
      if (user?.geographicRegionId) {
        const alerts = await db.alert.findMany({
          where: {
            geographicRegionId: user.geographicRegionId,
            status: 'ACTIVE',
            expiresAt: {
              gte: new Date()
            }
          }
        });

        for (const alert of alerts) {
          store.addAlert(alert);
        }
      }

      console.log(`User data downloaded successfully: ${modules.length} modules, ${drills.length} drills`);
    } catch (error) {
      console.error('Error downloading user data:', error);
      throw error;
    }
  }

  // Get sync status
  getSyncStatus() {
    const store = useOfflineStore.getState();
    return {
      isOnline: navigator.onLine,
      syncInProgress: this.syncInProgress,
      pendingOperations: store.syncQueue.length,
      lastSync: store.lastSync,
      storageUsage: store.getStorageUsage(),
      storageLimit: store.storageLimit
    };
  }

  // Force sync
  async forceSync(): Promise<SyncResult> {
    return await this.syncAllData();
  }

  // Clear all offline data
  async clearOfflineData(): Promise<void> {
    try {
      const store = useOfflineStore.getState();
      
      // Clear all data from store
      useOfflineStore.setState({
        modules: new Map(),
        drills: new Map(),
        alerts: new Map(),
        contacts: new Map(),
        syncQueue: [],
        lastSync: null
      });

      console.log('Offline data cleared successfully');
    } catch (error) {
      console.error('Error clearing offline data:', error);
      throw error;
    }
  }

  // Get offline statistics
  getOfflineStats() {
    const store = useOfflineStore.getState();
    
    return {
      modules: {
        total: store.modules.size,
        completed: Array.from(store.modules.values()).filter(m => m.isComplete).length,
        averageProgress: Array.from(store.modules.values()).reduce((acc, m) => acc + m.progress, 0) / store.modules.size || 0
      },
      drills: {
        total: store.drills.size,
        completed: Array.from(store.drills.values()).filter(d => d.isComplete).length,
        averageProgress: Array.from(store.drills.values()).reduce((acc, d) => acc + d.progress, 0) / store.drills.size || 0
      },
      alerts: {
        total: store.alerts.size,
        unread: Array.from(store.alerts.values()).filter(a => !a.isRead).length
      },
      contacts: {
        total: store.contacts.size,
        favorites: Array.from(store.contacts.values()).filter(c => c.isFavorite).length
      },
      sync: {
        pendingOperations: store.syncQueue.length,
        lastSync: store.lastSync,
        storageUsage: store.getStorageUsage(),
        storageLimit: store.storageLimit
      }
    };
  }

  // Cleanup resources
  destroy() {
    this.stopPeriodicSync();
    
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.handleOnline);
      window.removeEventListener('offline', this.handleOffline);
    }
    
    console.log('Data Sync Service destroyed');
  }
}