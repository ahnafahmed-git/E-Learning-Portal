const Database = require('better-sqlite3');
const db = new Database('sheba-learning.db');

// Create test
const test = db.prepare(\
  INSERT INTO tests (title, description, time_limit, passing_score, is_active)
  VALUES (?, ?, ?, ?, ?)
\).run(
  'AML/CFT Certification Test',
  'Mandatory compliance test for all Sheba Pay employees. 25 questions, 50 total marks.',
  30,
  70,
  1
);

const testId = test.lastInsertRowid;

// Selected 25 key questions
const questions = [
  {
    q: 'What is money laundering?',
    a: 'Legally investing money in businesses',
    b: 'Hiding origins of illegally obtained money',
    c: 'Converting money to foreign currency',
    d: 'Depositing cash in multiple accounts',
    correct: 'B',
    exp: 'ML is hiding illicit money origins through complex transactions'
  },
  {
    q: 'How many steps in money laundering?',
    a: '2', b: '3', c: '4', d: '5',
    correct: 'B',
    exp: 'Three steps: Placement, Layering, Integration'
  },
  {
    q: 'What is the first ML step called?',
    a: 'Integration', b: 'Layering', c: 'Placement', d: 'Verification',
    correct: 'C',
    exp: 'Placement introduces illegal money into financial system'
  },
  {
    q: 'What happens during layering?',
    a: 'Money collected from accounts',
    b: 'Illegal money introduced',
    c: 'Money moved to confuse origin',
    d: 'Funds used for purchases',
    correct: 'C',
    exp: 'Layering involves moving money to obscure its source'
  },
  {
    q: 'What is terrorist financing?',
    a: 'Investing in terrorist groups',
    b: 'Providing finance/support to terrorists',
    c: 'Laundering for terrorists',
    d: 'All of above',
    correct: 'B',
    exp: 'TF involves providing financial support to terrorists'
  },
  {
    q: 'Who licenses PSPs in Bangladesh?',
    a: 'Ministry of Finance',
    b: 'Bangladesh Financial Intelligence Unit',
    c: 'Bangladesh Bank',
    d: 'NBR',
    correct: 'C',
    exp: 'Bangladesh Bank issues PSP licenses'
  },
  {
    q: 'Which regulation governs PSPs?',
    a: 'BFIU Circular 26',
    b: 'BPSSR 2014',
    c: 'MLPA Act 2012',
    d: 'ATA Act 2009',
    correct: 'B',
    exp: 'BPSSR 2014 regulates Payment Service Providers'
  },
  {
    q: 'When was FATF formed?',
    a: '1979', b: '1989', c: '1999', d: '2009',
    correct: 'B',
    exp: 'FATF formed in 1989 to combat ML/TF globally'
  },
  {
    q: 'Which organization oversees Asia Pacific?',
    a: 'FATF',
    b: 'World Bank',
    c: 'Asia Pacific Group on ML',
    d: 'UN',
    correct: 'C',
    exp: 'Asia Pacific Group oversees AML/CFT in region'
  },
  {
    q: 'Minimum imprisonment for ML offense?',
    a: '2-4 years', b: '4-12 years', c: '6-10 years', d: '8-15 years',
    correct: 'B',
    exp: 'ML punishable by 4-12 years imprisonment'
  },
  {
    q: 'Minimum penalty for ML offense?',
    a: '5 lacs', b: '10 lacs', c: '25 lacs', d: '50 lacs',
    correct: 'B',
    exp: 'Minimum penalty: 10 lacs taka'
  },
  {
    q: 'What is NOT a risk of ML/TF for Sheba Pay?',
    a: 'Regulatory risk',
    b: 'Reputational damage',
    c: 'Increased customer trust',
    d: 'Operational risk',
    correct: 'C',
    exp: 'ML/TF damages trust, doesn\\'t increase it'
  },
  {
    q: 'What can damage Sheba Pay\\'s brand?',
    a: 'Technical glitches',
    b: 'Association with ML/TF',
    c: 'High fees',
    d: 'Slow service',
    correct: 'B',
    exp: 'ML/TF association damages brand trust severely'
  },
  {
    q: 'What process verifies customer identity?',
    a: 'STR', b: 'KYC', c: 'EDD', d: 'CDD',
    correct: 'B',
    exp: 'KYC (Know Your Customer) verifies identity'
  },
  {
    q: 'Where should STR be submitted?',
    a: 'Bangladesh Bank',
    b: 'BFIU',
    c: 'Ministry of Finance',
    d: 'Police',
    correct: 'B',
    exp: 'STR submitted to Bangladesh Financial Intelligence Unit'
  },
  {
    q: 'How many BFIU Circular 26 clauses?',
    a: '10', b: '13', c: '15', d: '20',
    correct: 'B',
    exp: 'BFIU Circular 26 has 13 clauses'
  },
  {
    q: 'Which approach for transaction monitoring?',
    a: 'Rule-based',
    b: 'Risk-based',
    c: 'Manual',
    d: 'Automated',
    correct: 'B',
    exp: 'Risk-based approach for monitoring'
  },
  {
    q: 'Minimum imprisonment for TF?',
    a: '2-10 years',
    b: '4-20 years',
    c: '5-15 years',
    d: '10-25 years',
    correct: 'B',
    exp: 'TF punishable by 4-20 years'
  },
  {
    q: 'What is Sheba Pay\\'s moral responsibility?',
    a: 'Maximize profits',
    b: 'Prevent crime, protect customers',
    c: 'Reduce costs',
    d: 'Expand market',
    correct: 'B',
    exp: 'Sheba Pay must prevent crime and protect customers'
  },
  {
    q: 'What should employees do when confused?',
    a: 'Make assumptions',
    b: 'Consult compliance',
    c: 'Skip process',
    d: 'Ask customer to return',
    correct: 'B',
    exp: 'Always consult compliance when unsure'
  },
  {
    q: 'What does PSP stand for?',
    a: 'Payment Security Provider',
    b: 'Payment Service Provider',
    c: 'Processing Service Provider',
    d: 'Payment Systems Partner',
    correct: 'B',
    exp: 'PSP = Payment Service Provider'
  },
  {
    q: 'What account must PSP maintain?',
    a: 'Current Account',
    b: 'Savings Account',
    c: 'Trust Cum Settlement Account',
    d: 'Escrow Account',
    correct: 'C',
    exp: 'PSP must maintain Trust Cum Settlement Account'
  },
  {
    q: 'When was MLPA first enacted?',
    a: '2002', b: '2009', c: '2012', d: '2015',
    correct: 'A',
    exp: 'MLPA first enacted 2002, amended 2012, 2015'
  },
  {
    q: 'Which act prevents terrorism?',
    a: 'MLPA Act 2012',
    b: 'ATA Act 2009',
    c: 'BFIU Circular 26',
    d: 'BPSSR 2014',
    correct: 'B',
    exp: 'ATA Act 2009 prevents terrorism'
  },
  {
    q: 'Who chairs National Working Committee?',
    a: 'Governor, BB',
    b: 'Prime Minister',
    c: 'Finance Minister',
    d: 'Home Minister',
    correct: 'C',
    exp: 'Finance Minister chairs NWC'
  }
];

const insert = db.prepare(\
  INSERT INTO questions (test_id, question_text, option_a, option_b, option_c, option_d, correct_option, points, explanation)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
\);

questions.forEach((q, i) => {
  insert.run(
    testId,
    q.q,
    q.a, q.b, q.c, q.d,
    q.correct,
    2,
    q.exp
  );
});

console.log(\✅ Created AML/CFT Test (ID: \) with \ questions\);
console.log(\   Total marks: \\);
db.close();
