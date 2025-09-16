'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

interface Comment {
  id: string;
  author: string;
  authorImage: string;
  text: string;
  publishedAt: string;
  likeCount: number;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

interface CategorizedComments {
  positive: Comment[];
  negative: Comment[];
  neutral: Comment[];
}

export default function CommentCategorizationPage() {
  const params = useParams();
  const router = useRouter();
  const videoId = params?.videoId as string;

  const [comments, setComments] = useState<Comment[]>([]);
  const [categorizedComments, setCategorizedComments] = useState<CategorizedComments>({
    positive: [],
    negative: [],
    neutral: []
  });
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'positive' | 'negative' | 'neutral'>('positive');

  const analyzeComments = async (commentsToAnalyze: Comment[]) => {
    try {
      setAnalyzing(true);
      setError(null);
      
      if (commentsToAnalyze.length === 0) {
        setCategorizedComments({ positive: [], negative: [], neutral: [] });
        return;
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/categorize-comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ comments: commentsToAnalyze }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to analyze comments');
      }

      const categorized = await response.json();
      setCategorizedComments(categorized);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message);
      // Set empty state on error
      setCategorizedComments({ positive: [], negative: [], neutral: [] });
    } finally {
      setAnalyzing(false);
    }
  };

  const fetchComments = useCallback(async () => {
    if (!videoId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/youtube/videos/${videoId}/comments`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch comments');
      }
      
      const data = await response.json();
      setComments(data);
      
      // Only auto-analyze if we have comments
      if (data.length > 0) {
        await analyzeComments(data);
      } else {
        setCategorizedComments({ positive: [], negative: [], neutral: [] });
        setAnalyzing(false);
      }
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message);
      setCategorizedComments({ positive: [], negative: [], neutral: [] });
    } finally {
      setLoading(false);
    }
  }, [videoId]);

  useEffect(() => {
    if (videoId) {
      fetchComments();
    }
  }, [videoId, fetchComments]);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-900/20 border-green-500/20 text-green-400';
      case 'negative':
        return 'bg-red-900/20 border-red-500/20 text-red-400';
      case 'neutral':
        return 'bg-gray-900/20 border-gray-500/20 text-gray-400';
      default:
        return 'bg-gray-900/20 border-gray-500/20 text-gray-400';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return '😊';
      case 'negative':
        return '😞';
      case 'neutral':
        return '😐';
      default:
        return '🤔';
    }
  };

  const getTabCount = (tab: string) => {
    return categorizedComments[tab as keyof CategorizedComments]?.length || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.back()}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold">Comment Analysis</h1>
            <div></div>
          </div>
          
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-400">Loading comments...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.back()}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold">Comment Analysis</h1>
            <div></div>
          </div>
          
          <div className="bg-red-900/20 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg">
            <span className="block sm:inline">{error}</span>
            <button
              onClick={fetchComments}
              className="mt-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-md text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold">Comment Sentiment Analysis</h1>
          <button
            onClick={() => analyzeComments(comments)}
            disabled={analyzing}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
          >
            {analyzing ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing...
              </span>
            ) : (
              'Re-analyze'
            )}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-900/20 border border-green-500/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{getTabCount('positive')}</div>
            <div className="text-green-300">Positive Comments</div>
          </div>
          <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{getTabCount('negative')}</div>
            <div className="text-red-300">Negative Comments</div>
          </div>
          <div className="bg-gray-900/20 border border-gray-500/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-400">{getTabCount('neutral')}</div>
            <div className="text-gray-300">Neutral Comments</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          {(['positive', 'negative', 'neutral'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab
                  ? getSentimentColor(tab) + ' border'
                  : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <span className="mr-2">{getSentimentIcon(tab)}</span>
              {tab.charAt(0).toUpperCase() + tab.slice(1)} ({getTabCount(tab)})
            </button>
          ))}
        </div>

        {/* Comments */}
        <div className="space-y-4">
          {categorizedComments[activeTab]?.length > 0 ? (
            categorizedComments[activeTab].map((comment) => (
              <div
                key={comment.id}
                className={`rounded-lg p-4 border ${getSentimentColor(activeTab)}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={comment.authorImage}
                      alt={comment.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium">{comment.author}</span>
                      <span className="text-xs opacity-70">
                        {new Date(comment.publishedAt).toLocaleDateString()}
                      </span>
                      <span className="text-lg">{getSentimentIcon(activeTab)}</span>
                    </div>
                    <p className="text-sm leading-relaxed">{comment.text}</p>
                    <div className="flex items-center mt-2 text-xs opacity-70">
                      <span>👍 {comment.likeCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">{getSentimentIcon(activeTab)}</div>
              <p className="text-gray-400">
                No {activeTab} comments found{analyzing ? ' yet. Analysis in progress...' : '.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}