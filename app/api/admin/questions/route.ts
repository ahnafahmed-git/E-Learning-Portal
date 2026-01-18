import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyToken } from '@/lib/auth/jwt';

// GET all questions
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const questions = db.prepare(`
      SELECT q.*, t.title as test_title
      FROM questions q
      JOIN tests t ON q.test_id = t.id
      ORDER BY q.test_id, q.id
    `).all() as any[];

    return NextResponse.json({ success: true, questions });
  } catch (error: any) {
    console.error('Get questions error:', error);
    return NextResponse.json({ error: 'Failed to get questions' }, { status: 500 });
  }
}

// POST new question
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const data = await request.json();
    const {
      test_id,
      question_text,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_option,
      points,
      explanation
    } = data;

    // Validate required fields
    if (!test_id || !question_text || !option_a || !option_b || !option_c || !option_d || !correct_option) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = db.prepare(`
      INSERT INTO questions (test_id, question_text, option_a, option_b, option_c, option_d, correct_option, points, explanation, in_pool)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `).run(test_id, question_text, option_a, option_b, option_c, option_d, correct_option, points || 2, explanation || '');

    return NextResponse.json({
      success: true,
      message: 'Question added successfully',
      question_id: result.lastInsertRowid
    });
  } catch (error: any) {
    console.error('Add question error:', error);
    return NextResponse.json({ error: 'Failed to add question' }, { status: 500 });
  }
}

// DELETE question
export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get('id');

    if (!questionId) {
      return NextResponse.json({ error: 'Question ID required' }, { status: 400 });
    }

    db.prepare('DELETE FROM questions WHERE id = ?').run(questionId);

    return NextResponse.json({ success: true, message: 'Question deleted successfully' });
  } catch (error: any) {
    console.error('Delete question error:', error);
    return NextResponse.json({ error: 'Failed to delete question' }, { status: 500 });
  }
}