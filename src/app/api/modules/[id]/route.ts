import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/modules/[id] - Get a specific module by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const includeLessons = searchParams.get('includeLessons') === 'true'

    const moduleRecord = await db.learningModule.findUnique({
      where: { id: params.id },
      include: {
        lessons: includeLessons ? {
          orderBy: { order: 'asc' }
        } : false
      }
    })

    if (!moduleRecord) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(moduleRecord)
  } catch (error) {
    console.error('Error fetching module:', error)
    return NextResponse.json(
      { error: 'Failed to fetch module' },
      { status: 500 }
    )
  }
}

// PUT /api/modules/[id] - Update a module
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, description, difficulty, duration, category, content, isActive } = body

    const existingModule = await db.learningModule.findUnique({
      where: { id: params.id }
    })

    if (!existingModule) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      )
    }

    const updatedModule = await db.learningModule.update({
      where: { id: params.id },
      data: {
        title,
        description,
        difficulty,
        duration,
        category,
        content,
        isActive
      },
      include: {
        lessons: true
      }
    })

    return NextResponse.json(updatedModule)
  } catch (error) {
    console.error('Error updating module:', error)
    return NextResponse.json(
      { error: 'Failed to update module' },
      { status: 500 }
    )
  }
}

// DELETE /api/modules/[id] - Delete a module
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existingModule = await db.learningModule.findUnique({
      where: { id: params.id }
    })

    if (!existingModule) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      )
    }

    await db.learningModule.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Module deleted successfully' })
  } catch (error) {
    console.error('Error deleting module:', error)
    return NextResponse.json(
      { error: 'Failed to delete module' },
      { status: 500 }
    )
  }
}
