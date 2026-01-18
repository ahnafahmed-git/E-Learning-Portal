// scripts/setup-database.js
const Database = require('better-sqlite3');
const db = new Database('sheba-learning.db');

console.log('🔧 Setting up database...');

// Create all tables (same as lib/db/index.ts)
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS tests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    time_limit INTEGER,
    passing_score INTEGER DEFAULT 70,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_id INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option CHAR(1) NOT NULL,
    points INTEGER DEFAULT 2,
    explanation TEXT,
    in_pool BOOLEAN DEFAULT 1,
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS test_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    test_id INTEGER NOT NULL,
    score INTEGER,
    total_questions INTEGER,
    correct_answers INTEGER,
    time_taken INTEGER,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (test_id) REFERENCES tests(id)
  )
`);

console.log('✅ Tables created!');

// Create a default AML/CFT test if it doesn't exist
const existingTest = db.prepare('SELECT id FROM tests WHERE id = 1').get();
if (!existingTest) {
  const test = db.prepare(`
    INSERT INTO tests (title, description, time_limit, passing_score) 
    VALUES (?, ?, ?, ?)
  `).run(
    'Compliance AML/CFT Assessment',
    'Mandatory compliance test for all employees. 25 questions, 50 marks total.',
    30,
    70
  );
  console.log('✅ Created default test with ID:', test.lastInsertRowid);
} else {
  console.log('✅ Test already exists with ID: 1');
}

// Check if we have questions
const questionCount = db.prepare('SELECT COUNT(*) as count FROM questions WHERE test_id = 1').get();
console.log(`Questions in test 1: ${questionCount.count}`);

db.close();