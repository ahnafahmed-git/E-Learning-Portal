// app/api/tests/[id]/questions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const testId = parseInt(params.id);
    
    // Get test details
    const test = db.prepare('SELECT * FROM tests WHERE id = ?').get(testId) as any;
    
    if (!test) {
      return NextResponse.json(
        { error: 'Test not found' },
        { status: 404 }
      );
    }

    // Get 25 random questions from the pool for this test
    const questions = db.prepare(`
      SELECT id, test_id, question_text, option_a, option_b, option_c, option_d, points
      FROM questions 
      WHERE test_id = ? AND in_pool = 1
      ORDER BY RANDOM()
      LIMIT 25
    `).all(testId) as any[];

    if (questions.length === 0) {
      return NextResponse.json(
        { error: 'No questions available for this test' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      test,
      questions,
      total_questions: questions.length,
      total_marks: questions.reduce((sum, q) => sum + q.points, 0),
      note: '25 questions randomly selected from pool'
    });

  } catch (error: any) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}