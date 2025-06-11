'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
}

interface VideoListProps {
  onVideoSelect: (videoId: string) => void;
}

export default function VideoList({ onVideoSelect }: VideoListProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/youtube/videos`, {
        credentials: 'include',
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch videos');
      }

      const data = await response.json();
      setVideos(data);
    } catch (error: unknown) {
      const err = error as Error;
      console.error('Error fetching videos:', err);
      setError(err.message || 'Failed to load videos. Please try again.');
      
      if (err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      }
      
      // If the error is due to authentication, redirect to login
      if (err.message?.includes('Authentication failed')) {
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        <p className="text-gray-400">Loading your videos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg relative" role="alert">
        <span className="block sm:inline">{error}</span>
        <button
          onClick={fetchVideos}
          className="mt-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-md text-sm font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No videos found. Upload some videos to your YouTube channel to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {videos.map((video) => (
        <div
          key={video.id}
          className="bg-gray-700/50 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-700/70 transition-colors"
          onClick={() => onVideoSelect(video.id)}
        >
          <div className="relative aspect-video">
            <Image
              src={video.thumbnail}
              alt={video.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="p-3">
            <h3 className="text-sm font-medium text-gray-100 line-clamp-2">
              {video.title}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(video.publishedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
} 