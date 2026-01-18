// scripts/debug-db.js
const Database = require('better-sqlite3');
const db = new Database('sheba-learning.db');

console.log('🔍 DEBUGGING DATABASE');
console.log('=====================');

// Check all tables
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('📋 Tables found:', tables.map(t => t.name));

// Check users
const users = db.prepare('SELECT COUNT(*) as count FROM users').get();
console.log('👥 Users:', users.count);

// Check tests
const tests = db.prepare('SELECT * FROM tests').all();
console.log(`🧪 Tests: ${tests.length}`);
tests.forEach(t => console.log(`  ID: ${t.id}, Title: "${t.title}"`));

// Check questions
const questions = db.prepare('SELECT COUNT(*) as count FROM questions').get();
console.log(`❓ Total Questions: ${questions.count}`);

// Check questions for test 1
const test1Questions = db.prepare(`
  SELECT COUNT(*) as count, 
         COUNT(CASE WHEN in_pool = 1 THEN 1 END) as in_pool_count
  FROM questions WHERE test_id = 1
`).get();
console.log(`  Questions for Test 1: ${test1Questions.count} (${test1Questions.in_pool_count} in pool)`);

// Show sample questions
console.log('\n📝 Sample Questions:');
const samples = db.prepare('SELECT id, question_text FROM questions WHERE test_id = 1 LIMIT 3').all();
samples.forEach(q => console.log(`  ${q.id}. ${q.question_text.substring(0, 50)}...`));

db.close();