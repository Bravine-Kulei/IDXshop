import React from 'react';
import { useUser } from '@clerk/clerk-react';

export const ProfilePage: React.FC = () => {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">Profile</h1>
        {user && (
          <div className="bg-[#1a1a1a] p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">User Information</h2>
            <p className="text-gray-300">Name: {user.fullName}</p>
            <p className="text-gray-300">Email: {user.primaryEmailAddress?.emailAddress}</p>
          </div>
        )}
      </div>
    </div>
  );
};
