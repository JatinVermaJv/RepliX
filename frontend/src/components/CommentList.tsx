'use client';

import { useState, useEffect, useCallback } from 'react';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedComment, setSelectedComment] = useState<string | null>(null);
  const [aiReply, setAiReply] = useState<string | null>(null);
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);

  const fetchComments = useCallback(async () => {
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
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [videoId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setIsSubmitting(true);
      setError(null);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/youtube/videos/${videoId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ text: newComment }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to post comment');
      }

      setNewComment('');
      fetchComments();
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReply = async (commentId: string, replyText: string) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/youtube/videos/${videoId}/comments/${commentId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ text: replyText }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to post reply');
      }

      setAiReply(null);
      setSelectedComment(null);
      fetchComments();
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Reply Error:', error);
      setError(error.message || 'Failed to post reply. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateAiReply = async (commentText: string) => {
    try {
      setIsGeneratingReply(true);
      setError(null);
      setAiReply(null);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/generate-reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ comment: commentText }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || `Failed to generate reply (${response.status}): ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.reply) {
        throw new Error('No reply was generated. Please try again.');
      }
      setAiReply(data.reply);
    } catch (err: unknown) {
      const error = err as Error;
      console.error('AI Reply Error:', error);
      setError(error.message || 'Failed to generate reply. Please try again.');
    } finally {
      setIsGeneratingReply(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-red-500 border-t-transparent"></div>
          <p className="text-gray-400 text-sm">Loading comments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-900/20 border border-red-500/20 text-red-400 p-4 rounded-lg mb-4">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
        <button
          onClick={fetchComments}
          className="flex items-center space-x-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 border border-red-500/20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmitComment} className="space-y-4">
        <div className="relative">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-4 rounded-xl bg-gray-900/50 text-white border border-gray-700/50 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 placeholder-gray-500 transition-colors duration-200"
            rows={3}
          />
          <div className="absolute bottom-3 right-3">
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <span>{isSubmitting ? 'Posting...' : 'Post Comment'}</span>
            </button>
          </div>
        </div>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 transition-all duration-200 hover:bg-gray-900/60">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Image
                  src={comment.authorImage}
                  alt={comment.author}
                  width={40}
                  height={40}
                  className="rounded-full ring-2 ring-gray-700/50"
                  sizes="40px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-white truncate">{comment.author}</span>
                  <span className="text-gray-400 text-sm">
                    {new Date(comment.publishedAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-1 text-gray-300 whitespace-pre-wrap break-words">{comment.text}</p>
                <div className="mt-3 flex items-center space-x-4">
                  <div className="flex items-center space-x-1 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    <span className="text-sm">{comment.likeCount}</span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedComment(comment.id === selectedComment ? null : comment.id);
                      if (comment.id !== selectedComment) {
                        generateAiReply(comment.text);
                      } else {
                        setAiReply(null);
                      }
                    }}
                    className="flex items-center space-x-2 text-red-500 hover:text-red-400 text-sm font-medium transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>{comment.id === selectedComment ? 'Hide AI Reply' : 'Generate AI Reply'}</span>
                  </button>
                </div>

                {comment.id === selectedComment && (
                  <div className="mt-4 p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50">
                    {isGeneratingReply ? (
                      <div className="flex items-center space-x-3 text-gray-300">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-500 border-t-transparent"></div>
                        <span>AI is crafting a reply...</span>
                      </div>
                    ) : aiReply ? (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          <span className="font-medium text-gray-200">AI Generated Reply:</span>
                        </div>
                        <p className="text-gray-300 pl-7">{aiReply}</p>
                        <div className="flex items-center space-x-3 pl-7">
                          <button
                            onClick={() => handleSubmitReply(comment.id, aiReply)}
                            disabled={isSubmitting}
                            className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 disabled:cursor-not-allowed"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            <span>{isSubmitting ? 'Posting...' : 'Post Reply'}</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedComment(null);
                              setAiReply(null);
                            }}
                            className="text-gray-400 hover:text-gray-300 text-sm font-medium transition-colors duration-200"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 