import React, { useState } from 'react';
import { Truck, ChevronDown, ChevronUp, Globe, Clock } from 'lucide-react';

const ShippingInfo = ({ variant = 'default', className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Different shipping options
  const shippingOptions = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      price: 'Free',
      time: '5-7 Business Days',
      icon: <Truck className="h-5 w-5 text-blue-500" />
    },
    {
      id: 'express',
      name: 'Express Shipping',
      price: '$9.99',
      time: '2-3 Business Days',
      icon: <Clock className="h-5 w-5 text-yellow-500" />
    },
    {
      id: 'international',
      name: 'International Shipping',
      price: 'From $19.99',
      time: '7-14 Business Days',
      icon: <Globe className="h-5 w-5 text-green-500" />
    }
  ];

  // Compact version for product cards
  if (variant === 'compact') {
    return (
      <div className={`text-sm text-gray-400 ${className}`}>
        <div className="flex items-center">
          <Truck className="h-4 w-4 mr-1" />
          <span>Free shipping available</span>
        </div>
      </div>
    );
  }

  // Sidebar version for product pages
  if (variant === 'sidebar') {
    return (
      <div className={`bg-gray-800 rounded-lg p-4 ${className}`}>
        <h3 className="font-medium text-white mb-3 flex items-center">
          <Truck className="h-5 w-5 mr-2 text-blue-500" />
          Shipping Information
        </h3>
        <ul className="space-y-2 text-sm">
          {shippingOptions.map(option => (
            <li key={option.id} className="flex justify-between items-center">
              <div className="flex items-center">
                {option.icon}
                <span className="ml-2">{option.name}</span>
              </div>
              <div className="text-right">
                <div className="font-medium">{option.price}</div>
                <div className="text-xs text-gray-400">{option.time}</div>
              </div>
            </li>
          ))}
        </ul>
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
          <Truck className="h-5 w-5 mr-2 text-blue-500" />
          <span className="font-medium">Shipping Information</span>
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
            We offer multiple shipping options to meet your needs. All orders are processed within 24 hours on business days.
          </p>
          <ul className="space-y-2">
            {shippingOptions.map(option => (
              <li key={option.id} className="flex justify-between items-center">
                <div className="flex items-center">
                  {option.icon}
                  <span className="ml-2">{option.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">{option.price}</div>
                  <div className="text-xs text-gray-400">{option.time}</div>
                </div>
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-400 mt-2">
            Shipping times are estimates and are not guaranteed. Delivery times may vary based on location and other factors.
          </p>
        </div>
      )}
    </div>
  );
};

export default ShippingInfo;
