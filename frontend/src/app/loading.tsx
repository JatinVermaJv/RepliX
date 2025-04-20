'use client';

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-red-500">R</span>
          </div>
        </div>
        <h1 className="text-xl font-bold text-white">RepliX</h1>
        <p className="text-sm text-gray-400">Loading your experience...</p>
      </div>
    </div>
  );
} 