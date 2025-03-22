'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">YouTube Comment Assistant</h1>
            </div>
            <div className="flex items-center">
              <span className="text-gray-300 mr-4">Welcome, {user.name}</span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3 space-y-6">
            <h2 className="text-2xl font-bold">Your Videos</h2>
            <div className="bg-gray-800 rounded-lg p-4">
              <VideoList onVideoSelect={setSelectedVideoId} />
            </div>
          </div>
          
          <div className="lg:w-2/3 space-y-6">
            <h2 className="text-2xl font-bold">
              {selectedVideoId ? 'Comments' : 'Select a video to view comments'}
            </h2>
            <div className="bg-gray-800 rounded-lg p-4">
              {selectedVideoId && <CommentList videoId={selectedVideoId} />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 