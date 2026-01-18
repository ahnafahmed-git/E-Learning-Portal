// /app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/lib/db';
import type { User } from '@/lib/types';

interface UserRow {
  id: number;
}

export async function POST(request: NextRequest) {
  try {
    const { username, name, password } = await request.json();

    // Validate input
    if (!username || !name || !password) {
      return NextResponse.json(
        { error: 'Username, name, and password are required' },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE username = ?').get(username) as UserRow | undefined;
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const result = db.prepare(`
      INSERT INTO users (username, name, password_hash) 
      VALUES (?, ?, ?)
    `).run(username, name, password_hash);

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      user: {
        id: Number(result.lastInsertRowid),
        username,
        name,
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}