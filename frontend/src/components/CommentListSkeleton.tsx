
import React from 'react';

const SkeletonPulse: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`animate-pulse bg-gray-700/50 rounded-md ${className}`} />
);

const CommentItemSkeleton: React.FC = () => (
  <div className="flex items-start space-x-4 py-4 border-b border-gray-700/50">
    <SkeletonPulse className="w-10 h-10 rounded-full" />
    <div className="flex-1 space-y-2">
      <div className="flex items-center space-x-2">
        <SkeletonPulse className="h-4 w-1/4" />
        <SkeletonPulse className="h-3 w-1/6" />
      </div>
      <SkeletonPulse className="h-4 w-full" />
      <SkeletonPulse className="h-4 w-5/6" />
      <div className="flex items-center space-x-4 mt-2">
        <SkeletonPulse className="h-6 w-20" />
        <SkeletonPulse className="h-6 w-20" />
      </div>
    </div>
  </div>
);

const CommentListSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <CommentItemSkeleton key={i} />
      ))}
    </div>
  );
};

export default CommentListSkeleton;
