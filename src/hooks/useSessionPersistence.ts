import { useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';

/**
 * Hook to manage session persistence across server restarts
 */
export const useSessionPersistence = () => {
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    const persistSession = async () => {
      if (isSignedIn && user) {
        try {
          // Store user session data in localStorage
          const sessionData = {
            userId: user.id,
            email: user.emailAddresses[0]?.emailAddress,
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            lastLogin: new Date().toISOString(),
            isSignedIn: true
          };

          localStorage.setItem('clerk_session_data', JSON.stringify(sessionData));

          // Store the current token for API requests
          const token = await getToken();
          if (token) {
            localStorage.setItem('clerk_token', token);
          }
        } catch (error) {
          console.warn('Failed to persist session:', error);
        }
      } else {
        // Clear session data when signed out
        localStorage.removeItem('clerk_session_data');
        localStorage.removeItem('clerk_token');
      }
    };

    persistSession();
  }, [isSignedIn, user, getToken]);

  // Function to restore session data
  const restoreSession = () => {
    try {
      const sessionData = localStorage.getItem('clerk_session_data');
      return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
      console.warn('Failed to restore session:', error);
      return null;
    }
  };

  // Function to check if session is valid
  const isSessionValid = () => {
    const sessionData = restoreSession();
    if (!sessionData) return false;

    // Check if session is not older than 7 days
    const lastLogin = new Date(sessionData.lastLogin);
    const now = new Date();
    const daysDiff = (now.getTime() - lastLogin.getTime()) / (1000 * 3600 * 24);
    
    return daysDiff < 7;
  };

  return {
    restoreSession,
    isSessionValid
  };
};
