/**
 * API Configuration
 * Centralized configuration for all API endpoints
 */

// Get API base URL from environment variables with fallback
const getApiBaseUrl = (): string => {
  // Check if we're in development, staging, or production
  const env = import.meta.env.VITE_APP_ENV || 'development';

  // Use environment variable if available
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Fallback based on environment
  switch (env) {
    case 'production':
      return 'https://your-production-api.com/api';
    case 'staging':
      return 'https://your-staging-api.com/api';
    case 'development':
    default:
      return 'http://localhost:3000/api';
  }
};

// Export the base URL
export const API_BASE_URL = getApiBaseUrl();

// API endpoint configurations
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },

  // Admin endpoints (without /admin prefix since buildAdminApiUrl adds it)
  ADMIN: {
    DASHBOARD: '/dashboard',
    USERS: '/users',
    INVENTORY: '/inventory',
    INVENTORY_STATS: '/inventory/stats',
    INVENTORY_PRODUCTS: '/inventory/products',
    IMPORT_JOBS: '/inventory/import-jobs',
  },

  // User endpoints
  USERS: {
    PROFILE: '/users/profile',
    ORDERS: '/users/orders',
  },

  // Product endpoints
  PRODUCTS: {
    LIST: '/products',
    CATEGORIES: '/products/categories',
    SEARCH: '/products/search',
  },

  // Order endpoints
  ORDERS: {
    CREATE: '/orders',
    LIST: '/orders',
    DETAILS: '/orders',
  },

  // Payment endpoints
  PAYMENTS: {
    MPESA: '/mpesa',
    STRIPE: '/payments/stripe',
  }
} as const;

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

// Helper function to build admin API URLs
export const buildAdminApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}/admin${endpoint}`;
};

// Export configuration object
export const apiConfig = {
  baseUrl: API_BASE_URL,
  timeout: 10000, // 10 seconds
  retries: 3,
  retryDelay: 1000, // 1 second
} as const;

// Development helpers
export const isDevelopment = import.meta.env.VITE_APP_ENV === 'development';
export const isProduction = import.meta.env.VITE_APP_ENV === 'production';

console.log('🔧 API Configuration:', {
  baseUrl: API_BASE_URL,
  environment: import.meta.env.VITE_APP_ENV || 'development',
  isDevelopment,
  isProduction
});
