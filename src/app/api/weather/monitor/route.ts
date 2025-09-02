import { NextRequest, NextResponse } from 'next/server';
import { weatherMonitor } from '@/lib/weather-monitor';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const action = searchParams.get('action');

    // Handle different actions
    switch (action) {
      case 'status':
        return NextResponse.json({
          success: true,
          data: weatherMonitor.getStatus()
        });

      case 'check-city':
        if (!city) {
          return NextResponse.json(
            { error: 'City parameter is required for check-city action' },
            { status: 400 }
          );
        }
        
        try {
          const weatherData = await weatherMonitor.checkCityWeather(city);
          return NextResponse.json({
            success: true,
            data: weatherData
          });
        } catch (error) {
          return NextResponse.json(
            { 
              error: 'Failed to check city weather',
              details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
          );
        }

      default:
        return NextResponse.json({
          success: true,
          data: weatherMonitor.getStatus(),
          message: 'Weather monitor status retrieved. Use ?action=status for status, ?action=check-city&city=CityName for specific city weather.'
        });
    }

  } catch (error) {
    console.error('Error in weather monitor API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process weather monitor request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
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
        await weatherMonitor.startMonitoring(intervalMinutes || 15);
        return NextResponse.json({
          success: true,
          message: `Weather monitoring started with ${intervalMinutes || 15} minute intervals`,
          data: weatherMonitor.getStatus()
        });

      case 'stop':
        weatherMonitor.stopMonitoring();
        return NextResponse.json({
          success: true,
          message: 'Weather monitoring stopped',
          data: weatherMonitor.getStatus()
        });

      case 'restart':
        weatherMonitor.stopMonitoring();
        await weatherMonitor.startMonitoring(intervalMinutes || 15);
        return NextResponse.json({
          success: true,
          message: `Weather monitoring restarted with ${intervalMinutes || 15} minute intervals`,
          data: weatherMonitor.getStatus()
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: start, stop, or restart' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error controlling weather monitor:', error);
    return NextResponse.json(
      { 
        error: 'Failed to control weather monitor',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
