/**
 * M-Pesa Context
 * State management for M-Pesa operations
 * 
 * @author G20Shop Development Team
 * @version 1.0.0
 * @since 2024-01-15
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { mpesaService, MpesaTransaction, MpesaTransactionHistory } from '../services/mpesa.service';

interface MpesaContextType {
  // State
  transactions: MpesaTransaction[];
  refunds: any[];
  loading: boolean;
  error: string | null;
  
  // Transaction management
  refreshTransactions: () => Promise<void>;
  getTransaction: (id: string) => Promise<MpesaTransaction | null>;
  
  // Refund management
  processRefund: (orderId: string, phoneNumber: string, amount: number, reason?: string) => Promise<any>;
  refreshRefunds: () => Promise<void>;
  
  // Utility functions
  validatePhoneNumber: (phoneNumber: string) => Promise<any>;
  validateAmount: (amount: number, transactionType?: string) => Promise<any>;
  calculateFee: (amount: number) => Promise<any>;
  formatCurrency: (amount: number) => string;
  formatPhoneNumber: (phoneNumber: string) => string;
  maskPhoneNumber: (phoneNumber: string) => string;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => string;
  
  // Business logic
  canRequestRefund: (orderId: string) => boolean;
  isWithinRefundPeriod: (orderDate: Date) => boolean;
}

const MpesaContext = createContext<MpesaContextType | undefined>(undefined);

export const useMpesa = () => {
  const context = useContext(MpesaContext);
  if (!context) {
    throw new Error('useMpesa must be used within a MpesaProvider');
  }
  return context;
};

interface MpesaProviderProps {
  children: React.ReactNode;
}

export const MpesaProvider: React.FC<MpesaProviderProps> = ({ children }) => {
  const { isSignedIn, getToken } = useAuth();
  const [transactions, setTransactions] = useState<MpesaTransaction[]>([]);
  const [refunds, setRefunds] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refresh transactions
  const refreshTransactions = async () => {
    if (!isSignedIn) {
      setTransactions([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      if (!token) return;

      const data = await mpesaService.getMyTransactions({}, token);
      setTransactions(data.transactions || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching M-Pesa transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get specific transaction
  const getTransaction = async (id: string): Promise<MpesaTransaction | null> => {
    if (!isSignedIn) return null;

    try {
      const token = await getToken();
      if (!token) return null;

      return await mpesaService.getTransaction(id, token);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching transaction:', err);
      return null;
    }
  };

  // Process refund
  const processRefund = async (
    orderId: string, 
    phoneNumber: string, 
    amount: number, 
    reason?: string
  ) => {
    if (!isSignedIn) {
      throw new Error('Please sign in to process refunds');
    }

    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      if (!token) throw new Error('Authentication required');

      const result = await mpesaService.processRefund({
        orderId,
        phoneNumber,
        amount,
        reason
      }, token);

      // Refresh transactions to show the new refund
      await refreshTransactions();
      await refreshRefunds();

      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Refresh refunds
  const refreshRefunds = async () => {
    if (!isSignedIn) {
      setRefunds([]);
      return;
    }

    try {
      const token = await getToken();
      if (!token) return;

      const data = await mpesaService.getMyRefunds({}, token);
      setRefunds(data.refunds || []);
    } catch (err: any) {
      console.error('Error fetching refunds:', err);
    }
  };

  // Validate phone number
  const validatePhoneNumber = async (phoneNumber: string) => {
    try {
      return await mpesaService.validatePhoneNumber(phoneNumber);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Validate amount
  const validateAmount = async (amount: number, transactionType?: string) => {
    try {
      return await mpesaService.validateAmount(amount, transactionType);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Calculate fee
  const calculateFee = async (amount: number) => {
    try {
      return await mpesaService.calculateFee(amount);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Utility functions
  const formatCurrency = (amount: number) => mpesaService.formatCurrency(amount);
  const formatPhoneNumber = (phoneNumber: string) => mpesaService.formatPhoneNumber(phoneNumber);
  const maskPhoneNumber = (phoneNumber: string) => mpesaService.maskPhoneNumber(phoneNumber);
  const getStatusColor = (status: string) => mpesaService.getStatusColor(status);
  const getStatusIcon = (status: string) => mpesaService.getStatusIcon(status);

  // Business logic functions
  const canRequestRefund = (orderId: string): boolean => {
    // Check if there's already a pending or completed refund for this order
    const existingRefund = refunds.find(refund => 
      refund.orderId === orderId && 
      ['PENDING', 'SUBMITTED', 'COMPLETED'].includes(refund.status)
    );
    return !existingRefund;
  };

  const isWithinRefundPeriod = (orderDate: Date): boolean => {
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff <= 30; // 30-day refund period
  };

  // Load data when user signs in
  useEffect(() => {
    if (isSignedIn) {
      refreshTransactions();
      refreshRefunds();
    } else {
      setTransactions([]);
      setRefunds([]);
      setError(null);
    }
  }, [isSignedIn]);

  const value: MpesaContextType = {
    // State
    transactions,
    refunds,
    loading,
    error,
    
    // Transaction management
    refreshTransactions,
    getTransaction,
    
    // Refund management
    processRefund,
    refreshRefunds,
    
    // Utility functions
    validatePhoneNumber,
    validateAmount,
    calculateFee,
    formatCurrency,
    formatPhoneNumber,
    maskPhoneNumber,
    getStatusColor,
    getStatusIcon,
    
    // Business logic
    canRequestRefund,
    isWithinRefundPeriod
  };

  return (
    <MpesaContext.Provider value={value}>
      {children}
    </MpesaContext.Provider>
  );
};
