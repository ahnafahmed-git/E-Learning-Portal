import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyToken } from '@/lib/auth/jwt';

export async function GET(request: NextRequest) {
  try {
    // Verify admin
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get all test results
    const results = db.prepare(`
      SELECT 
        tr.*,
        u.username,
        u.name as user_name,
        t.title as test_title
      FROM test_results tr
      JOIN users u ON tr.user_id = u.id
      JOIN tests t ON tr.test_id = t.id
      ORDER BY tr.completed_at DESC
    `).all() as any[];

    return NextResponse.json({
      success: true,
      results
    });

  } catch (error: any) {
    console.error('Get results error:', error);
    return NextResponse.json(
      { error: 'Failed to get results' },
      { status: 500 }
    );
  }
}