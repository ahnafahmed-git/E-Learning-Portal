'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  username: string;
  name: string;
  role: string;
  created_at: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'slides' | 'tests'>('tests');
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      
      if (response.ok) {
        setUser(data.user);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-blue-600">Sheba E-Learning</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, <strong>{user.name}</strong></span>
              {user.role === 'admin' && (
                <button
                  onClick={() => router.push('/admin')}
                  className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded text-sm transition"
                >
                  Admin Panel
                </button>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <nav className="flex space-x-8 px-4">
            <button
              onClick={() => setActiveTab('tests')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tests'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Tests & History
            </button>
            <button
              onClick={() => setActiveTab('slides')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'slides'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Lecture Slides
            </button>
            <button
              onClick={() => setActiveTab('info')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'info'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Company Information
            </button>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {activeTab === 'info' && <CompanyInfoTab />}
          {activeTab === 'slides' && <LectureSlidesTab />}
          {activeTab === 'tests' && <TestsHistoryTab userId={user.id} />}
        </div>
      </main>
    </div>
  );
}

function CompanyInfoTab() {
  const sisterConcerns = [
    {
      id: 1,
      name: 'Sheba XYZ',
      description: 'Leading healthcare service provider in Bangladesh, offering telemedicine, doctor consultations, and health packages.',
      email: 'info@shebaxyz.com.bd',
      icon: '🏥'
    },
    {
      id: 2,
      name: 'Sheba Business',
      description: 'B2B platform connecting businesses with essential services, logistics, and supply chain solutions.',
      email: 'business@sheba.xyz',
      icon: '💼'
    },
    {
      id: 3,
      name: 'Sheba Manager',
      description: 'Management platform for service providers, enabling efficient operations and customer engagement.',
      email: 'manager@sheba.xyz',
      icon: '📊'
    },
    {
      id: 4,
      name: 'Sheba Pay',
      description: 'Payment Service Provider offering secure digital payment solutions, wallet services, and financial transactions.',
      email: 'support@shebapay.com.bd',
      icon: '💳'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Sheba Platform Sister Concerns</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sisterConcerns.map((company) => (
          <div key={company.id} className="border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-blue-300 transition">
            <div className="flex items-start mb-4">
              <div className="text-4xl mr-4">{company.icon}</div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-blue-700 mb-2">{company.name}</h3>
                <p className="text-gray-600 leading-relaxed">{company.description}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <strong className="font-medium">{company.email}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
        <p className="text-blue-800 flex items-start">
          <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            <strong>Note:</strong> All sister concerns are part of the Sheba Platform ecosystem, working together to provide comprehensive digital services across Bangladesh.
          </span>
        </p>
      </div>
    </div>
  );
}

function LectureSlidesTab() {
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUserAndSlides();
  }, []);

  const fetchUserAndSlides = async () => {
    try {
      const [userRes, slidesRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/slides')
      ]);

      const userData = await userRes.json();
      const slidesData = await slidesRes.json();

      if (userRes.ok) {
        setUser(userData.user);
      }

      if (slidesRes.ok) {
        setSlides(slidesData.slides);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

const handleViewSlide = (slide: any) => {
  if (!slide.has_material) {
    alert('Material is currently under development. Please check back later.');
    return;
  }

  // Check if file exists first by trying to open it
  const fullPath = slide.file_path;
  console.log('Attempting to open:', fullPath);
  
  // Open PDF in new tab
  const newWindow = window.open(fullPath, '_blank');
  
  if (!newWindow) {
    alert('Please allow pop-ups to view the material. Then try again.');
  }
};

const handleDownloadSlide = (slide: any) => {
  if (!slide.has_material) {
    alert('Material is currently under development. Please check back later.');
    return;
  }

  console.log('Attempting to download:', slide.file_path);
  
  // Method 1: Try direct download
  fetch(slide.file_path)
    .then(response => {
      if (!response.ok) {
        throw new Error('File not found');
      }
      return response.blob();
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = slide.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    })
    .catch(error => {
      console.error('Download error:', error);
      alert(`Failed to download file. Please check:\n1. File exists in public/materials/\n2. File name: ${slide.file_name}\n\nError: ${error.message}`);
    });
};

const handleAddMaterial = () => {
  // For now, just show an alert - proper implementation later
  alert('Upload functionality coming soon!\n\nFor now, please add PDF files manually to:\npublic/materials/\n\nThen ask admin to add database entry.');
};

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Training Lecture Slides</h2>
        {user?.role === 'admin' && (
          <button 
            onClick={handleAddMaterial}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
          >
            ➕ Add New Material
          </button>
        )}
      </div>

      {slides.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <p className="mt-4 text-gray-500">No lecture slides available yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {slides.map((slide) => (
            <div key={slide.id} className="flex items-center justify-between p-5 border-2 border-gray-200 rounded-lg hover:shadow-md hover:border-blue-300 transition">
              <div className="flex items-center flex-1">
                <div className="flex-shrink-0 p-4 bg-blue-100 rounded-lg mr-5">
                  <span className="text-3xl">{slide.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <h4 className="font-semibold text-gray-900 text-lg">{slide.title}</h4>
                    <span className="ml-3 px-2 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded">
                      {slide.category}
                    </span>
                    {!slide.has_material && (
                      <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                        Under Development
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{slide.description}</p>
                  <div className="flex items-center text-xs text-gray-500 space-x-4">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(slide.uploaded_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      PDF
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                      </svg>
                      {slide.file_size}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3 ml-4">
                <button 
                  onClick={() => handleViewSlide(slide)}
                  disabled={!slide.has_material}
                  className={`px-4 py-2 rounded-lg transition text-sm font-semibold flex items-center ${
                    slide.has_material
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View
                </button>
                <button 
                  onClick={() => handleDownloadSlide(slide)}
                  disabled={!slide.has_material}
                  className={`px-4 py-2 rounded-lg transition text-sm font-semibold flex items-center ${
                    slide.has_material
                      ? 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                      : 'border-2 border-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
        <p className="text-yellow-800 flex items-start">
          <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>
            <strong>Reminder:</strong> Please review all lecture materials before attempting the certification test. These materials contain essential information for the assessment.
          </span>
        </p>
      </div>
    </div>
  );
}

function TestsHistoryTab({ userId }: { userId: number }) {
    const router = useRouter();
    const [availableTests, setAvailableTests] = useState<any[]>([]);
    const [testResults, setTestResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchData();
    }, [userId]);
    const fetchData = async () => {
      try {
            const [testsRes, resultsRes] = await Promise.all([
               fetch('/api/tests/available'),
               fetch('/api/tests/user-results') 
]);
  const testsData = await testsRes.json();
  const resultsData = await resultsRes.json();

  if (testsRes.ok) {
    setAvailableTests(testsData.tests);
  }

  if (resultsRes.ok) {
    const userResults = resultsData.results.filter((r: any) => r.user_id === userId);
    setTestResults(resultsData.results);;
  }
} catch (error) {
  console.error('Failed to fetch data:', error);
} finally {
  setLoading(false);
}
};
const startTest = (testId: number) => {
  if (window.confirm('Ready to start the test? You will have 30 minutes. Make sure you have reviewed all lecture materials.')) {
    router.push(`/test/${testId}`);
  }
};
if (loading) {
return (
<div className="bg-white rounded-lg shadow p-6">
<div className="flex justify-center items-center h-40">
<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
</div>
</div>
);
}
return (
<div className="space-y-6">
{/* Available Tests */}
<div className="bg-white rounded-lg shadow p-6">
<div className="flex justify-between items-center mb-6">
<h2 className="text-2xl font-bold text-gray-800">Available Tests</h2>
<div className="text-sm text-gray-500">
User ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{userId}</span>
</div>
</div>
    {availableTests.length === 0 ? (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="mt-4 text-gray-500">No tests available at the moment.</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableTests.map((test) => {
          const userTestResults = testResults.filter(r => r.test_id === test.id);
          const lastAttempt = userTestResults.length > 0 ? userTestResults[0] : null;
          const attemptCount = userTestResults.length;
          
          return (
            <div key={test.id} className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg text-gray-900">{test.title}</h3>
                {lastAttempt && lastAttempt.passed && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">✓ PASSED</span>
                )}
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span><strong>25</strong> Questions (from pool of {test.question_count || 40})</span>
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Total: <strong>50</strong> marks (2 marks each)</span>
              </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Duration: <strong>{test.time_limit || 30}</strong> minutes</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Passing: <strong>{test.passing_score || 70}%</strong></span>
                </div>
              </div>

              {lastAttempt && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">Last Attempt:</div>
                  <div className="flex justify-between items-center">
                    <span className={`text-lg font-bold ${lastAttempt.passed ? 'text-green-600' : 'text-red-600'}`}>
                      {lastAttempt.percentage}%
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(lastAttempt.completed_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Attempts: {attemptCount}
                  </div>
                </div>
              )}
              
              <button
                onClick={() => startTest(test.id)}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  lastAttempt && lastAttempt.passed
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                }`}
              >
                {lastAttempt && lastAttempt.passed ? '🔄 Retake Test' : '▶️ Start Test'}
              </button>
            </div>
          );
        })}
      </div>
    )}
  </div>

  {/* Performance History */}
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Performance History</h2>
    
    {testResults.length === 0 ? (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        <p className="mt-4 text-gray-500">No test history found. Start your first test!</p>
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Test</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {testResults.map((result) => (
              <tr key={result.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {result.test_title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(result.completed_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      result.percentage >= 70 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {result.percentage}%
                    </span>
                    <span className="ml-2 text-xs text-gray-500">
                      ({result.score}/{result.total_marks})
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {Math.floor(result.time_taken / 60)}m {result.time_taken % 60}s
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    result.passed 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {result.passed ? '✓ Passed' : '✗ Failed'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => window.location.href = `/test/results/${result.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Details →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
</div>
);
}
