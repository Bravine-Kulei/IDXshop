import React from 'react';
import { useAuth, useUser, RedirectToSignIn } from '@clerk/clerk-react';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  const userRole = user?.publicMetadata?.role as string || 'customer';

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  if (userRole !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="bg-red-500 text-white p-8 rounded-lg max-w-md">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="mb-4">You don't have permission to access this area.</p>
            <p className="text-sm">Admin access required.</p>
            <button
              onClick={() => window.history.back()}
              className="mt-4 bg-white text-red-500 px-4 py-2 rounded hover:bg-gray-100"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
