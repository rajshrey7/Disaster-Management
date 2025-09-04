import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/users/[id] - Get a specific user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const includeProfile = searchParams.get('includeProfile') === 'true'
    const includeProgress = searchParams.get('includeProgress') === 'true'
    const includeDrillResults = searchParams.get('includeDrillResults') === 'true'

    const user = await db.user.findUnique({
      where: { id: params.id },
      include: {
        profile: includeProfile,
        progress: includeProgress ? {
          include: {
            module: true,
            lesson: true
          }
        } : false,
        drillResults: includeDrillResults ? {
          include: {
            drill: true
          },
          orderBy: { completedAt: 'desc' }
        } : false
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

// PUT /api/users/[id] - Update a user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { email, name, role, institution, location, phone, profile } = body

    const existingUser = await db.user.findUnique({
      where: { id: params.id }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const updatedUser = await db.user.update({
      where: { id: params.id },
      data: {
        email,
        name,
        role,
        institution,
        location,
        phone,
        profile: profile ? {
          upsert: {
            create: {
              grade: profile.grade,
              department: profile.department,
              subjects: profile.subjects,
              emergencyContact: profile.emergencyContact,
              medicalConditions: profile.medicalConditions,
              avatar: profile.avatar
            },
            update: {
              grade: profile.grade,
              department: profile.department,
              subjects: profile.subjects,
              emergencyContact: profile.emergencyContact,
              medicalConditions: profile.medicalConditions,
              avatar: profile.avatar
            }
          }
        } : undefined
      },
      include: {
        profile: true
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

// DELETE /api/users/[id] - Delete a user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existingUser = await db.user.findUnique({
      where: { id: params.id }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    await db.user.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}
