import React, { useState } from 'react';
import { CreditCard, ChevronDown, ChevronUp, Lock } from 'lucide-react';

const PaymentOptions = ({ variant = 'default', className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Payment method icons (in a real app, these would be actual images)
  const paymentMethods = [
    { id: 'visa', name: 'Visa', icon: 'VISA' },
    { id: 'mastercard', name: 'Mastercard', icon: 'MC' },
    { id: 'amex', name: 'American Express', icon: 'AMEX' },
    { id: 'paypal', name: 'PayPal', icon: 'PP' },
    { id: 'applepay', name: 'Apple Pay', icon: 'AP' },
    { id: 'googlepay', name: 'Google Pay', icon: 'GP' }
  ];

  // Compact version for product cards
  if (variant === 'compact') {
    return (
      <div className={`text-sm text-gray-400 ${className}`}>
        <div className="flex items-center">
          <CreditCard className="h-4 w-4 mr-1" />
          <span>Multiple payment options</span>
        </div>
      </div>
    );
  }

  // Sidebar version for product pages
  if (variant === 'sidebar') {
    return (
      <div className={`bg-gray-800 rounded-lg p-4 ${className}`}>
        <h3 className="font-medium text-white mb-3 flex items-center">
          <CreditCard className="h-5 w-5 mr-2 text-blue-500" />
          Payment Options
        </h3>
        <div className="flex flex-wrap gap-2">
          {paymentMethods.map(method => (
            <div 
              key={method.id} 
              className="bg-gray-700 text-white text-xs font-bold px-2 py-1 rounded"
              title={method.name}
            >
              {method.icon}
            </div>
          ))}
        </div>
        <div className="flex items-center mt-3 text-xs text-gray-400">
          <Lock className="h-3 w-3 mr-1" />
          <span>Secure, encrypted payments</span>
        </div>
      </div>
    );
  }

  // Footer version
  if (variant === 'footer') {
    return (
      <div className={className}>
        <h3 className="font-medium text-white mb-2">Payment Methods</h3>
        <div className="flex flex-wrap gap-2">
          {paymentMethods.map(method => (
            <div 
              key={method.id} 
              className="bg-gray-700 text-white text-xs font-bold px-2 py-1 rounded"
              title={method.name}
            >
              {method.icon}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default expandable version for product pages
  return (
    <div className={`border-t border-gray-700 ${className}`}>
      <button
        onClick={toggleExpand}
        className="flex justify-between items-center w-full py-4 text-left"
      >
        <div className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2 text-blue-500" />
          <span className="font-medium">Payment Options</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>
      
      {isExpanded && (
        <div className="pb-4 text-sm text-gray-300">
          <p className="mb-3">
            We accept a variety of payment methods to make your shopping experience convenient and secure.
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {paymentMethods.map(method => (
              <div 
                key={method.id} 
                className="bg-gray-700 text-white px-3 py-1 rounded"
                title={method.name}
              >
                {method.icon}
              </div>
            ))}
          </div>
          <div className="flex items-center text-xs text-gray-400 mt-3">
            <Lock className="h-3 w-3 mr-1" />
            <span>All payments are secure and encrypted using industry-standard SSL technology.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentOptions;
