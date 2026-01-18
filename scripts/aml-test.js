// scripts/insert-aml-questions.js
const Database = require('better-sqlite3');
const db = new Database('sheba-learning.db');

// Create AML/CFT test
const test = db.prepare(`
  INSERT INTO tests (title, description, time_limit, passing_score)
  VALUES (?, ?, ?, ?)
`).run(
  'AML/CFT Compliance Test',
  'Anti-Money Laundering and Counter Financing of Terrorism assessment for Sheba Pay employees. 25 questions, 2 marks each. Passing score: 70%',
  45, // 45 minutes for 25 questions
  70  // 70% passing (35/50 marks)
);

const testId = test.lastInsertRowid;

// All 40 questions (you can select 25 for the actual test)
const questions = [
  {
    question_text: "What is money laundering?",
    option_a: "Legally investing money in businesses",
    option_b: "Hiding origins of illegally obtained money through complex transactions",
    option_c: "Converting money to foreign currency",
    option_d: "Depositing cash in multiple bank accounts",
    correct_option: "B",
    points: 2,
    explanation: "Money laundering is the process of hiding the origins of money obtained from illegitimate sources and changing its identity through complex transactions."
  },
  {
    question_text: "How many steps are in the money laundering cycle?",
    option_a: "2",
    option_b: "3",
    option_c: "4",
    option_d: "5",
    correct_option: "B",
    points: 2,
    explanation: "Money laundering usually involves three steps: Placement, Layering, and Integration."
  },
  // Add all 40 questions here...
];

// Insert questions
const insertQuestion = db.prepare(`
  INSERT INTO questions (test_id, question_text, option_a, option_b, option_c, option_d, correct_option, points, explanation)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

questions.forEach((q, index) => {
  insertQuestion.run(
    testId,
    q.question_text,
    q.option_a,
    q.option_b,
    q.option_c,
    q.option_d,
    q.correct_option,
    q.points,
    q.explanation
  );
  console.log(`Inserted question ${index + 1}: ${q.question_text.substring(0, 50)}...`);
});

console.log(`✅ Created AML/CFT Test (ID: ${testId}) with ${questions.length} questions`);
db.close();