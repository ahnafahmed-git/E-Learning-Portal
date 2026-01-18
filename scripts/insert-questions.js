// scripts/insert-40-questions.js
const Database = require('better-sqlite3');
const db = new Database('sheba-learning.db');

console.log('📝 Inserting 40 AML/CFT questions...');

// First, delete existing questions for test 1 (if needed)
db.prepare('DELETE FROM questions WHERE test_id = 1').run();
console.log('✅ Cleared existing questions');

// Insert all 40 questions
const questions = [
  {
    question_text: "What is money laundering?",
    option_a: "Legally investing money in businesses",
    option_b: "Hiding origins of illegally obtained money through complex transactions",
    option_c: "Converting money to foreign currency",
    option_d: "Depositing cash in multiple bank accounts",
    correct_option: "B",
    explanation: "Money laundering is the process of hiding the origins of money obtained from illegitimate sources and changing its identity through complex transactions."
  },
  {
    question_text: "How many steps are in the money laundering cycle?",
    option_a: "2",
    option_b: "3",
    option_c: "4",
    option_d: "5",
    correct_option: "B",
    explanation: "Money laundering usually involves three steps: Placement, Layering, and Integration."
  },
  {
    question_text: "Which is NOT a step in money laundering?",
    option_a: "Placement",
    option_b: "Layering",
    option_c: "Integration",
    option_d: "Verification",
    correct_option: "D",
    explanation: "Money laundering has three steps: Placement, Layering, and Integration. Verification is not part of the process."
  },
  {
    question_text: "What is the first step of money laundering called?",
    option_a: "Integration",
    option_b: "Layering",
    option_c: "Placement",
    option_d: "Collection",
    correct_option: "C",
    explanation: "Placement is the first step where illegal money is introduced into the financial system."
  },
  {
    question_text: "During which stage does the money launderer introduce illegal money into the financial system?",
    option_a: "Integration",
    option_b: "Layering",
    option_c: "Placement",
    option_d: "Verification",
    correct_option: "C",
    explanation: "Placement involves introducing illegal money into the financial system."
  },
  {
    question_text: "What happens during the layering stage?",
    option_a: "Money is collected from various accounts",
    option_b: "Illegal money is introduced into financial system",
    option_c: "Money is moved around to confuse its origin",
    option_d: "Funds are used to purchase luxury items",
    correct_option: "C",
    explanation: "Layering involves moving money around to obscure its origin."
  },
  {
    question_text: "What is the final goal of money laundering?",
    option_a: "To hide money from tax authorities",
    option_b: "To make illegal money appear legitimate",
    option_c: "To invest in offshore accounts",
    option_d: "To avoid bank fees",
    correct_option: "B",
    explanation: "The ultimate goal is to make illegally obtained money appear legitimate."
  },
  {
    question_text: "Who was historically associated with coining the term 'money laundering'?",
    option_a: "John Dillinger",
    option_b: "Al Capone",
    option_c: "Pablo Escobar",
    option_d: "Bonnie and Clyde",
    correct_option: "B",
    explanation: "Al Capone claimed his illegal earnings as profits from a laundry business."
  },
  {
    question_text: "Which business did Al Capone claim as his legitimate income source?",
    option_a: "Restaurant business",
    option_b: "Laundry business",
    option_c: "Car dealership",
    option_d: "Construction company",
    correct_option: "B",
    explanation: "Al Capone claimed his earnings came from a laundry business."
  },
  {
    question_text: "When was money laundering officially declared a crime in the USA?",
    option_a: "1920",
    option_b: "1930",
    option_c: "1940",
    option_d: "1950",
    correct_option: "B",
    explanation: "Money laundering was declared a crime in the USA in 1930."
  },
  {
    question_text: "What is terrorist financing?",
    option_a: "Investing in terrorist organizations",
    option_b: "Providing finance/support to terrorists or non-state actors",
    option_c: "Laundering money for terrorist groups",
    option_d: "All of the above",
    correct_option: "B",
    explanation: "Terrorist financing involves providing financial support to terrorists."
  },
  {
    question_text: "How can terrorist financing funds be obtained?",
    option_a: "Only from illegal sources",
    option_b: "Only from legal sources",
    option_c: "From both legal and illegal sources",
    option_d: "Only from foreign donations",
    correct_option: "C",
    explanation: "Terrorist financing can use both legal and illegal funds."
  },
  {
    question_text: "What type of assistance does terrorist financing include?",
    option_a: "Only financial",
    option_b: "Only mental",
    option_c: "Financial, mental, or other assistance",
    option_d: "Only logistical",
    correct_option: "C",
    explanation: "TF includes financial, mental, or any other type of assistance."
  },
  {
    question_text: "What is a key difference between money laundering and terrorist financing?",
    option_a: "ML uses legal money, TF uses illegal money",
    option_b: "ML hides source, TF can use legitimate funds",
    option_c: "TF is always international, ML is domestic",
    option_d: "There is no difference",
    correct_option: "B",
    explanation: "ML hides illegal money, TF can use legitimate funds for illegal purposes."
  },
  {
    question_text: "Which objective is common to both ML and TF?",
    option_a: "Both aim to overthrow governments",
    option_b: "Both exploit financial system vulnerabilities",
    option_c: "Both require international cooperation",
    option_d: "Both use only cash transactions",
    correct_option: "B",
    explanation: "Both ML and TF exploit vulnerabilities in the financial system."
  },
  {
    question_text: "What does PSP stand for?",
    option_a: "Payment Security Provider",
    option_b: "Payment Service Provider",
    option_c: "Processing Service Provider",
    option_d: "Payment Systems Partner",
    correct_option: "B",
    explanation: "PSP stands for Payment Service Provider."
  },
  {
    question_text: "Who licenses PSPs in Bangladesh?",
    option_a: "Ministry of Finance",
    option_b: "Bangladesh Financial Intelligence Unit",
    option_c: "Bangladesh Bank",
    option_d: "National Board of Revenue",
    correct_option: "C",
    explanation: "Bangladesh Bank issues PSP licenses."
  },
  {
    question_text: "Which regulation governs PSPs in Bangladesh?",
    option_a: "BFIU Circular 26",
    option_b: "BPSSR 2014",
    option_c: "MLPA Act 2012",
    option_d: "ATA Act 2009",
    correct_option: "B",
    explanation: "BPSSR 2014 (Bangladesh Payment and Settlement System Regulations) governs PSPs."
  },
  {
    question_text: "What type of account must a PSP maintain?",
    option_a: "Current Account",
    option_b: "Savings Account",
    option_c: "Trust Cum Settlement Account",
    option_d: "Escrow Account",
    correct_option: "C",
    explanation: "PSPs must maintain a Trust Cum Settlement Account."
  },
  {
    question_text: "When was FATF formed?",
    option_a: "1979",
    option_b: "1989",
    option_c: "1999",
    option_d: "2009",
    correct_option: "B",
    explanation: "FATF (Financial Action Task Force) was formed in 1989."
  },
  {
    question_text: "How many countries are committed to FATF recommendations?",
    option_a: "50+",
    option_b: "100+",
    option_c: "150+",
    option_d: "200+",
    correct_option: "D",
    explanation: "Over 200 countries are committed to FATF recommendations."
  },
  {
    question_text: "Which organization oversees AML/CFT in Asia Pacific region?",
    option_a: "FATF",
    option_b: "World Bank",
    option_c: "Asia Pacific Group on Money Laundering",
    option_d: "United Nations",
    correct_option: "C",
    explanation: "Asia Pacific Group on Money Laundering oversees the region."
  },
  {
    question_text: "When was Money Laundering Prevention Act first enacted in Bangladesh?",
    option_a: "2002",
    option_b: "2009",
    option_c: "2012",
    option_d: "2015",
    correct_option: "A",
    explanation: "MLPA was first enacted in 2002, amended in 2012 and 2015."
  },
  {
    question_text: "Which act prevents terrorism in Bangladesh?",
    option_a: "MLPA Act 2012",
    option_b: "ATA Act 2009",
    option_c: "BFIU Circular 26",
    option_d: "BPSSR 2014",
    correct_option: "B",
    explanation: "ATA Act 2009 (Anti-Terrorism Act) prevents terrorism."
  },
  {
    question_text: "Who chairs the National Working Committee for AML/CFT?",
    option_a: "Governor, Bangladesh Bank",
    option_b: "Prime Minister",
    option_c: "Finance Minister",
    option_d: "Home Minister",
    correct_option: "C",
    explanation: "The Finance Minister chairs the National Working Committee."
  },
  {
    question_text: "How many clauses does BFIU Circular 26 have?",
    option_a: "10",
    option_b: "13",
    option_c: "15",
    option_d: "20",
    correct_option: "B",
    explanation: "BFIU Circular 26 has 13 clauses."
  },
  {
    question_text: "What does CAMLCO stand for?",
    option_a: "Chief Anti-Money Laundering Compliance Officer",
    option_b: "Compliance and Money Laundering Control Officer",
    option_c: "Central AML Compliance Officer",
    option_d: "Chief AML Control Officer",
    correct_option: "A",
    explanation: "CAMLCO stands for Chief Anti-Money Laundering Compliance Officer."
  },
  {
    question_text: "Which approach should transaction monitoring follow?",
    option_a: "Rule-based approach",
    option_b: "Risk-based approach",
    option_c: "Manual approach",
    option_d: "Automated approach",
    correct_option: "B",
    explanation: "Transaction monitoring should follow a risk-based approach."
  },
  {
    question_text: "Where should STR be submitted?",
    option_a: "Bangladesh Bank",
    option_b: "BFIU",
    option_c: "Ministry of Finance",
    option_d: "Police Headquarters",
    correct_option: "B",
    explanation: "STR (Suspicious Transaction Report) should be submitted to BFIU."
  },
  {
    question_text: "What is the minimum penalty for money laundering offense?",
    option_a: "5 lacs",
    option_b: "10 lacs",
    option_c: "25 lacs",
    option_d: "50 lacs",
    correct_option: "B",
    explanation: "Minimum penalty for ML is 10 lacs taka."
  },
  {
    question_text: "What is the minimum imprisonment for money laundering offense?",
    option_a: "2-4 years",
    option_b: "4-12 years",
    option_c: "6-10 years",
    option_d: "8-15 years",
    correct_option: "B",
    explanation: "ML is punishable by 4-12 years imprisonment."
  },
  {
    question_text: "What is the minimum imprisonment for terrorist financing?",
    option_a: "2-10 years",
    option_b: "4-20 years",
    option_c: "5-15 years",
    option_d: "10-25 years",
    correct_option: "B",
    explanation: "TF is punishable by 4-20 years imprisonment."
  },
  {
    question_text: "What punishment applies for divulging information?",
    option_a: "1 year imprisonment",
    option_b: "2 years imprisonment",
    option_c: "3 years imprisonment",
    option_d: "5 years imprisonment",
    correct_option: "B",
    explanation: "Divulging information is punishable by 2 years imprisonment."
  },
  {
    question_text: "What is NOT a risk of ML/TF activities for Sheba Pay?",
    option_a: "Regulatory risk",
    option_b: "Reputational damage",
    option_c: "Increased customer trust",
    option_d: "Operational risk",
    correct_option: "C",
    explanation: "ML/TF activities damage customer trust, not increase it."
  },
  {
    question_text: "Which risk involves possible suspension of PSP license?",
    option_a: "Reputational risk",
    option_b: "Regulatory risk",
    option_c: "Operational risk",
    option_d: "Financial risk",
    correct_option: "B",
    explanation: "Regulatory risk includes license suspension."
  },
  {
    question_text: "What can damage Sheba Pay's brand trust?",
    option_a: "Technical glitches",
    option_b: "Association with ML/TF activities",
    option_c: "High transaction fees",
    option_d: "Slow customer service",
    correct_option: "B",
    explanation: "Association with ML/TF severely damages brand trust."
  },
  {
    question_text: "What might suspicious transactions lead to?",
    option_a: "Increased business",
    option_b: "Account freezes or system shutdowns",
    option_c: "Lower compliance requirements",
    option_d: "Faster transaction processing",
    correct_option: "B",
    explanation: "Suspicious transactions can lead to account freezes."
  },
  {
    question_text: "What is Sheba Pay's moral responsibility?",
    option_a: "Maximizing profits",
    option_b: "Preventing crime and protecting customers",
    option_c: "Reducing operational costs",
    option_d: "Expanding market share",
    correct_option: "B",
    explanation: "Sheba Pay has a moral duty to prevent crime and protect customers."
  },
  {
    question_text: "Which process involves verifying customer identity?",
    option_a: "STR",
    option_b: "KYC",
    option_c: "EDD",
    option_d: "CDD",
    correct_option: "B",
    explanation: "KYC (Know Your Customer) verifies customer identity."
  },
  {
    question_text: "What should employees do when confused during onboarding?",
    option_a: "Make assumptions",
    option_b: "Consult with compliance",
    option_c: "Skip the process",
    option_d: "Ask the customer to return later",
    correct_option: "B",
    explanation: "Always consult compliance when unsure."
  }
];

const insertQuestion = db.prepare(`
  INSERT INTO questions (test_id, question_text, option_a, option_b, option_c, option_d, 
                         correct_option, points, explanation, in_pool)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

questions.forEach((q, index) => {
  insertQuestion.run(
    1, // test_id
    q.question_text,
    q.option_a,
    q.option_b,
    q.option_c,
    q.option_d,
    q.correct_option,
    2, // points
    q.explanation,
    1  // in_pool = true
  );
  console.log(`Inserted question ${index + 1}: ${q.question_text.substring(0, 60)}...`);
});

console.log(`✅ Inserted ${questions.length} questions into the database`);
db.close();