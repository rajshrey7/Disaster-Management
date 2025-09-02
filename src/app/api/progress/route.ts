import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/progress - Get progress records with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const moduleId = searchParams.get('moduleId')
    const lessonId = searchParams.get('lessonId')
    const isCompleted = searchParams.get('isCompleted')

    const where: any = {}
    
    if (userId) where.userId = userId
    if (moduleId) where.moduleId = moduleId
    if (lessonId) where.lessonId = lessonId
    if (isCompleted !== null) where.isCompleted = isCompleted === 'true'

    const progress = await db.userProgress.findMany({
      where,
      include: {
        user: true,
        module: true,
        lesson: true
      },
      orderBy: { lastAccessed: 'desc' }
    })

    return NextResponse.json(progress)
  } catch (error) {
    console.error('Error fetching progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    )
  }
}

// POST /api/progress - Create or update progress
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, moduleId, lessonId, completedLessons, totalLessons, progress, isCompleted } = body

    if (!userId || !moduleId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if progress record already exists
    const existingProgress = await db.userProgress.findUnique({
      where: {
        userId_moduleId: {
          userId,
          moduleId
        }
      }
    })

    let result
    if (existingProgress) {
      // Update existing progress
      result = await db.userProgress.update({
        where: {
          userId_moduleId: {
            userId,
            moduleId
          }
        },
        data: {
          lessonId,
          completedLessons,
          totalLessons,
          progress,
          isCompleted,
          lastAccessed: new Date()
        },
        include: {
          user: true,
          module: true,
          lesson: true
        }
      })
    } else {
      // Create new progress record
      result = await db.userProgress.create({
        data: {
          userId,
          moduleId,
          lessonId,
          completedLessons: completedLessons || 0,
          totalLessons: totalLessons || 0,
          progress: progress || 0,
          isCompleted: isCompleted || false,
          lastAccessed: new Date()
        },
        include: {
          user: true,
          module: true,
          lesson: true
        }
      })
    }

    return NextResponse.json(result, { status: existingProgress ? 200 : 201 })
  } catch (error) {
    console.error('Error creating/updating progress:', error)
    return NextResponse.json(
      { error: 'Failed to create/update progress' },
      { status: 500 }
    )
  }
}

// PUT - Update existing progress records
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { userId, moduleId, lessonId, progress, drillResultId, score, timeTaken } = body

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      )
    }

    let result: any = {}

    // Update module progress
    if (moduleId && progress !== undefined) {
      const module = await db.learningModule.findUnique({
        where: { id: moduleId },
        include: {
          _count: {
            select: { lessons: true }
          }
        }
      })

      if (module) {
        const totalLessons = module._count.lessons
        const completedLessons = Math.floor((progress / 100) * totalLessons)
        const isCompleted = progress >= 100

        result.moduleProgress = await db.userProgress.update({
          where: {
            userId_moduleId: {
              userId,
              moduleId
            }
          },
          data: {
            progress,
            completedLessons,
            totalLessons,
            isCompleted,
            lastAccessed: new Date(),
            lessonId: lessonId || undefined
          }
        })
      }
    }

    // Update drill result
    if (drillResultId && score !== undefined) {
      const passed = score >= 70 // 70% to pass

      result.drillResult = await db.drillResult.update({
        where: { id: drillResultId },
        data: {
          score,
          passed,
          timeTaken: timeTaken || undefined
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: "Progress updated successfully",
    })
  } catch (error) {
    console.error("Failed to update progress:", error)
    return NextResponse.json(
      { success: false, message: "Failed to update progress" },
      { status: 500 }
    )
  }
}

// DELETE - Delete progress records
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const moduleId = searchParams.get('moduleId')
    const drillResultId = searchParams.get('drillResultId')

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      )
    }

    if (moduleId) {
      // Delete specific module progress
      await db.userProgress.delete({
        where: {
          userId_moduleId: {
            userId,
            moduleId
          }
        }
      })
    } else if (drillResultId) {
      // Delete specific drill result
      await db.drillResult.delete({
        where: { id: drillResultId }
      })
    } else {
      // Delete all progress for user
      await db.userProgress.deleteMany({
        where: { userId }
      })
      await db.drillResult.deleteMany({
        where: { userId }
      })
    }

    return NextResponse.json({
      success: true,
      message: "Progress deleted successfully",
    })
  } catch (error) {
    console.error("Failed to delete progress:", error)
    return NextResponse.json(
      { success: false, message: "Failed to delete progress" },
      { status: 500 }
    )
  }
}

