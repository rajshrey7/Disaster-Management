import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/users - Get all users with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const institution = searchParams.get('institution')
    const location = searchParams.get('location')
    const includeProfile = searchParams.get('includeProfile') === 'true'

    const where: any = {}
    
    if (role) where.role = role
    if (institution) where.institution = institution
    if (location) where.location = location

    const users = await db.user.findMany({
      where,
      include: {
        profile: includeProfile
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, role, institution, location, phone, profile } = body

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const user = await db.user.create({
      data: {
        email,
        name,
        role: role || 'STUDENT',
        institution,
        location,
        phone,
        profile: profile ? {
          create: {
            grade: profile.grade,
            department: profile.department,
            subjects: profile.subjects,
            emergencyContact: profile.emergencyContact,
            medicalConditions: profile.medicalConditions,
            avatar: profile.avatar
          }
        } : undefined
      },
      include: {
        profile: true
      }
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}

// PUT - Update a user and profile
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { 
      id, 
      email, 
      name, 
      role, 
      institution, 
      location, 
      phone,
      profile 
    } = body

    if (!id) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      )
    }

    // Update user and profile in a transaction
    const result = await db.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id },
        data: {
          email,
          name,
          role,
          institution,
          location,
          phone,
          updatedAt: new Date(),
          profile: profile ? {
            upsert: {
              create: {
                grade: profile.grade || null,
                department: profile.department || null,
                subjects: profile.subjects ? JSON.stringify(profile.subjects) : null,
                emergencyContact: profile.emergencyContact || null,
                medicalConditions: profile.medicalConditions || null,
                avatar: profile.avatar || null
              },
              update: {
                grade: profile.grade || null,
                department: profile.department || null,
                subjects: profile.subjects ? JSON.stringify(profile.subjects) : null,
                emergencyContact: profile.emergencyContact || null,
                medicalConditions: profile.medicalConditions || null,
                avatar: profile.avatar || null,
                updatedAt: new Date()
              }
            }
          } : undefined
        },
        include: {
          profile: true
        }
      })
      return user
    })

    return NextResponse.json({
      success: true,
      data: result,
      message: "User updated successfully",
    })
  } catch (error) {
    console.error("Failed to update user:", error)
    return NextResponse.json(
      { success: false, message: "Failed to update user" },
      { status: 500 }
    )
  }
}

// DELETE - Delete a user
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      )
    }

    // Delete user (cascade will handle related records)
    await db.user.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    console.error("Failed to delete user:", error)
    return NextResponse.json(
      { success: false, message: "Failed to delete user" },
      { status: 500 }
    )
  }
}

