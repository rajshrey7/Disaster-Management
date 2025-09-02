import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Enhanced query parameters for localization
    const region = searchParams.get('region');
    const state = searchParams.get('state');
    const district = searchParams.get('district');
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const language = searchParams.get('language');
    const includeLessons = searchParams.get('includeLessons') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build dynamic where clause for localization
    const whereClause: any = {
      isActive: true
    };

    // Geographic filtering
    if (region) {
      whereClause.geographicRegion = {
        name: {
          contains: region,
          mode: 'insensitive'
        }
      };
    }

    if (state) {
      whereClause.geographicRegion = {
        ...whereClause.geographicRegion,
        states: {
          contains: state,
          mode: 'insensitive'
        }
      };
    }

    if (district) {
      whereClause.geographicRegion = {
        ...whereClause.geographicRegion,
        districts: {
          contains: district,
          mode: 'insensitive'
        }
      };
    }

    // Category and difficulty filtering
    if (category) {
      whereClause.category = category;
    }

    if (difficulty) {
      whereClause.difficulty = difficulty;
    }

    // Language filtering
    if (language) {
      whereClause.languages = {
        contains: language,
        mode: 'insensitive'
      };
    }

    // Build include clause
    const includeClause: any = {
      geographicRegion: true
    };

    if (includeLessons) {
      includeClause.lessons = {
        orderBy: { order: 'asc' }
      };
    }

    // Fetch modules with enhanced localization
    const modules = await db.learningModule.findMany({
      where: whereClause,
      include: includeClause,
      orderBy: [
        { geographicRegion: { name: 'asc' } },
        { category: 'asc' },
        { difficulty: 'asc' },
        { title: 'asc' }
      ],
      take: limit,
      skip: offset
    });

    // Enhanced response with regional context
    const enhancedModules = modules.map(module => ({
      ...module,
      regionalContext: {
        region: module.geographicRegion?.name,
        states: module.geographicRegion?.states ? JSON.parse(module.geographicRegion.states) : [],
        districts: module.geographicRegion?.districts ? JSON.parse(module.geographicRegion.districts) : [],
        hazards: module.geographicRegion?.hazards ? JSON.parse(module.geographicRegion.hazards) : [],
        climate: module.geographicRegion?.climate,
        languages: module.languages ? JSON.parse(module.languages) : [],
        regionalVariants: module.regionalVariants ? JSON.parse(module.regionalVariants) : [],
        seasonalRelevance: module.seasonalRelevance ? JSON.parse(module.seasonalRelevance) : []
      },
      metadata: {
        tags: module.tags ? JSON.parse(module.tags) : [],
        prerequisites: module.prerequisites ? JSON.parse(module.prerequisites) : [],
        learningOutcomes: module.learningOutcomes ? JSON.parse(module.learningOutcomes) : []
      }
    }));

    return NextResponse.json({
      success: true,
      data: enhancedModules,
      pagination: {
        limit,
        offset,
        total: enhancedModules.length,
        hasMore: enhancedModules.length === limit
      },
      filters: {
        region,
        state,
        district,
        category,
        difficulty,
        language
      }
    });

  } catch (error) {
    console.error('Error fetching modules:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch modules',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Enhanced validation for localized content
    const {
      title,
      description,
      difficulty,
      duration,
      category,
      content,
      geographicRegionId,
      languages,
      regionalVariants,
      seasonalRelevance,
      tags,
      prerequisites,
      learningOutcomes
    } = body;

    // Validate required fields
    if (!title || !description || !difficulty || !duration || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, difficulty, duration, category' },
        { status: 400 }
      );
    }

    // Validate geographic region if provided
    if (geographicRegionId) {
      const region = await db.geographicRegion.findUnique({
        where: { id: geographicRegionId }
      });
      
      if (!region) {
        return NextResponse.json(
          { error: 'Invalid geographic region ID' },
          { status: 400 }
        );
      }
    }

    // Create module with enhanced localization
    const module = await db.learningModule.create({
      data: {
        title,
        description,
        difficulty,
        duration,
        category,
        content,
        geographicRegionId,
        languages: languages ? JSON.stringify(languages) : null,
        regionalVariants: regionalVariants ? JSON.stringify(regionalVariants) : null,
        seasonalRelevance: seasonalRelevance ? JSON.stringify(seasonalRelevance) : null,
        tags: tags ? JSON.stringify(tags) : null,
        prerequisites: prerequisites ? JSON.stringify(prerequisites) : null,
        learningOutcomes: learningOutcomes ? JSON.stringify(learningOutcomes) : null,
        isActive: true
      },
      include: {
        geographicRegion: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Module created successfully',
      data: {
        ...module,
        regionalContext: {
          region: module.geographicRegion?.name,
          languages: module.languages ? JSON.parse(module.languages) : [],
          regionalVariants: module.regionalVariants ? JSON.parse(module.regionalVariants) : [],
          seasonalRelevance: module.seasonalRelevance ? JSON.parse(module.seasonalRelevance) : []
        },
        metadata: {
          tags: module.tags ? JSON.parse(module.tags) : [],
          prerequisites: module.prerequisites ? JSON.parse(module.prerequisites) : [],
          learningOutcomes: module.learningOutcomes ? JSON.parse(module.learningOutcomes) : []
        }
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating module:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create module',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PUT - Update a learning module
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, title, description, difficulty, duration, category, content, isActive } = body

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Module ID is required" },
        { status: 400 }
      )
    }

    const updatedModule = await db.learningModule.update({
      where: { id },
      data: {
        title,
        description,
        difficulty,
        duration,
        category,
        content,
        isActive,
        updatedAt: new Date()
      },
      include: {
        lessons: {
          orderBy: {
            order: "asc"
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedModule,
      message: "Module updated successfully",
    })
  } catch (error) {
    console.error("Failed to update module:", error)
    return NextResponse.json(
      { success: false, message: "Failed to update module" },
      { status: 500 }
    )
  }
}

// DELETE - Delete a learning module
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Module ID is required" },
        { status: 400 }
      )
    }

    // Delete module (cascade will handle lessons and user progress)
    await db.learningModule.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: "Module deleted successfully",
    })
  } catch (error) {
    console.error("Failed to delete module:", error)
    return NextResponse.json(
      { success: false, message: "Failed to delete module" },
      { status: 500 }
    )
  }
}