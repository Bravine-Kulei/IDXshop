/**
 * M-Pesa Feature Index
 * Central export point for all M-Pesa related components and services
 * 
 * @author G20Shop Development Team
 * @version 1.0.0
 * @since 2024-01-15
 */

// Services
export { mpesaService } from './services/mpesa.service';
export type {
  MpesaPaymentRequest,
  MpesaRefundRequest,
  MpesaTransaction,
  MpesaTransactionHistory,
  MpesaValidationResult,
  MpesaAmountValidation
} from './services/mpesa.service';

// Contexts
export { MpesaProvider, useMpesa } from './contexts/MpesaContext';

// Components
export { RefundButton } from './components/RefundButton';
export { TransactionStatus } from './components/TransactionStatus';
export { TransactionHistory } from './components/TransactionHistory';

// Pages
export { MpesaDashboard } from './pages/MpesaDashboard';
