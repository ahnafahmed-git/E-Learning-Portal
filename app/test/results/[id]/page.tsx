'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';

interface TestResult {
  id: number;
  test_id: number; 
  user_id: number;
  user_name: string;
  username: string;
  test_title: string;
  test_description: string;
  score: number;
  total_marks: number;
  correct_answers: number;
  total_questions: number;
  percentage: number;
  passed: boolean;
  time_taken: number;
  completed_at: string;
  answers: any[];
}

export default function TestResultsPage() {
  const params = useParams();
  const router = useRouter();
  const resultId = params.id;

  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    fetchResult();
  }, [resultId]);

  const fetchResult = async () => {
    try {
      const response = await fetch(`/api/tests/results/${resultId}`);
      const data = await response.json();

      if (response.ok) {
        setResult(data.result);
        if (data.result.passed) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
        }
      } else {
        alert('Failed to load results');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching result:', error);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

const downloadCertificate = async () => {
  if (!result || !result.passed) {
    alert('Certificate is only available for passed tests.');
    return;
  }
  
  try {
    console.log('📄 Generating certificate...');
    
    // Dynamically import libraries (Next.js best practice)
    const jsPDF = (await import('jspdf')).default;
    const html2canvas = (await import('html2canvas')).default;
    
    const response = await fetch(`/api/tests/certificate/${resultId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch certificate template');
    }
    
    const html = await response.text();
    
    // Create temporary container
    const container = document.createElement('div');
    container.innerHTML = html;
    container.style.position = 'fixed';
    container.style.left = '0';
    container.style.top = '0';
    container.style.width = '297mm'; // A4 landscape width
    container.style.height = '210mm'; // A4 landscape height
    container.style.zIndex = '-1000';
    document.body.appendChild(container);
    
    // Wait for fonts and images to load
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('📸 Capturing certificate as image...');
    
    // Convert HTML to canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      width: 1122, // A4 landscape in pixels at 96 DPI
      height: 794
    });
    
    // Clean up
    document.body.removeChild(container);
    
    console.log('📋 Creating PDF...');
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);
    
    // Download
    const fileName = `Certificate_${result.user_name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
    
    console.log('✅ Certificate downloaded:', fileName);
    alert('Certificate downloaded successfully!');
    
  } catch (error) {
    console.error('❌ Certificate error:', error);
    alert('Failed to generate certificate. Error: ' + (error as Error).message);
  }
};

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Results not found</h2>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-6"
          >
            <div className="text-center mb-6">
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${
                result.passed ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {result.passed ? (
                  <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {result.passed ? 'Congratulations! 🎉' : 'Test Completed'}
              </h1>
              <p className="text-xl text-gray-600 mb-4">{result.test_title}</p>
              
              <div className={`inline-block px-6 py-3 rounded-full text-lg font-bold ${
                result.passed 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {result.passed ? 'PASSED' : 'NOT PASSED'}
              </div>
            </div>

            {/* Score Display */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{result.percentage}%</div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">{result.score}/{result.total_marks}</div>
                <div className="text-sm text-gray-600">Marks</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">{result.correct_answers}/{result.total_questions}</div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-3xl font-bold text-orange-600">{formatTime(result.time_taken)}</div>
                <div className="text-sm text-gray-600">Time Taken</div>
              </div>
            </div>

            {/* Test Info */}
            <div className="border-t pt-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Student:</span>
                <span className="font-semibold">{result.user_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completed:</span>
                <span className="font-semibold">{new Date(result.completed_at).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Passing Score:</span>
                <span className="font-semibold">70%</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mt-8">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold transition"
              >
                Back to Dashboard
              </button>
              
              {result.passed && (
                <button
                  onClick={downloadCertificate}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                >
                  📄 Download Certificate
                </button>
              )}
              
              <button
                onClick={() => router.push(`/test/${result.test_id}`)}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                🔄 Retake Test
              </button>
            </div>
          </motion.div>

          {/* Detailed Answers */}
          {result.answers && result.answers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Answer Review</h2>
                <button
                  onClick={() => setShowAnswers(!showAnswers)}
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                  {showAnswers ? 'Hide Answers' : 'Show Answers'}
                </button>
              </div>

              {showAnswers && (
                <div className="space-y-6">
                  {result.answers.map((answer, index) => (
                    <div
                      key={index}
                      className={`border-2 rounded-lg p-4 ${
                        answer.is_correct ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-800 flex-1">
                          Q{index + 1}. {answer.question_text}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                          answer.is_correct ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                        }`}>
                          {answer.is_correct ? '✓ Correct' : '✗ Wrong'}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mt-4">
                        <div className="flex items-center">
                          <span className="font-medium text-gray-600 mr-2">Your Answer:</span>
                          <span className={`px-3 py-1 rounded ${
                            answer.is_correct ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                          }`}>
                            {answer.user_answer}
                          </span>
                        </div>
                        
                        {!answer.is_correct && (
                          <div className="flex items-center">
                            <span className="font-medium text-gray-600 mr-2">Correct Answer:</span>
                            <span className="px-3 py-1 rounded bg-green-200 text-green-800">
                              {answer.correct_answer}
                            </span>
                          </div>
                        )}
                        
                        {answer.explanation && (
                          <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                            <p className="text-sm text-gray-700">
                              <strong>Explanation:</strong> {answer.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}