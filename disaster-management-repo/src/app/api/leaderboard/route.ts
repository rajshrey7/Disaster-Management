import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { gamificationService } from '@/lib/gamification';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));

    const users = await db.user.findMany({
      select: { id: true, name: true, role: true },
      take: limit * 3, // fetch extra to account for missing progress
    });

    const stats = await Promise.all(
      users.map(async (u) => {
        try {
          const s = await gamificationService.calculateUserStats(u.id);
          return {
            id: u.id,
            name: u.name || `User ${u.id.slice(0, 5)}`,
            class: u.role, // placeholder; could map to profile.grade/section
            xp: s.experiencePoints,
            level: s.level,
            badges: s.badges.length,
          };
        } catch {
          return null;
        }
      })
    );

    const rows = stats
      .filter((r): r is NonNullable<typeof r> => Boolean(r))
      .sort((a, b) => b.xp - a.xp)
      .slice(0, limit);

    return NextResponse.json({ success: true, data: rows });
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Failed to load leaderboard' }, { status: 500 });
  }
}


