// app/api/tests/test/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    // Check if database has questions
    const testCount = db.prepare('SELECT COUNT(*) as count FROM tests').get() as any;
    const questionCount = db.prepare('SELECT COUNT(*) as count FROM questions').get() as any;
    const testResults = db.prepare('SELECT COUNT(*) as count FROM test_results').get() as any;
    
    return NextResponse.json({
      status: 'API is working',
      database: {
        tests: testCount.count,
        questions: questionCount.count,
        test_results: testResults.count
      },
      endpoints: {
        available_tests: '/api/tests/available',
        test_questions: '/api/tests/[id]/questions',
        submit_test: '/api/tests/submit (POST)'
      }
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: 'API error', details: error.message },
      { status: 500 }
    );
  }
}