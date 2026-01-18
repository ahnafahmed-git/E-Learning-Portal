// app/api/tests/available/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const tests = db.prepare(`
      SELECT t.*, 
             COUNT(q.id) as question_count,
             SUM(q.points) as total_marks
      FROM tests t
      LEFT JOIN questions q ON t.id = q.test_id
      WHERE t.is_active = 1
      GROUP BY t.id
    `).all() as any[];

    return NextResponse.json({
      tests,
      count: tests.length
    });

  } catch (error: any) {
    console.error('Error fetching tests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tests' },
      { status: 500 }
    );
  }
}