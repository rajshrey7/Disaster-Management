import { NextRequest, NextResponse } from 'next/server';

export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMINISTRATOR' | 'PARENT';

export function getRequestRole(req: NextRequest): UserRole | null {
  const headerRole = req.headers.get('x-user-role');
  const url = new URL(req.url);
  const queryRole = url.searchParams.get('role');
  const role = (headerRole || queryRole || '').toUpperCase();
  if (role === 'STUDENT' || role === 'TEACHER' || role === 'ADMINISTRATOR' || role === 'PARENT') {
    return role as UserRole;
  }
  return null;
}

export function getRequestUserId(req: NextRequest): string | null {
  return req.headers.get('x-user-id') || null;
}

export function requireRole(req: NextRequest, allowed: UserRole[]): NextResponse | null {
  const role = getRequestRole(req);
  if (!role) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
  if (!allowed.includes(role)) {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
  }
  return null;
}


