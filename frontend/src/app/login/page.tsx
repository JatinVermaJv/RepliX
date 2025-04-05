'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginContent() {
  const { user, login, loading, error } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const getErrorMessage = () => {
    const errorParam = searchParams?.get('error');
    if (errorParam) {
      switch (errorParam) {
        case 'authentication_failed':
          return 'Authentication failed. Please try again.';
        case 'no_user':
          return 'No user found. Please try again.';
        case 'login_failed':
          return 'Login failed. Please try again.';
        default:
          return 'An error occurred. Please try again.';
      }
    }
    return error;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      <div className="text-center mb-8">
        <h1 className="text-6xl font-bold text-red-500 mb-4">RepliX</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto px-4">
          Your AI-powered YouTube comment assistant. Streamline your engagement, 
          manage responses with a single click.
        </p>
      </div>
      <div className="max-w-md w-full mx-4 space-y-8 p-8 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
        <div>
          <h2 className="text-center text-2xl font-semibold text-white">
            Welcome 
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Sign in to continue managing your YouTube comments
          </p>
        </div>
        {getErrorMessage() && (
          <div className="bg-red-900/20 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg relative" role="alert">
            <span className="block sm:inline">{getErrorMessage()}</span>
          </div>
        )}
        
        <button
          onClick={login}
          className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-800 transition-colors duration-200"
        >
          <span className="absolute left-0 inset-y-0 flex items-center pl-3">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
              />
            </svg>
          </span>
          Sign in with Google
        </button>
      </div>
      <div className="mt-8 text-center text-sm text-gray-400">
        <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
} 