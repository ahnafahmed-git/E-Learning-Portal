// lib/types.ts
export interface User {
  id: number;
  username: string;
  name: string;
  password_hash: string;
  role: 'admin' | 'employee';
  created_at: string;
}

export interface JWTPayload {
  userId: number;
  username: string;
  name: string;
  role: 'admin' | 'employee';
}

export interface Test {
  id: number;
  title: string;
  description: string;
  time_limit: number;
  passing_score: number;
  total_marks: number;
  question_count: number;
  is_active: boolean;
  created_at: string;
}

export interface Question {
  id: number;
  test_id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  points: number;
  explanation?: string;
  in_pool: boolean;
}

export interface TestResult {
  id: number;
  user_id: number;
  test_id: number;
  score: number;
  total_marks: number;
  total_questions: number;
  correct_answers: number;
  percentage: number;
  passed: boolean;
  time_taken: number;
  answers_json: string;
  completed_at: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}