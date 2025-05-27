/**
 * Enhanced Checkout Page with M-Pesa Integration
 * Complete checkout process with M-Pesa B2C refund capabilities
 *
 * @author G20Shop Development Team
 * @version 2.0.0
 * @since 2024-01-15
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useCart } from '../contexts/CartContext';
import { useMpesa } from '../features/mpesa/contexts/MpesaContext';
import { RefundButton } from '../features/mpesa/components/RefundButton';
import { TransactionHistory } from '../features/mpesa/components/TransactionHistory';
import { orderService, OrderData, Order } from '../services/order.service';
import { PaymentStatusModal } from '../components/PaymentStatusModal';

interface OrderSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export const CheckoutPage: React.FC = () => {
  const { isSignedIn, user, getToken } = useAuth();
  const { items = [], totalAmount = 0, clearCart, refreshCart, loading: cartLoading } = useCart();
  const { formatCurrency, error: mpesaError, clearError } = useMpesa();

  // Fallback currency formatter
  const safeCurrencyFormatter = (amount: number) => {
    try {
      return formatCurrency ? formatCurrency(amount) : orderService.formatCurrency(amount);
    } catch (error) {
      return `KES ${amount.toLocaleString()}`;
    }
  };

  const [currentStep, setCurrentStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: user?.fullName || '',
    email: user?.primaryEmailAddress?.emailAddress || '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [processing, setProcessing] = useState(false);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<{
    isProcessing: boolean;
    checkoutRequestId?: string;
    error?: string;
  }>({ isProcessing: false });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [phoneValidation, setPhoneValidation] = useState<{
    isValid: boolean;
    message: string;
  }>({ isValid: true, message: '' });

  // Calculate order summary with safety checks
  const safeItems = Array.isArray(items) ? items : [];
  const safeTotalAmount = typeof totalAmount === 'number' ? totalAmount : 0;

  const orderSummary: OrderSummary = {
    subtotal: safeTotalAmount,
    shipping: safeTotalAmount > 5000 ? 0 : 500, // Free shipping over KES 5,000
    tax: safeTotalAmount * 0.16, // 16% VAT
    total: 0
  };
  orderSummary.total = orderSummary.subtotal + orderSummary.shipping + orderSummary.tax;

  // Clear M-Pesa errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleShippingInfoChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));

    // Validate phone number for M-Pesa if it's the phone field
    if (field === 'phone' && paymentMethod === 'mpesa') {
      const validation = orderService.validateMpesaPhone(value);
      setPhoneValidation(validation);
    }
  };

  const validateShippingInfo = (): boolean => {
    const required = ['fullName', 'email', 'phone', 'address', 'city'];
    const basicValidation = required.every(field => shippingInfo[field as keyof ShippingInfo].trim() !== '');

    // Additional validation for M-Pesa phone number
    if (paymentMethod === 'mpesa') {
      const phoneValidation = orderService.validateMpesaPhone(shippingInfo.phone);
      return basicValidation && phoneValidation.isValid;
    }

    return basicValidation;
  };

  const handlePlaceOrder = async () => {
    if (!validateShippingInfo()) {
      alert('Please fill in all required shipping information');
      return;
    }

    setProcessing(true);
    try {
      const token = await getToken();

      // Prepare order data
      const orderData: OrderData = {
        items: safeItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
          productName: item.product.name,
          productSku: item.product.sku,
          productImage: item.product.imageUrl
        })),
        shippingAddress: {
          fullName: shippingInfo.fullName,
          email: shippingInfo.email,
          phone: shippingInfo.phone,
          address: shippingInfo.address,
          city: shippingInfo.city,
          postalCode: shippingInfo.postalCode,
          country: 'Kenya'
        },
        paymentMethod: paymentMethod as 'mpesa' | 'credit_card' | 'cash_on_delivery',
        subtotal: orderSummary.subtotal,
        tax: orderSummary.tax,
        shippingCost: orderSummary.shipping,
        totalAmount: orderSummary.total
      };

      // Create the order
      const createdOrder = await orderService.createOrder(orderData, token || undefined);
      setOrder(createdOrder);

      // If payment method is M-Pesa, initiate payment
      if (paymentMethod === 'mpesa') {
        const phoneValidation = orderService.validateMpesaPhone(shippingInfo.phone);
        if (!phoneValidation.isValid || !phoneValidation.formatted) {
          throw new Error('Invalid phone number for M-Pesa payment');
        }

        setPaymentStatus({ isProcessing: true });
        setShowPaymentModal(true);

        // Initiate M-Pesa payment
        const paymentResponse = await orderService.initiateMpesaPayment(
          createdOrder.id,
          phoneValidation.formatted,
          orderSummary.total,
          token || undefined
        );

        if (paymentResponse.success && paymentResponse.checkoutRequestId) {
          setPaymentStatus({
            isProcessing: true,
            checkoutRequestId: paymentResponse.checkoutRequestId
          });
        } else {
          throw new Error(paymentResponse.responseDescription || 'Failed to initiate M-Pesa payment');
        }
      } else {
        // For other payment methods, mark as placed
        setOrderPlaced(true);
        await clearCart();
      }

    } catch (error: any) {
      console.error('Error placing order:', error);
      setPaymentStatus({ isProcessing: false, error: error.message });
      alert(`Failed to place order: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentSuccess = async (updatedOrder: Order) => {
    console.log('🎉 Payment successful, updating order state');
    setOrder(updatedOrder);
    setOrderPlaced(true);
    setShowPaymentModal(false);
    // Cart is automatically cleared by the backend after successful M-Pesa payment
    // Refresh cart to reflect the cleared state
    console.log('🔄 Refreshing cart after successful payment');
    await refreshCart();
  };

  const handlePaymentFailed = (error: string) => {
    setPaymentStatus({ isProcessing: false, error });
    setShowPaymentModal(false);
    alert(`Payment failed: ${error}. You can try again or contact support.`);
  };

  const handleRefundSuccess = (result: any) => {
    alert(`Refund initiated successfully! Transaction ID: ${result.data?.transactionId}`);
  };

  const handleRefundError = (error: string) => {
    alert(`Refund failed: ${error}`);
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Please Sign In</h1>
            <p className="text-gray-400">You need to be signed in to access the checkout.</p>
          </div>
        </div>
      </div>
    );
  }

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Loading...</h1>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (orderPlaced && order && order.id) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Order Success */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="text-center mb-8">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
              <p className="text-gray-600">Thank you for your purchase. Your order has been confirmed.</p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Order Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-mono">{order.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-semibold">{safeCurrencyFormatter(orderSummary.total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="capitalize">{order.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status:</span>
                      <span className={`capitalize ${
                        order.paymentStatus === 'paid' ? 'text-green-600' :
                        order.paymentStatus === 'pending' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Date:</span>
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Information</h3>
                  <div className="text-sm text-gray-600">
                    <div>{shippingInfo.fullName || 'N/A'}</div>
                    <div>{shippingInfo.email || 'N/A'}</div>
                    <div>{shippingInfo.phone || 'N/A'}</div>
                    <div>{shippingInfo.address || 'N/A'}</div>
                    <div>{shippingInfo.city || 'N/A'}{shippingInfo.postalCode ? `, ${shippingInfo.postalCode}` : ''}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* M-Pesa Refund Integration */}
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Order Management</h3>
              <div className="flex flex-wrap gap-4">
                {order.id && order.shippingAddress?.phone && (
                  <RefundButton
                    orderId={order.id}
                    orderAmount={order.totalAmount || orderSummary.total}
                    customerPhone={order.shippingAddress.phone}
                    orderDate={new Date(order.createdAt || Date.now())}
                    onRefundSuccess={handleRefundSuccess}
                    onRefundError={handleRefundError}
                    className="bg-red-600 hover:bg-red-700"
                  />
                )}

                <button
                  onClick={() => setShowTransactionHistory(!showTransactionHistory)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  {showTransactionHistory ? 'Hide' : 'View'} Transaction History
                </button>
              </div>

              {/* M-Pesa Error Display */}
              {mpesaError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-red-800">{mpesaError}</span>
                    <button
                      onClick={clearError}
                      className="ml-auto text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Transaction History */}
            {showTransactionHistory && (
              <div className="border-t border-gray-200 pt-6 mt-6">
                <TransactionHistory showFilters={false} pageSize={5} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

        {safeItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some items to your cart before checking out.</p>
            <a
              href="/products"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Continue Shopping
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step Indicator */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`flex items-center ${step < 3 ? 'flex-1' : ''}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          currentStep >= step
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {step}
                      </div>
                      <span className={`ml-2 text-sm ${
                        currentStep >= step ? 'text-blue-600' : 'text-gray-500'
                      }`}>
                        {step === 1 ? 'Shipping' : step === 2 ? 'Payment' : 'Review'}
                      </span>
                      {step < 3 && (
                        <div className={`flex-1 h-0.5 mx-4 ${
                          currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 1: Shipping Information */}
              {currentStep === 1 && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.fullName}
                        onChange={(e) => handleShippingInfoChange('fullName', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => handleShippingInfoChange('email', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number * (for M-Pesa)
                      </label>
                      <input
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) => handleShippingInfoChange('phone', e.target.value)}
                        placeholder="254XXXXXXXXX"
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          !phoneValidation.isValid && shippingInfo.phone ? 'border-red-300' : 'border-gray-300'
                        }`}
                        required
                      />
                      <p className={`text-xs mt-1 ${
                        !phoneValidation.isValid && shippingInfo.phone ? 'text-red-500' : 'text-gray-500'
                      }`}>
                        {!phoneValidation.isValid && shippingInfo.phone
                          ? phoneValidation.message
                          : 'This will be used for M-Pesa payments and refunds'
                        }
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.city}
                        onChange={(e) => handleShippingInfoChange('city', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                      </label>
                      <textarea
                        value={shippingInfo.address}
                        onChange={(e) => handleShippingInfoChange('address', e.target.value)}
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.postalCode}
                        onChange={(e) => handleShippingInfoChange('postalCode', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => setCurrentStep(2)}
                      disabled={!validateShippingInfo()}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Payment Method */}
              {currentStep === 2 && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="mpesa"
                          checked={paymentMethod === 'mpesa'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">M-Pesa</div>
                          <div className="text-sm text-gray-600">
                            Pay securely with M-Pesa mobile money. Refunds will be processed back to your M-Pesa account.
                          </div>
                        </div>
                        <div className="text-green-600 font-semibold">Recommended</div>
                      </label>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4 opacity-50">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="credit_card"
                          checked={paymentMethod === 'credit_card'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mr-3"
                          disabled
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">Credit/Debit Card</div>
                          <div className="text-sm text-gray-600">
                            Pay with Visa, Mastercard, or other major cards. (Coming Soon)
                          </div>
                        </div>
                      </label>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4 opacity-50">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="cash_on_delivery"
                          checked={paymentMethod === 'cash_on_delivery'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mr-3"
                          disabled
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">Cash on Delivery</div>
                          <div className="text-sm text-gray-600">
                            Pay when your order is delivered. (Coming Soon)
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Back to Shipping
                    </button>
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Review Order
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Order Review */}
              {currentStep === 3 && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Review Your Order</h2>

                  {/* Order Items */}
                  <div className="space-y-4 mb-6">
                    {safeItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                        {item.product.imageUrl && (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          {safeCurrencyFormatter(item.product.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Back to Payment
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={processing}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      {processing ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Placing Order...</span>
                        </div>
                      ) : (
                        `Place Order - ${safeCurrencyFormatter(orderSummary.total)}`
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>{safeCurrencyFormatter(orderSummary.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span>{orderSummary.shipping === 0 ? 'Free' : safeCurrencyFormatter(orderSummary.shipping)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (16%):</span>
                    <span>{safeCurrencyFormatter(orderSummary.tax)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total:</span>
                      <span>{safeCurrencyFormatter(orderSummary.total)}</span>
                    </div>
                  </div>
                </div>

                {orderSummary.shipping === 0 && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-green-800">Free shipping applied!</span>
                    </div>
                  </div>
                )}

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <svg className="h-5 w-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-blue-800">
                      <div className="font-medium mb-1">M-Pesa Integration</div>
                      <div>
                        • Secure mobile money payments<br/>
                        • Instant refund processing<br/>
                        • Real-time transaction tracking
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Status Modal */}
        {showPaymentModal && paymentStatus.checkoutRequestId && order && order.id && order.shippingAddress && (
          <PaymentStatusModal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            checkoutRequestId={paymentStatus.checkoutRequestId}
            orderId={order.id}
            amount={order.totalAmount || orderSummary.total}
            phoneNumber={order.shippingAddress.phone || shippingInfo.phone}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentFailed={handlePaymentFailed}
          />
        )}
      </div>
    </div>
  );
};
