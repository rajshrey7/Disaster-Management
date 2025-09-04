import { NextRequest, NextResponse } from 'next/server';
import { ImpactMeasurementService } from '@/lib/impact-measurement';

const impactService = ImpactMeasurementService.getInstance();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const institutionId = searchParams.get('institutionId');
    const regionId = searchParams.get('regionId');
    const period = searchParams.get('period') || 'monthly';
    const type = searchParams.get('type');

    if (type === 'kpi') {
      const kpis = await impactService.getKPIDashboard(
        institutionId || undefined,
        regionId || undefined,
        period as any
      );
      return NextResponse.json({ kpis });
    }

    if (type === 'report') {
      const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined;
      const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined;
      
      const report = await impactService.generateImpactReport(
        institutionId || undefined,
        regionId || undefined,
        startDate,
        endDate
      );
      
      return NextResponse.json({ report });
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
  } catch (error) {
    console.error('Error in impact GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'track-learning-progress':
        await impactService.trackLearningProgress(data);
        return NextResponse.json({ 
          message: 'Learning progress tracked successfully' 
        });

      case 'track-drill-performance':
        await impactService.trackDrillPerformance(data);
        return NextResponse.json({ 
          message: 'Drill performance tracked successfully' 
        });

      case 'track-engagement':
        await impactService.trackEngagement(data);
        return NextResponse.json({ 
          message: 'Engagement tracked successfully' 
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in impact POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}