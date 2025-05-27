/**
 * M-Pesa Service
 * Frontend service for M-Pesa B2C operations
 *
 * @author G20Shop Development Team
 * @version 1.0.0
 * @since 2024-01-15
 */

import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';

// Types for M-Pesa operations
export interface MpesaPaymentRequest {
  phoneNumber: string;
  amount: number;
  transactionType?: 'REFUND' | 'SALARY' | 'PROMOTION' | 'GENERAL';
  remarks?: string;
  occasion?: string;
  orderId?: string;
  metadata?: Record<string, any>;
}

export interface MpesaRefundRequest {
  orderId: string;
  phoneNumber: string;
  amount: number;
  reason?: string;
}

export interface MpesaTransaction {
  id: string;
  conversationId: string;
  amount: string;
  type: string;
  typeDescription: string;
  status: string;
  statusDescription: string;
  remarks: string;
  receiptNumber?: string;
  initiatedAt: string;
  completedAt?: string;
  resultDescription?: string;
  duration?: number;
}

export interface MpesaTransactionHistory {
  transactions: MpesaTransaction[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface MpesaValidationResult {
  original: string;
  isValid: boolean;
  formatted?: string;
  masked?: string;
  message: string;
}

export interface MpesaAmountValidation {
  original: number;
  isValid: boolean;
  errors: string[];
  formatted: string;
  estimatedFee: string;
  limits: {
    minimum: number;
    maximum: number;
    daily: number;
  };
}

class MpesaService {
  private baseUrl = `${API_BASE_URL}/mpesa/b2c`;

  /**
   * Get authentication headers
   */
  private async getAuthHeaders(token: string) {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Process refund (linked to checkout)
   */
  async processRefund(request: MpesaRefundRequest, token: string) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/refund`,
        request,
        { headers: await this.getAuthHeaders(token) }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get user's B2C transactions
   */
  async getMyTransactions(params: {
    status?: string;
    transactionType?: string;
    page?: number;
    limit?: number;
  } = {}, token: string): Promise<MpesaTransactionHistory> {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });

      const response = await axios.get(
        `${this.baseUrl}/my-transactions?${queryParams.toString()}`,
        { headers: await this.getAuthHeaders(token) }
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get specific transaction details
   */
  async getTransaction(transactionId: string, token: string): Promise<MpesaTransaction> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/my-transaction/${transactionId}`,
        { headers: await this.getAuthHeaders(token) }
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get user's refunds
   */
  async getMyRefunds(params: {
    status?: string;
    page?: number;
    limit?: number;
  } = {}, token: string) {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });

      const response = await axios.get(
        `${this.baseUrl}/my-refunds?${queryParams.toString()}`,
        { headers: await this.getAuthHeaders(token) }
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Validate phone number
   */
  async validatePhoneNumber(phoneNumber: string): Promise<MpesaValidationResult> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/utility/validate-phone`,
        { phoneNumber }
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Validate amount
   */
  async validateAmount(amount: number, transactionType?: string): Promise<MpesaAmountValidation> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/utility/validate-amount`,
        { amount, transactionType }
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Calculate transaction fee
   */
  async calculateFee(amount: number) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/utility/fee-calculator/${amount}`
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Format phone number for display
   */
  formatPhoneNumber(phoneNumber: string): string {
    if (!phoneNumber) return '';

    const cleaned = phoneNumber.replace(/[\s\-\(\)]/g, '');

    if (cleaned.startsWith('0')) {
      return `254${cleaned.substring(1)}`;
    } else if (cleaned.startsWith('254')) {
      return cleaned;
    } else if (cleaned.startsWith('+254')) {
      return cleaned.substring(1);
    } else if (cleaned.length === 9) {
      return `254${cleaned}`;
    }

    return phoneNumber;
  }

  /**
   * Mask phone number for display
   */
  maskPhoneNumber(phoneNumber: string): string {
    if (!phoneNumber || phoneNumber.length < 4) return '****';
    return `****${phoneNumber.slice(-4)}`;
  }

  /**
   * Format currency for display
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  }

  /**
   * Get status color for UI
   */
  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-green-500';
      case 'pending':
      case 'submitted':
        return 'text-yellow-500';
      case 'failed':
      case 'timeout':
      case 'cancelled':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  }

  /**
   * Get status icon for UI
   */
  getStatusIcon(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
        return '✅';
      case 'pending':
      case 'submitted':
        return '⏳';
      case 'failed':
      case 'timeout':
      case 'cancelled':
        return '❌';
      default:
        return '❓';
    }
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): Error {
    if (error.response) {
      const message = error.response.data?.message || 'An error occurred';
      const errors = error.response.data?.errors || [];

      if (errors.length > 0) {
        return new Error(`${message}: ${errors.join(', ')}`);
      }

      return new Error(message);
    } else if (error.request) {
      return new Error('Network error. Please check your connection.');
    } else {
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

export const mpesaService = new MpesaService();
