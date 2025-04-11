'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import VideoList from '@/components/VideoList';
import CommentList from '@/components/CommentList';

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 page-transition">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
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
          quality={100}
        />
        <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 bg-gray-800/50 backdrop-blur-md shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-red-500">RepliX</h1>
            </div>
            <div className="flex items-center">
              <span className="text-gray-300 mr-4">Welcome, {user.name}</span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-800 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3 space-y-6">
            <h2 className="text-2xl font-bold text-red-500">Your Videos</h2>
            <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-4 border border-gray-700 shadow-xl">
              <VideoList onVideoSelect={setSelectedVideoId} />
            </div>
          </div>
          
          <div className="lg:w-2/3 space-y-6">
            <h2 className="text-2xl font-bold text-red-500">
              {selectedVideoId ? 'Comments' : 'Select a video to view comments'}
            </h2>
            <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-4 border border-gray-700 shadow-xl">
              {selectedVideoId && <CommentList videoId={selectedVideoId} />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 