import React from 'react';
import { SignUpButton as ClerkSignUpButton, useAuth } from '@clerk/clerk-react';

export const SignUpButton: React.FC = () => {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return null;
  }

  return (
    <ClerkSignUpButton mode="modal">
      <button className="bg-[#00a8ff] hover:bg-[#0090e0] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
        Sign Up
      </button>
    </ClerkSignUpButton>
  );
};
