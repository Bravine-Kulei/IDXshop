import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { API_BASE_URL, buildAdminApiUrl, API_ENDPOINTS } from '../../config/api';

export const ApiTest: React.FC = () => {
  const { getToken, isSignedIn, userId } = useAuth();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (test: string, success: boolean, data: any) => {
    setResults(prev => [...prev, { test, success, data, timestamp: new Date().toISOString() }]);
  };

  const testHealthCheck = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`);
      addResult('Health Check', true, response.data);
    } catch (error: any) {
      addResult('Health Check', false, error.message);
    }
  };

  const testClerkAuth = async () => {
    try {
      const token = await getToken();
      addResult('Clerk Token', !!token, { hasToken: !!token, userId, isSignedIn });
    } catch (error: any) {
      addResult('Clerk Token', false, error.message);
    }
  };

  const testAdminUsers = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(buildAdminApiUrl(API_ENDPOINTS.ADMIN.USERS), {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      addResult('Admin Users API', true, response.data);
    } catch (error: any) {
      addResult('Admin Users API', false, {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
    }
  };

  const testAdminDashboard = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(buildAdminApiUrl(API_ENDPOINTS.ADMIN.DASHBOARD), {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      addResult('Admin Dashboard API', true, response.data);
    } catch (error: any) {
      addResult('Admin Dashboard API', false, {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    setResults([]);

    await testHealthCheck();
    await testClerkAuth();
    await testAdminDashboard();
    await testAdminUsers();

    setLoading(false);
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="p-6 bg-[#1a1a1a] rounded-lg border border-gray-800 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">API Debug Tool</h2>

      <div className="flex gap-4 mb-6">
        <button
          onClick={runAllTests}
          disabled={loading}
          className="bg-[#00a8ff] hover:bg-[#0090e0] text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? 'Running Tests...' : 'Run All Tests'}
        </button>
        <button
          onClick={clearResults}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
        >
          Clear Results
        </button>
      </div>

      <div className="space-y-4">
        {results.map((result, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${
              result.success
                ? 'bg-green-900/20 border-green-500 text-green-400'
                : 'bg-red-900/20 border-red-500 text-red-400'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{result.test}</h3>
              <span className="text-sm opacity-75">{result.timestamp}</span>
            </div>
            <pre className="text-sm overflow-x-auto">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </div>
        ))}
      </div>

      {results.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          Click "Run All Tests" to start debugging the API connections
        </div>
      )}
    </div>
  );
};
