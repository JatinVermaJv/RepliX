'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Comment {
  id: string;
  author: string;
  authorImage: string;
  text: string;
  publishedAt: string;
  likeCount: number;
}

interface CommentListProps {
  videoId: string;
}

export default function CommentList({ videoId }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:3001/api/youtube/videos/${videoId}/comments`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch comments');
      }

      const data = await response.json();
      setComments(data);
    } catch (error: any) {
      console.error('Error fetching comments:', error);
      setError(error.message || 'Failed to load comments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      const response = await fetch(`http://localhost:3001/api/youtube/videos/${videoId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newComment }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to post comment');
      }

      setNewComment('');
      fetchComments();
    } catch (error: any) {
      console.error('Error posting comment:', error);
      setError(error.message || 'Failed to post comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        <p className="text-gray-400">Loading comments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg relative" role="alert">
        <span className="block sm:inline">{error}</span>
        <button
          onClick={fetchComments}
          className="mt-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-md text-sm font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmitComment} className="space-y-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          rows={3}
        />
        <button
          type="submit"
          disabled={submitting || !newComment.trim()}
          className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="relative h-10 w-10 flex-shrink-0">
                <Image
                  src={comment.authorImage}
                  alt={comment.author}
                  fill
                  className="rounded-full object-cover"
                  sizes="40px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-gray-100 truncate">{comment.author}</h4>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {new Date(comment.publishedAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-1 text-gray-300 whitespace-pre-wrap break-words">{comment.text}</p>
                <div className="mt-2 flex items-center space-x-2 text-sm text-gray-400">
                  <span>👍 {comment.likeCount}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 