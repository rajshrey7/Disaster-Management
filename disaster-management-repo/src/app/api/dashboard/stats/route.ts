import { NextRequest, NextResponse } from 'next/server';
import { gamificationService } from '@/lib/gamification';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get comprehensive user statistics
    const userStats = await gamificationService.calculateUserStats(userId);

    return NextResponse.json({
      success: true,
      data: userStats
    });

  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch user statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, action } = body;

    if (!userId || !action) {
      return NextResponse.json(
        { error: 'User ID and action are required' },
        { status: 400 }
      );
    }

    // Update user progress and recalculate stats
    await gamificationService.updateUserProgress(userId, action);
    
    // Get updated statistics
    const updatedStats = await gamificationService.calculateUserStats(userId);

    return NextResponse.json({
      success: true,
      message: 'User progress updated successfully',
      data: updatedStats
    });

  } catch (error) {
    console.error('Error updating user progress:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update user progress',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
