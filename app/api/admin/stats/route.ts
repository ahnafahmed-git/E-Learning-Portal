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

    // Get stats
    const stats = {
      totalUsers: db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get('employee') as any,
      totalTests: db.prepare('SELECT COUNT(*) as count FROM tests').get() as any,
      totalQuestions: db.prepare('SELECT COUNT(*) as count FROM questions').get() as any,
      totalResults: db.prepare('SELECT COUNT(*) as count FROM test_results').get() as any,
      passedResults: db.prepare('SELECT COUNT(*) as count FROM test_results WHERE passed = 1').get() as any,
      recentResults: db.prepare(`
        SELECT 
          tr.id,
          tr.percentage,
          tr.passed,
          tr.completed_at,
          u.name as user_name,
          t.title as test_title
        FROM test_results tr
        JOIN users u ON tr.user_id = u.id
        JOIN tests t ON tr.test_id = t.id
        ORDER BY tr.completed_at DESC
        LIMIT 10
      `).all() as any[]
    };

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers: stats.totalUsers.count,
        totalTests: stats.totalTests.count,
        totalQuestions: stats.totalQuestions.count,
        totalResults: stats.totalResults.count,
        passedResults: stats.passedResults.count,
        passRate: stats.totalResults.count > 0 
          ? Math.round((stats.passedResults.count / stats.totalResults.count) * 100) 
          : 0,
        recentResults: stats.recentResults
      }
    });

  } catch (error: any) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: 'Failed to get stats' },
      { status: 500 }
    );
  }
}