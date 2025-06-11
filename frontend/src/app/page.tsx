'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Simple gray placeholder image as base64
const PLACEHOLDER_BLUR_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showLoadingState, setShowLoadingState] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Effect for handling loading state
  useEffect(() => {
    // Only show loading indicator if authentication check takes longer than 500ms
    const timer = setTimeout(() => {
      setShowLoadingState(loading);
      if (process.env.NODE_ENV === 'development') {
        console.log('Loading state changed:', loading);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [loading]);
  
  // Effect for handling redirect
  useEffect(() => {
    if (!loading && user && !isRedirecting) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Redirecting to dashboard, user:', user);
      }
      setIsRedirecting(true);
      router.push('/dashboard');
    }
  }, [user, loading, router, isRedirecting]);
  
  // Only show loading UI if auth check is taking time
  if (loading && showLoadingState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated and redirecting, don't render anything
  if (user && isRedirecting) {
    return null;
  }

  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/image.png"
          alt="Samurai forest background"
          fill
          className="object-cover"
          priority
          quality={75}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          placeholder="blur"
          blurDataURL={PLACEHOLDER_BLUR_DATA_URL}
          loading="eager"
        />
        <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 bg-gray-800/50 backdrop-blur-md shadow-lg border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-red-500">RepliX</h1>
              <span className="h-6 w-px bg-gray-700/50"></span>
              <p className="text-sm text-gray-400">YouTube Comment Assistant</p>
            </div>
            <div className="flex items-center">
              <Link 
                href="/login"
                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                <span>Sign In</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight">
            <span className='block text-red-600'>RepliX</span>
            <span className="block">Manage Your YouTube</span>
            <span className="block text-red-500">Comments with AI</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-300">
            RepliX helps YouTube creators manage and respond to comments efficiently with AI-powered assistance.
          </p>
          <div className="mt-10 flex justify-center space-x-4">
            <Link
              href="/login"
              className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 md:py-4 md:text-lg md:px-10"
            >
              Get Started
            </Link>
            <a
              href="#features"
              className="px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-300 bg-transparent hover:bg-gray-800 md:py-4 md:text-lg md:px-10"
            >
              Learn More
            </a>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-16 bg-gray-800/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Features
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-300">
              Everything you need to manage your YouTube comments effectively.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="w-12 h-12 rounded-md bg-red-500/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">AI-Powered Replies</h3>
              <p className="mt-2 text-gray-300">
                Generate intelligent, context-aware responses to your YouTube comments with just one click.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="w-12 h-12 rounded-md bg-red-500/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Save Time</h3>
              <p className="mt-2 text-gray-300">
                Respond to comments faster and more efficiently, giving you more time to create content.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="w-12 h-12 rounded-md bg-red-500/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Engage Better</h3>
              <p className="mt-2 text-gray-300">
                Build stronger relationships with your audience through consistent, thoughtful responses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900/80 backdrop-blur-md border-t border-gray-700/50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <h2 className="text-xl font-bold text-red-500">RepliX</h2>
              <p className="text-sm text-gray-400">© 2025 RepliX. All rights reserved.</p>
            </div>
            
          </div>
        </div>
      </footer>
    </div>
  );
}
