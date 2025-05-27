/**
 * Order Service
 * Frontend service for order management and payment processing
 *
 * @author G20Shop Development Team
 * @version 1.0.0
 * @since 2024-01-15
 */

import axios from 'axios';
import { API_BASE_URL } from '../config/api';

// Types for order operations
export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  productName: string;
  productSku?: string;
  productImage?: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode?: string;
  country?: string;
}

export interface OrderData {
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  paymentMethod: 'mpesa' | 'credit_card' | 'cash_on_delivery';
  subtotal: number;
  tax: number;
  shippingCost: number;
  totalAmount: number;
  notes?: string;
  couponCode?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  totalAmount: number;
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface PaymentInitiationResponse {
  success: boolean;
  orderId: string;
  checkoutRequestId?: string;
  merchantRequestId?: string;
  customerMessage?: string;
  responseCode?: string;
  responseDescription?: string;
}

class OrderService {
  private baseUrl = `${API_BASE_URL}`;

  /**
   * Get authentication headers
   */
  private async getAuthHeaders(token?: string) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Create a new order
   */
  async createOrder(orderData: OrderData, token?: string): Promise<Order> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/orders`,
        orderData,
        { headers: await this.getAuthHeaders(token) }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Initiate M-Pesa payment for an order
   */
  async initiateMpesaPayment(
    orderId: string,
    phoneNumber: string,
    amount: number,
    token?: string
  ): Promise<PaymentInitiationResponse> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/mpesa/initiate-payment`,
        {
          orderId,
          phoneNumber,
          amount,
          accountReference: `G20SHOP-${orderId}`,
          transactionDesc: `Payment for G20Shop Order ${orderId}`
        },
        { headers: await this.getAuthHeaders(token) }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Check M-Pesa payment status
   */
  async checkPaymentStatus(checkoutRequestId: string, token?: string) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/mpesa/payment-status/${checkoutRequestId}`,
        { headers: await this.getAuthHeaders(token) }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get order by ID
   */
  async getOrder(orderId: string, token?: string): Promise<Order> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/orders/${orderId}`,
        { headers: await this.getAuthHeaders(token) }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get user orders
   */
  async getUserOrders(params: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}, token?: string) {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });

      const response = await axios.get(
        `${this.baseUrl}/orders/user?${queryParams.toString()}`,
        { headers: await this.getAuthHeaders(token) }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Cancel an order
   */
  async cancelOrder(orderId: string, cancelReason?: string, token?: string) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/orders/${orderId}/cancel`,
        { cancelReason },
        { headers: await this.getAuthHeaders(token) }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
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
   * Validate phone number for M-Pesa
   */
  validateMpesaPhone(phoneNumber: string): { isValid: boolean; formatted?: string; message: string } {
    if (!phoneNumber) {
      return { isValid: false, message: 'Phone number is required' };
    }

    // Remove spaces, dashes, and parentheses
    const cleaned = phoneNumber.replace(/[\s\-\(\)]/g, '');

    // Check if it's a valid Kenyan number (Safaricom 07xx, Airtel 01xx)
    const kenyanPattern = /^(?:254|0)?(7[0-9]\d{7}|1[0-9]\d{7})$/;
    const match = cleaned.match(kenyanPattern);

    if (!match) {
      return {
        isValid: false,
        message: 'Please enter a valid Kenyan phone number (e.g., 0712345678 or 254712345678)'
      };
    }

    const formatted = `254${match[1]}`;
    return {
      isValid: true,
      formatted,
      message: 'Valid phone number'
    };
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

export const orderService = new OrderService();
