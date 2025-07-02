'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MessageSquare, Clock, Users } from 'lucide-react';

const LandingPageSkeleton = () => (
  <div className="min-h-screen bg-gray-900">
    {/* Navigation Skeleton */}
    <nav className="bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="animate-pulse bg-gray-700/50 rounded-md h-8 w-24"></div>
          <div className="animate-pulse bg-gray-700/50 rounded-md h-8 w-24"></div>
        </div>
      </div>
    </nav>

    {/* Hero Section Skeleton */}
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
      <div className="text-center">
        <div className="animate-pulse bg-gray-700/50 rounded-md h-12 w-1/2 mx-auto"></div>
        <div className="animate-pulse bg-gray-700/50 rounded-md h-8 w-3/4 mx-auto mt-6"></div>
        <div className="mt-10 flex justify-center space-x-4">
          <div className="animate-pulse bg-gray-700/50 rounded-md h-12 w-32"></div>
          <div className="animate-pulse bg-gray-700/50 rounded-md h-12 w-32"></div>
        </div>
      </div>
    </main>
  </div>
);

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || user) {
    return <LandingPageSkeleton />;
  }

  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/background.jpg"
          alt="Abstract technology background"
          fill
          className="object-cover"
          priority
          quality={50} 
        />
        <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20 items-center border-b border-white/10">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-red-500">RepliX</h1>
              </div>
              <div className="flex items-center space-x-4">
                <Link 
                  href="/login"
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/login"
                  className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 sm:pt-32 sm:pb-24 text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-red-500 tracking-tight">
            RepliX
          </h1>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mt-2">
            <span className="block">Manage Your YouTube Comments</span>
            <span className="block">Smarter & Faster</span>
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-300">
            RepliX is an AI-powered assistant that helps you manage and respond to YouTube comments, so you can focus on creating amazing content.
          </p>
          <div className="mt-10 flex justify-center space-x-4">
            <Link
              href="/login"
              className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-500 hover:bg-red-600 md:py-4 md:text-lg md:px-10"
            >
              Get Started for Free
            </Link>
            <a
              href="#features"
              className="px-8 py-3 border border-red-500 text-base font-medium rounded-md text-red-500 bg-black/20 hover:bg-black/40 md:py-4 md:text-lg md:px-10"
            >
              Learn More
            </a>
          </div>
        </main>

        {/* Features Section */}
        <section id="features" className="py-16 sm:py-24 bg-black/20 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Why You'll Love RepliX
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-300">
                Everything you need to supercharge your comment management.
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10">
                <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center mb-6">
                  <MessageSquare className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white">AI-Powered Replies</h3>
                <p className="mt-2 text-gray-300">
                  Generate intelligent, context-aware responses to comments in seconds.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10">
                <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center mb-6">
                  <Clock className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white">Save Time</h3>
                <p className="mt-2 text-gray-300">
                  Dramatically reduce the time you spend on comment moderation and replies.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10">
                <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white">Engage Your Community</h3>
                <p className="mt-2 text-gray-300">
                  Foster a more active and engaged community with timely and thoughtful interactions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-transparent">
          <div className="max-w-4xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">Ready to take control of your comments?</span>
            </h2>
            <p className="mt-4 text-lg leading-6 text-gray-300">
              Start your free trial today and see how RepliX can transform your workflow.
            </p>
            <Link
              href="/login"
              className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-500 hover:bg-red-600 sm:w-auto"
            >
              Sign up for free
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-transparent border-t border-white/10">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-bold text-red-500">RepliX</h2>
                <p className="text-sm text-gray-400">© 2025 RepliX. All rights reserved.</p>
              </div>
              <div className="flex items-center space-x-6">
                <Link href="#" className="text-sm text-gray-400 hover:text-white">Terms</Link>
                <Link href="#" className="text-sm text-gray-400 hover:text-white">Privacy</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

