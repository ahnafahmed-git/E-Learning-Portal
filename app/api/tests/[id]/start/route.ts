import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const testId = parseInt(params.id);
    console.log(`📝 Starting test ${testId}`);

    // Get test details
    const test = db.prepare('SELECT * FROM tests WHERE id = ? AND is_active = 1').get(testId) as any;
    
    if (!test) {
      console.error(`❌ Test ${testId} not found or inactive`);
      return NextResponse.json(
        { error: 'Test not found or inactive' },
        { status: 404 }
      );
    }

    // Check if questions exist
    const questionCount = db.prepare(
      'SELECT COUNT(*) as count FROM questions WHERE test_id = ? AND in_pool = 1'
    ).get(testId) as any;
    
    if (!questionCount || questionCount.count === 0) {
      console.error(`❌ No questions for test ${testId}`);
      return NextResponse.json(
        { error: 'No questions available for this test' },
        { status: 404 }
      );
    }

    console.log(`✅ Found ${questionCount.count} questions for test ${testId}`);

    // Get random questions (limit to test's question_count)
    const questions = db.prepare(`
      SELECT id, test_id, question_text, option_a, option_b, option_c, option_d, points
      FROM questions 
      WHERE test_id = ? AND in_pool = 1
      ORDER BY RANDOM()
      LIMIT ?
    `).all(testId, test.question_count) as any[];

    console.log(`✅ Returning ${questions.length} random questions`);

    return NextResponse.json({
      test,
      questions,
      total_questions: questions.length,
      total_marks: questions.reduce((sum, q) => sum + q.points, 0),
    });

  } catch (error: any) {
    console.error('❌ Error starting test:', error);
    return NextResponse.json(
      { error: 'Failed to start test: ' + error.message },
      { status: 500 }
    );
  }
}