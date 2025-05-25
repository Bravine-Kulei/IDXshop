import React, { useState } from 'react';
import { Award, ChevronDown, ChevronUp, Shield, AlertCircle } from 'lucide-react';

const WarrantyInfo = ({ variant = 'default', className = '', warrantyLength = '1-Year' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Warranty details
  const warrantyDetails = [
    {
      id: 'coverage',
      title: 'Manufacturer Defects',
      description: 'Covers all manufacturing defects and failures during normal use.',
      icon: <Shield className="h-4 w-4 text-green-500 flex-shrink-0" />
    },
    {
      id: 'period',
      title: `${warrantyLength} Coverage`,
      description: `Valid for ${warrantyLength.toLowerCase()} from the date of purchase.`,
      icon: <Shield className="h-4 w-4 text-green-500 flex-shrink-0" />
    },
    {
      id: 'process',
      title: 'Easy Claim Process',
      description: 'Contact our support team to initiate a warranty claim.',
      icon: <Shield className="h-4 w-4 text-green-500 flex-shrink-0" />
    },
    {
      id: 'exclusions',
      title: 'Not Covered',
      description: 'Physical damage, water damage, or improper use not covered.',
      icon: <AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
    }
  ];

  // Compact version for product cards
  if (variant === 'compact') {
    return (
      <div className={`text-sm text-gray-400 ${className}`}>
        <div className="flex items-center">
          <Award className="h-4 w-4 mr-1" />
          <span>{warrantyLength} warranty included</span>
        </div>
      </div>
    );
  }

  // Sidebar version for product pages
  if (variant === 'sidebar') {
    return (
      <div className={`bg-gray-800 rounded-lg p-4 ${className}`}>
        <h3 className="font-medium text-white mb-3 flex items-center">
          <Award className="h-5 w-5 mr-2 text-purple-500" />
          {warrantyLength} Warranty
        </h3>
        <ul className="space-y-2 text-sm">
          {warrantyDetails.slice(0, 3).map(item => (
            <li key={item.id} className="flex items-start">
              {item.icon}
              <span className="ml-2">{item.title}</span>
            </li>
          ))}
        </ul>
        <a href="/warranty" className="text-blue-400 text-sm hover:underline mt-2 inline-block">
          View warranty details
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
          <Award className="h-5 w-5 mr-2 text-purple-500" />
          <span className="font-medium">{warrantyLength} Warranty</span>
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
            All our products come with a manufacturer's warranty to ensure your satisfaction and peace of mind.
          </p>
          <ul className="space-y-2">
            {warrantyDetails.map(item => (
              <li key={item.id} className="flex items-start">
                {item.icon}
                <div className="ml-2">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs text-gray-400">{item.description}</div>
                </div>
              </li>
            ))}
          </ul>
          <div className="text-xs text-gray-400 mt-2">
            For warranty claims or questions, please contact our customer support team.
          </div>
          <a href="/warranty" className="text-blue-400 hover:underline inline-block mt-2">
            View full warranty information
          </a>
        </div>
      )}
    </div>
  );
};

export default WarrantyInfo;
