import React from 'react';
import { useCart } from '../contexts/CartContext';

export const CartPage: React.FC = () => {
  const { items, totalAmount, loading } = useCart();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">Shopping Cart</h1>
        
        {items.length > 0 ? (
          <div>
            <p className="text-white">Total: ${totalAmount.toFixed(2)}</p>
            <p className="text-gray-400 mt-4">Cart functionality will be implemented here.</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-xl font-semibold text-white mb-2">Your cart is empty</h3>
            <p className="text-gray-400">Add some products to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};
