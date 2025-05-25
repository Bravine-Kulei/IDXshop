import React from 'react';
import { Shield, CreditCard, Truck, RotateCcw, Award, MessageCircle } from 'lucide-react';

const TrustBadges = ({ variant = 'default', className = '' }) => {
  // Different layouts based on where the component is used
  const variants = {
    default: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4',
    footer: 'grid grid-cols-2 sm:grid-cols-3 gap-4',
    sidebar: 'flex flex-col space-y-3',
    compact: 'flex flex-wrap justify-center gap-3',
    productPage: 'grid grid-cols-2 md:grid-cols-3 gap-3'
  };

  const baseItemClass = "flex flex-col items-center text-center p-3 rounded-lg";
  const itemClasses = {
    default: `${baseItemClass} bg-gray-800 hover:bg-gray-700 transition-colors`,
    footer: `${baseItemClass} bg-transparent`,
    sidebar: `${baseItemClass} bg-gray-800 hover:bg-gray-700 transition-colors`,
    compact: `${baseItemClass} bg-transparent`,
    productPage: `${baseItemClass} bg-gray-800 hover:bg-gray-700 transition-colors`
  };

  const badges = [
    {
      id: 'secure',
      icon: <Shield className="h-6 w-6 mb-2 text-green-500" />,
      title: 'Secure Payments',
      description: 'SSL Encrypted Checkout'
    },
    {
      id: 'payment',
      icon: <CreditCard className="h-6 w-6 mb-2 text-blue-500" />,
      title: 'Payment Options',
      description: 'Credit Cards, PayPal, Apple Pay'
    },
    {
      id: 'shipping',
      icon: <Truck className="h-6 w-6 mb-2 text-yellow-500" />,
      title: 'Fast Shipping',
      description: '2-5 Business Days'
    },
    {
      id: 'returns',
      icon: <RotateCcw className="h-6 w-6 mb-2 text-red-500" />,
      title: '30-Day Returns',
      description: 'Hassle-free Refunds'
    },
    {
      id: 'warranty',
      icon: <Award className="h-6 w-6 mb-2 text-purple-500" />,
      title: '1-Year Warranty',
      description: 'On All Products'
    },
    {
      id: 'support',
      icon: <MessageCircle className="h-6 w-6 mb-2 text-teal-500" />,
      title: '24/7 Support',
      description: 'Live Chat & Email'
    }
  ];

  // For compact variant, show fewer badges
  const displayBadges = variant === 'compact' ? badges.slice(0, 4) : badges;

  return (
    <div className={`${variants[variant]} ${className}`}>
      {displayBadges.map(badge => (
        <div key={badge.id} className={itemClasses[variant]}>
          {badge.icon}
          <h3 className="font-medium text-sm">{badge.title}</h3>
          {variant !== 'compact' && (
            <p className="text-xs text-gray-400 mt-1">{badge.description}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default TrustBadges;
