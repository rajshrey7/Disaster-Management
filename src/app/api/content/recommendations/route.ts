import { NextRequest, NextResponse } from 'next/server';
import { RegionalContentEngine } from '@/lib/regional-content-engine';

const contentEngine = RegionalContentEngine.getInstance();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const regionId = searchParams.get('regionId');
    const season = searchParams.get('season');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    if (season && regionId) {
      // Get seasonal recommendations
      const recommendations = await contentEngine.getSeasonalRecommendations(regionId, season);
      return NextResponse.json({ recommendations, type: 'seasonal' });
    }

    // Get personalized recommendations
    const recommendations = await contentEngine.getPersonalizedRecommendations(userId);
    return NextResponse.json({ recommendations, type: 'personalized' });
  } catch (error) {
    console.error('Error getting content recommendations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, regionId, hazards, climateData } = body;

    switch (action) {
      case 'update-hazard-profile':
        if (!regionId || !hazards) {
          return NextResponse.json(
            { error: 'regionId and hazards are required' },
            { status: 400 }
          );
        }

        await contentEngine.updateHazardProfile(regionId, hazards, climateData);
        return NextResponse.json({ 
          message: 'Hazard profile updated successfully' 
        });

      case 'get-hazard-profile':
        if (!regionId) {
          return NextResponse.json(
            { error: 'regionId is required' },
            { status: 400 }
          );
        }

        const profile = contentEngine.getHazardProfile(regionId);
        if (!profile) {
          return NextResponse.json(
            { error: 'Hazard profile not found' },
            { status: 404 }
          );
        }

        return NextResponse.json({ profile });

      case 'get-all-hazard-profiles':
        const profiles = contentEngine.getAllHazardProfiles();
        return NextResponse.json({ profiles });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in content recommendations POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}