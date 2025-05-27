/**
 * M-Pesa Context Frontend Tests
 * Test suite for M-Pesa React context and state management
 * 
 * @author G20Shop Development Team
 * @version 1.0.0
 * @since 2024-01-15
 */

import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { useAuth } from '@clerk/clerk-react';
import { MpesaProvider, useMpesa } from '../../src/features/mpesa/contexts/MpesaContext';
import { mpesaService } from '../../src/features/mpesa/services/mpesa.service';

// Mock dependencies
vi.mock('@clerk/clerk-react');
vi.mock('../../src/features/mpesa/services/mpesa.service');

const mockUseAuth = useAuth as Mock;
const mockMpesaService = mpesaService as {
  getMyTransactions: Mock;
  getMyRefunds: Mock;
  processRefund: Mock;
  getTransaction: Mock;
  validatePhoneNumber: Mock;
  validateAmount: Mock;
  calculateFee: Mock;
  formatCurrency: Mock;
  formatPhoneNumber: Mock;
  maskPhoneNumber: Mock;
  getStatusColor: Mock;
  getStatusIcon: Mock;
};

// Test component to access context
const TestComponent = () => {
  const mpesa = useMpesa();
  
  return (
    <div>
      <div data-testid="loading">{mpesa.loading ? 'loading' : 'not-loading'}</div>
      <div data-testid="error">{mpesa.error || 'no-error'}</div>
      <div data-testid="transactions-count">{mpesa.transactions.length}</div>
      <div data-testid="refunds-count">{mpesa.refunds.length}</div>
      <button 
        data-testid="refresh-transactions" 
        onClick={mpesa.refreshTransactions}
      >
        Refresh
      </button>
      <button 
        data-testid="process-refund" 
        onClick={() => mpesa.processRefund('ORD_123', '254708374149', 1000, 'Test')}
      >
        Process Refund
      </button>
    </div>
  );
};

