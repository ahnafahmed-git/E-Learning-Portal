import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyToken } from '@/lib/auth/jwt';

export async function POST(request: NextRequest) {
  try {
    const { test_id, answers, time_taken } = await request.json();
    
    // Get user from token
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userId = decoded.userId;

    // Get test details
    const test = db.prepare('SELECT * FROM tests WHERE id = ?').get(test_id) as any;
    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    // Get all questions that were answered (from the answers object)
    const questionIds = Object.keys(answers).map(id => parseInt(id));
    
    if (questionIds.length === 0) {
      return NextResponse.json({ error: 'No answers submitted' }, { status: 400 });
    }

    const placeholders = questionIds.map(() => '?').join(',');
    const questions = db.prepare(
      `SELECT * FROM questions WHERE id IN (${placeholders})`
    ).all(...questionIds) as any[];
    
    // Calculate score
    let correctAnswers = 0;
    let totalScore = 0;
    const detailedAnswers: any[] = [];
    
    questions.forEach(question => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correct_option;
      
      if (isCorrect) {
        correctAnswers++;
        totalScore += question.points;
      }

      detailedAnswers.push({
        question_id: question.id,
        question_text: question.question_text,
        user_answer: userAnswer,
        correct_answer: question.correct_option,
        is_correct: isCorrect,
        points: isCorrect ? question.points : 0,
        explanation: question.explanation
      });
    });

    const totalPossible = questions.reduce((sum, q) => sum + q.points, 0);
    const percentageScore = Math.round((totalScore / totalPossible) * 100);
    const passed = percentageScore >= test.passing_score;

    // Save result
    const result = db.prepare(`
      INSERT INTO test_results 
      (user_id, test_id, score, total_marks, total_questions, correct_answers, percentage, passed, time_taken, answers_json, completed_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).run(
      userId, 
      test_id, 
      totalScore, 
      totalPossible,
      questions.length, 
      correctAnswers, 
      percentageScore,
      passed ? 1 : 0,
      time_taken,
      JSON.stringify(detailedAnswers)
    );

    return NextResponse.json({
      success: true,
      result_id: result.lastInsertRowid,
      score: totalScore,
      total_marks: totalPossible,
      correct_answers: correctAnswers,
      total_questions: questions.length,
      percentage: percentageScore,
      passed: passed,
      passing_score: test.passing_score,
      time_taken: time_taken
    });

  } catch (error: any) {
    console.error('Submit test error:', error);
    return NextResponse.json(
      { error: 'Failed to submit test: ' + error.message },
      { status: 500 }
    );
  }
}