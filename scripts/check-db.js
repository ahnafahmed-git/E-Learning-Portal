// scripts/check-db.js
const Database = require('better-sqlite3');
const db = new Database('sheba-learning.db');

console.log('📊 DATABASE CHECK');
console.log('================');

// Check tables
const tables = db.prepare(`
  SELECT name FROM sqlite_master 
  WHERE type='table' 
  ORDER BY name
`).all();

console.log('Tables found:', tables.map(t => t.name));

// Check counts
const users = db.prepare('SELECT COUNT(*) as count FROM users').get();
const tests = db.prepare('SELECT COUNT(*) as count FROM tests').get();
const questions = db.prepare('SELECT COUNT(*) as count FROM questions').get();
const results = db.prepare('SELECT COUNT(*) as count FROM test_results').get();

console.log('\n📈 Counts:');
console.log('Users:', users.count);
console.log('Tests:', tests.count);
console.log('Questions:', questions.count);
console.log('Test Results:', results.count);

// Show test details
console.log('\n🧪 Tests:');
const testDetails = db.prepare('SELECT * FROM tests').all();
console.table(testDetails);

// Show sample questions
console.log('\n❓ Sample Questions:');
const sampleQuestions = db.prepare('SELECT id, question_text, test_id FROM questions LIMIT 3').all();
console.table(sampleQuestions);

db.close();