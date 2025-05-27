/**
 * M-Pesa Service Frontend Tests
 * Test suite for M-Pesa frontend service layer
 * 
 * @author G20Shop Development Team
 * @version 1.0.0
 * @since 2024-01-15
 */

import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import axios from 'axios';
import { mpesaService } from '../../src/features/mpesa/services/mpesa.service';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as {
  post: Mock;
  get: Mock;
};

describe('M-Pesa Service Frontend Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('🔐 Authentication', () => {
    it('should include authorization headers', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { transactions: [], pagination: {} }
        }
      };
      
      mockedAxios.get.mockResolvedValue(mockResponse);
      
      const token = 'test-token';
      await mpesaService.getMyTransactions({}, token);
      
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          })
        })
      );
    });
  });

  describe('💸 Refund Processing', () => {
    it('should process refund successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            transactionId: 'txn_123',
            conversationId: 'conv_123',
            status: 'SUBMITTED'
          }
        }
      };
      
      mockedAxios.post.mockResolvedValue(mockResponse);
      
      const refundRequest = {
        orderId: 'ORD_123',
        phoneNumber: '254708374149',
        amount: 1000,
        reason: 'Customer request'
      };
      
      const result = await mpesaService.processRefund(refundRequest, 'test-token');
      
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/admin/refund'),
        refundRequest,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token'
          })
        })
      );
      
      expect(result.success).toBe(true);
      expect(result.data.transactionId).toBe('txn_123');
    });

    it('should handle refund errors', async () => {
      const mockError = {
        response: {
          data: {
            message: 'Refund already processed',
            errors: ['Duplicate refund request']
          }
        }
      };
      
      mockedAxios.post.mockRejectedValue(mockError);
      
      const refundRequest = {
        orderId: 'ORD_123',
        phoneNumber: '254708374149',
        amount: 1000,
        reason: 'Duplicate test'
      };
      
      await expect(mpesaService.processRefund(refundRequest, 'test-token'))
        .rejects
        .toThrow('Refund already processed: Duplicate refund request');
    });
  });

  describe('📊 Transaction Management', () => {
    it('should get user transactions with filters', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            transactions: [
              {
                id: 'txn_1',
                amount: '1000.00',
                status: 'COMPLETED',
                type: 'REFUND'
              }
            ],
            pagination: {
              total: 1,
              page: 1,
              limit: 10,
              totalPages: 1
            }
          }
        }
      };
      
      mockedAxios.get.mockResolvedValue(mockResponse);
      
      const params = {
        status: 'COMPLETED',
        transactionType: 'REFUND',
        page: 1,
        limit: 10
      };
      
      const result = await mpesaService.getMyTransactions(params, 'test-token');
      
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('status=COMPLETED&transactionType=REFUND&page=1&limit=10'),
        expect.any(Object)
      );
      
      expect(result.transactions).toHaveLength(1);
      expect(result.transactions[0].status).toBe('COMPLETED');
    });

    it('should get specific transaction', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            id: 'txn_123',
            amount: '1000.00',
            status: 'COMPLETED',
            receiptNumber: 'MPE123456789'
          }
        }
      };
      
      mockedAxios.get.mockResolvedValue(mockResponse);
      
      const result = await mpesaService.getTransaction('txn_123', 'test-token');
      
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/my-transaction/txn_123'),
        expect.any(Object)
      );
      
      expect(result.id).toBe('txn_123');
      expect(result.receiptNumber).toBe('MPE123456789');
    });

    it('should get user refunds', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            refunds: [
              {
                id: 'ref_1',
                orderId: 'ORD_123',
                amount: '500.00',
                status: 'COMPLETED'
              }
            ],
            pagination: {
              total: 1,
              page: 1,
              limit: 10,
              totalPages: 1
            }
          }
        }
      };
      
      mockedAxios.get.mockResolvedValue(mockResponse);
      
      const result = await mpesaService.getMyRefunds({}, 'test-token');
      
      expect(result.refunds).toHaveLength(1);
      expect(result.refunds[0].orderId).toBe('ORD_123');
    });
  });

  describe('✅ Validation Functions', () => {
    it('should validate phone numbers', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            original: '0708374149',
            isValid: true,
            formatted: '254708374149',
            masked: '****4149',
            message: 'Valid Kenyan phone number'
          }
        }
      };
      
      mockedAxios.post.mockResolvedValue(mockResponse);
      
      const result = await mpesaService.validatePhoneNumber('0708374149');
      
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/validate-phone'),
        { phoneNumber: '0708374149' }
      );
      
      expect(result.isValid).toBe(true);
      expect(result.formatted).toBe('254708374149');
      expect(result.masked).toBe('****4149');
    });

    it('should validate amounts', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            original: 1000,
            isValid: true,
            errors: [],
            formatted: 'KES 1,000',
            estimatedFee: 'KES 15',
            limits: {
              minimum: 10,
              maximum: 250000,
              daily: 300000
            }
          }
        }
      };
      
      mockedAxios.post.mockResolvedValue(mockResponse);
      
      const result = await mpesaService.validateAmount(1000, 'GENERAL');
      
      expect(result.isValid).toBe(true);
      expect(result.formatted).toBe('KES 1,000');
      expect(result.estimatedFee).toBe('KES 15');
    });

    it('should calculate fees', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            amount: 1000,
            fee: 15,
            total: 1015,
            feeStructure: 'Standard B2C rates'
          }
        }
      };
      
      mockedAxios.get.mockResolvedValue(mockResponse);
      
      const result = await mpesaService.calculateFee(1000);
      
      expect(result.fee).toBe(15);
      expect(result.total).toBe(1015);
    });
  });

  describe('🎨 Utility Functions', () => {
    it('should format phone numbers correctly', () => {
      const testCases = [
        { input: '0708374149', expected: '254708374149' },
        { input: '254708374149', expected: '254708374149' },
        { input: '+254708374149', expected: '254708374149' },
        { input: '708374149', expected: '254708374149' },
        { input: '', expected: '' },
        { input: 'invalid', expected: 'invalid' }
      ];

      testCases.forEach(testCase => {
        const result = mpesaService.formatPhoneNumber(testCase.input);
        expect(result).toBe(testCase.expected);
      });
    });

    it('should mask phone numbers', () => {
      const testCases = [
        { input: '254708374149', expected: '****4149' },
        { input: '0708374149', expected: '****4149' },
        { input: '123', expected: '****' },
        { input: '', expected: '****' }
      ];

      testCases.forEach(testCase => {
        const result = mpesaService.maskPhoneNumber(testCase.input);
        expect(result).toBe(testCase.expected);
      });
    });

    it('should format currency', () => {
      const testCases = [
        { input: 1000, expected: 'KES 1,000' },
        { input: 1000.50, expected: 'KES 1,001' },
        { input: 250000, expected: 'KES 250,000' },
        { input: 0, expected: 'KES 0' }
      ];

      testCases.forEach(testCase => {
        const result = mpesaService.formatCurrency(testCase.input);
        expect(result).toBe(testCase.expected);
      });
    });

    it('should get status colors', () => {
      const testCases = [
        { status: 'COMPLETED', expected: 'text-green-500' },
        { status: 'PENDING', expected: 'text-yellow-500' },
        { status: 'SUBMITTED', expected: 'text-yellow-500' },
        { status: 'FAILED', expected: 'text-red-500' },
        { status: 'TIMEOUT', expected: 'text-red-500' },
        { status: 'CANCELLED', expected: 'text-red-500' },
        { status: 'UNKNOWN', expected: 'text-gray-500' }
      ];

      testCases.forEach(testCase => {
        const result = mpesaService.getStatusColor(testCase.status);
        expect(result).toBe(testCase.expected);
      });
    });

    it('should get status icons', () => {
      const testCases = [
        { status: 'COMPLETED', expected: '✅' },
        { status: 'PENDING', expected: '⏳' },
        { status: 'SUBMITTED', expected: '⏳' },
        { status: 'FAILED', expected: '❌' },
        { status: 'TIMEOUT', expected: '❌' },
        { status: 'CANCELLED', expected: '❌' },
        { status: 'UNKNOWN', expected: '❓' }
      ];

      testCases.forEach(testCase => {
        const result = mpesaService.getStatusIcon(testCase.status);
        expect(result).toBe(testCase.expected);
      });
    });
  });

  describe('🚫 Error Handling', () => {
    it('should handle network errors', async () => {
      const networkError = new Error('Network Error');
      mockedAxios.post.mockRejectedValue(networkError);

      await expect(mpesaService.validatePhoneNumber('254708374149'))
        .rejects
        .toThrow('Network error. Please check your connection.');
    });

    it('should handle API errors with response', async () => {
      const apiError = {
        response: {
          data: {
            message: 'Invalid phone number',
            errors: ['Phone number must be Kenyan format']
          }
        }
      };
      
      mockedAxios.post.mockRejectedValue(apiError);

      await expect(mpesaService.validatePhoneNumber('invalid'))
        .rejects
        .toThrow('Invalid phone number: Phone number must be Kenyan format');
    });

    it('should handle API errors without response', async () => {
      const requestError = {
        request: {}
      };
      
      mockedAxios.post.mockRejectedValue(requestError);

      await expect(mpesaService.validatePhoneNumber('254708374149'))
        .rejects
        .toThrow('Network error. Please check your connection.');
    });

    it('should handle unknown errors', async () => {
      const unknownError = new Error('Something went wrong');
      mockedAxios.post.mockRejectedValue(unknownError);

      await expect(mpesaService.validatePhoneNumber('254708374149'))
        .rejects
        .toThrow('Something went wrong');
    });
  });
});
