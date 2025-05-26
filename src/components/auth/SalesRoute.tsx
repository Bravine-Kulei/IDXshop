import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface SalesRouteProps {
  children: React.ReactNode;
}

export const SalesRoute: React.FC<SalesRouteProps> = ({ children }) => {
  const { isLoaded, isSignedIn, user } = useUser();

  // Show loading while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  // Check user role
  const userRole = user?.publicMetadata?.role as string || 'customer';
  
  // Allow access for sales and admin users
  if (userRole !== 'sales' && userRole !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
