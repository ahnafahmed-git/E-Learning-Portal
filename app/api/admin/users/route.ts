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

    // Get all users with their test stats
    const users = db.prepare(`
      SELECT 
        u.id,
        u.username,
        u.name,
        u.role,
        u.created_at,
        COUNT(DISTINCT tr.id) as tests_taken,
        AVG(tr.percentage) as avg_score,
        SUM(CASE WHEN tr.passed = 1 THEN 1 ELSE 0 END) as tests_passed
      FROM users u
      LEFT JOIN test_results tr ON u.id = tr.user_id
      WHERE u.role = 'employee'
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `).all() as any[];

    return NextResponse.json({
      success: true,
      users
    });

  } catch (error: any) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Failed to get users' },
      { status: 500 }
    );
  }
}