// app/api/tests/[id]/check/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const testId = parseInt(params.id);
    
    // For now, just check if test exists
    const test = db.prepare('SELECT * FROM tests WHERE id = ?').get(testId) as any;
    
    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    return NextResponse.json({
      test_exists: true,
      completed: false // For now, always return false to allow retakes
    });

  } catch (error: any) {
    console.error('Check test error:', error);
    return NextResponse.json({ error: 'Failed to check test' }, { status: 500 });
  }
}