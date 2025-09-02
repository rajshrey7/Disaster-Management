import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const name = searchParams.get('name');
    const state = searchParams.get('state');
    const district = searchParams.get('district');
    const isActive = searchParams.get('isActive');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build dynamic where clause
    const whereClause: any = {};

    if (name) {
      whereClause.name = {
        contains: name,
        mode: 'insensitive'
      };
    }

    if (state) {
      whereClause.states = {
        contains: state,
        mode: 'insensitive'
      };
    }

    if (district) {
      whereClause.districts = {
        contains: district,
        mode: 'insensitive'
      };
    }

    if (isActive !== null) {
      whereClause.isActive = isActive === 'true';
    }

    // Fetch geographic regions
    const regions = await db.geographicRegion.findMany({
      where: whereClause,
      orderBy: [
        { name: 'asc' }
      ],
      take: limit,
      skip: offset
    });

    // Enhanced response with parsed JSON fields
    const enhancedRegions = regions.map(region => ({
      ...region,
      states: region.states ? JSON.parse(region.states) : [],
      districts: region.districts ? JSON.parse(region.districts) : [],
      hazards: region.hazards ? JSON.parse(region.hazards) : [],
      climate: region.climate
    }));

    return NextResponse.json({
      success: true,
      data: enhancedRegions,
      pagination: {
        limit,
        offset,
        total: enhancedRegions.length,
        hasMore: enhancedRegions.length === limit
      },
      filters: {
        name,
        state,
        district,
        isActive
      }
    });

  } catch (error) {
    console.error('Error fetching geographic regions:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch geographic regions',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      name,
      description,
      states,
      districts,
      hazards,
      climate
    } = body;

    // Validate required fields
    if (!name || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description' },
        { status: 400 }
      );
    }

    // Validate JSON arrays
    if (states && !Array.isArray(states)) {
      return NextResponse.json(
        { error: 'States must be an array' },
        { status: 400 }
      );
    }

    if (districts && !Array.isArray(districts)) {
      return NextResponse.json(
        { error: 'Districts must be an array' },
        { status: 400 }
      );
    }

    if (hazards && !Array.isArray(hazards)) {
      return NextResponse.json(
        { error: 'Hazards must be an array' },
        { status: 400 }
      );
    }

    // Check if region name already exists
    const existingRegion = await db.geographicRegion.findUnique({
      where: { name }
    });

    if (existingRegion) {
      return NextResponse.json(
        { error: 'Geographic region with this name already exists' },
        { status: 409 }
      );
    }

    // Create geographic region
    const region = await db.geographicRegion.create({
      data: {
        name,
        description,
        states: states ? JSON.stringify(states) : null,
        districts: districts ? JSON.stringify(districts) : null,
        hazards: hazards ? JSON.stringify(hazards) : null,
        climate: climate || null,
        isActive: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Geographic region created successfully',
      data: {
        ...region,
        states: region.states ? JSON.parse(region.states) : [],
        districts: region.districts ? JSON.parse(region.districts) : [],
        hazards: region.hazards ? JSON.parse(region.hazards) : []
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating geographic region:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create geographic region',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
