import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/alerts - Get all alerts with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const severity = searchParams.get('severity')
    const region = searchParams.get('region')
    const status = searchParams.get('status')
    const activeOnly = searchParams.get('activeOnly') === 'true'

    const where: any = {}
    
    if (type) where.type = type
    if (severity) where.severity = severity
    if (region) where.region = region
    if (status) where.status = status
    if (activeOnly) {
      where.status = 'ACTIVE'
      where.expiresAt = { gt: new Date() }
    }

    const alerts = await db.alert.findMany({
      where,
      orderBy: { issuedAt: 'desc' }
    })

    return NextResponse.json(alerts)
  } catch (error) {
    console.error('Error fetching alerts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    )
  }
}

// POST /api/alerts - Create a new alert
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, type, severity, region, expiresAt, actions, source, contact } = body

    if (!title || !description || !type || !severity || !region || !expiresAt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const alert = await db.alert.create({
      data: {
        title,
        description,
        type,
        severity,
        region,
        expiresAt: new Date(expiresAt),
        actions,
        source,
        contact
      }
    })

    // Broadcast the new alert via WebSocket to connected clients
    try {
      const broadcastAlert = (global as any).broadcastAlert;
      if (broadcastAlert && typeof broadcastAlert === 'function') {
        broadcastAlert({
          id: alert.id,
          title: alert.title,
          description: alert.description,
          type: alert.type,
          severity: alert.severity,
          region: alert.region,
          issuedAt: alert.issuedAt.toISOString(),
          expiresAt: alert.expiresAt.toISOString(),
          actions: alert.actions,
          source: alert.source,
          contact: alert.contact
        });
        console.log('Alert broadcasted via WebSocket');
      } else {
        console.log('WebSocket broadcast function not available');
      }
    } catch (wsError) {
      console.error('Error broadcasting alert via WebSocket:', wsError);
      // Don't fail the API call if WebSocket broadcasting fails
    }

    return NextResponse.json(alert, { status: 201 })
  } catch (error) {
    console.error('Error creating alert:', error)
    return NextResponse.json(
      { error: 'Failed to create alert' },
      { status: 500 }
    )
  }
}

// PUT - Update an existing alert
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, title, description, type, severity, region, expiresAt, actions, source, contact, status } = body

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Alert ID is required" },
        { status: 400 }
      )
    }

    const updatedAlert = await db.alert.update({
      where: { id },
      data: {
        title,
        description,
        type,
        severity,
        region,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
        actions: actions ? JSON.stringify(actions) : undefined,
        source,
        contact,
        status,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedAlert,
      message: "Alert updated successfully"
    })
  } catch (error) {
    console.error("Failed to update alert:", error)
    return NextResponse.json(
      { success: false, message: "Failed to update alert" },
      { status: 500 }
    )
  }
}

// DELETE - Delete an alert
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Alert ID is required" },
        { status: 400 }
      )
    }

    await db.alert.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: "Alert deleted successfully"
    })
  } catch (error) {
    console.error("Failed to delete alert:", error)
    return NextResponse.json(
      { success: false, message: "Failed to delete alert" },
      { status: 500 }
    )
  }
}