/**
 * M-Pesa Components Frontend Tests
 * Test suite for M-Pesa React components
 * 
 * @author G20Shop Development Team
 * @version 1.0.0
 * @since 2024-01-15
 */

import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RefundButton } from '../../src/features/mpesa/components/RefundButton';
import { TransactionStatus } from '../../src/features/mpesa/components/TransactionStatus';
import { TransactionHistory } from '../../src/features/mpesa/components/TransactionHistory';
import { useMpesa } from '../../src/features/mpesa/contexts/MpesaContext';

// Mock the M-Pesa context
vi.mock('../../src/features/mpesa/contexts/MpesaContext');
const mockUseMpesa = useMpesa as Mock;

describe('M-Pesa Components Frontend Tests', () => {
  const mockMpesaContext = {
    processRefund: vi.fn(),
    canRequestRefund: vi.fn(),
    isWithinRefundPeriod: vi.fn(),
    loading: false,
    formatCurrency: vi.fn((amount) => `KES ${amount.toLocaleString()}`),
    formatPhoneNumber: vi.fn((phone) => phone),
    getTransaction: vi.fn(),
    getStatusColor: vi.fn((status) => `text-${status.toLowerCase()}-500`),
    getStatusIcon: vi.fn((status) => status === 'COMPLETED' ? '✅' : '⏳'),
    transactions: [],
    refreshTransactions: vi.fn(),
    error: null,
    clearError: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseMpesa.mockReturnValue(mockMpesaContext);
  });

  describe('💸 RefundButton Component', () => {
    const defaultProps = {
      orderId: 'ORD_123',
      orderAmount: 1000,
      customerPhone: '254708374149',
      orderDate: new Date(),
      onRefundSuccess: vi.fn(),
      onRefundError: vi.fn()
    };

    it('should render refund button when refund is allowed', () => {
      mockMpesaContext.canRequestRefund.mockReturnValue(true);
      mockMpesaContext.isWithinRefundPeriod.mockReturnValue(true);

      render(<RefundButton {...defaultProps} />);

      expect(screen.getByText('Refund KES 1,000')).toBeInTheDocument();
    });

    it('should show refund period expired message', () => {
      mockMpesaContext.canRequestRefund.mockReturnValue(true);
      mockMpesaContext.isWithinRefundPeriod.mockReturnValue(false);

      render(<RefundButton {...defaultProps} />);

      expect(screen.getByText('Refund period expired (30 days)')).toBeInTheDocument();
      expect(screen.queryByText('Refund KES 1,000')).not.toBeInTheDocument();
    });

    it('should show refund already processed message', () => {
      mockMpesaContext.canRequestRefund.mockReturnValue(false);
      mockMpesaContext.isWithinRefundPeriod.mockReturnValue(true);

      render(<RefundButton {...defaultProps} />);

      expect(screen.getByText('Refund already processed')).toBeInTheDocument();
    });

    it('should open confirmation modal when clicked', async () => {
      mockMpesaContext.canRequestRefund.mockReturnValue(true);
      mockMpesaContext.isWithinRefundPeriod.mockReturnValue(true);

      render(<RefundButton {...defaultProps} />);

      fireEvent.click(screen.getByText('Refund KES 1,000'));

      await waitFor(() => {
        expect(screen.getByText('Confirm Refund')).toBeInTheDocument();
        expect(screen.getByText('ORD_123')).toBeInTheDocument();
        expect(screen.getByText('254708374149')).toBeInTheDocument();
      });
    });

    it('should require refund reason', async () => {
      mockMpesaContext.canRequestRefund.mockReturnValue(true);
      mockMpesaContext.isWithinRefundPeriod.mockReturnValue(true);

      render(<RefundButton {...defaultProps} />);

      fireEvent.click(screen.getByText('Refund KES 1,000'));

      await waitFor(() => {
        expect(screen.getByText('Confirm Refund')).toBeInTheDocument();
      });

      const confirmButton = screen.getByText('Confirm Refund');
      expect(confirmButton).toBeDisabled();
    });

    it('should process refund with reason', async () => {
      const user = userEvent.setup();
      mockMpesaContext.canRequestRefund.mockReturnValue(true);
      mockMpesaContext.isWithinRefundPeriod.mockReturnValue(true);
      mockMpesaContext.processRefund.mockResolvedValue({ success: true });

      render(<RefundButton {...defaultProps} />);

      // Open modal
      fireEvent.click(screen.getByText('Refund KES 1,000'));

      await waitFor(() => {
        expect(screen.getByText('Confirm Refund')).toBeInTheDocument();
      });

      // Enter reason
      const reasonTextarea = screen.getByPlaceholderText('Please provide a reason for this refund...');
      await user.type(reasonTextarea, 'Customer request');

      // Confirm refund
      const confirmButton = screen.getByText('Confirm Refund');
      expect(confirmButton).not.toBeDisabled();
      
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(mockMpesaContext.processRefund).toHaveBeenCalledWith(
          'ORD_123',
          '254708374149',
          1000,
          'Customer request'
        );
      });

      expect(defaultProps.onRefundSuccess).toHaveBeenCalled();
    });

    it('should handle refund errors', async () => {
      const user = userEvent.setup();
      mockMpesaContext.canRequestRefund.mockReturnValue(true);
      mockMpesaContext.isWithinRefundPeriod.mockReturnValue(true);
      mockMpesaContext.processRefund.mockRejectedValue(new Error('Refund failed'));

      render(<RefundButton {...defaultProps} />);

      // Open modal and process refund
      fireEvent.click(screen.getByText('Refund KES 1,000'));

      await waitFor(() => {
        expect(screen.getByText('Confirm Refund')).toBeInTheDocument();
      });

      const reasonTextarea = screen.getByPlaceholderText('Please provide a reason for this refund...');
      await user.type(reasonTextarea, 'Test reason');

      fireEvent.click(screen.getByText('Confirm Refund'));

      await waitFor(() => {
        expect(defaultProps.onRefundError).toHaveBeenCalledWith('Refund failed');
      });
    });

    it('should show processing state', async () => {
      const user = userEvent.setup();
      mockMpesaContext.canRequestRefund.mockReturnValue(true);
      mockMpesaContext.isWithinRefundPeriod.mockReturnValue(true);
      
      let resolveRefund: (value: any) => void;
      const refundPromise = new Promise(resolve => {
        resolveRefund = resolve;
      });
      mockMpesaContext.processRefund.mockReturnValue(refundPromise);

      render(<RefundButton {...defaultProps} />);

      fireEvent.click(screen.getByText('Refund KES 1,000'));

      await waitFor(() => {
        expect(screen.getByText('Confirm Refund')).toBeInTheDocument();
      });

      const reasonTextarea = screen.getByPlaceholderText('Please provide a reason for this refund...');
      await user.type(reasonTextarea, 'Test reason');

      fireEvent.click(screen.getByText('Confirm Refund'));

      await waitFor(() => {
        expect(screen.getByText('Processing...')).toBeInTheDocument();
      });

      // Resolve the promise
      resolveRefund({ success: true });

      await waitFor(() => {
        expect(screen.queryByText('Processing...')).not.toBeInTheDocument();
      });
    });
  });

  describe('📊 TransactionStatus Component', () => {
    const mockTransaction = {
      id: 'txn_123',
      conversationId: 'conv_123',
      amount: '1000.00',
      type: 'REFUND',
      typeDescription: 'Refund Payment',
      status: 'COMPLETED',
      statusDescription: 'Transaction completed successfully',
      remarks: 'Customer refund',
      receiptNumber: 'MPE123456789',
      initiatedAt: '2024-01-15T10:00:00Z',
      completedAt: '2024-01-15T10:02:30Z',
      duration: 150
    };

    it('should display transaction status', async () => {
      mockMpesaContext.getTransaction.mockResolvedValue(mockTransaction);

      render(<TransactionStatus transactionId="txn_123" />);

      await waitFor(() => {
        expect(screen.getByText('Transaction completed successfully')).toBeInTheDocument();
        expect(screen.getByText('1000.00')).toBeInTheDocument();
        expect(screen.getByText('Refund Payment')).toBeInTheDocument();
      });
    });

    it('should show receipt number for completed transactions', async () => {
      mockMpesaContext.getTransaction.mockResolvedValue(mockTransaction);

      render(<TransactionStatus transactionId="txn_123" />);

      await waitFor(() => {
        expect(screen.getByText('Transaction Completed')).toBeInTheDocument();
        expect(screen.getByText('Receipt: MPE123456789')).toBeInTheDocument();
      });
    });

    it('should show detailed information when requested', async () => {
      mockMpesaContext.getTransaction.mockResolvedValue(mockTransaction);

      render(<TransactionStatus transactionId="txn_123" showDetails={true} />);

      await waitFor(() => {
        expect(screen.getByText('Transaction Details')).toBeInTheDocument();
        expect(screen.getByText('txn_123')).toBeInTheDocument();
        expect(screen.getByText('conv_123')).toBeInTheDocument();
        expect(screen.getByText('150 seconds')).toBeInTheDocument();
      });
    });

    it('should show pending status with processing message', async () => {
      const pendingTransaction = {
        ...mockTransaction,
        status: 'PENDING',
        statusDescription: 'Transaction pending',
        receiptNumber: undefined,
        completedAt: undefined
      };

      mockMpesaContext.getTransaction.mockResolvedValue(pendingTransaction);

      render(<TransactionStatus transactionId="txn_123" />);

      await waitFor(() => {
        expect(screen.getByText('Processing Transaction')).toBeInTheDocument();
        expect(screen.getByText(/Please wait while we process/)).toBeInTheDocument();
      });
    });

    it('should show error message for failed transactions', async () => {
      const failedTransaction = {
        ...mockTransaction,
        status: 'FAILED',
        statusDescription: 'Transaction failed',
        resultDescription: 'Insufficient funds'
      };

      mockMpesaContext.getTransaction.mockResolvedValue(failedTransaction);

      render(<TransactionStatus transactionId="txn_123" />);

      await waitFor(() => {
        expect(screen.getByText('Transaction Failed')).toBeInTheDocument();
        expect(screen.getByText('Insufficient funds')).toBeInTheDocument();
      });
    });

    it('should auto-refresh for pending transactions', async () => {
      const pendingTransaction = {
        ...mockTransaction,
        status: 'PENDING',
        statusDescription: 'Transaction pending'
      };

      mockMpesaContext.getTransaction.mockResolvedValue(pendingTransaction);

      render(<TransactionStatus transactionId="txn_123" autoRefresh={true} refreshInterval={1} />);

      await waitFor(() => {
        expect(mockMpesaContext.getTransaction).toHaveBeenCalledWith('txn_123');
      });

      // Wait for auto-refresh
      await waitFor(() => {
        expect(mockMpesaContext.getTransaction).toHaveBeenCalledTimes(2);
      }, { timeout: 2000 });
    });
  });

  describe('📋 TransactionHistory Component', () => {
    const mockTransactions = [
      {
        id: 'txn_1',
        amount: '1000.00',
        status: 'COMPLETED',
        statusDescription: 'Completed',
        type: 'REFUND',
        typeDescription: 'Refund Payment',
        initiatedAt: '2024-01-15T10:00:00Z',
        receiptNumber: 'MPE123456789',
        remarks: 'Customer refund'
      },
      {
        id: 'txn_2',
        amount: '500.00',
        status: 'PENDING',
        statusDescription: 'Pending',
        type: 'GENERAL',
        typeDescription: 'General Payment',
        initiatedAt: '2024-01-14T15:30:00Z',
        remarks: 'Test payment'
      }
    ];

    beforeEach(() => {
      mockMpesaContext.transactions = mockTransactions;
    });

    it('should display transaction history', () => {
      render(<TransactionHistory />);

      expect(screen.getByText('M-Pesa Transaction History')).toBeInTheDocument();
      expect(screen.getByText('1000.00')).toBeInTheDocument();
      expect(screen.getByText('500.00')).toBeInTheDocument();
      expect(screen.getByText('Refund Payment')).toBeInTheDocument();
      expect(screen.getByText('General Payment')).toBeInTheDocument();
    });

    it('should show filters when enabled', () => {
      render(<TransactionHistory showFilters={true} />);

      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Type')).toBeInTheDocument();
      expect(screen.getByDisplayValue('All Statuses')).toBeInTheDocument();
      expect(screen.getByDisplayValue('All Types')).toBeInTheDocument();
    });

    it('should filter transactions by status', () => {
      render(<TransactionHistory showFilters={true} />);

      const statusFilter = screen.getByDisplayValue('All Statuses');
      fireEvent.change(statusFilter, { target: { value: 'COMPLETED' } });

      // Should only show completed transactions
      expect(screen.getByText('1000.00')).toBeInTheDocument();
      expect(screen.queryByText('500.00')).not.toBeInTheDocument();
    });

    it('should filter transactions by type', () => {
      render(<TransactionHistory showFilters={true} />);

      const typeFilter = screen.getByDisplayValue('All Types');
      fireEvent.change(typeFilter, { target: { value: 'REFUND' } });

      // Should only show refund transactions
      expect(screen.getByText('Refund Payment')).toBeInTheDocument();
      expect(screen.queryByText('General Payment')).not.toBeInTheDocument();
    });

    it('should clear filters', () => {
      render(<TransactionHistory showFilters={true} />);

      const statusFilter = screen.getByDisplayValue('All Statuses');
      fireEvent.change(statusFilter, { target: { value: 'COMPLETED' } });

      const clearButton = screen.getByText('Clear Filters');
      fireEvent.click(clearButton);

      expect(statusFilter).toHaveValue('');
    });

    it('should show transaction details on click', () => {
      render(<TransactionHistory />);

      const viewDetailsButton = screen.getAllByText('View Details')[0];
      fireEvent.click(viewDetailsButton);

      expect(screen.getByText('Hide Details')).toBeInTheDocument();
    });

    it('should handle pagination', () => {
      const manyTransactions = Array.from({ length: 25 }, (_, i) => ({
        id: `txn_${i}`,
        amount: '100.00',
        status: 'COMPLETED',
        statusDescription: 'Completed',
        type: 'GENERAL',
        typeDescription: 'General Payment',
        initiatedAt: '2024-01-15T10:00:00Z',
        remarks: `Transaction ${i}`
      }));

      mockMpesaContext.transactions = manyTransactions;

      render(<TransactionHistory pageSize={10} />);

      expect(screen.getByText('Showing 1 to 10 of 25 transactions')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
      expect(screen.getByText('Previous')).toBeInTheDocument();
    });

    it('should show empty state when no transactions', () => {
      mockMpesaContext.transactions = [];

      render(<TransactionHistory />);

      expect(screen.getByText('No transactions found')).toBeInTheDocument();
    });

    it('should show loading state', () => {
      mockMpesaContext.loading = true;

      render(<TransactionHistory />);

      expect(screen.getByText('Loading transactions...')).toBeInTheDocument();
    });

    it('should show error state', () => {
      mockMpesaContext.error = 'Failed to load transactions';

      render(<TransactionHistory />);

      expect(screen.getByText('Failed to load transactions')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    it('should refresh transactions on error retry', () => {
      mockMpesaContext.error = 'Failed to load transactions';

      render(<TransactionHistory />);

      const retryButton = screen.getByText('Try Again');
      fireEvent.click(retryButton);

      expect(mockMpesaContext.refreshTransactions).toHaveBeenCalled();
    });
  });
});
