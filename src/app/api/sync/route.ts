import { NextRequest, NextResponse } from 'next/server';
import { DataSyncService } from '@/lib/data-sync-service';

const syncService = DataSyncService.getInstance();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'status':
        const status = syncService.getSyncStatus();
        return NextResponse.json(status);

      case 'stats':
        const stats = syncService.getOfflineStats();
        return NextResponse.json(stats);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in sync GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId, data } = body;

    switch (action) {
      case 'sync':
        const result = await syncService.syncAllData();
        return NextResponse.json(result);

      case 'force-sync':
        const forceResult = await syncService.forceSync();
        return NextResponse.json(forceResult);

      case 'download-user-data':
        if (!userId) {
          return NextResponse.json(
            { error: 'userId is required' },
            { status: 400 }
          );
        }
        
        await syncService.downloadUserData(userId);
        return NextResponse.json({ 
          message: 'User data downloaded successfully for offline use' 
        });

      case 'clear-offline-data':
        await syncService.clearOfflineData();
        return NextResponse.json({ 
          message: 'Offline data cleared successfully' 
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in sync POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}