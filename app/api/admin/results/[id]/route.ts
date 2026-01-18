//Adding Admin functionality to delete test result
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyToken } from '@/lib/auth/jwt';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const resultId = parseInt(params.id);

    db.prepare('DELETE FROM test_results WHERE id = ?').run(resultId);

    return NextResponse.json({ 
      success: true, 
      message: 'Test result deleted successfully' 
    });

  } catch (error: any) {
    console.error('Delete result error:', error);
    return NextResponse.json(
      { error: 'Failed to delete result' },
      { status: 500 }
    );
  }
}