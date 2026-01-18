'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';

interface Question {
  id: number;
  test_id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  points: number;
}

interface TestDetails {
  id: number;
  title: string;
  description: string;
  time_limit: number;
  passing_score: number;
}

export default function TestPage() {
  const params = useParams();
  const router = useRouter();
  const testId = parseInt(params.id as string);
  
  const [test, setTest] = useState<TestDetails | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [testStarted, setTestStarted] = useState(false);
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, boolean>>({});
  
  const timerRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    fetchTestDetails();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testId]);

  const fetchTestDetails = async () => {
    try {
      console.log('📋 Fetching test details for test ID:', testId);
      
      // Check if test is already completed
      const checkResponse = await fetch(`/api/tests/${testId}/check`);
      const checkData = await checkResponse.json();
      
      if (checkResponse.ok && checkData.completed) {
        console.log('✅ Test already completed, redirecting to results');
        router.push(`/test/results/${checkData.result_id}`);
        return;
      }

      // Fetch test details
      const testResponse = await fetch(`/api/tests/${testId}`);
      const testData = await testResponse.json();
      
      if (testResponse.ok) {
        console.log('✅ Test details loaded:', testData.test);
        setTest(testData.test);
      } else {
        console.error('❌ Failed to load test details');
        alert('Failed to load test details');
      }
    } catch (error) {
      console.error('❌ Error fetching test:', error);
      alert('Error loading test. Please try again.');
    } finally {
      setLoading(false); // CRITICAL FIX: Set loading to false
      console.log('✅ Test page ready');
    }
  };

  const startTest = async () => {
    console.log('🔄 Starting test...');
    setLoading(true);
    setShowInstructions(false);
    
    try {
      console.log(`📤 Calling API: /api/tests/${testId}/start`);
      const response = await fetch(`/api/tests/${testId}/start`, {
        method: 'POST',
      });
      
      console.log('📥 API Response status:', response.status);
      
      const data = await response.json();
      console.log('📦 API Response data:', data);
      
      if (response.ok) {
        console.log('✅ API Success, got questions:', data.questions?.length);
        // Shuffle questions to randomize order
        const shuffled = [...data.questions].sort(() => Math.random() - 0.5);
        setQuestions(shuffled);
        setTestStarted(true);
        startTimeRef.current = Date.now();
        
        // Start timer
        timerRef.current = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              handleSubmitTest();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        console.error('❌ API Error:', data.error);
        alert('Failed to load test: ' + (data.error || 'Unknown error'));
        setShowInstructions(true);
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      alert('Network error. Please check your connection.');
      setShowInstructions(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId: number, option: string) => {
    const newAnswers = { ...answers, [questionId]: option };
    setAnswers(newAnswers);
    setSelectedAnswers(prev => ({ ...prev, [questionId]: true }));
  };

  const handleSubmitTest = async () => {
    if (testSubmitted) return;
    
    setTestSubmitted(true);
    if (timerRef.current) clearInterval(timerRef.current);
    
    const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);
    
    try {
      const response = await fetch('/api/tests/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          test_id: testId,
          answers: answers,
          time_taken: timeTaken
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        if (data.passed) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
        }
        
        // Delay redirect to show confetti
        setTimeout(() => {
          router.push(`/test/results/${data.result_id}`);
        }, 2000);
      }
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const retakeTest = () => {
    if (window.confirm('Start a new attempt with different questions?')) {
      setTestStarted(false);
      setTestSubmitted(false);
      setAnswers({});
      setCurrentQuestion(0);
      setTimeLeft(30 * 60);
      setQuestions([]);
      setSelectedAnswers({});
      setShowInstructions(true);
      startTest();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (showInstructions && !testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{test?.title || 'Compliance Test'}</h1>
            <p className="text-gray-600 mb-6">{test?.description}</p>
          </div>

          <div className="space-y-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Test Structure</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• 25 Multiple Choice Questions</li>
                  <li>• 2 marks per question (Total: 50 marks)</li>
                  <li>• Time limit: 30 minutes</li>
                  <li>• Passing score: 35/50 (70%)</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Instructions</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Read each question carefully</li>
                  <li>• Select only one answer per question</li>
                  <li>• You can navigate between questions</li>
                  <li>• Timer will be shown at the top</li>
                  <li>• Test auto-submits when time ends</li>
                  <li>• Questions are randomly generated each attempt</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold">!</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Important Notes</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Do not refresh the page during the test</li>
                  <li>• Ensure stable internet connection</li>
                  <li>• Results are saved immediately after submission</li>
                  <li>• You can retake the test with different questions</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={startTest}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading Questions...' : 'Start Test Now'}
            </button>
            <p className="text-sm text-gray-500 mt-4">
              You have unlimited attempts. Each attempt has different questions.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-200 rounded-full"></div>
          <div className="w-20 h-20 border-4 border-blue-600 rounded-full animate-spin absolute top-0 border-t-transparent"></div>
        </div>
        <p className="mt-6 text-lg font-medium text-gray-700">Preparing your test...</p>
        <p className="text-gray-500">Questions are being randomized</p>
      </div>
    );
  }

  if (questions.length === 0 && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Test Not Available</h2>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (testSubmitted) {
    return (
      <>
        {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Test Submitted Successfully!</h2>
            <p className="text-gray-600 mb-6">Your answers have been recorded. Processing results...</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Dashboard
              </button>
              <button
                onClick={retakeTest}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retake Test
              </button>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  const currentQ = questions[currentQuestion];
  const answeredCount = Object.keys(answers).length;
  const progress = ((answeredCount) / questions.length) * 100;
  const timePercentage = (timeLeft / (30 * 60)) * 100;

  return (
    <>
      {showConfetti && <Confetti />}
      
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold">Q</span>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Question</div>
                  <div className="font-bold">
                    {currentQuestion + 1} <span className="text-gray-400">/ {questions.length}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-bold">A</span>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Answered</div>
                  <div className="font-bold">
                    {answeredCount} <span className="text-gray-400">/ {questions.length}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className={`text-2xl font-bold ${timeLeft < 300 ? 'text-red-600 animate-pulse' : 'text-blue-600'}`}>
                  {formatTime(timeLeft)}
                </div>
                <div className="text-xs text-gray-500">Time Remaining</div>
              </div>
              
              <button
                onClick={handleSubmitTest}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 shadow-md"
              >
                Submit Test
              </button>
            </div>
          </div>
          
          {/* Progress Bars */}
          <div className="mt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Question Progress: {Math.round(progress)}%</span>
              <span>Time Remaining: {Math.round(timePercentage)}%</span>
            </div>
            <div className="flex space-x-2">
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${timeLeft < 300 ? 'bg-red-500' : 'bg-green-500'}`}
                    style={{ width: `${timePercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-28 pb-8 min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Question Navigation Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow p-4 sticky top-24">
                <h3 className="font-bold text-gray-700 mb-4">Question Navigation</h3>
                <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-2">
                  {questions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestion(index)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                        currentQuestion === index
                          ? 'bg-blue-600 text-white scale-110 shadow-md'
                          : answers[questions[index].id]
                          ? 'bg-green-100 text-green-800 border border-green-300'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                
                <div className="mt-6 space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <span className="text-sm text-gray-600">Current Question</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-300 rounded-full"></div>
                    <span className="text-sm text-gray-600">Answered</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                    <span className="text-sm text-gray-600">Unanswered</span>
                  </div>
                </div>
                
                <button
                  onClick={handleSubmitTest}
                  className="w-full mt-6 bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-red-600 hover:to-pink-700"
                >
                  Final Submit
                </button>
              </div>
            </div>

            {/* Question Content */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-xl shadow-lg p-6 mb-6"
                >
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-lg">
                        Question {currentQuestion + 1} • {currentQ.points} marks
                      </span>
                      <div className="text-sm text-gray-500">
                        {currentQuestion + 1} of {questions.length}
                      </div>
                    </div>
                    
                    <h2 className="text-xl font-semibold text-gray-800 mb-6 leading-relaxed">
                      {currentQ.question_text}
                    </h2>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { key: 'A', option: currentQ.option_a },
                      { key: 'B', option: currentQ.option_b },
                      { key: 'C', option: currentQ.option_c },
                      { key: 'D', option: currentQ.option_d },
                    ].map(({ key, option }) => (
                      <div
                        key={key}
                        onClick={() => handleAnswer(currentQ.id, key)}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                          answers[currentQ.id] === key
                            ? 'border-blue-500 bg-blue-50 shadow-sm'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-10 h-10 flex items-center justify-center rounded-lg mr-4 ${
                            answers[currentQ.id] === key
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            <span className="font-bold">{key}</span>
                          </div>
                          <div className="text-gray-700">{option}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestion === 0}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Previous</span>
                </button>
                
                {currentQuestion < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestion(prev => prev + 1)}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <span>Next Question</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitTest}
                    className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700"
                  >
                    <span>Submit All Answers</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                )}
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={retakeTest}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Want different questions? Retake Test
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
