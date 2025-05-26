import React, { useState } from 'react';
import { Edit, Trash2, Eye, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Product } from '../../../types/product';
import { LoadingSpinner } from '../../ui/LoadingSpinner';
import { Pagination } from '../../ui/Pagination';

interface InventoryTableProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEditProduct: (product: Product) => void;
  onRefetch: () => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  products,
  loading,
  error,
  currentPage,
  totalPages,
  onPageChange,
  onEditProduct,
  onRefetch,
}) => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const getStockStatus = (product: Product) => {
    if (product.stock === 0) {
      return { status: 'out-of-stock', color: 'text-red-400', icon: XCircle };
    } else if (product.stock <= product.lowStockThreshold) {
      return { status: 'low-stock', color: 'text-yellow-400', icon: AlertTriangle };
    } else {
      return { status: 'in-stock', color: 'text-green-400', icon: CheckCircle };
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(products.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
        <div className="text-center">
          <div className="text-red-400 mb-4">
            <XCircle className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Error Loading Products</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={onRefetch}
            className="bg-[#00a8ff] hover:bg-[#0090e0] text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <Eye className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No Products Found</h3>
          <p className="text-gray-400">Try adjusting your search criteria or add some products.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="bg-gray-700 px-6 py-3 border-b border-gray-600">
          <div className="flex items-center justify-between">
            <span className="text-white">
              {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors">
                Delete Selected
              </button>
              <button className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm transition-colors">
                Bulk Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedProducts.length === products.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-600 bg-gray-700 text-[#00a8ff] focus:ring-[#00a8ff]"
                />
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                SKU
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {products.map((product) => {
              const stockStatus = getStockStatus(product);
              const StatusIcon = stockStatus.icon;

              return (
                <tr key={product.id} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={(e) => handleSelectProduct(product.id, e.target.checked)}
                      className="rounded border-gray-600 bg-gray-700 text-[#00a8ff] focus:ring-[#00a8ff]"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center mr-4">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-gray-400 text-xs">No Image</span>
                        )}
                      </div>
                      <div>
                        <div className="text-white font-medium">{product.name}</div>
                        <div className="text-gray-400 text-sm truncate max-w-xs">
                          {product.shortDescription || product.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300 font-mono text-sm">
                    {product.sku}
                  </td>
                  <td className="px-6 py-4 text-gray-300 capitalize">
                    {product.category}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white font-medium">
                      {formatPrice(product.salePrice || product.regularPrice)}
                    </div>
                    {product.salePrice && (
                      <div className="text-gray-400 text-sm line-through">
                        {formatPrice(product.regularPrice)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white font-medium">{product.stock}</div>
                    <div className="text-gray-400 text-sm">
                      Low: {product.lowStockThreshold}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-2 ${stockStatus.color}`}>
                      <StatusIcon className="w-4 h-4" />
                      <span className="text-sm capitalize">
                        {stockStatus.status.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="text-gray-400 text-sm">
                      {product.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEditProduct(product)}
                        className="text-gray-400 hover:text-[#00a8ff] transition-colors"
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="text-gray-400 hover:text-red-400 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-700">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};
