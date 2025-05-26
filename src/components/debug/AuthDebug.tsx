import React, { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import axios from 'axios';

export const AuthDebug: React.FC = () => {
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const gatherDebugInfo = async () => {
      try {
        const info: any = {
          isSignedIn,
          userId: user?.id,
          userEmail: user?.emailAddresses?.[0]?.emailAddress,
          userRole: user?.publicMetadata?.role,
          userFirstName: user?.firstName,
          userLastName: user?.lastName,
        };

        if (isSignedIn) {
          try {
            const token = await getToken();
            info.hasToken = !!token;
            info.tokenLength = token?.length || 0;
            info.tokenPreview = token ? `${token.substring(0, 20)}...` : 'No token';

            // Test API call
            try {
              console.log('🔍 Making API call to /users/profile with token:', token?.substring(0, 20) + '...');
              const response = await axios.get('/users/profile', {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
              console.log('✅ API call successful:', response.data);
              info.apiCallSuccess = true;
              info.apiResponse = response.data;
            } catch (apiError: any) {
              console.error('❌ API call failed:', {
                status: apiError.response?.status,
                statusText: apiError.response?.statusText,
                data: apiError.response?.data,
                url: apiError.config?.url,
                method: apiError.config?.method,
                headers: apiError.config?.headers
              });
              info.apiCallSuccess = false;
              info.apiError = {
                status: apiError.response?.status,
                statusText: apiError.response?.statusText,
                message: apiError.response?.data?.message || apiError.message,
                url: apiError.config?.url
              };
            }
          } catch (tokenError) {
            info.tokenError = tokenError.message;
          }
        }

        setDebugInfo(info);
      } catch (error) {
        console.error('Debug info gathering failed:', error);
      } finally {
        setLoading(false);
      }
    };

    gatherDebugInfo();
  }, [isSignedIn, user, getToken]);

  if (loading) {
    return <div className="p-4 bg-gray-100 rounded">Loading debug info...</div>;
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg max-w-2xl mx-auto my-4">
      <h3 className="text-lg font-bold mb-4 text-gray-800">🔍 Authentication Debug Info</h3>

      <div className="space-y-2 text-sm">
        <div className="grid grid-cols-2 gap-2">
          <span className="font-medium">Signed In:</span>
          <span className={isSignedIn ? 'text-green-600' : 'text-red-600'}>
            {isSignedIn ? '✅ Yes' : '❌ No'}
          </span>

          <span className="font-medium">User ID:</span>
          <span className="font-mono text-xs">{debugInfo.userId || 'None'}</span>

          <span className="font-medium">Email:</span>
          <span>{debugInfo.userEmail || 'None'}</span>

          <span className="font-medium">Role:</span>
          <span className={debugInfo.userRole === 'admin' ? 'text-green-600 font-bold' : 'text-orange-600'}>
            {debugInfo.userRole || 'customer (default)'}
          </span>

          <span className="font-medium">Has Token:</span>
          <span className={debugInfo.hasToken ? 'text-green-600' : 'text-red-600'}>
            {debugInfo.hasToken ? '✅ Yes' : '❌ No'}
          </span>

          <span className="font-medium">Token Length:</span>
          <span>{debugInfo.tokenLength}</span>
        </div>

        {debugInfo.tokenPreview && (
          <div className="mt-4">
            <span className="font-medium">Token Preview:</span>
            <div className="font-mono text-xs bg-gray-200 p-2 rounded mt-1">
              {debugInfo.tokenPreview}
            </div>
          </div>
        )}

        {debugInfo.apiCallSuccess !== undefined && (
          <div className="mt-4 p-3 rounded border">
            <span className="font-medium">API Test Result:</span>
            <div className={`mt-2 ${debugInfo.apiCallSuccess ? 'text-green-600' : 'text-red-600'}`}>
              {debugInfo.apiCallSuccess ? (
                <div>
                  <div>✅ API call successful!</div>
                  <div className="text-xs mt-1">User role from backend: {debugInfo.apiResponse?.user?.role}</div>
                </div>
              ) : (
                <div>
                  <div>❌ API call failed</div>
                  <div className="text-xs mt-1">
                    Status: {debugInfo.apiError?.status}<br/>
                    Message: {debugInfo.apiError?.message}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {debugInfo.tokenError && (
          <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded">
            <span className="font-medium text-red-800">Token Error:</span>
            <div className="text-red-600 text-xs mt-1">{debugInfo.tokenError}</div>
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-gray-600">
        <strong>💡 Troubleshooting:</strong><br/>
        • If role is not "admin", set it in Clerk Dashboard<br/>
        • If API call fails with 401, try logging out and back in<br/>
        • If no token, check Clerk configuration
      </div>
    </div>
  );
};

export default AuthDebug;
