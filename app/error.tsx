'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h2 className="text-white text-2xl font-bold mb-4">Something went wrong!</h2>
        <p className="text-secondary mb-6">
          {error.message || 'An unexpected error occurred'}
        </p>
        <button
          onClick={reset}
          className="bg-tertiary py-3 px-8 rounded-xl text-white font-bold shadow-md hover:bg-[#151030] transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
