// /app/page.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to Sheba E-Learning Portal
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Your gateway to knowledge and skill development
          </p>
          <div className="space-x-4">
            <Link
              href="/login"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition border border-blue-600"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}