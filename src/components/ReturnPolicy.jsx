import React, { useState } from 'react';
import { RotateCcw, ChevronDown, ChevronUp, CheckCircle, XCircle } from 'lucide-react';

const ReturnPolicy = ({ variant = 'default', className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Return policy details
  const policyDetails = [
    {
      id: 'timeframe',
      title: '30-Day Return Window',
      description: 'Return any item within 30 days of delivery for a full refund.',
      icon: <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
    },
    {
      id: 'condition',
      title: 'Unopened Products',
      description: 'Items must be in original packaging and unused condition.',
      icon: <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
    },
    {
      id: 'process',
      title: 'Easy Return Process',
      description: 'Start your return online and print a prepaid shipping label.',
      icon: <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
    },
    {
      id: 'exceptions',
      title: 'Some Exceptions Apply',
      description: 'Special order items and certain electronics may have different policies.',
      icon: <XCircle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
    }
  ];

  // Compact version for product cards
  if (variant === 'compact') {
    return (
      <div className={`text-sm text-gray-400 ${className}`}>
        <div className="flex items-center">
          <RotateCcw className="h-4 w-4 mr-1" />
          <span>30-day hassle-free returns</span>
        </div>
      </div>
    );
  }

  // Sidebar version for product pages
  if (variant === 'sidebar') {
    return (
      <div className={`bg-gray-800 rounded-lg p-4 ${className}`}>
        <h3 className="font-medium text-white mb-3 flex items-center">
          <RotateCcw className="h-5 w-5 mr-2 text-red-500" />
          Return Policy
        </h3>
        <ul className="space-y-2 text-sm">
          {policyDetails.map(item => (
            <li key={item.id} className="flex items-start">
              {item.icon}
              <span className="ml-2">{item.title}</span>
            </li>
          ))}
        </ul>
        <a href="/returns" className="text-blue-400 text-sm hover:underline mt-2 inline-block">
          View full return policy
        </a>
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
          <RotateCcw className="h-5 w-5 mr-2 text-red-500" />
          <span className="font-medium">Return Policy</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>
      
      {isExpanded && (
        <div className="pb-4 text-sm text-gray-300 space-y-3">
          <p>
            We stand behind our products and want you to be completely satisfied with your purchase.
          </p>
          <ul className="space-y-2">
            {policyDetails.map(item => (
              <li key={item.id} className="flex items-start">
                {item.icon}
                <div className="ml-2">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs text-gray-400">{item.description}</div>
                </div>
              </li>
            ))}
          </ul>
          <a href="/returns" className="text-blue-400 hover:underline inline-block mt-2">
            View full return policy
          </a>
        </div>
      )}
    </div>
  );
};

export default ReturnPolicy;
