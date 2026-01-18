// create-database.js
const Database = require('better-sqlite3');

// Create/connect to the database file
const db = new Database('sheba-learning.db');

// Enable foreign keys (good practice)
db.pragma('foreign_keys = ON');

// Drop existing users table if it exists
db.exec('DROP TABLE IF EXISTS users');

// Create the users table
db.exec(`
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

console.log('✓ Database file: sheba-learning.db');
console.log('✓ Table "users" created with columns:');
console.log('  - id (primary key, auto-increment)');
console.log('  - username (unique identifier)');
console.log('  - name (user\'s full name)');
console.log('  - password_hash (hashed password)');
console.log('  - created_at (timestamp)');

// Verify the table was created
const tableInfo = db.prepare('PRAGMA table_info(users)').all();
console.log('\n✓ Table structure verified:');
console.table(tableInfo);

// Optional: Insert a test user (remove in production)
const bcrypt = require('bcrypt');  // You'll need to install: npm install bcrypt
const testPassword = 'test123';
const hashedPassword = bcrypt.hashSync(testPassword, 10);

const insertUser = db.prepare(`
    INSERT INTO users (username, name, password_hash) 
    VALUES (?, ?, ?)
`);

insertUser.run('admin', 'System Administrator', hashedPassword);
console.log('\n✓ Test user created:');
console.log('  Username: admin');
console.log('  Name: System Administrator');
console.log('  Password: test123 (hashed)');

// Query to show all users (verification)
const users = db.prepare('SELECT * FROM users').all();
console.log('\n✓ Current users in database:');
console.table(users);

db.close();
console.log('\n✅ Database setup complete!');