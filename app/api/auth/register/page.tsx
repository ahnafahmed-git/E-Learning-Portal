import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-600 mt-2">Join Sheba E-Learning</p>
          </div>
          
          <RegisterForm />
          
          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a 
              href="/login" 
              className="font-semibold text-blue-600 hover:text-blue-500"
            >
              Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}