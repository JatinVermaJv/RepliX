'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import VideoList from '@/components/VideoList';
import CommentList from '@/components/CommentList';
import VideoListSkeleton from '@/components/VideoListSkeleton';
import CommentListSkeleton from '@/components/CommentListSkeleton';

const DashboardSkeleton = () => (
  <div className="relative min-h-screen bg-gray-900 text-white">
    {/* Background Image */}
    <div className="absolute inset-0 z-0">
      <Image
        src="/Dashboard.jpg"
        alt="Samurai forest background"
        fill
        className="object-cover"
        priority
        quality={75}
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm"></div>
    </div>

    {/* Navigation Skeleton */}
    <nav className="relative z-10 bg-gray-800/50 backdrop-blur-md shadow-lg border-b border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="animate-pulse bg-gray-700/50 rounded-md h-8 w-24"></div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="animate-pulse bg-gray-700/50 rounded-full h-8 w-8"></div>
            <div className="animate-pulse bg-gray-700/50 rounded-md h-8 w-24"></div>
          </div>
        </div>
      </div>
    </nav>

    {/* Main Content Skeleton */}
    <main className="relative z-10 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3 space-y-6">
          <div className="animate-pulse bg-gray-700/50 rounded-md h-8 w-1/2"></div>
          <div className="bg-gray-800/40 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 shadow-xl">
            <VideoListSkeleton />
          </div>
        </div>
        <div className="lg:w-2/3 space-y-6">
          <div className="animate-pulse bg-gray-700/50 rounded-md h-8 w-1/2"></div>
          <div className="bg-gray-800/40 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 shadow-xl">
            <CommentListSkeleton />
          </div>
        </div>
      </div>
    </main>
  </div>
);

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="relative min-h-screen bg-gray-900 text-white page-transition">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/Dashboard.jpg"
          alt="Samurai forest background"
          fill
          className="object-cover"
          priority
          quality={75}
          sizes="100vw"
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
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-300">{user.name}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 border border-red-500/20"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3 space-y-6">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold text-red-500">Your Videos</h2>
              <div className="h-px flex-1 bg-red-500/20"></div>
            </div>
            <div className="bg-gray-800/40 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 shadow-xl ring-1 ring-inset ring-gray-700/10">
              <VideoList onVideoSelect={setSelectedVideoId} />
            </div>
          </div>
          
          <div className="lg:w-2/3 space-y-6">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold text-red-500">
                {selectedVideoId ? 'Comments' : 'Select a video to view comments'}
              </h2>
              <div className="h-px flex-1 bg-red-500/20"></div>
            </div>
            <div className="bg-gray-800/40 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 shadow-xl ring-1 ring-inset ring-gray-700/10">
              {selectedVideoId ? (
                <CommentList videoId={selectedVideoId} />
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-red-500/10 mx-auto flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-sm">Select a video from the list to view and manage its comments</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 