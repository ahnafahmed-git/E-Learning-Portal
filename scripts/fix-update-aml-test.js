// scripts/fix-update-aml-test.js
const Database = require('better-sqlite3');
const db = new Database('sheba-learning.db');

console.log('Checking current questions...');

// Check current questions count
const currentQuestions = db.prepare('SELECT COUNT(*) as count FROM questions WHERE test_id = 1').get();
console.log(`Currently have ${currentQuestions.count} questions for test 1`);

// Update the test title and description
db.prepare(`
  UPDATE tests 
  SET title = 'Compliance AML/CFT Assessment', 
      description = 'Mandatory AML/CFT compliance test. 25 randomly selected questions from a pool. Passing score: 70%.'
  WHERE id = 1
`).run();

console.log('Updated test title to: Compliance AML/CFT Assessment');

// Try to add column, ignore error if exists
try {
  db.prepare('ALTER TABLE questions ADD COLUMN in_pool BOOLEAN DEFAULT 1').run();
  console.log('Added in_pool column');
} catch (error) {
  console.log('ℹ️ Column in_pool already exists');
}

// Mark all questions as in pool
db.prepare('UPDATE questions SET in_pool = 1 WHERE test_id = 1').run();

console.log('✅ All questions marked as in pool');

// Check total questions again
const totalQuestions = db.prepare('SELECT COUNT(*) as count FROM questions WHERE test_id = 1').get();
console.log(`✅ Total questions in pool: ${totalQuestions.count}`);

db.close();