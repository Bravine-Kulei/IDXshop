/**
 * Transaction History Component
 * Displays user's M-Pesa transaction history with filtering
 * 
 * @author G20Shop Development Team
 * @version 1.0.0
 * @since 2024-01-15
 */

import React, { useState, useEffect } from 'react';
import { useMpesa } from '../contexts/MpesaContext';
import { TransactionStatus } from './TransactionStatus';

interface TransactionHistoryProps {
  showFilters?: boolean;
  pageSize?: number;
  className?: string;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  showFilters = true,
  pageSize = 10,
  className = ''
}) => {
  const {
    transactions,
    loading,
    error,
    refreshTransactions,
    getStatusColor,
    getStatusIcon,
    formatCurrency
  } = useMpesa();

  const [filters, setFilters] = useState({
    status: '',
    transactionType: '',
    page: 1
  });

  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);

  // Refresh transactions on component mount
  useEffect(() => {
    refreshTransactions();
  }, []);

  // Filter transactions locally (you could also implement server-side filtering)
  const filteredTransactions = transactions.filter(transaction => {
    if (filters.status && transaction.status !== filters.status) return false;
    if (filters.transactionType && transaction.type !== filters.transactionType) return false;
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / pageSize);
  const startIndex = (filters.page - 1) * pageSize;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + pageSize);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filtering
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  if (error) {
    return (
      <div className={`p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <div className="flex items-center space-x-2">
          <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-red-800">{error}</span>
        </div>
        <button
          onClick={refreshTransactions}
          className="mt-2 px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-800 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          M-Pesa Transaction History
        </h3>
        <button
          onClick={refreshTransactions}
          disabled={loading}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="PENDING">Pending</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="FAILED">Failed</option>
              <option value="TIMEOUT">Timeout</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={filters.transactionType}
              onChange={(e) => handleFilterChange('transactionType', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="REFUND">Refunds</option>
              <option value="SALARY">Salary</option>
              <option value="PROMOTION">Promotions</option>
              <option value="GENERAL">General</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setFilters({ status: '', transactionType: '', page: 1 })}
              className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Transaction List */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Loading transactions...</span>
        </div>
      ) : paginatedTransactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {filteredTransactions.length === 0 && transactions.length === 0 
            ? 'No transactions found'
            : 'No transactions match your filters'
          }
        </div>
      ) : (
        <div className="space-y-3">
          {paginatedTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getStatusIcon(transaction.status)}</span>
                  <span className={`font-medium ${getStatusColor(transaction.status)}`}>
                    {transaction.statusDescription}
                  </span>
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {transaction.amount}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                <div>
                  <span className="font-medium">Type:</span>
                  <div>{transaction.typeDescription}</div>
                </div>
                <div>
                  <span className="font-medium">Date:</span>
                  <div>{new Date(transaction.initiatedAt).toLocaleDateString()}</div>
                </div>
                <div>
                  <span className="font-medium">Time:</span>
                  <div>{new Date(transaction.initiatedAt).toLocaleTimeString()}</div>
                </div>
                {transaction.receiptNumber && (
                  <div>
                    <span className="font-medium">Receipt:</span>
                    <div className="font-mono text-xs">{transaction.receiptNumber}</div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Remarks:</span> {transaction.remarks}
                </div>
                <button
                  onClick={() => setSelectedTransaction(
                    selectedTransaction === transaction.id ? null : transaction.id
                  )}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {selectedTransaction === transaction.id ? 'Hide Details' : 'View Details'}
                </button>
              </div>

              {/* Expanded Details */}
              {selectedTransaction === transaction.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <TransactionStatus
                    transactionId={transaction.id}
                    showDetails={true}
                    autoRefresh={['PENDING', 'SUBMITTED'].includes(transaction.status)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(startIndex + pageSize, filteredTransactions.length)} of {filteredTransactions.length} transactions
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(filters.page - 1)}
              disabled={filters.page === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 text-sm border rounded ${
                  page === filters.page
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(filters.page + 1)}
              disabled={filters.page === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
