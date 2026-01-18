const fs = require('fs');
const path = require('path');

console.log('🔍 Checking file structure...\n');

// Check if public folder exists
const publicPath = path.join(process.cwd(), 'public');
console.log('Public folder path:', publicPath);
console.log('Public folder exists:', fs.existsSync(publicPath));

// Check if materials folder exists
const materialsPath = path.join(publicPath, 'materials');
console.log('\nMaterials folder path:', materialsPath);
console.log('Materials folder exists:', fs.existsSync(materialsPath));

if (fs.existsSync(materialsPath)) {
  console.log('\n📁 Files in materials folder:');
  const files = fs.readdirSync(materialsPath);
  
  if (files.length === 0) {
    console.log('  ❌ No files found!');
  } else {
    files.forEach(file => {
      const filePath = path.join(materialsPath, file);
      const stats = fs.statSync(filePath);
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      console.log(`  ✅ ${file} (${sizeMB} MB)`);
    });
  }
} else {
  console.log('  ❌ Materials folder does not exist!');
  console.log('\n📝 To fix:');
  console.log('  1. Create folder: public/materials/');
  console.log('  2. Move your PDF files into it');
}

// Check database for slides
const Database = require('better-sqlite3');
const db = new Database('sheba-learning.db');

console.log('\n📊 Database lecture slides:');
const slides = db.prepare('SELECT * FROM lecture_slides').all();

slides.forEach(slide => {
  console.log(`\nSlide: ${slide.title}`);
  console.log(`  File: ${slide.file_name}`);
  console.log(`  Path: ${slide.file_path}`);
  console.log(`  Has material: ${slide.has_material ? 'Yes' : 'No'}`);
  
  // Check if file actually exists
  const expectedPath = path.join(publicPath, 'materials', slide.file_name);
  const exists = fs.existsSync(expectedPath);
  console.log(`  File exists on disk: ${exists ? '✅ Yes' : '❌ No'}`);
  
  if (!exists) {
    console.log(`  ⚠️ Expected at: ${expectedPath}`);
  }
});

db.close();

console.log('\n✅ Check complete!');