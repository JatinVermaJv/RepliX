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
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-900/50 text-red-200 p-4 rounded-lg mb-4">
          {error}
        </div>
        <button
          onClick={fetchComments}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
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
          className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          rows={3}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-start space-x-4">
              <Image
                src={comment.authorImage}
                alt={comment.author}
                width={40}
                height={40}
                className="rounded-full"
                sizes="40px"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-white">{comment.author}</span>
                  <span className="text-gray-400 text-sm">
                    {new Date(comment.publishedAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-1 text-gray-200">{comment.text}</p>
                <div className="mt-2 flex items-center space-x-4">
                  <span className="text-gray-400 text-sm">
                    {comment.likeCount} likes
                  </span>
                  <button
                    onClick={() => {
                      setSelectedComment(comment.id === selectedComment ? null : comment.id);
                      if (comment.id !== selectedComment) {
                        generateAiReply(comment.text);
                      } else {
                        setAiReply(null);
                      }
                    }}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    {comment.id === selectedComment ? 'Hide AI Reply' : 'Generate AI Reply'}
                  </button>
                </div>
                {comment.id === selectedComment && (
                  <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                    {isGeneratingReply ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span className="text-gray-300">Generating reply...</span>
                      </div>
                    ) : aiReply ? (
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-blue-400 text-sm font-semibold">AI Reply:</span>
                        </div>
                        <p className="text-gray-200">{aiReply}</p>
                        <div className="mt-4 flex space-x-4">
                          <button
                            onClick={() => handleSubmitReply(comment.id, aiReply)}
                            disabled={isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
                          >
                            {isSubmitting ? 'Posting...' : 'Post Reply'}
                          </button>
                          <button
                            onClick={() => {
                              setSelectedComment(null);
                              setAiReply(null);
                            }}
                            className="text-gray-400 hover:text-gray-300 text-sm"
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