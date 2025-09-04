import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET - Fetch lessons with optional filtering
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const moduleId = searchParams.get('moduleId')
    const lessonId = searchParams.get('lessonId')

    if (lessonId) {
      // Fetch specific lesson
      const lesson = await db.lesson.findUnique({
        where: { id: lessonId },
        include: {
          module: true,
          userProgress: true
        }
      })

      if (!lesson) {
        return NextResponse.json(
          { success: false, message: "Lesson not found" },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: lesson,
        message: "Lesson retrieved successfully",
      })
    }

    if (moduleId) {
      // Fetch all lessons for a specific module
      const lessons = await db.lesson.findMany({
        where: { moduleId },
        orderBy: {
          order: "asc",
        },
        include: {
          _count: {
            select: {
              userProgress: true
            }
          }
        }
      })

      return NextResponse.json({
        success: true,
        data: lessons,
        message: "Lessons retrieved successfully",
      })
    }

    // Fetch all lessons across all modules
    const lessons = await db.lesson.findMany({
      include: {
        module: true,
        _count: {
          select: {
            userProgress: true
          }
        }
      },
      orderBy: [
        { module: { title: 'asc' } },
        { order: 'asc' }
      ]
    })

    return NextResponse.json({
      success: true,
      data: lessons,
      message: "Lessons retrieved successfully",
    })
  } catch (error) {
    console.error("Failed to retrieve lessons:", error)
    return NextResponse.json(
      { success: false, message: "Failed to retrieve lessons" },
      { status: 500 }
    )
  }
}

// POST - Create a new lesson
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { moduleId, title, description, content, duration, order } = body

    if (!moduleId || !title || !description) {
      return NextResponse.json(
        { success: false, message: "Module ID, title, and description are required" },
        { status: 400 }
      )
    }

    // Verify module exists
    const moduleRecord = await db.learningModule.findUnique({
      where: { id: moduleId }
    })

    if (!moduleRecord) {
      return NextResponse.json(
        { success: false, message: "Module not found" },
        { status: 404 }
      )
    }

    // Get the next order number if not provided
    let lessonOrder = order
    if (!lessonOrder) {
      const lastLesson = await db.lesson.findFirst({
        where: { moduleId },
        orderBy: { order: 'desc' }
      })
      lessonOrder = lastLesson ? lastLesson.order + 1 : 1
    }

    const lesson = await db.lesson.create({
      data: {
        moduleId,
        title,
        description,
        content: content || null,
        duration: duration || 0,
        order: lessonOrder
      },
      include: {
        module: true
      }
    })

    return NextResponse.json({
      success: true,
      data: lesson,
      message: "Lesson created successfully",
    }, { status: 201 })
  } catch (error) {
    console.error("Failed to create lesson:", error)
    return NextResponse.json(
      { success: false, message: "Failed to create lesson" },
      { status: 500 }
    )
  }
}

// PUT - Update a lesson
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, title, description, content, duration, order } = body

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Lesson ID is required" },
        { status: 400 }
      )
    }

    const updatedLesson = await db.lesson.update({
      where: { id },
      data: {
        title,
        description,
        content,
        duration,
        order,
        updatedAt: new Date()
      },
      include: {
        module: true
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedLesson,
      message: "Lesson updated successfully",
    })
  } catch (error) {
    console.error("Failed to update lesson:", error)
    return NextResponse.json(
      { success: false, message: "Failed to update lesson" },
      { status: 500 }
    )
  }
}

// DELETE - Delete a lesson
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Lesson ID is required" },
        { status: 400 }
      )
    }

    await db.lesson.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: "Lesson deleted successfully",
    })
  } catch (error) {
    console.error("Failed to delete lesson:", error)
    return NextResponse.json(
      { success: false, message: "Failed to delete lesson" },
      { status: 500 }
    )
  }
}

