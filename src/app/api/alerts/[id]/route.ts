import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/alerts/[id] - Get a specific alert by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const alert = await db.alert.findUnique({
      where: { id: params.id }
    })

    if (!alert) {
      return NextResponse.json(
        { error: 'Alert not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(alert)
  } catch (error) {
    console.error('Error fetching alert:', error)
    return NextResponse.json(
      { error: 'Failed to fetch alert' },
      { status: 500 }
    )
  }
}

// PUT /api/alerts/[id] - Update an alert
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, description, type, severity, region, expiresAt, status, actions, source, contact } = body

    const existingAlert = await db.alert.findUnique({
      where: { id: params.id }
    })

    if (!existingAlert) {
      return NextResponse.json(
        { error: 'Alert not found' },
        { status: 404 }
      )
    }

    const updatedAlert = await db.alert.update({
      where: { id: params.id },
      data: {
        title,
        description,
        type,
        severity,
        region,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
        status,
        actions,
        source,
        contact
      }
    })

    return NextResponse.json(updatedAlert)
  } catch (error) {
    console.error('Error updating alert:', error)
    return NextResponse.json(
      { error: 'Failed to update alert' },
      { status: 500 }
    )
  }
}

// DELETE /api/alerts/[id] - Delete an alert
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existingAlert = await db.alert.findUnique({
      where: { id: params.id }
    })

    if (!existingAlert) {
      return NextResponse.json(
        { error: 'Alert not found' },
        { status: 404 }
      )
    }

    await db.alert.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Alert deleted successfully' })
  } catch (error) {
    console.error('Error deleting alert:', error)
    return NextResponse.json(
      { error: 'Failed to delete alert' },
      { status: 500 }
    )
  }
}
