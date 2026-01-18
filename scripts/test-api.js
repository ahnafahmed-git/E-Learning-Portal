// scripts/test-api.js
const http = require('http');

console.log('🔍 Testing API Endpoints...');
console.log('===========================');

const endpoints = [
  { method: 'GET', url: '/api/tests/1/questions', name: 'Get Questions' },
  { method: 'POST', url: '/api/tests/1/start', name: 'Start Test' },
  { method: 'GET', url: '/api/tests/available', name: 'Available Tests' }
];

endpoints.forEach(({ method, url, name }) => {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: url,
    method: method
  };

  console.log(`\n${method} ${url} (${name})`);
  
  const req = http.request(options, (res) => {
    console.log(`  Status: ${res.statusCode}`);
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        console.log(`  Response:`, 
          json.questions ? `${json.questions.length} questions` : 
          json.tests ? `${json.tests.length} tests` : 
          'Success');
      } catch {
        console.log('  Response:', data.substring(0, 100));
      }
    });
  });

  req.on('error', (error) => {
    console.log(`  ❌ Error: ${error.message}`);
  });

  req.end();
});