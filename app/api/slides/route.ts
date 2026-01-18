import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const slides = db.prepare(`
      SELECT * FROM lecture_slides
      ORDER BY uploaded_at DESC
    `).all() as any[];

    return NextResponse.json({
      success: true,
      slides
    });

  } catch (error: any) {
    console.error('Get slides error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch slides' },
      { status: 500 }
    );
  }
}