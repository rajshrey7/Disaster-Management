import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/drills/[id] - Get a specific drill by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const includeSteps = searchParams.get('includeSteps') === 'true'

    const drill = await db.virtualDrill.findUnique({
      where: { id: params.id },
      include: {
        steps: includeSteps ? {
          orderBy: { order: 'asc' }
        } : false
      }
    })

    if (!drill) {
      return NextResponse.json(
        { error: 'Drill not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(drill)
  } catch (error) {
    console.error('Error fetching drill:', error)
    return NextResponse.json(
      { error: 'Failed to fetch drill' },
      { status: 500 }
    )
  }
}

// PUT /api/drills/[id] - Update a drill
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, description, type, difficulty, duration, scenario, isActive } = body

    const existingDrill = await db.virtualDrill.findUnique({
      where: { id: params.id }
    })

    if (!existingDrill) {
      return NextResponse.json(
        { error: 'Drill not found' },
        { status: 404 }
      )
    }

    const updatedDrill = await db.virtualDrill.update({
      where: { id: params.id },
      data: {
        title,
        description,
        type,
        difficulty,
        duration,
        scenario,
        isActive
      },
      include: {
        steps: true
      }
    })

    return NextResponse.json(updatedDrill)
  } catch (error) {
    console.error('Error updating drill:', error)
    return NextResponse.json(
      { error: 'Failed to update drill' },
      { status: 500 }
    )
  }
}

// DELETE /api/drills/[id] - Delete a drill
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existingDrill = await db.virtualDrill.findUnique({
      where: { id: params.id }
    })

    if (!existingDrill) {
      return NextResponse.json(
        { error: 'Drill not found' },
        { status: 404 }
      )
    }

    await db.virtualDrill.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Drill deleted successfully' })
  } catch (error) {
    console.error('Error deleting drill:', error)
    return NextResponse.json(
      { error: 'Failed to delete drill' },
      { status: 500 }
    )
  }
}
