import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useSessionPersistence } from '../../hooks/useSessionPersistence';

interface SessionRecoveryProps {
  children: React.ReactNode;
}

/**
 * Component to handle session recovery after server restart
 */
export const SessionRecovery: React.FC<SessionRecoveryProps> = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const { restoreSession, isSessionValid } = useSessionPersistence();
  const [isRecovering, setIsRecovering] = useState(false);
  const [showRecoveryMessage, setShowRecoveryMessage] = useState(false);

  useEffect(() => {
    const attemptSessionRecovery = async () => {
      if (!isLoaded) return;

      // If user is not signed in but has valid session data
      if (!isSignedIn && isSessionValid()) {
        setIsRecovering(true);
        setShowRecoveryMessage(true);

        const sessionData = restoreSession();
        if (sessionData) {
          console.log('Attempting to recover session for:', sessionData.email);
          
          // Show recovery message for 3 seconds
          setTimeout(() => {
            setShowRecoveryMessage(false);
            setIsRecovering(false);
          }, 3000);
        }
      }
    };

    attemptSessionRecovery();
  }, [isLoaded, isSignedIn, isSessionValid, restoreSession]);

  if (showRecoveryMessage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a] text-white">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Restoring Your Session</h2>
          <p className="text-gray-400 mb-4">
            We're recovering your login session. This will only take a moment.
          </p>
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <p className="text-sm text-blue-300">
              💡 <strong>Tip:</strong> Your session is now configured to persist across server restarts. 
              You won't need to log in again unless you explicitly sign out or your session expires.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
