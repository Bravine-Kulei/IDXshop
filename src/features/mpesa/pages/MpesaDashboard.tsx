/**
 * M-Pesa Dashboard Page
 * User dashboard for viewing M-Pesa transactions and refunds
 * 
 * @author G20Shop Development Team
 * @version 1.0.0
 * @since 2024-01-15
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useMpesa } from '../contexts/MpesaContext';
import { TransactionHistory } from '../components/TransactionHistory';
import { TransactionStatus } from '../components/TransactionStatus';

export const MpesaDashboard: React.FC = () => {
  const { user } = useAuth();
  const {
    transactions,
    refunds,
    loading,
    error,
    refreshTransactions,
    refreshRefunds,
    formatCurrency,
    clearError
  } = useMpesa();

  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'refunds'>('overview');
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);

  useEffect(() => {
    refreshTransactions();
    refreshRefunds();
  }, []);

  // Calculate summary statistics
  const summary = {
    totalTransactions: transactions.length,
    completedTransactions: transactions.filter(t => t.status === 'COMPLETED').length,
    pendingTransactions: transactions.filter(t => ['PENDING', 'SUBMITTED'].includes(t.status)).length,
    totalRefunds: refunds.length,
    completedRefunds: refunds.filter(r => r.status === 'COMPLETED').length,
    pendingRefunds: refunds.filter(r => ['PENDING', 'SUBMITTED'].includes(r.status)).length,
    totalRefundAmount: refunds
      .filter(r => r.status === 'COMPLETED')
      .reduce((sum, r) => sum + parseFloat(r.amount.replace(/[^\d.-]/g, '')), 0)
  };

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">M-Pesa Dashboard</h1>
          <p className="text-gray-400">
            Welcome back, {user?.firstName}! Manage your M-Pesa transactions and refunds.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-800">{error}</span>
              </div>
              <button
                onClick={clearError}
                className="text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'transactions', label: 'All Transactions', icon: '💳' },
              { id: 'refunds', label: 'Refunds', icon: '💰' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                    <p className="text-2xl font-bold text-gray-900">{summary.totalTransactions}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  {summary.completedTransactions} completed, {summary.pendingTransactions} pending
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Refunds</p>
                    <p className="text-2xl font-bold text-gray-900">{summary.totalRefunds}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  {summary.completedRefunds} completed, {summary.pendingRefunds} pending
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Refund Amount</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(summary.totalRefundAmount)}
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Total refunded to your M-Pesa
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Success Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {summary.totalTransactions > 0 
                        ? Math.round((summary.completedTransactions / summary.totalTransactions) * 100)
                        : 0}%
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Transaction success rate
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View All
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="ml-2 text-gray-600">Loading transactions...</span>
                </div>
              ) : recentTransactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No transactions found
                </div>
              ) : (
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedTransaction(
                        selectedTransaction === transaction.id ? null : transaction.id
                      )}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-gray-100 rounded-full">
                          <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{transaction.typeDescription}</div>
                          <div className="text-sm text-gray-600">
                            {new Date(transaction.initiatedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{transaction.amount}</div>
                        <div className={`text-sm ${
                          transaction.status === 'COMPLETED' ? 'text-green-600' :
                          ['PENDING', 'SUBMITTED'].includes(transaction.status) ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {transaction.statusDescription}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Transaction Details */}
            {selectedTransaction && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Details</h3>
                <TransactionStatus
                  transactionId={selectedTransaction}
                  showDetails={true}
                  autoRefresh={true}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <TransactionHistory showFilters={true} pageSize={10} />
          </div>
        )}

        {activeTab === 'refunds' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Refunds</h3>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-600">Loading refunds...</span>
              </div>
            ) : refunds.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No refunds found
              </div>
            ) : (
              <div className="space-y-4">
                {refunds.map((refund) => (
                  <div
                    key={refund.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">
                          {refund.isCompleted ? '✅' : refund.isPending ? '⏳' : '❌'}
                        </span>
                        <span className="font-medium text-gray-900">
                          {refund.statusDescription}
                        </span>
                      </div>
                      <span className="text-lg font-semibold text-gray-900">
                        {refund.amount}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Order ID:</span>
                        <div className="font-mono text-xs">{refund.orderId}</div>
                      </div>
                      <div>
                        <span className="font-medium">Date:</span>
                        <div>{new Date(refund.initiatedAt).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <span className="font-medium">Time:</span>
                        <div>{new Date(refund.initiatedAt).toLocaleTimeString()}</div>
                      </div>
                      {refund.receiptNumber && (
                        <div>
                          <span className="font-medium">Receipt:</span>
                          <div className="font-mono text-xs">{refund.receiptNumber}</div>
                        </div>
                      )}
                    </div>

                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">Remarks:</span> {refund.remarks}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
