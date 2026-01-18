import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_change_in_production';

export interface User {
  id: number;
  email: string;
  name?: string;
  is_verified: boolean;
  created_at: string;
}

export class AuthService {
  static async register(
    email: string,
    password: string,
    name?: string
  ): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
    try {
      // Check if user exists
      const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
      if (existingUser) {
        return { success: false, error: 'User already exists' };
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Insert user
      const stmt = db.prepare(
        'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)'
      );
      const result = stmt.run(email, passwordHash, name);

      // Get the inserted user
      const user = db.prepare('SELECT id, email, name, is_verified, created_at FROM users WHERE id = ?').get(result.lastInsertRowid) as User;

      // Generate token
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

      return {
        success: true,
        user,
        token,
      };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    }
  }

  static async login(
    email: string,
    password: string
  ): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
    try {
      // Get user by email
      const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
      if (!user) {
        return { success: false, error: 'Invalid credentials' };
      }

      // Compare passwords
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return { success: false, error: 'Invalid credentials' };
      }

      // Generate token
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

      // Remove password_hash from user object
      const { password_hash, ...userWithoutPassword } = user;

      return {
        success: true,
        user: userWithoutPassword,
        token,
      };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  }

  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }
}