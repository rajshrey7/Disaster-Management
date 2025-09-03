import { NextRequest, NextResponse } from 'next/server';
import { requireRole, getRequestUserId } from '@/lib/rbac';

// In-memory store for demo; in production, use Prisma models
type RollState = 'SAFE' | 'MISSING' | 'NEEDS_ATTENTION';
interface RollCallEntry {
  userId: string;
  classId?: string;
  status: RollState;
  location?: string;
  updatedAt: string;
}

const rollCall = new Map<string, RollCallEntry>();

export async function GET(req: NextRequest) {
  try {
    const authError = requireRole(req, ['ADMINISTRATOR', 'TEACHER']);
    if (authError) return authError;

    // Aggregate counts
    let safe = 0, missing = 0, needs = 0;
    rollCall.forEach((e) => {
      if (e.status === 'SAFE') safe++;
      else if (e.status === 'MISSING') missing++;
      else needs++;
    });

    return NextResponse.json({
      success: true,
      data: {
        totals: { SAFE: safe, MISSING: missing, NEEDS_ATTENTION: needs },
        entries: Array.from(rollCall.values()),
      },
    });
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Failed to fetch roll call' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authError = requireRole(req, ['TEACHER']);
    if (authError) return authError;

    const body = await req.json();
    const { targetUserId, status, location, classId } = body as {
      targetUserId?: string;
      status: RollState;
      location?: string;
      classId?: string;
    };

    if (!status) {
      return NextResponse.json({ success: false, message: 'Missing status' }, { status: 400 });
    }

    const actingUserId = getRequestUserId(req);
    const userId = targetUserId || actingUserId;
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Missing user context' }, { status: 400 });
    }

    const entry: RollCallEntry = {
      userId,
      classId,
      status,
      location,
      updatedAt: new Date().toISOString(),
    };
    rollCall.set(userId, entry);

    // TODO: emit websocket event for real-time admin dashboard
    return NextResponse.json({ success: true, data: entry, message: 'Roll call updated' });
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Failed to update roll call' }, { status: 500 });
  }
}


