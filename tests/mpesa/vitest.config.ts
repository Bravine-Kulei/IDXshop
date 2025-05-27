/**
 * Vitest Configuration for M-Pesa Frontend Tests
 * Specialized configuration for M-Pesa frontend test suite
 * 
 * @author G20Shop Development Team
 * @version 1.0.0
 * @since 2024-01-15
 */

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  
  test: {
    // Test environment
    environment: 'jsdom',
    
    // Test file patterns
    include: ['**/tests/mpesa/**/*.test.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    
    // Setup files
    setupFiles: ['./tests/mpesa/setup.ts'],
    
    // Global test configuration
    globals: true,
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage/mpesa',
      include: [
        'src/features/mpesa/**/*.{ts,tsx}',
        'src/pages/CheckoutPage.tsx'
      ],
      exclude: [
        'src/features/mpesa/index.ts',
        '**/*.test.{ts,tsx}',
        '**/*.d.ts',
        '**/node_modules/**'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        },
        'src/features/mpesa/services/': {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90
        },
        'src/features/mpesa/contexts/': {
          branches: 85,
          functions: 85,
          lines: 85,
          statements: 85
        }
      }
    },
    
    // Test timeout
    testTimeout: 10000,
    
    // Retry configuration
    retry: 2,
    
    // Reporter configuration
    reporter: ['verbose', 'json', 'html'],
    outputFile: {
      json: './test-results/mpesa/results.json',
      html: './test-results/mpesa/index.html'
    }
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../../src'),
      '@tests': path.resolve(__dirname, '../'),
      '@mpesa': path.resolve(__dirname, '../../src/features/mpesa')
    }
  },
  
  define: {
    // Environment variables for tests
    'process.env.NODE_ENV': '"test"',
    'process.env.VITE_API_BASE_URL': '"http://localhost:3001/api"'
  }
});
