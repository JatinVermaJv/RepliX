'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

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

  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/LandingPage.jpg"
          alt="Samurai forest background"
          fill
          className="object-cover"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 bg-gray-800/50 backdrop-blur-md shadow-lg border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-red-500">RepliX</h1>
              </Link>
            </div>
            <div className="flex items-center">
              <Link 
                href="/"
                className="flex items-center space-x-2 text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Login Content */}
      <div className="relative z-10 flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 bg-gray-800/50 backdrop-blur-md p-8 rounded-xl border border-gray-700/50">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              Manage your YouTube comments with AI
            </p>
          </div>

          {getErrorMessage() && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg text-sm">
              {getErrorMessage()}
            </div>
          )}

          <div className="mt-8 space-y-6">
            <button
              onClick={login}
              disabled={loading}
              className="group relative flex w-full justify-center rounded-lg bg-red-600 px-3 py-3 text-sm font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                  </svg>
                  <span>Sign in with Google</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
} 