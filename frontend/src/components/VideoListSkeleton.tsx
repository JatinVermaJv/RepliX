
import React from 'react';

const SkeletonPulse: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`animate-pulse bg-gray-700/50 rounded-md ${className}`} />
);

const VideoListItemSkeleton: React.FC = () => (
  <div className="flex items-center space-x-4 p-3 rounded-lg transition-colors duration-200">
    <SkeletonPulse className="w-28 h-16" />
    <div className="flex-1 space-y-2">
      <SkeletonPulse className="h-4 w-3/4" />
      <SkeletonPulse className="h-3 w-1/2" />
    </div>
  </div>
);

const VideoListSkeleton: React.FC = () => {
  return (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <VideoListItemSkeleton key={i} />
      ))}
    </div>
  );
};

export default VideoListSkeleton;
