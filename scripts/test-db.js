// scripts/setup-test-db.js
const Database = require('better-sqlite3');
const db = new Database('sheba-learning.db');

// Create tests table
db.exec(`
  CREATE TABLE IF NOT EXISTS tests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    time_limit INTEGER, -- in minutes
    passing_score INTEGER DEFAULT 70,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create questions table
db.exec(`
  CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_id INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option CHAR(1) NOT NULL CHECK(correct_option IN ('A', 'B', 'C', 'D')),
    points INTEGER DEFAULT 1,
    explanation TEXT,
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
  )
`);

// Create test_results table
db.exec(`
  CREATE TABLE IF NOT EXISTS test_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    test_id INTEGER NOT NULL,
    score INTEGER,
    total_questions INTEGER,
    correct_answers INTEGER,
    time_taken INTEGER, -- in seconds
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (test_id) REFERENCES tests(id)
  )
`);

// Insert sample test
const test = db.prepare('INSERT INTO tests (title, description, time_limit) VALUES (?, ?, ?)').run(
  'Company Policy & Safety Test',
  'Assessment on company policies, safety procedures, and service standards',
  30
);

console.log('✅ Database tables created successfully!');
console.log(`✅ Sample test created with ID: ${test.lastInsertRowid}`);

// Add sample questions (temporary - we'll replace with your PDF questions)
const sampleQuestions = [
  {
    question: "What should you do in case of a fire emergency?",
    options: {
      A: "Run to the nearest exit",
      B: "Use the fire extinguisher immediately",
      C: "Activate fire alarm and evacuate calmly",
      D: "Hide under your desk"
    },
    correct: "C",
    explanation: "Always activate the fire alarm first and evacuate calmly following emergency procedures."
  },
  {
    question: "What is the company's core value?",
    options: {
      A: "Profit maximization",
      B: "Customer satisfaction and safety",
      C: "Market dominance",
      D: "Employee benefits only"
    },
    correct: "B",
    explanation: "Our core value prioritizes customer satisfaction and safety above all else."
  }
];

sampleQuestions.forEach((q, index) => {
  db.prepare(`
    INSERT INTO questions (test_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    test.lastInsertRowid,
    q.question,
    q.options.A,
    q.options.B,
    q.options.C,
    q.options.D,
    q.correct,
    q.explanation
  );
});

console.log(`✅ Added ${sampleQuestions.length} sample questions`);
db.close();