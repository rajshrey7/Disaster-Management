import { NextResponse, NextRequest } from "next/server"
import { requireRole } from "@/lib/rbac"

// Mock data for users
const users = [
  {
    id: "1",
    name: "Rajesh Kumar",
    role: "student",
    status: "online",
    location: "Classroom A-101",
    lastSeen: new Date().toISOString()
  },
  {
    id: "2",
    name: "Priya Sharma",
    role: "teacher",
    status: "online",
    location: "Staff Room",
    lastSeen: new Date().toISOString()
  },
  {
    id: "3",
    name: "Dr. Anand Patel",
    role: "admin",
    status: "busy",
    location: "Principal Office",
    lastSeen: new Date().toISOString()
  },
  {
    id: "4",
    name: "Emergency Response Team",
    role: "emergency_responder",
    status: "online",
    location: "Command Center",
    lastSeen: new Date().toISOString()
  }
]

// Mock data for messages
const messages = [
  {
    id: "1",
    sender: "System",
    senderType: "system",
    content: "Emergency communication system activated. All users can now communicate in real-time.",
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    type: "system"
  },
  {
    id: "2",
    sender: "Priya Sharma",
    senderType: "teacher",
    content: "All students please report to your designated assembly points immediately.",
    timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    type: "text"
  },
  {
    id: "3",
    sender: "Emergency Response Team",
    senderType: "emergency",
    content: "🚨 EMERGENCY ALERT: Earthquake drill in progress. Follow safety protocols.",
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    type: "emergency",
    priority: "high"
  }
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'users':
        return NextResponse.json({
          success: true,
          data: users,
          message: "Users retrieved successfully"
        })

      case 'messages':
        const limit = parseInt(searchParams.get('limit') || '50')
        const offset = parseInt(searchParams.get('offset') || '0')
        
        const paginatedMessages = messages
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(offset, offset + limit)

        return NextResponse.json({
          success: true,
          data: {
            messages: paginatedMessages,
            total: messages.length,
            limit,
            offset
          },
          message: "Messages retrieved successfully"
        })

      case 'calls':
        // Mock call history
        const callHistory = [
          {
            id: "1",
            type: "audio",
            participant: "Emergency Response Team",
            duration: 300,
            status: "completed",
            startTime: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
            endTime: new Date(Date.now() - 2 * 60 * 1000).toISOString()
          },
          {
            id: "2",
            type: "video",
            participant: "Dr. Anand Patel",
            duration: 600,
            status: "completed",
            startTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
            endTime: new Date(Date.now() - 50 * 60 * 1000).toISOString()
          }
        ]

        return NextResponse.json({
          success: true,
          data: callHistory,
          message: "Call history retrieved successfully"
        })

      default:
        return NextResponse.json({
          success: true,
          data: {
            users,
            messages: messages.slice(0, 10),
            systemStatus: "active"
          },
          message: "Communication data retrieved successfully"
        })
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to retrieve communication data" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case 'send_message':
        const { sender, content, type, priority } = data
        
        const newMessage = {
          id: Date.now().toString(),
          sender,
          senderType: "user", // In real app, get from auth
          content,
          timestamp: new Date().toISOString(),
          type: type || "text",
          priority
        }

        console.log('New message:', newMessage)

        // Simulate emergency response
        if (type === 'emergency') {
          setTimeout(() => {
            console.log('Emergency response triggered')
          }, 1000)
        }

        return NextResponse.json({
          success: true,
          data: newMessage,
          message: "Message sent successfully"
        })

      case 'start_call':
        const { callType, participants } = data
        
        const callSession = {
          id: Date.now().toString(),
          type: callType,
          participants,
          status: "initiated",
          startTime: new Date().toISOString(),
          sessionId: `call_${Date.now()}`
        }

        console.log('Call session started:', callSession)

        return NextResponse.json({
          success: true,
          data: callSession,
          message: "Call initiated successfully"
        })

      case 'end_call':
        const { callId, duration } = data
        
        console.log(`Call ${callId} ended after ${duration} seconds`)

        return NextResponse.json({
          success: true,
          message: "Call ended successfully"
        })

      case 'broadcast':
        {
        const authError = requireRole(request, ['ADMINISTRATOR'])
        if (authError) return authError
        const { message, broadcastType, priority: broadcastPriority, targetRegions } = data
        
        const broadcast = {
          id: Date.now().toString(),
          message,
          type: broadcastType,
          priority: broadcastPriority,
          targetRegions,
          sender: "System",
          timestamp: new Date().toISOString(),
          status: "sent"
        }

        console.log('Emergency broadcast sent:', broadcast)

        return NextResponse.json({
          success: true,
          data: broadcast,
          message: "Broadcast sent successfully"
        })
        }

      case 'update_status':
        const { userId, status, location } = data
        
        console.log(`User ${userId} status updated to ${status} at ${location}`)

        return NextResponse.json({
          success: true,
          message: "Status updated successfully"
        })

      default:
        return NextResponse.json(
          { success: false, message: "Unknown action" },
          { status: 400 }
        )
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to process communication action" },
      { status: 500 }
    )
  }
}