describe('M-Pesa Context Frontend Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock setup
    mockUseAuth.mockReturnValue({
      isSignedIn: true,
      getToken: vi.fn().mockResolvedValue('test-token')
    });
    
    mockMpesaService.getMyTransactions.mockResolvedValue({
      transactions: [],
      pagination: { total: 0, page: 1, limit: 10, totalPages: 0 }
    });
    
    mockMpesaService.getMyRefunds.mockResolvedValue({
      refunds: []
    });
    
    mockMpesaService.formatCurrency.mockImplementation((amount) => `KES ${amount.toLocaleString()}`);
    mockMpesaService.formatPhoneNumber.mockImplementation((phone) => phone);
    mockMpesaService.maskPhoneNumber.mockImplementation((phone) => `****${phone.slice(-4)}`);
    mockMpesaService.getStatusColor.mockImplementation((status) => `text-${status.toLowerCase()}-500`);
    mockMpesaService.getStatusIcon.mockImplementation((status) => status === 'COMPLETED' ? '✅' : '⏳');
  });

  describe('🔐 Authentication Integration', () => {
    it('should load data when user is signed in', async () => {
      const mockTransactions = [
        { id: 'txn_1', amount: '1000.00', status: 'COMPLETED' },
        { id: 'txn_2', amount: '500.00', status: 'PENDING' }
      ];
      
      mockMpesaService.getMyTransactions.mockResolvedValue({
        transactions: mockTransactions,
        pagination: { total: 2, page: 1, limit: 10, totalPages: 1 }
      });

      render(
        <MpesaProvider>
          <TestComponent />
        </MpesaProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('transactions-count')).toHaveTextContent('2');
      });

      expect(mockMpesaService.getMyTransactions).toHaveBeenCalledWith({}, 'test-token');
      expect(mockMpesaService.getMyRefunds).toHaveBeenCalledWith({}, 'test-token');
    });

    it('should clear data when user is not signed in', async () => {
      mockUseAuth.mockReturnValue({
        isSignedIn: false,
        getToken: vi.fn()
      });

      render(
        <MpesaProvider>
          <TestComponent />
        </MpesaProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('transactions-count')).toHaveTextContent('0');
        expect(screen.getByTestId('refunds-count')).toHaveTextContent('0');
      });

      expect(mockMpesaService.getMyTransactions).not.toHaveBeenCalled();
    });

    it('should handle missing token gracefully', async () => {
      mockUseAuth.mockReturnValue({
        isSignedIn: true,
        getToken: vi.fn().mockResolvedValue(null)
      });

      render(
        <MpesaProvider>
          <TestComponent />
        </MpesaProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });

      expect(mockMpesaService.getMyTransactions).not.toHaveBeenCalled();
    });
  });

  describe('📊 Data Management', () => {
    it('should refresh transactions on demand', async () => {
      const mockTransactions = [
        { id: 'txn_1', amount: '1000.00', status: 'COMPLETED' }
      ];
      
      mockMpesaService.getMyTransactions.mockResolvedValue({
        transactions: mockTransactions,
        pagination: { total: 1, page: 1, limit: 10, totalPages: 1 }
      });

      render(
        <MpesaProvider>
          <TestComponent />
        </MpesaProvider>
      );

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByTestId('transactions-count')).toHaveTextContent('1');
      });

      // Clear mock and set new data
      mockMpesaService.getMyTransactions.mockClear();
      mockMpesaService.getMyTransactions.mockResolvedValue({
        transactions: [...mockTransactions, { id: 'txn_2', amount: '500.00', status: 'PENDING' }],
        pagination: { total: 2, page: 1, limit: 10, totalPages: 1 }
      });

      // Trigger refresh
      act(() => {
        screen.getByTestId('refresh-transactions').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('transactions-count')).toHaveTextContent('2');
      });

      expect(mockMpesaService.getMyTransactions).toHaveBeenCalledTimes(1);
    });

    it('should handle loading states correctly', async () => {
      let resolveTransactions: (value: any) => void;
      const transactionsPromise = new Promise(resolve => {
        resolveTransactions = resolve;
      });
      
      mockMpesaService.getMyTransactions.mockReturnValue(transactionsPromise);

      render(
        <MpesaProvider>
          <TestComponent />
        </MpesaProvider>
      );

      // Should be loading initially
      expect(screen.getByTestId('loading')).toHaveTextContent('loading');

      // Resolve the promise
      act(() => {
        resolveTransactions({
          transactions: [],
          pagination: { total: 0, page: 1, limit: 10, totalPages: 0 }
        });
      });

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });
    });

    it('should handle errors properly', async () => {
      const errorMessage = 'Failed to fetch transactions';
      mockMpesaService.getMyTransactions.mockRejectedValue(new Error(errorMessage));

      render(
        <MpesaProvider>
          <TestComponent />
        </MpesaProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent(errorMessage);
      });
    });
  });

  describe('💸 Refund Processing', () => {
    it('should process refund successfully', async () => {
      const mockRefundResult = {
        data: {
          transactionId: 'txn_refund_123',
          status: 'SUBMITTED'
        }
      };
      
      mockMpesaService.processRefund.mockResolvedValue(mockRefundResult);

      render(
        <MpesaProvider>
          <TestComponent />
        </MpesaProvider>
      );

      act(() => {
        screen.getByTestId('process-refund').click();
      });

      await waitFor(() => {
        expect(mockMpesaService.processRefund).toHaveBeenCalledWith(
          {
            orderId: 'ORD_123',
            phoneNumber: '254708374149',
            amount: 1000,
            reason: 'Test'
          },
          'test-token'
        );
      });

      // Should refresh data after successful refund
      expect(mockMpesaService.getMyTransactions).toHaveBeenCalled();
      expect(mockMpesaService.getMyRefunds).toHaveBeenCalled();
    });

    it('should handle refund errors', async () => {
      const errorMessage = 'Refund already processed';
      mockMpesaService.processRefund.mockRejectedValue(new Error(errorMessage));

      render(
        <MpesaProvider>
          <TestComponent />
        </MpesaProvider>
      );

      act(() => {
        screen.getByTestId('process-refund').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent(errorMessage);
      });
    });

    it('should require authentication for refunds', async () => {
      mockUseAuth.mockReturnValue({
        isSignedIn: false,
        getToken: vi.fn()
      });

      render(
        <MpesaProvider>
          <TestComponent />
        </MpesaProvider>
      );

      act(() => {
        screen.getByTestId('process-refund').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Please sign in to process refunds');
      });

      expect(mockMpesaService.processRefund).not.toHaveBeenCalled();
    });
  });

  describe('✅ Validation Functions', () => {
    it('should provide validation functions', async () => {
      const TestValidationComponent = () => {
        const { validatePhoneNumber, validateAmount, calculateFee } = useMpesa();
        
        return (
          <div>
            <button 
              data-testid="validate-phone" 
              onClick={() => validatePhoneNumber('254708374149')}
            >
              Validate Phone
            </button>
            <button 
              data-testid="validate-amount" 
              onClick={() => validateAmount(1000)}
            >
              Validate Amount
            </button>
            <button 
              data-testid="calculate-fee" 
              onClick={() => calculateFee(1000)}
            >
              Calculate Fee
            </button>
          </div>
        );
      };

      mockMpesaService.validatePhoneNumber.mockResolvedValue({ isValid: true });
      mockMpesaService.validateAmount.mockResolvedValue({ isValid: true });
      mockMpesaService.calculateFee.mockResolvedValue({ fee: 15 });

      render(
        <MpesaProvider>
          <TestValidationComponent />
        </MpesaProvider>
      );

      act(() => {
        screen.getByTestId('validate-phone').click();
        screen.getByTestId('validate-amount').click();
        screen.getByTestId('calculate-fee').click();
      });

      await waitFor(() => {
        expect(mockMpesaService.validatePhoneNumber).toHaveBeenCalledWith('254708374149');
        expect(mockMpesaService.validateAmount).toHaveBeenCalledWith(1000, undefined);
        expect(mockMpesaService.calculateFee).toHaveBeenCalledWith(1000);
      });
    });
  });

  describe('🎨 Utility Functions', () => {
    it('should provide utility functions', () => {
      const TestUtilityComponent = () => {
        const { 
          formatCurrency, 
          formatPhoneNumber, 
          maskPhoneNumber, 
          getStatusColor, 
          getStatusIcon 
        } = useMpesa();
        
        return (
          <div>
            <div data-testid="formatted-currency">{formatCurrency(1000)}</div>
            <div data-testid="formatted-phone">{formatPhoneNumber('0708374149')}</div>
            <div data-testid="masked-phone">{maskPhoneNumber('254708374149')}</div>
            <div data-testid="status-color">{getStatusColor('COMPLETED')}</div>
            <div data-testid="status-icon">{getStatusIcon('COMPLETED')}</div>
          </div>
        );
      };

      render(
        <MpesaProvider>
          <TestUtilityComponent />
        </MpesaProvider>
      );

      expect(screen.getByTestId('formatted-currency')).toHaveTextContent('KES 1,000');
      expect(screen.getByTestId('formatted-phone')).toHaveTextContent('0708374149');
      expect(screen.getByTestId('masked-phone')).toHaveTextContent('****4149');
      expect(screen.getByTestId('status-color')).toHaveTextContent('text-completed-500');
      expect(screen.getByTestId('status-icon')).toHaveTextContent('✅');
    });
  });

  describe('🏪 Business Logic', () => {
    it('should check refund eligibility correctly', () => {
      const TestBusinessLogicComponent = () => {
        const { canRequestRefund, isWithinRefundPeriod } = useMpesa();
        
        const orderDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000); // 10 days ago
        const oldOrderDate = new Date(Date.now() - 40 * 24 * 60 * 60 * 1000); // 40 days ago
        
        return (
          <div>
            <div data-testid="can-refund">{canRequestRefund('ORD_123') ? 'yes' : 'no'}</div>
            <div data-testid="within-period">{isWithinRefundPeriod(orderDate) ? 'yes' : 'no'}</div>
            <div data-testid="outside-period">{isWithinRefundPeriod(oldOrderDate) ? 'yes' : 'no'}</div>
          </div>
        );
      };

      render(
        <MpesaProvider>
          <TestBusinessLogicComponent />
        </MpesaProvider>
      );

      expect(screen.getByTestId('can-refund')).toHaveTextContent('yes');
      expect(screen.getByTestId('within-period')).toHaveTextContent('yes');
      expect(screen.getByTestId('outside-period')).toHaveTextContent('no');
    });

    it('should prevent refund for existing refund requests', async () => {
      const mockRefunds = [
        {
          id: 'ref_1',
          orderId: 'ORD_123',
          status: 'PENDING'
        }
      ];
      
      mockMpesaService.getMyRefunds.mockResolvedValue({
        refunds: mockRefunds
      });

      const TestRefundCheckComponent = () => {
        const { canRequestRefund, refunds } = useMpesa();
        
        return (
          <div>
            <div data-testid="refunds-loaded">{refunds.length > 0 ? 'yes' : 'no'}</div>
            <div data-testid="can-refund-existing">{canRequestRefund('ORD_123') ? 'yes' : 'no'}</div>
            <div data-testid="can-refund-new">{canRequestRefund('ORD_456') ? 'yes' : 'no'}</div>
          </div>
        );
      };

      render(
        <MpesaProvider>
          <TestRefundCheckComponent />
        </MpesaProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('refunds-loaded')).toHaveTextContent('yes');
        expect(screen.getByTestId('can-refund-existing')).toHaveTextContent('no');
        expect(screen.getByTestId('can-refund-new')).toHaveTextContent('yes');
      });
    });
  });

  describe('🚫 Error Handling', () => {
    it('should provide error clearing functionality', async () => {
      const TestErrorComponent = () => {
        const { error, clearError } = useMpesa();
        
        return (
          <div>
            <div data-testid="error-state">{error || 'no-error'}</div>
            <button data-testid="clear-error" onClick={clearError}>
              Clear Error
            </button>
          </div>
        );
      };

      mockMpesaService.getMyTransactions.mockRejectedValue(new Error('Test error'));

      render(
        <MpesaProvider>
          <TestErrorComponent />
        </MpesaProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('error-state')).toHaveTextContent('Test error');
      });

      act(() => {
        screen.getByTestId('clear-error').click();
      });

      expect(screen.getByTestId('error-state')).toHaveTextContent('no-error');
    });
  });

  describe('🔄 Context Provider', () => {
    it('should throw error when used outside provider', () => {
      const TestComponentWithoutProvider = () => {
        try {
          useMpesa();
          return <div>Should not render</div>;
        } catch (error) {
          return <div data-testid="error">Error caught</div>;
        }
      };

      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => render(<TestComponentWithoutProvider />)).toThrow();

      consoleSpy.mockRestore();
    });
  });
});
