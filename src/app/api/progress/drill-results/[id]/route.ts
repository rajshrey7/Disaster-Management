import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/progress/drill-results/[id] - Get a specific drill result by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const drillResult = await db.drillResult.findUnique({
      where: { id: params.id },
      include: {
        user: true,
        drill: true
      }
    })

    if (!drillResult) {
      return NextResponse.json(
        { error: 'Drill result not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(drillResult)
  } catch (error) {
    console.error('Error fetching drill result:', error)
    return NextResponse.json(
      { error: 'Failed to fetch drill result' },
      { status: 500 }
    )
  }
}

// PUT /api/progress/drill-results/[id] - Update a drill result
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { userResponses, score, maxScore, timeTaken, passed } = body

    const existingDrillResult = await db.drillResult.findUnique({
      where: { id: params.id }
    })

    if (!existingDrillResult) {
      return NextResponse.json(
        { error: 'Drill result not found' },
        { status: 404 }
      )
    }

    const updatedDrillResult = await db.drillResult.update({
      where: { id: params.id },
      data: {
        userResponses,
        score,
        maxScore,
        timeTaken,
        passed
      },
      include: {
        user: true,
        drill: true
      }
    })

    return NextResponse.json(updatedDrillResult)
  } catch (error) {
    console.error('Error updating drill result:', error)
    return NextResponse.json(
      { error: 'Failed to update drill result' },
      { status: 500 }
    )
  }
}

// DELETE /api/progress/drill-results/[id] - Delete a drill result
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existingDrillResult = await db.drillResult.findUnique({
      where: { id: params.id }
    })

    if (!existingDrillResult) {
      return NextResponse.json(
        { error: 'Drill result not found' },
        { status: 404 }
      )
    }

    await db.drillResult.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Drill result deleted successfully' })
  } catch (error) {
    console.error('Error deleting drill result:', error)
    return NextResponse.json(
      { error: 'Failed to delete drill result' },
      { status: 500 }
    )
  }
}
