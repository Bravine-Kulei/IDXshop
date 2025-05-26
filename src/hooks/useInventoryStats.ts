import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { ProductStats } from '../types/product';
import { productService } from '../services/productService';

interface UseInventoryStatsReturn {
  stats: ProductStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useInventoryStats = (): UseInventoryStatsReturn => {
  const { isSignedIn, getToken } = useAuth();
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if user is signed in
      if (!isSignedIn) {
        setError('Authentication required');
        return;
      }

      // Get authentication token
      const token = await getToken();
      if (!token) {
        setError('Authentication token not available');
        return;
      }

      console.log('🔍 Fetching inventory stats with token:', token.substring(0, 20) + '...');
      const statsData = await productService.getStats();
      setStats(statsData);
      console.log('✅ Inventory stats fetched successfully:', statsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stats';
      setError(errorMessage);
      console.error('❌ Error fetching inventory stats:', {
        error: err,
        message: errorMessage,
        isSignedIn,
      });
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchStats();
  };

  useEffect(() => {
    // Only fetch stats if user is signed in
    if (isSignedIn) {
      fetchStats();
    } else {
      setLoading(false);
      setError('Please sign in to view inventory statistics');
    }
  }, [isSignedIn]);

  return {
    stats,
    loading,
    error,
    refetch,
  };
};
