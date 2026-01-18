import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyToken } from '@/lib/auth/jwt';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resultId = parseInt(params.id);

    // Get user from token
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get test result with user and test details
    const result = db.prepare(`
      SELECT 
        tr.*,
        u.name as user_name,
        u.username as username,
        t.title as test_title,
        t.description as test_description
      FROM test_results tr
      JOIN users u ON tr.user_id = u.id
      JOIN tests t ON tr.test_id = t.id
      WHERE tr.id = ?
    `).get(resultId) as any;

    if (!result) {
      return NextResponse.json({ error: 'Result not found' }, { status: 404 });
    }

    // Check if user owns this result or is admin
    if (result.user_id !== decoded.userId && decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Parse answers JSON
    const answers = result.answers_json ? JSON.parse(result.answers_json) : [];

    return NextResponse.json({
      success: true,
      result: {
        ...result,
        answers: answers
      }
    });

  } catch (error: any) {
    console.error('Get result error:', error);
    return NextResponse.json(
      { error: 'Failed to get result' },
      { status: 500 }
    );
  }
}