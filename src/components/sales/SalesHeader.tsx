import React from 'react';
import { TrendingUp, DollarSign, Users, ShoppingCart } from 'lucide-react';

export const SalesHeader: React.FC = () => {
  return (
    <div className="mb-8">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          Sales Dashboard
        </h1>
        <p className="text-gray-400">
          Manage customers, orders, and track sales performance
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Today's Sales</p>
              <p className="text-white text-2xl font-bold">$2,450</p>
              <p className="text-green-400 text-sm">+12% from yesterday</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">New Customers</p>
              <p className="text-white text-2xl font-bold">24</p>
              <p className="text-blue-400 text-sm">+8% this week</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Orders Today</p>
              <p className="text-white text-2xl font-bold">18</p>
              <p className="text-yellow-400 text-sm">3 pending</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Conversion Rate</p>
              <p className="text-white text-2xl font-bold">3.2%</p>
              <p className="text-green-400 text-sm">+0.5% this month</p>
            </div>
            <div className="w-12 h-12 bg-[#00a8ff]/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[#00a8ff]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
