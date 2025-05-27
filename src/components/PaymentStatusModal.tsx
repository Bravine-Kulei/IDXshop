/**
 * Payment Status Modal
 * Real-time payment status tracking for M-Pesa transactions
 * 
 * @author G20Shop Development Team
 * @version 1.0.0
 * @since 2024-01-15
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { orderService } from '../services/order.service';

interface PaymentStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  checkoutRequestId: string;
  orderId: string;
  amount: number;
  phoneNumber: string;
  onPaymentSuccess: (order: any) => void;
  onPaymentFailed: (error: string) => void;
}

export const PaymentStatusModal: React.FC<PaymentStatusModalProps> = ({
  isOpen,
  onClose,
  checkoutRequestId,
  orderId,
  amount,
  phoneNumber,
  onPaymentSuccess,
  onPaymentFailed
}) => {
  const { getToken } = useAuth();
  const [status, setStatus] = useState<'checking' | 'pending' | 'success' | 'failed' | 'timeout'>('checking');
  const [message, setMessage] = useState('Initiating payment...');
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes timeout
  const [isPolling, setIsPolling] = useState(true);

  useEffect(() => {
    if (!isOpen || !checkoutRequestId) return;

    let pollInterval: NodeJS.Timeout;
    let timeoutInterval: NodeJS.Timeout;

    const pollPaymentStatus = async () => {
      try {
        const token = await getToken();
        const response = await orderService.checkPaymentStatus(checkoutRequestId, token || undefined);
        
        if (response.success) {
          const paymentStatus = response.data?.status || response.data?.resultCode;
          
          if (paymentStatus === 'COMPLETED' || paymentStatus === '0') {
            setStatus('success');
            setMessage('Payment completed successfully!');
            setIsPolling(false);
            
            // Fetch the updated order
            const order = await orderService.getOrder(orderId, token || undefined);
            onPaymentSuccess(order);
            
          } else if (paymentStatus === 'FAILED' || (paymentStatus && paymentStatus !== 'PENDING')) {
            setStatus('failed');
            setMessage(response.data?.resultDesc || 'Payment failed. Please try again.');
            setIsPolling(false);
            onPaymentFailed(response.data?.resultDesc || 'Payment failed');
          } else {
            setStatus('pending');
            setMessage('Waiting for payment confirmation...');
          }
        }
      } catch (error: any) {
        console.error('Error checking payment status:', error);
        // Continue polling unless it's a critical error
        if (error.message.includes('Network error')) {
          setMessage('Checking payment status...');
        }
      }
    };

    // Start polling immediately
    pollPaymentStatus();

    // Set up polling interval
    if (isPolling) {
      pollInterval = setInterval(pollPaymentStatus, 3000); // Poll every 3 seconds
    }

    // Set up timeout countdown
    timeoutInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setStatus('timeout');
          setMessage('Payment timeout. Please try again.');
          setIsPolling(false);
          onPaymentFailed('Payment timeout');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (pollInterval) clearInterval(pollInterval);
      if (timeoutInterval) clearInterval(timeoutInterval);
    };
  }, [isOpen, checkoutRequestId, orderId, isPolling, getToken, onPaymentSuccess, onPaymentFailed]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const maskPhoneNumber = (phone: string) => {
    if (phone.length < 4) return phone;
    return `****${phone.slice(-4)}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center">
          {/* Status Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4">
            {status === 'checking' || status === 'pending' ? (
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            ) : status === 'success' ? (
              <div className="bg-green-100 rounded-full h-16 w-16 flex items-center justify-center">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : (
              <div className="bg-red-100 rounded-full h-16 w-16 flex items-center justify-center">
                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {status === 'checking' && 'Initiating Payment'}
            {status === 'pending' && 'Payment Pending'}
            {status === 'success' && 'Payment Successful'}
            {(status === 'failed' || status === 'timeout') && 'Payment Failed'}
          </h3>

          {/* Message */}
          <p className="text-sm text-gray-600 mb-4">{message}</p>

          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold">{orderService.formatCurrency(amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-mono">{maskPhoneNumber(phoneNumber)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-mono text-xs">{orderId}</span>
              </div>
              {(status === 'pending' || status === 'checking') && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Time left:</span>
                  <span className="font-mono text-orange-600">{formatTime(timeLeft)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          {(status === 'checking' || status === 'pending') && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <div className="text-sm text-blue-800">
                <div className="font-medium mb-1">Complete payment on your phone:</div>
                <div className="text-xs">
                  1. Check your phone for M-Pesa prompt<br/>
                  2. Enter your M-Pesa PIN<br/>
                  3. Confirm the payment
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            {status === 'success' ? (
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Continue
              </button>
            ) : (status === 'failed' || status === 'timeout') ? (
              <>
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel Payment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
