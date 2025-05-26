import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Product, ProductFilters, ProductsResponse } from '../types/product';
import { productService } from '../services/productService';

interface UseInventoryParams extends ProductFilters {}

interface UseInventoryReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  totalProducts: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  setCurrentPage: (page: number) => void;
  refetch: () => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
  bulkDelete: (ids: string[]) => Promise<void>;
  bulkUpdate: (ids: string[], updates: Partial<Product>) => Promise<void>;
}

export const useInventory = (params: UseInventoryParams = {}): UseInventoryReturn => {
  const { isSignedIn, getToken } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(params.page || 1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  const fetchProducts = useCallback(async () => {
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

      console.log('🔍 Fetching inventory products with token:', token.substring(0, 20) + '...');
      const response = await productService.getProducts({
        ...params,
        page: currentPage,
      });

      setProducts(response.products);
      setTotalProducts(response.totalProducts);
      setTotalPages(response.totalPages);
      setHasNextPage(response.hasNextPage);
      setHasPrevPage(response.hasPrevPage);
      console.log('✅ Inventory products fetched successfully:', response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(errorMessage);
      console.error('❌ Error fetching inventory products:', {
        error: err,
        message: errorMessage,
        isSignedIn,
      });
    } finally {
      setLoading(false);
    }
  }, [params.search, params.category, params.sortBy, params.sortOrder, params.limit, currentPage, isSignedIn, getToken]);

  const refetch = useCallback(async () => {
    await fetchProducts();
  }, [fetchProducts]);

  const deleteProduct = useCallback(async (id: string) => {
    try {
      await productService.deleteProduct(id);
      await refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
      throw err;
    }
  }, [refetch]);

  const updateProduct = useCallback(async (id: string, data: Partial<Product>) => {
    try {
      await productService.updateProduct(id, data);
      await refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
      throw err;
    }
  }, [refetch]);

  const bulkDelete = useCallback(async (ids: string[]) => {
    try {
      await productService.bulkDelete(ids);
      await refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete products');
      throw err;
    }
  }, [refetch]);

  const bulkUpdate = useCallback(async (ids: string[], updates: Partial<Product>) => {
    try {
      await productService.bulkUpdate(ids, updates);
      await refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update products');
      throw err;
    }
  }, [refetch]);

  useEffect(() => {
    // Only fetch products if user is signed in
    if (isSignedIn) {
      fetchProducts();
    } else {
      setLoading(false);
      setError('Please sign in to view inventory');
    }
  }, [fetchProducts, isSignedIn]);

  return {
    products,
    loading,
    error,
    totalProducts,
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    setCurrentPage,
    refetch,
    deleteProduct,
    updateProduct,
    bulkDelete,
    bulkUpdate,
  };
};
