/**
 * M-Pesa Frontend Test Setup
 * Setup configuration for M-Pesa frontend tests
 * 
 * @author G20Shop Development Team
 * @version 1.0.0
 * @since 2024-01-15
 */

import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Clean up after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Mock environment variables
Object.defineProperty(window, 'env', {
  value: {
    VITE_API_BASE_URL: 'http://localhost:3001/api',
    NODE_ENV: 'test'
  },
  writable: true
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
});

// Mock scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock
});

// Mock fetch
global.fetch = vi.fn();

// Test utilities
export const testUtils = {
  // Generate test data
  generateTestPhone: () => `254708${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
  generateTestOrderId: () => `ORD_TEST_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
  generateTestTransactionId: () => `TXN_TEST_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
  
  // Create mock transaction
  createMockTransaction: (overrides = {}) => ({
    id: testUtils.generateTestTransactionId(),
    conversationId: `AG_${Date.now()}`,
    amount: '1000.00',
    type: 'REFUND',
    typeDescription: 'Refund Payment',
    status: 'COMPLETED',
    statusDescription: 'Transaction completed successfully',
    remarks: 'Test transaction',
    receiptNumber: `MPE${Math.floor(Math.random() * 1000000000)}`,
    initiatedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    duration: 120,
    ...overrides
  }),
  
  // Create mock refund
  createMockRefund: (overrides = {}) => ({
    id: `REF_${Date.now()}`,
    orderId: testUtils.generateTestOrderId(),
    amount: '500.00',
    status: 'COMPLETED',
    statusDescription: 'Refund completed',
    reason: 'Customer request',
    initiatedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    ...overrides
  }),
  
  // Create mock M-Pesa context
  createMockMpesaContext: (overrides = {}) => ({
    transactions: [],
    refunds: [],
    loading: false,
    error: null,
    refreshTransactions: vi.fn(),
    getTransaction: vi.fn(),
    processRefund: vi.fn(),
    refreshRefunds: vi.fn(),
    validatePhoneNumber: vi.fn(),
    validateAmount: vi.fn(),
    calculateFee: vi.fn(),
    formatCurrency: vi.fn((amount) => `KES ${amount.toLocaleString()}`),
    formatPhoneNumber: vi.fn((phone) => phone),
    maskPhoneNumber: vi.fn((phone) => `****${phone.slice(-4)}`),
    getStatusColor: vi.fn((status) => `text-${status.toLowerCase()}-500`),
    getStatusIcon: vi.fn((status) => status === 'COMPLETED' ? '✅' : '⏳'),
    canRequestRefund: vi.fn(() => true),
    isWithinRefundPeriod: vi.fn(() => true),
    clearError: vi.fn(),
    ...overrides
  }),
  
  // Wait for async operations
  wait: (ms = 0) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Mock API responses
  mockApiResponse: (data: any, success = true) => ({
    data: {
      success,
      data,
      message: success ? 'Success' : 'Error',
      ...(success ? {} : { errors: ['Test error'] })
    }
  }),
  
  // Mock API error
  mockApiError: (message = 'API Error', errors = []) => ({
    response: {
      data: {
        success: false,
        message,
        errors
      }
    }
  })
};

// Custom matchers for M-Pesa tests
expect.extend({
  toBeValidKenyanPhone(received: string) {
    const phoneRegex = /^254\d{9}$/;
    const pass = phoneRegex.test(received);
    
    return {
      pass,
      message: () => pass
        ? `expected ${received} not to be a valid Kenyan phone number`
        : `expected ${received} to be a valid Kenyan phone number (254XXXXXXXXX)`
    };
  },
  
  toBeValidTransactionAmount(received: number) {
    const pass = !isNaN(received) && received > 0 && received <= 250000;
    
    return {
      pass,
      message: () => pass
        ? `expected ${received} not to be a valid transaction amount`
        : `expected ${received} to be a valid transaction amount (1-250000)`
    };
  },
  
  toBeValidTransactionStatus(received: string) {
    const validStatuses = ['SUBMITTED', 'COMPLETED', 'FAILED', 'TIMEOUT', 'CANCELLED', 'PENDING'];
    const pass = validStatuses.includes(received);
    
    return {
      pass,
      message: () => pass
        ? `expected ${received} not to be a valid transaction status`
        : `expected ${received} to be a valid transaction status (${validStatuses.join(', ')})`
    };
  },
  
  toHaveValidCurrencyFormat(received: string) {
    const currencyRegex = /^KES\s[\d,]+$/;
    const pass = currencyRegex.test(received);
    
    return {
      pass,
      message: () => pass
        ? `expected ${received} not to have valid currency format`
        : `expected ${received} to have valid currency format (KES X,XXX)`
    };
  }
});

// Global test configuration
console.log('🧪 M-Pesa Frontend Test Setup Complete');

// Export test utilities for use in tests
export { testUtils as default };
