import React from 'react';
import { SignInButton as ClerkSignInButton, useAuth } from '@clerk/clerk-react';

export const SignInButton: React.FC = () => {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return null;
  }

  return (
    <ClerkSignInButton mode="modal">
      <button className="text-gray-300 hover:text-[#00a8ff] px-3 py-2 text-sm font-medium transition-colors">
        Sign In
      </button>
    </ClerkSignInButton>
  );
};
