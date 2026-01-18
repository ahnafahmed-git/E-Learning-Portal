// scripts/update-aml-test.js
const Database = require('better-sqlite3');
const db = new Database('sheba-learning.db');

// Update the test title and description
db.prepare(`
  UPDATE tests 
  SET title = 'Compliance AML/CFT Assessment', 
      description = 'Mandatory AML/CFT compliance test. 25 randomly selected questions from a pool of 40. Passing score: 70%.'
  WHERE id = 1
`).run();

console.log('✅ Updated test title to: Compliance AML/CFT Assessment');

// Create a function to get 25 random questions for the test
const getAllQuestions = db.prepare('SELECT * FROM questions WHERE test_id = 1').all();

console.log(`✅ Found ${getAllQuestions.length} questions in the pool`);

// Add a field to mark which questions are in the pool
db.prepare('ALTER TABLE questions ADD COLUMN in_pool BOOLEAN DEFAULT 1').run().catch(() => {
  // Column might already exist
});

// Mark all AML questions as in pool
db.prepare('UPDATE questions SET in_pool = 1 WHERE test_id = 1').run();

console.log('✅ All 40 questions marked as in pool');

db.close();