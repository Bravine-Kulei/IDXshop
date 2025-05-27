/**
 * Refund Button Component
 * Button component for processing M-Pesa refunds from checkout/orders
 * 
 * @author G20Shop Development Team
 * @version 1.0.0
 * @since 2024-01-15
 */

import React, { useState } from 'react';
import { useMpesa } from '../contexts/MpesaContext';

interface RefundButtonProps {
  orderId: string;
  orderAmount: number;
  customerPhone: string;
  orderDate: Date;
  className?: string;
  onRefundSuccess?: (result: any) => void;
  onRefundError?: (error: string) => void;
}

export const RefundButton: React.FC<RefundButtonProps> = ({
  orderId,
  orderAmount,
  customerPhone,
  orderDate,
  className = '',
  onRefundSuccess,
  onRefundError
}) => {
  const {
    processRefund,
    canRequestRefund,
    isWithinRefundPeriod,
    loading,
    formatCurrency,
    formatPhoneNumber
  } = useMpesa();

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [processing, setProcessing] = useState(false);

  // Check if refund is possible
  const canRefund = canRequestRefund(orderId) && isWithinRefundPeriod(orderDate);

  const handleRefundClick = () => {
    if (!canRefund) return;
    setShowConfirmation(true);
  };

  const handleConfirmRefund = async () => {
    if (!refundReason.trim()) {
      onRefundError?.('Please provide a reason for the refund');
      return;
    }

    try {
      setProcessing(true);
      const result = await processRefund(
        orderId,
        formatPhoneNumber(customerPhone),
        orderAmount,
        refundReason
      );

      setShowConfirmation(false);
      setRefundReason('');
      onRefundSuccess?.(result);
    } catch (error: any) {
      onRefundError?.(error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleCancelRefund = () => {
    setShowConfirmation(false);
    setRefundReason('');
  };

  if (!canRefund) {
    return (
      <div className="text-sm text-gray-500">
        {!isWithinRefundPeriod(orderDate) 
          ? 'Refund period expired (30 days)'
          : 'Refund already processed'
        }
      </div>
    );
  }

  return (
    <>
      {/* Refund Button */}
      <button
        onClick={handleRefundClick}
        disabled={loading || processing}
        className={`
          px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-200
          ${className}
        `}
      >
        {processing ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Processing...</span>
          </div>
        ) : (
          `Refund ${formatCurrency(orderAmount)}`
        )}
      </button>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Refund
            </h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order ID
                </label>
                <div className="text-sm text-gray-600 font-mono bg-gray-100 p-2 rounded">
                  {orderId}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Refund Amount
                </label>
                <div className="text-lg font-semibold text-green-600">
                  {formatCurrency(orderAmount)}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Phone
                </label>
                <div className="text-sm text-gray-600">
                  {formatPhoneNumber(customerPhone)}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Refund *
                </label>
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="Please provide a reason for this refund..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  required
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleCancelRefund}
                disabled={processing}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRefund}
                disabled={processing || !refundReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50"
              >
                {processing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  'Confirm Refund'
                )}
              </button>
            </div>

            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-800">
                    This will initiate an M-Pesa B2C payment to refund the customer. 
                    The refund will be processed to their mobile money account.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
