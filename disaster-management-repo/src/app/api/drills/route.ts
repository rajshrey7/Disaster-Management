import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Enhanced query parameters for interactive drills
    const region = searchParams.get('region');
    const type = searchParams.get('type');
    const difficulty = searchParams.get('difficulty');
    const language = searchParams.get('language');
    const includeSteps = searchParams.get('includeSteps') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build dynamic where clause for localization and filtering
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

    // Type and difficulty filtering
    if (type) {
      whereClause.type = type;
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

    if (includeSteps) {
      includeClause.steps = {
        orderBy: { order: 'asc' }
      };
    }

    // Fetch drills with enhanced localization and interactivity
    const drills = await db.virtualDrill.findMany({
      where: whereClause,
      include: includeClause,
      orderBy: [
        { geographicRegion: { name: 'asc' } },
        { type: 'asc' },
        { difficulty: 'asc' },
        { title: 'asc' }
      ],
      take: limit,
      skip: offset
    });

    // Enhanced response with regional context and interactive features
    const enhancedDrills = drills.map(drill => ({
      ...drill,
      regionalContext: {
        region: drill.geographicRegion?.name,
        languages: drill.languages ? JSON.parse(drill.languages) : [],
        regionalVariants: drill.regionalVariants ? JSON.parse(drill.regionalVariants) : []
      },
      interactiveFeatures: {
        branchingScenarios: drill.branchingScenarios ? JSON.parse(drill.branchingScenarios) : [],
        multimediaContent: drill.multimediaContent ? JSON.parse(drill.multimediaContent) : [],
        accessibility: drill.accessibility ? JSON.parse(drill.accessibility) : []
      },
      scoring: {
        passingScore: drill.passingScore,
        maxAttempts: drill.maxAttempts,
        timeLimit: drill.timeLimit
      },
      steps: drill.steps ? drill.steps.map(step => ({
        ...step,
        choices: JSON.parse(step.choices),
        feedback: step.feedback ? JSON.parse(step.feedback) : [],
        consequences: step.consequences ? JSON.parse(step.consequences) : [],
        nextStepLogic: step.nextStepLogic ? JSON.parse(step.nextStepLogic) : null,
        conditionalSteps: step.conditionalSteps ? JSON.parse(step.conditionalSteps) : [],
        mediaContent: step.mediaContent ? JSON.parse(step.mediaContent) : []
      })) : []
    }));

    return NextResponse.json({
      success: true,
      data: enhancedDrills,
      pagination: {
        limit,
        offset,
        total: enhancedDrills.length,
        hasMore: enhancedDrills.length === limit
      },
      filters: {
        region,
        type,
        difficulty,
        language
      }
    });

  } catch (error) {
    console.error('Error fetching drills:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch drills',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Enhanced validation for interactive drills
    const {
      title,
      description,
      type,
      difficulty,
      duration,
      scenario,
      geographicRegionId,
      languages,
      regionalVariants,
      branchingScenarios,
      multimediaContent,
      accessibility,
      passingScore,
      maxAttempts,
      timeLimit,
      steps
    } = body;

    // Validate required fields
    if (!title || !description || !type || !difficulty || !duration || !scenario) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, type, difficulty, duration, scenario' },
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

    // Validate steps if provided
    if (steps && Array.isArray(steps)) {
      for (const step of steps) {
        if (!step.title || !step.description || !step.choices || step.order === undefined) {
          return NextResponse.json(
            { error: 'Invalid step data: each step must have title, description, choices, and order' },
            { status: 400 }
          );
        }

        // Validate choices structure
        try {
          const choices = JSON.parse(step.choices);
          if (!Array.isArray(choices) || choices.length === 0) {
            return NextResponse.json(
              { error: 'Step choices must be a non-empty array' },
              { status: 400 }
            );
          }
        } catch {
          return NextResponse.json(
            { error: 'Step choices must be valid JSON' },
            { status: 400 }
          );
        }
      }
    }

    // Create drill with enhanced interactivity
    const drill = await db.virtualDrill.create({
      data: {
        title,
        description,
        type,
        difficulty,
        duration,
        scenario,
        geographicRegionId,
        languages: languages ? JSON.stringify(languages) : null,
        regionalVariants: regionalVariants ? JSON.stringify(regionalVariants) : null,
        branchingScenarios: branchingScenarios ? JSON.stringify(branchingScenarios) : null,
        multimediaContent: multimediaContent ? JSON.stringify(multimediaContent) : null,
        accessibility: accessibility ? JSON.stringify(accessibility) : null,
        passingScore: passingScore || 70,
        maxAttempts: maxAttempts || 3,
        timeLimit: timeLimit || null,
        isActive: true
      },
      include: {
        geographicRegion: true
      }
    });

    // Create drill steps if provided
    let createdSteps = [];
    if (steps && Array.isArray(steps)) {
      createdSteps = await Promise.all(
        steps.map(async (step) => {
          return await db.drillStep.create({
            data: {
              drillId: drill.id,
              title: step.title,
              description: step.description,
              choices: step.choices,
              correctChoice: step.correctChoice || null,
              points: step.points || 10,
              order: step.order,
              scenarioText: step.scenarioText || null,
              mediaContent: step.mediaContent ? JSON.stringify(step.mediaContent) : null,
              feedback: step.feedback ? JSON.stringify(step.feedback) : null,
              consequences: step.consequences ? JSON.stringify(step.consequences) : null,
              nextStepLogic: step.nextStepLogic ? JSON.stringify(step.nextStepLogic) : null,
              conditionalSteps: step.conditionalSteps ? JSON.stringify(step.conditionalSteps) : null
            }
          });
        })
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Interactive drill created successfully',
      data: {
        ...drill,
        regionalContext: {
          region: drill.geographicRegion?.name,
          languages: drill.languages ? JSON.parse(drill.languages) : [],
          regionalVariants: drill.regionalVariants ? JSON.parse(drill.regionalVariants) : []
        },
        interactiveFeatures: {
          branchingScenarios: drill.branchingScenarios ? JSON.parse(drill.branchingScenarios) : [],
          multimediaContent: drill.multimediaContent ? JSON.parse(drill.multimediaContent) : [],
          accessibility: drill.accessibility ? JSON.parse(drill.accessibility) : []
        },
        scoring: {
          passingScore: drill.passingScore,
          maxAttempts: drill.maxAttempts,
          timeLimit: drill.timeLimit
        },
        steps: createdSteps.map(step => ({
          ...step,
          choices: JSON.parse(step.choices),
          feedback: step.feedback ? JSON.parse(step.feedback) : [],
          consequences: step.consequences ? JSON.parse(step.consequences) : [],
          nextStepLogic: step.nextStepLogic ? JSON.parse(step.nextStepLogic) : null,
          conditionalSteps: step.conditionalSteps ? JSON.parse(step.conditionalSteps) : [],
          mediaContent: step.mediaContent ? JSON.parse(step.mediaContent) : []
        }))
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating drill:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create interactive drill',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PUT - Update a virtual drill
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, title, description, type, difficulty, duration, scenario, isActive } = body

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Drill ID is required" },
        { status: 400 }
      )
    }

    const updatedDrill = await db.virtualDrill.update({
      where: { id },
      data: {
        title,
        description,
        type,
        difficulty,
        duration,
        scenario,
        isActive,
        updatedAt: new Date()
      },
      include: {
        steps: {
          orderBy: {
            order: "asc"
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedDrill,
      message: "Drill updated successfully",
    })
  } catch (error) {
    console.error("Failed to update drill:", error)
    return NextResponse.json(
      { success: false, message: "Failed to update drill" },
      { status: 500 }
    )
  }
}

// DELETE - Delete a virtual drill
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Drill ID is required" },
        { status: 400 }
      )
    }

    // Delete drill (cascade will handle steps and drill results)
    await db.virtualDrill.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: "Drill deleted successfully",
    })
  } catch (error) {
    console.error("Failed to delete drill:", error)
    return NextResponse.json(
      { success: false, message: "Failed to delete drill" },
      { status: 500 }
    )
  }
}