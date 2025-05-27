/**
 * Transaction Status Component
 * Displays M-Pesa transaction status with real-time updates
 * 
 * @author G20Shop Development Team
 * @version 1.0.0
 * @since 2024-01-15
 */

import React, { useState, useEffect } from 'react';
import { useMpesa } from '../contexts/MpesaContext';
import { MpesaTransaction } from '../services/mpesa.service';

interface TransactionStatusProps {
  transactionId: string;
  showDetails?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number; // in seconds
  className?: string;
}

export const TransactionStatus: React.FC<TransactionStatusProps> = ({
  transactionId,
  showDetails = false,
  autoRefresh = true,
  refreshInterval = 30,
  className = ''
}) => {
  const {
    getTransaction,
    getStatusColor,
    getStatusIcon,
    formatCurrency,
    loading
  } = useMpesa();

  const [transaction, setTransaction] = useState<MpesaTransaction | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch transaction details
  const fetchTransaction = async () => {
    try {
      setRefreshing(true);
      const data = await getTransaction(transactionId);
      setTransaction(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching transaction:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Auto-refresh for pending transactions
  useEffect(() => {
    fetchTransaction();

    if (autoRefresh && transaction?.status && ['PENDING', 'SUBMITTED'].includes(transaction.status)) {
      const interval = setInterval(fetchTransaction, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [transactionId, autoRefresh, refreshInterval, transaction?.status]);

  if (loading || !transaction) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        <span className="text-gray-600">Loading transaction...</span>
      </div>
    );
  }

  const statusColor = getStatusColor(transaction.status);
  const statusIcon = getStatusIcon(transaction.status);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Status Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{statusIcon}</span>
          <span className={`font-medium ${statusColor}`}>
            {transaction.statusDescription || transaction.status}
          </span>
          {refreshing && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          )}
        </div>
        
        {lastUpdated && (
          <span className="text-xs text-gray-500">
            Updated {lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-600">Amount:</span>
          <span className="ml-2 font-medium">{transaction.amount}</span>
        </div>
        <div>
          <span className="text-gray-600">Type:</span>
          <span className="ml-2">{transaction.typeDescription}</span>
        </div>
      </div>

      {/* Receipt Number (if completed) */}
      {transaction.receiptNumber && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <div className="text-sm font-medium text-green-800">
                Transaction Completed
              </div>
              <div className="text-sm text-green-600">
                Receipt: {transaction.receiptNumber}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message (if failed) */}
      {transaction.status === 'FAILED' && transaction.resultDescription && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <div className="text-sm font-medium text-red-800">
                Transaction Failed
              </div>
              <div className="text-sm text-red-600">
                {transaction.resultDescription}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Information */}
      {showDetails && (
        <div className="border-t pt-3 space-y-2">
          <h4 className="font-medium text-gray-900">Transaction Details</h4>
          
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="font-mono text-xs">{transaction.id}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Conversation ID:</span>
              <span className="font-mono text-xs">{transaction.conversationId}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Initiated:</span>
              <span>{new Date(transaction.initiatedAt).toLocaleString()}</span>
            </div>
            
            {transaction.completedAt && (
              <div className="flex justify-between">
                <span className="text-gray-600">Completed:</span>
                <span>{new Date(transaction.completedAt).toLocaleString()}</span>
              </div>
            )}
            
            {transaction.duration && (
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span>{transaction.duration} seconds</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-gray-600">Remarks:</span>
              <span className="text-right max-w-xs">{transaction.remarks}</span>
            </div>
          </div>
        </div>
      )}

      {/* Pending Status Info */}
      {['PENDING', 'SUBMITTED'].includes(transaction.status) && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <svg className="h-5 w-5 text-blue-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <div className="text-sm font-medium text-blue-800">
                Processing Transaction
              </div>
              <div className="text-sm text-blue-600">
                Please wait while we process your {transaction.typeDescription.toLowerCase()}. 
                This usually takes 1-3 minutes.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Refresh Button */}
      {!autoRefresh && (
        <button
          onClick={fetchTransaction}
          disabled={refreshing}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          {refreshing ? 'Refreshing...' : 'Refresh Status'}
        </button>
      )}
    </div>
  );
};
