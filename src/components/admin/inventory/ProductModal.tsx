import React, { useState, useEffect } from 'react';
import { X, Save, Upload } from 'lucide-react';
import { Product, CreateProductData } from '../../../types/product';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: (data: CreateProductData) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<CreateProductData>({
    name: '',
    description: '',
    shortDescription: '',
    sku: '',
    category: '',
    subcategory: '',
    brand: '',
    regularPrice: 0,
    salePrice: 0,
    costPrice: 0,
    stock: 0,
    lowStockThreshold: 5,
    specifications: [],
    tags: [],
    isActive: true,
    isFeatured: false,
    weight: 0,
    warranty: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        shortDescription: product.shortDescription || '',
        sku: product.sku,
        category: product.category,
        subcategory: product.subcategory || '',
        brand: product.brand || '',
        regularPrice: product.regularPrice,
        salePrice: product.salePrice || 0,
        costPrice: product.costPrice || 0,
        stock: product.stock,
        lowStockThreshold: product.lowStockThreshold,
        specifications: product.specifications || [],
        tags: product.tags || [],
        isActive: product.isActive,
        isFeatured: product.isFeatured,
        weight: product.weight || 0,
        warranty: product.warranty || ''
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert empty strings to 0 for number fields before saving
      const cleanedData = {
        ...formData,
        regularPrice: formData.regularPrice === '' ? 0 : formData.regularPrice,
        salePrice: formData.salePrice === '' ? 0 : formData.salePrice,
        costPrice: formData.costPrice === '' ? 0 : formData.costPrice,
        stock: formData.stock === '' ? 0 : formData.stock,
        lowStockThreshold: formData.lowStockThreshold === '' ? 5 : formData.lowStockThreshold,
        weight: formData.weight === '' ? 0 : formData.weight,
      };

      await onSave(cleanedData);
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateProductData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNumberChange = (field: keyof CreateProductData, value: string, isFloat: boolean = false) => {
    // Allow empty string for user to clear the field
    if (value === '') {
      setFormData(prev => ({
        ...prev,
        [field]: ''
      }));
      return;
    }

    // Parse the number
    const numValue = isFloat ? parseFloat(value) : parseInt(value);

    // Only update if it's a valid number
    if (!isNaN(numValue)) {
      setFormData(prev => ({
        ...prev,
        [field]: numValue
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00a8ff] focus:ring-1 focus:ring-[#00a8ff]"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  SKU *
                </label>
                <input
                  type="text"
                  required
                  value={formData.sku}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00a8ff] focus:ring-1 focus:ring-[#00a8ff]"
                  placeholder="Enter SKU"
                />
              </div>
            </div>

            {/* Category and Brand */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-[#00a8ff] focus:ring-1 focus:ring-[#00a8ff]"
                >
                  <option value="">Select Category</option>
                  <option value="laptops">Laptops</option>
                  <option value="accessories">Accessories</option>
                  <option value="components">Components</option>
                  <option value="peripherals">Peripherals</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Subcategory
                </label>
                <input
                  type="text"
                  value={formData.subcategory}
                  onChange={(e) => handleInputChange('subcategory', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00a8ff] focus:ring-1 focus:ring-[#00a8ff]"
                  placeholder="Enter subcategory"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00a8ff] focus:ring-1 focus:ring-[#00a8ff]"
                  placeholder="Enter brand"
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Regular Price *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.regularPrice}
                  onChange={(e) => handleNumberChange('regularPrice', e.target.value, true)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00a8ff] focus:ring-1 focus:ring-[#00a8ff]"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sale Price
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.salePrice}
                  onChange={(e) => handleNumberChange('salePrice', e.target.value, true)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00a8ff] focus:ring-1 focus:ring-[#00a8ff]"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cost Price
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.costPrice}
                  onChange={(e) => handleNumberChange('costPrice', e.target.value, true)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00a8ff] focus:ring-1 focus:ring-[#00a8ff]"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Inventory */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={(e) => handleNumberChange('stock', e.target.value, false)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00a8ff] focus:ring-1 focus:ring-[#00a8ff]"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Low Stock Threshold
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.lowStockThreshold}
                  onChange={(e) => handleNumberChange('lowStockThreshold', e.target.value, false)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00a8ff] focus:ring-1 focus:ring-[#00a8ff]"
                  placeholder="5"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00a8ff] focus:ring-1 focus:ring-[#00a8ff]"
                placeholder="Enter product description"
              />
            </div>

            {/* Status Toggles */}
            <div className="flex gap-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  className="rounded border-gray-600 bg-gray-700 text-[#00a8ff] focus:ring-[#00a8ff]"
                />
                <span className="ml-2 text-gray-300">Active</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                  className="rounded border-gray-600 bg-gray-700 text-[#00a8ff] focus:ring-[#00a8ff]"
                />
                <span className="ml-2 text-gray-300">Featured</span>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-[#00a8ff] hover:bg-[#0090e0] text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
