import { NextRequest, NextResponse } from 'next/server';
import { WeatherAlertService } from '@/lib/weather-service';

const weatherService = WeatherAlertService.getInstance();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'status') {
      const status = weatherService.getMonitoringStatus();
      return NextResponse.json(status);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error in weather monitor GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, intervalMinutes } = body;

    switch (action) {
      case 'start':
        if (typeof intervalMinutes !== 'number' || intervalMinutes < 1) {
          return NextResponse.json(
            { error: 'Invalid intervalMinutes' },
            { status: 400 }
          );
        }
        
        weatherService.startMonitoring(intervalMinutes);
        
        // Process alerts immediately
        await weatherService.processAndStoreAlerts();
        
        return NextResponse.json({ 
          message: `Weather monitoring started with ${intervalMinutes} minute intervals`,
          status: weatherService.getMonitoringStatus()
        });

      case 'stop':
        weatherService.stopMonitoring();
        return NextResponse.json({ 
          message: 'Weather monitoring stopped',
          status: weatherService.getMonitoringStatus()
        });

      case 'process':
        await weatherService.processAndStoreAlerts();
        return NextResponse.json({ 
          message: 'Weather alerts processed successfully' 
        });

      case 'expire':
        const expiredCount = await weatherService.expireOldAlerts();
        return NextResponse.json({ 
          message: `${expiredCount} old alerts expired` 
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in weather monitor POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}