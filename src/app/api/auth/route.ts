import { NextResponse } from "next/server"

// Mock user database
const users = [
  {
    id: "1",
    email: "student@example.com",
    password: "password123", // In real app, use hashed passwords
    name: "Rajesh Kumar",
    role: "student",
    institution: "Delhi Public School",
    location: "Delhi",
    profile: {
      grade: "10th",
      emergencyContact: "+91 9876543210",
      medicalConditions: "None",
      completedModules: 8,
      completedDrills: 3
    }
  },
  {
    id: "2",
    email: "teacher@example.com",
    password: "password123",
    name: "Priya Sharma",
    role: "teacher",
    institution: "Delhi Public School",
    location: "Delhi",
    profile: {
      department: "Science",
      subjects: ["Physics", "Chemistry"],
      emergencyContact: "+91 9876543211",
      completedModules: 12,
      completedDrills: 5
    }
  },
  {
    id: "3",
    email: "admin@example.com",
    password: "password123",
    name: "Dr. Anand Patel",
    role: "admin",
    institution: "Delhi Public School",
    location: "Delhi",
    profile: {
      position: "Principal",
      emergencyContact: "+91 9876543212",
      completedModules: 15,
      completedDrills: 8
    }
  }
]

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    switch (action) {
      case 'login':
        const { email, password } = data
        
        // Find user by email
        const user = users.find(u => u.email === email)
        
        if (!user || user.password !== password) {
          return NextResponse.json(
            { success: false, message: "Invalid credentials" },
            { status: 401 }
          )
        }

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user

        // In a real app, you would generate and return a JWT token
        return NextResponse.json({
          success: true,
          data: {
            user: userWithoutPassword,
            token: "mock_jwt_token_" + Date.now() // Mock token
          },
          message: "Login successful"
        })

      case 'register':
        const { email: regEmail, password: regPassword, name, role, institution, location, profile } = data
        
        // Check if user already exists
        const existingUser = users.find(u => u.email === regEmail)
        if (existingUser) {
          return NextResponse.json(
            { success: false, message: "User already exists" },
            { status: 400 }
          )
        }

        // Create new user
        const newUser = {
          id: (users.length + 1).toString(),
          email: regEmail,
          password: regPassword,
          name,
          role,
          institution,
          location,
          profile: {
            ...profile,
            completedModules: 0,
            completedDrills: 0
          }
        }

        users.push(newUser)

        // Remove password from response
        const { password: __, ...userWithoutPassword2 } = newUser

        return NextResponse.json({
          success: true,
          data: {
            user: userWithoutPassword2,
            token: "mock_jwt_token_" + Date.now()
          },
          message: "Registration successful"
        })

      case 'update_profile':
        const { userId, profileData } = data
        
        // Find and update user
        const userToUpdate = users.find(u => u.id === userId)
        if (!userToUpdate) {
          return NextResponse.json(
            { success: false, message: "User not found" },
            { status: 404 }
          )
        }

        userToUpdate.profile = { ...userToUpdate.profile, ...profileData }

        return NextResponse.json({
          success: true,
          data: userToUpdate,
          message: "Profile updated successfully"
        })

      case 'change_password':
        const { userId: pwdUserId, currentPassword, newPassword } = data
        
        const userForPwd = users.find(u => u.id === pwdUserId)
        if (!userForPwd || userForPwd.password !== currentPassword) {
          return NextResponse.json(
            { success: false, message: "Current password is incorrect" },
            { status: 400 }
          )
        }

        userForPwd.password = newPassword

        return NextResponse.json({
          success: true,
          message: "Password changed successfully"
        })

      case 'forgot_password':
        const { email: forgotEmail } = data
        
        const userForReset = users.find(u => u.email === forgotEmail)
        if (!userForReset) {
          return NextResponse.json(
            { success: false, message: "Email not found" },
            { status: 404 }
          )
        }

        // In a real app, you would send a password reset email
        console.log(`Password reset requested for ${forgotEmail}`)

        return NextResponse.json({
          success: true,
          message: "Password reset email sent"
        })

      case 'verify_token':
        const { token } = data
        
        // In a real app, you would verify the JWT token
        if (token && token.startsWith("mock_jwt_token_")) {
          const userId = token.split("_").pop()
          const user = users.find(u => u.id === userId)
          
          if (user) {
            const { password: ___, ...userWithoutPassword3 } = user
            return NextResponse.json({
              success: true,
              data: { user: userWithoutPassword3 },
              message: "Token valid"
            })
          }
        }

        return NextResponse.json(
          { success: false, message: "Invalid token" },
          { status: 401 }
        )

      default:
        return NextResponse.json(
          { success: false, message: "Unknown action" },
          { status: 400 }
        )
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Authentication error" },
      { status: 500 }
    )
  }
}