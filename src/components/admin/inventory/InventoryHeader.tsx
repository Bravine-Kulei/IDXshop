import React from 'react';
import { Plus, Download, Upload, BarChart3, AlertCircle } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { useInventoryStats } from '../../../hooks/useInventoryStats';

interface InventoryHeaderProps {
  totalProducts: number;
  onAddProduct: () => void;
  onExport?: () => void;
  onImport?: () => void;
  onViewStats?: () => void;
}

export const InventoryHeader: React.FC<InventoryHeaderProps> = ({
  totalProducts,
  onAddProduct,
  onExport,
  onImport,
  onViewStats
}) => {
  const { isSignedIn, user } = useAuth();
  const { stats, loading: statsLoading, error: statsError } = useInventoryStats();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };
  return (
    <div className="mb-8">
      {/* Authentication Status Debug */}
      {statsError && (
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
            <div>
              <h3 className="text-red-400 font-semibold">Authentication Issue</h3>
              <p className="text-red-300 text-sm mt-1">{statsError}</p>
              <div className="text-xs text-gray-400 mt-2">
                <p>Signed In: {isSignedIn ? 'Yes' : 'No'}</p>
                <p>User Role: {user?.publicMetadata?.role as string || 'Not set'}</p>
                <p>User ID: {user?.id || 'None'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Page Title and Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Inventory Management
          </h1>
          <p className="text-gray-400">
            Manage your product catalog and inventory levels
          </p>
        </div>

        <div className="mt-4 sm:mt-0">
          <div className="bg-gray-800 rounded-lg px-4 py-3 border border-gray-700">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#00a8ff]">
                {(totalProducts || 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Total Products</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Primary Action - Add Product */}
        <button
          onClick={onAddProduct}
          className="flex items-center justify-center gap-2 bg-[#00a8ff] hover:bg-[#0090e0] text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add New Product
        </button>

        {/* Secondary Actions */}
        <div className="flex gap-3">
          {onExport && (
            <button
              onClick={onExport}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 transition-colors duration-200"
              title="Export Products"
            >
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          )}

          {onImport && (
            <button
              onClick={onImport}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 transition-colors duration-200"
              title="Import Products"
            >
              <Upload className="w-5 h-5" />
              <span className="hidden sm:inline">Import</span>
            </button>
          )}

          {onViewStats && (
            <button
              onClick={onViewStats}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 transition-colors duration-200"
              title="View Statistics"
            >
              <BarChart3 className="w-5 h-5" />
              <span className="hidden sm:inline">Stats</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Products</p>
              <p className="text-white text-xl font-semibold">
                {statsLoading ? '...' : (stats?.activeProducts || 0).toLocaleString()}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Low Stock</p>
              <p className="text-white text-xl font-semibold">
                {statsLoading ? '...' : (stats?.lowStockProducts || 0).toLocaleString()}
              </p>
            </div>
            <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Out of Stock</p>
              <p className="text-white text-xl font-semibold">
                {statsLoading ? '...' : (stats?.outOfStockProducts || 0).toLocaleString()}
              </p>
            </div>
            <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Value</p>
              <p className="text-white text-xl font-semibold">
                {statsLoading ? '...' : formatCurrency(stats?.totalValue || 0)}
              </p>
            </div>
            <div className="w-8 h-8 bg-[#00a8ff]/20 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-[#00a8ff] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
