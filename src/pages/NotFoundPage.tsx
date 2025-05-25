import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-4xl font-bold text-white mb-4">404 - Page Not Found</h1>
        <p className="text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="bg-[#00a8ff] hover:bg-[#0090e0] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};
