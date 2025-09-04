import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/progress/drill-results - Get drill results with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const drillId = searchParams.get('drillId')
    const passed = searchParams.get('passed')

    const where: any = {}
    
    if (userId) where.userId = userId
    if (drillId) where.drillId = drillId
    if (passed !== null) where.passed = passed === 'true'

    const drillResults = await db.drillResult.findMany({
      where,
      include: {
        user: true,
        drill: true
      },
      orderBy: { completedAt: 'desc' }
    })

    return NextResponse.json(drillResults)
  } catch (error) {
    console.error('Error fetching drill results:', error)
    return NextResponse.json(
      { error: 'Failed to fetch drill results' },
      { status: 500 }
    )
  }
}

// POST /api/progress/drill-results - Create a new drill result
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, drillId, userResponses, score, maxScore, timeTaken } = body

    if (!userId || !drillId || userResponses === undefined || score === undefined || maxScore === undefined || timeTaken === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Calculate if user passed (70% threshold)
    const passed = score >= (maxScore * 0.7)

    const drillResult = await db.drillResult.create({
      data: {
        userId,
        drillId,
        userResponses,
        score,
        maxScore,
        timeTaken,
        passed,
        completedAt: new Date()
      },
      include: {
        user: true,
        drill: true
      }
    })

    return NextResponse.json(drillResult, { status: 201 })
  } catch (error) {
    console.error('Error creating drill result:', error)
    return NextResponse.json(
      { error: 'Failed to create drill result' },
      { status: 500 }
    )
  }
}
