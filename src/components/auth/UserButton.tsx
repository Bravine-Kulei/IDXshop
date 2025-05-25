import React from 'react';
import { UserButton as ClerkUserButton, useAuth, useUser } from '@clerk/clerk-react';

export const UserButton: React.FC = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-300 hidden md:block">
        Welcome, {user?.firstName || user?.emailAddresses[0]?.emailAddress}
      </span>
      <ClerkUserButton 
        appearance={{
          elements: {
            avatarBox: "w-8 h-8",
            userButtonPopoverCard: "bg-gray-800 border border-gray-700",
            userButtonPopoverActionButton: "text-white hover:bg-gray-700",
            userButtonPopoverActionButtonText: "text-white",
            userButtonPopoverFooter: "hidden"
          }
        }}
        afterSignOutUrl="/"
      />
    </div>
  );
};
