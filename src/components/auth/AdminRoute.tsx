import React, { useState, useEffect } from 'react';
import { useAuth, useUser, RedirectToSignIn, useSession } from '@clerk/clerk-react';
import axios from 'axios';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const { user } = useUser();
  const [userRole, setUserRole] = useState<string>('customer');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!isSignedIn || !user) {
        setLoading(false);
        return;
      }

      try {
        // Get the user's role from the backend
        const token = await getToken();
        const response = await axios.get('/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setUserRole(response.data.user?.role || 'customer');
      } catch (error) {
        console.error('Failed to fetch user role:', error);
        // Check if role is stored in Clerk metadata
        const role = user.publicMetadata?.role as string || 'customer';
        setUserRole(role);
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded) {
      checkUserRole();
    }
  }, [isSignedIn, isLoaded, user, getToken]);

  if (!isLoaded || loading) {
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
