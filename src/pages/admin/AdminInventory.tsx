import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { Package, Plus, Edit, Trash2, AlertTriangle, Search, Upload, Download, FileText, Eye, Calendar, ExternalLink } from 'lucide-react';
import { buildAdminApiUrl, API_ENDPOINTS } from '../../config/api';
// Note: XLSX import will be added when library is properly installed

interface Product {
  id: string;
  name: string;
  brand: string;
  model: string;
  sku: string;
  regularPrice: number;
  salePrice?: number;
  stockQuantity: number;
  minOrderQuantity: number;
  isActive: boolean;
  description?: string;
  cost: number;
  featured: boolean;
}

interface InventoryStats {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalValue: number;
}

interface NewProduct {
  name: string;
  brand: string;
  model: string;
  description: string;
  sku: string;
  regularPrice: number;
  salePrice?: number;
  cost?: number;
  stockQuantity: number;
  minOrderQuantity: number;
  maxOrderQuantity?: number;
  weight?: number;
  dimensions?: string;
  featured: boolean;
  categories: string[];
  images: Array<{
    url: string;
    altText: string;
  }>;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

interface BulkImportResult {
  success: boolean;
  message: string;
  imported: number;
  failed: number;
  errors?: Array<{
    row: number;
    error: string;
  }>;
}

export const AdminInventory: React.FC = () => {
  const { getToken } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Add Product Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingProduct, setAddingProduct] = useState(false);

  // Bulk Import State
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<BulkImportResult | null>(null);

  // Advanced Import Features
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [validationErrors, setValidationErrors] = useState<any[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Scheduled Import Features
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [importJobs, setImportJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);

  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: '',
    brand: '',
    model: '',
    description: '',
    sku: '',
    regularPrice: 0,
    salePrice: undefined,
    cost: undefined,
    stockQuantity: 0,
    minOrderQuantity: 1,
    maxOrderQuantity: undefined,
    weight: undefined,
    dimensions: '',
    featured: false,
    categories: [],
    images: [],
    metaTitle: '',
    metaDescription: '',
    metaKeywords: ''
  });

  // Fetch inventory data
  const fetchInventory = async () => {
    try {
      // Fetch products and stats in parallel
      // Note: Using global axios interceptor for authentication
      const [productsResponse, statsResponse] = await Promise.all([
        axios.get(buildAdminApiUrl(API_ENDPOINTS.ADMIN.INVENTORY), {
          params: {
            search: searchTerm || undefined,
            status: statusFilter === 'all' ? undefined : statusFilter
          }
        }),
        axios.get(buildAdminApiUrl(API_ENDPOINTS.ADMIN.INVENTORY_STATS))
      ]);

      setProducts(productsResponse.data.data?.products || []);
      setStats(statsResponse.data.data || null);
      setError(null);
    } catch (err: any) {
      console.error('Inventory error:', err);
      setError(err.response?.data?.message || 'Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [getToken, searchTerm, statusFilter]);

  // Handle CSV/Excel file parsing
  const parseFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const fileExtension = file.name.toLowerCase().split('.').pop();

      reader.onload = (e) => {
        try {
          if (fileExtension === 'csv') {
            // Parse CSV
            const text = e.target?.result as string;
            const lines = text.split('\n').filter(line => line.trim());

            if (lines.length < 2) {
              reject(new Error('File must contain at least a header row and one data row'));
              return;
            }

            // Parse header
            const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));

            // Parse data rows
            const data = lines.slice(1).map((line, index) => {
              const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
              const row: any = {};

              headers.forEach((header, i) => {
                row[header.toLowerCase().replace(/\s+/g, '_')] = values[i] || '';
              });

              row._rowNumber = index + 2;
              return row;
            });

            resolve(data);
          } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
            // For now, show message that Excel support is coming
            reject(new Error('Excel file support is being implemented. Please use CSV format for now.'));
          } else {
            reject(new Error('Unsupported file format. Please use CSV or Excel files.'));
          }
        } catch (error) {
          reject(new Error('Failed to parse file'));
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));

      if (fileExtension === 'csv') {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
  };

  // Validate import data
  const validateImportData = (data: any[]): { valid: any[], errors: any[] } => {
    const valid: any[] = [];
    const errors: any[] = [];

    data.forEach((row, index) => {
      const rowErrors: string[] = [];

      // Check required fields
      if (!row.name && !row.product_name) rowErrors.push('Missing product name');
      if (!row.brand) rowErrors.push('Missing brand');
      if (!row.sku) rowErrors.push('Missing SKU');
      if (!row.regular_price && !row.price) rowErrors.push('Missing price');

      // Validate data types
      const price = parseFloat(row.regular_price || row.price || '0');
      if (isNaN(price) || price <= 0) rowErrors.push('Invalid price');

      const stock = parseInt(row.stock_quantity || row.stock || '0');
      if (isNaN(stock) || stock < 0) rowErrors.push('Invalid stock quantity');

      if (rowErrors.length > 0) {
        errors.push({
          row: index + 2,
          errors: rowErrors,
          data: row
        });
      } else {
        valid.push(row);
      }
    });

    return { valid, errors };
  };

  // Preview import data
  const handlePreviewImport = async () => {
    if (!importFile) {
      alert('Please select a file to preview');
      return;
    }

    try {
      const data = await parseFile(importFile);
      const { valid, errors } = validateImportData(data);

      setPreviewData(valid);
      setValidationErrors(errors);
      setShowPreviewModal(true);
    } catch (error: any) {
      alert(error.message);
    }
  };

  // Handle bulk import
  const handleBulkImport = async () => {
    if (!importFile) {
      alert('Please select a file to import');
      return;
    }

    setImporting(true);
    setImportResult(null);

    try {
      // Parse the file
      const data = await parseFile(importFile);

      // Transform data to match our product structure
      const products = data.map(row => ({
        name: row.name || row.product_name || '',
        brand: row.brand || '',
        model: row.model || '',
        description: row.description || '',
        sku: row.sku || '',
        regularPrice: parseFloat(row.regular_price || row.price || '0'),
        salePrice: row.sale_price ? parseFloat(row.sale_price) : undefined,
        cost: row.cost ? parseFloat(row.cost) : undefined,
        stockQuantity: parseInt(row.stock_quantity || row.stock || '0'),
        minOrderQuantity: parseInt(row.min_order_quantity || '1'),
        maxOrderQuantity: row.max_order_quantity ? parseInt(row.max_order_quantity) : undefined,
        weight: row.weight ? parseFloat(row.weight) : undefined,
        dimensions: row.dimensions || '',
        featured: row.featured === 'true' || row.featured === '1',
        categories: row.categories ? row.categories.split(';').filter(Boolean) : [],
        images: [],
        metaTitle: row.meta_title || '',
        metaDescription: row.meta_description || '',
        metaKeywords: row.meta_keywords || ''
      }));

      // Send to backend
      const response = await axios.post(
        buildAdminApiUrl(`${API_ENDPOINTS.ADMIN.INVENTORY_PRODUCTS}/bulk`),
        { products }
      );

      setImportResult(response.data);

      // Refresh inventory if any products were imported
      if (response.data.imported > 0) {
        fetchInventory();
      }

    } catch (err: any) {
      console.error('Bulk import error:', err);
      setImportResult({
        success: false,
        message: err.response?.data?.message || 'Failed to import products',
        imported: 0,
        failed: 0,
        errors: []
      });
    } finally {
      setImporting(false);
    }
  };

  // Export existing inventory to CSV
  const handleExportInventory = async () => {
    setExporting(true);
    try {
      // Get all products for export
      const response = await axios.get(buildAdminApiUrl(API_ENDPOINTS.ADMIN.INVENTORY), {
        params: { limit: 1000 } // Get all products
      });

      const products = response.data.data?.products || [];

      if (products.length === 0) {
        alert('No products to export');
        return;
      }

      // Prepare CSV headers
      const headers = [
        'name',
        'brand',
        'model',
        'description',
        'sku',
        'regular_price',
        'sale_price',
        'cost',
        'stock_quantity',
        'min_order_quantity',
        'max_order_quantity',
        'weight',
        'dimensions',
        'featured',
        'is_active',
        'created_at'
      ];

      // Convert products to CSV format
      const csvData = products.map((product: any) => [
        product.name || '',
        product.brand || '',
        product.model || '',
        product.description || '',
        product.sku || '',
        product.regularPrice || '',
        product.salePrice || '',
        product.cost || '',
        product.stockQuantity || 0,
        product.minOrderQuantity || 1,
        product.maxOrderQuantity || '',
        product.weight || '',
        product.dimensions || '',
        product.featured ? 'true' : 'false',
        product.isActive ? 'true' : 'false',
        product.createdAt ? new Date(product.createdAt).toISOString().split('T')[0] : ''
      ]);

      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.map(field => `"${field}"`).join(','))
      ].join('\n');

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inventory_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setShowExportModal(false);
    } catch (error: any) {
      console.error('Export error:', error);
      alert('Failed to export inventory: ' + (error.response?.data?.message || error.message));
    } finally {
      setExporting(false);
    }
  };

  // Load import jobs
  const loadImportJobs = async () => {
    setLoadingJobs(true);
    try {
      const response = await axios.get(buildAdminApiUrl(API_ENDPOINTS.ADMIN.IMPORT_JOBS));
      setImportJobs(response.data.data?.jobs || []);
    } catch (error: any) {
      console.error('Failed to load import jobs:', error);
      alert('Failed to load import jobs: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoadingJobs(false);
    }
  };

  // Create new import job
  const createImportJob = async (jobData: any) => {
    try {
      const response = await axios.post(buildAdminApiUrl(API_ENDPOINTS.ADMIN.IMPORT_JOBS), jobData);
      alert('Import job created successfully!');
      loadImportJobs(); // Refresh the list
      return response.data;
    } catch (error: any) {
      console.error('Failed to create import job:', error);
      throw new Error(error.response?.data?.message || 'Failed to create import job');
    }
  };

  // Trigger import job manually
  const triggerImportJob = async (jobId: string) => {
    try {
      const response = await axios.post(buildAdminApiUrl(`${API_ENDPOINTS.ADMIN.IMPORT_JOBS}/${jobId}/trigger`));
      alert('Import job triggered successfully!');
      loadImportJobs(); // Refresh the list
      return response.data;
    } catch (error: any) {
      console.error('Failed to trigger import job:', error);
      alert('Failed to trigger import job: ' + (error.response?.data?.message || error.message));
    }
  };

  // Download CSV template
  const downloadTemplate = () => {
    const headers = [
      'name',
      'brand',
      'model',
      'description',
      'sku',
      'regular_price',
      'sale_price',
      'cost',
      'stock_quantity',
      'min_order_quantity',
      'max_order_quantity',
      'weight',
      'dimensions',
      'featured',
      'categories',
      'meta_title',
      'meta_description',
      'meta_keywords'
    ];

    const sampleData = [
      'Gaming Laptop Stand',
      'TechPro',
      'TP-GLS-001',
      'Adjustable aluminum laptop stand for gaming setups',
      'GLS001',
      '89.99',
      '79.99',
      '45.00',
      '25',
      '1',
      '10',
      '1.2',
      '30 x 20 x 15 cm',
      'false',
      'Accessories;Gaming',
      'Gaming Laptop Stand - TechPro',
      'Professional adjustable laptop stand for gaming',
      'laptop stand, gaming, adjustable, aluminum'
    ];

    const csvContent = [
      headers.join(','),
      sampleData.join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product_import_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Handle adding new product
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingProduct(true);

    try {
      // Validate required fields
      if (!newProduct.name || !newProduct.brand || !newProduct.sku || !newProduct.regularPrice) {
        alert('Please fill in all required fields');
        return;
      }

      // Using global axios interceptor for authentication
      await axios.post(
        buildAdminApiUrl(API_ENDPOINTS.ADMIN.INVENTORY_PRODUCTS),
        newProduct
      );

      // Reset form and close modal
      setNewProduct({
        name: '',
        brand: '',
        model: '',
        description: '',
        sku: '',
        regularPrice: 0,
        salePrice: undefined,
        cost: undefined,
        stockQuantity: 0,
        minOrderQuantity: 1,
        maxOrderQuantity: undefined,
        weight: undefined,
        dimensions: '',
        featured: false,
        categories: [],
        images: [],
        metaTitle: '',
        metaDescription: '',
        metaKeywords: ''
      });
      setShowAddModal(false);

      // Refresh the inventory
      fetchInventory();

      alert('Product added successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add product');
    } finally {
      setAddingProduct(false);
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      // Using global axios interceptor for authentication
      await axios.delete(
        buildAdminApiUrl(`${API_ENDPOINTS.ADMIN.INVENTORY_PRODUCTS}/${productId}`)
      );

      // Refresh the inventory after deletion
      fetchInventory();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete product');
    }
  };

  // Get stock status styling
  const getStockStatus = (quantity: number, minQuantity: number) => {
    if (quantity === 0) {
      return { text: 'Out of Stock', className: 'text-red-400 font-semibold' };
    } else if (quantity <= 10 || quantity <= minQuantity) {
      return { text: `${quantity} (Low Stock)`, className: 'text-yellow-400 font-semibold' };
    } else {
      return { text: quantity.toString(), className: 'text-green-400' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#00a8ff] mx-auto mb-4"></div>
          <p className="text-gray-400">Loading inventory...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-900/20 border border-red-500 text-red-400 p-6 rounded-lg">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <h2 className="text-xl font-bold">Error Loading Inventory</h2>
            </div>
            <p>{error}</p>
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                fetchInventory();
              }}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Inventory Management</h1>
            <p className="text-gray-400">Manage your product inventory and stock levels</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
            <button
              onClick={downloadTemplate}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center text-sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Template
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center text-sm"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Export
            </button>
            <button
              onClick={() => setShowBulkImportModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center text-sm"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import
            </button>
            <button
              onClick={() => {
                setShowScheduleModal(true);
                loadImportJobs();
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center text-sm"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#00a8ff] hover:bg-[#0090e0] text-white px-6 py-3 rounded-lg transition-colors flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Product
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Products</p>
                  <p className="text-2xl font-bold text-white">{stats.totalProducts}</p>
                </div>
                <Package className="h-8 w-8 text-[#00a8ff]" />
              </div>
            </div>
            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Products</p>
                  <p className="text-2xl font-bold text-green-400">{stats.activeProducts}</p>
                </div>
                <Package className="h-8 w-8 text-green-400" />
              </div>
            </div>
            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Low Stock</p>
                  <p className="text-2xl font-bold text-yellow-400">{stats.lowStockProducts}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-400" />
              </div>
            </div>
            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Out of Stock</p>
                  <p className="text-2xl font-bold text-red-400">{stats.outOfStockProducts}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
            </div>
            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Value</p>
                  <p className="text-2xl font-bold text-[#00a8ff]">${stats.totalValue.toLocaleString()}</p>
                </div>
                <Package className="h-8 w-8 text-[#00a8ff]" />
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products by name, SKU, or brand..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00a8ff]"
                />
              </div>
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                className="px-4 py-2 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#00a8ff]"
              >
                <option value="all">All Products</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-[#1a1a1a] rounded-lg border border-gray-800 overflow-hidden">
          {products.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No Products Found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || statusFilter !== 'all'
                  ? 'No products match your current filters.'
                  : 'Start by adding your first product to the inventory.'}
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-[#00a8ff] hover:bg-[#0090e0] text-white px-6 py-3 rounded-lg transition-colors flex items-center mx-auto"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Your First Product
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-[#0a0a0a]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {products.map((product) => {
                    const stockStatus = getStockStatus(product.stockQuantity, product.minOrderQuantity);
                    return (
                      <tr key={product.id} className="hover:bg-[#0a0a0a] transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-white">{product.name}</div>
                            <div className="text-sm text-gray-400">{product.brand} - {product.model}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          <span className="font-mono bg-gray-800 px-2 py-1 rounded text-xs">
                            {product.sku}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          <div>
                            {product.salePrice ? (
                              <>
                                <span className="line-through text-gray-500">${product.regularPrice}</span>
                                <span className="ml-2 text-green-400 font-semibold">${product.salePrice}</span>
                              </>
                            ) : (
                              <span className="text-white font-semibold">${product.regularPrice}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center">
                            <span className={stockStatus.className}>
                              {stockStatus.text}
                            </span>
                            {(product.stockQuantity <= 10 || product.stockQuantity <= product.minOrderQuantity) && product.stockQuantity > 0 && (
                              <AlertTriangle className="h-4 w-4 text-yellow-400 ml-2" />
                            )}
                            {product.stockQuantity === 0 && (
                              <AlertTriangle className="h-4 w-4 text-red-400 ml-2" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            product.isActive
                              ? 'bg-green-900/20 text-green-400 border border-green-500/20'
                              : 'bg-red-900/20 text-red-400 border border-red-500/20'
                          }`}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-3">
                            <button
                              className="text-[#00a8ff] hover:text-[#0090e0] transition-colors flex items-center"
                              title="Edit Product"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-400 hover:text-red-300 transition-colors flex items-center"
                              title="Delete Product"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination would go here if needed */}
        {products.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Showing {products.length} products
            </div>
            <div className="text-sm text-gray-400">
              {stats && `Total inventory value: $${stats.totalValue.toLocaleString()}`}
            </div>
          </div>
        )}

        {/* Bulk Import Modal */}
        {showBulkImportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#1a1a1a] rounded-lg border border-gray-700 w-full max-w-2xl">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Bulk Import Products</h2>
                  <button
                    onClick={() => {
                      setShowBulkImportModal(false);
                      setImportFile(null);
                      setImportResult(null);
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Instructions */}
                <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-start">
                    <FileText className="h-5 w-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-blue-400 font-semibold mb-2">Import Instructions</h3>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Download the CSV template to see the required format</li>
                        <li>• Supported formats: CSV (.csv) and Excel (.xlsx, .xls)</li>
                        <li>• Required fields: name, brand, sku, regular_price, stock_quantity</li>
                        <li>• Use semicolons (;) to separate multiple categories</li>
                        <li>• Featured field: use 'true' or 'false'</li>
                        <li>• Use Preview to validate data before importing</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Template Download */}
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">CSV Template</h4>
                    <p className="text-sm text-gray-400">Download the template with sample data and correct headers</p>
                  </div>
                  <button
                    onClick={downloadTemplate}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center text-sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </button>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select CSV File
                  </label>
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        setImportFile(file || null);
                        setImportResult(null);
                        setPreviewData([]);
                        setValidationErrors([]);
                      }}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-300 mb-2">
                        {importFile ? importFile.name : 'Click to select a CSV or Excel file'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Supported formats: .csv, .xlsx, .xls
                      </p>
                    </label>
                  </div>

                  {/* Preview Button */}
                  {importFile && (
                    <div className="flex justify-center">
                      <button
                        onClick={handlePreviewImport}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center text-sm"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview & Validate
                      </button>
                    </div>
                  )}
                </div>

                {/* Import Results */}
                {importResult && (
                  <div className={`rounded-lg p-4 ${
                    importResult.success
                      ? 'bg-green-900/20 border border-green-500/20'
                      : 'bg-red-900/20 border border-red-500/20'
                  }`}>
                    <h4 className={`font-semibold mb-2 ${
                      importResult.success ? 'text-green-400' : 'text-red-400'
                    }`}>
                      Import Results
                    </h4>
                    <div className="text-sm text-gray-300 space-y-1">
                      <p>• Successfully imported: {importResult.imported} products</p>
                      <p>• Failed: {importResult.failed} products</p>
                      {importResult.errors && importResult.errors.length > 0 && (
                        <div className="mt-3">
                          <p className="text-red-400 font-medium">Errors:</p>
                          <ul className="mt-1 space-y-1">
                            {importResult.errors.slice(0, 5).map((error, index) => (
                              <li key={index} className="text-xs text-red-300">
                                Row {error.row}: {error.error}
                              </li>
                            ))}
                            {importResult.errors.length > 5 && (
                              <li className="text-xs text-red-300">
                                ... and {importResult.errors.length - 5} more errors
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-700">
                  <button
                    type="button"
                    onClick={() => {
                      setShowBulkImportModal(false);
                      setImportFile(null);
                      setImportResult(null);
                    }}
                    className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBulkImport}
                    disabled={!importFile || importing}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {importing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Importing...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Import Products
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scheduled Import Modal */}
        {showScheduleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#1a1a1a] rounded-lg border border-gray-700 w-full max-w-6xl max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Scheduled Import Jobs</h2>
                  <button
                    onClick={() => setShowScheduleModal(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                {/* Info Section */}
                <div className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-4">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-purple-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-purple-400 font-semibold mb-2">Automated Import Scheduling</h3>
                      <p className="text-sm text-gray-300 mb-3">
                        Set up automated imports from various sources including HTTP URLs, Google Sheets, and API webhooks.
                        Jobs run on a cron schedule and can import products automatically.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h4 className="text-purple-300 font-medium mb-1">Supported Sources:</h4>
                          <ul className="text-gray-400 space-y-1">
                            <li>• HTTP/HTTPS URLs (CSV/JSON)</li>
                            <li>• Google Sheets API</li>
                            <li>• API Webhooks</li>
                            <li>• File Upload (manual)</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-purple-300 font-medium mb-1">Schedule Examples:</h4>
                          <ul className="text-gray-400 space-y-1">
                            <li>• <code>*/5 * * * *</code> - Every 5 minutes</li>
                            <li>• <code>0 * * * *</code> - Every hour</li>
                            <li>• <code>0 0 * * *</code> - Daily at midnight</li>
                            <li>• <code>0 0 * * 0</code> - Weekly on Sunday</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Create New Job Button */}
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white">Import Jobs ({importJobs.length})</h3>
                  <button
                    onClick={() => {
                      const jobData = {
                        name: prompt('Job Name:') || 'New Import Job',
                        description: prompt('Description:') || '',
                        sourceType: 'http_url',
                        sourceConfig: {
                          url: prompt('Source URL (CSV/JSON):') || 'https://example.com/products.csv'
                        },
                        schedule: prompt('Cron Schedule (e.g., "0 0 * * *" for daily):') || '0 0 * * *',
                        isActive: true
                      };
                      createImportJob(jobData);
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center text-sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Job
                  </button>
                </div>

                {/* Jobs List */}
                {loadingJobs ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto"></div>
                    <p className="text-gray-400 mt-2">Loading import jobs...</p>
                  </div>
                ) : importJobs.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-400 mb-2">No Scheduled Jobs</h3>
                    <p className="text-gray-500">Create your first automated import job to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {importJobs.map((job) => (
                      <div key={job.id} className="bg-[#0a0a0a] border border-gray-700 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-lg font-semibold text-white">{job.name}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                job.isActive
                                  ? 'bg-green-900/20 text-green-400 border border-green-500/20'
                                  : 'bg-gray-900/20 text-gray-400 border border-gray-500/20'
                              }`}>
                                {job.isActive ? 'Active' : 'Inactive'}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                job.lastRunStatus === 'success'
                                  ? 'bg-green-900/20 text-green-400'
                                  : job.lastRunStatus === 'failed'
                                  ? 'bg-red-900/20 text-red-400'
                                  : 'bg-yellow-900/20 text-yellow-400'
                              }`}>
                                {job.lastRunStatus || 'Never Run'}
                              </span>
                            </div>

                            {job.description && (
                              <p className="text-gray-400 text-sm mb-3">{job.description}</p>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Source:</span>
                                <span className="text-gray-300 ml-2 capitalize">{job.sourceType.replace('_', ' ')}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Schedule:</span>
                                <span className="text-gray-300 ml-2 font-mono">{job.schedule}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Next Run:</span>
                                <span className="text-gray-300 ml-2">
                                  {job.nextRunAt ? new Date(job.nextRunAt).toLocaleString() : 'Not scheduled'}
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mt-2">
                              <div>
                                <span className="text-gray-500">Total Runs:</span>
                                <span className="text-gray-300 ml-2">{job.totalRuns}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Successful:</span>
                                <span className="text-green-400 ml-2">{job.successfulRuns}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Failed:</span>
                                <span className="text-red-400 ml-2">{job.failedRuns}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => triggerImportJob(job.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                            >
                              Run Now
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-700">
                  <button
                    onClick={() => setShowScheduleModal(false)}
                    className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={loadImportJobs}
                    disabled={loadingJobs}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center"
                  >
                    {loadingJobs ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Refreshing...
                      </>
                    ) : (
                      <>
                        <Calendar className="h-4 w-4 mr-2" />
                        Refresh Jobs
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#1a1a1a] rounded-lg border border-gray-700 w-full max-w-md">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Export Inventory</h2>
                  <button
                    onClick={() => setShowExportModal(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="text-center">
                  <ExternalLink className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Export Current Inventory</h3>
                  <p className="text-gray-400 mb-4">
                    Download all your products as a CSV file. This includes all product details, pricing, and stock information.
                  </p>
                  <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-3 mb-4">
                    <p className="text-sm text-blue-400">
                      📊 {products.length} products will be exported
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-4">
                  <button
                    onClick={() => setShowExportModal(false)}
                    className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleExportInventory}
                    disabled={exporting}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {exporting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Exporting...
                      </>
                    ) : (
                      <>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Export CSV
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preview Modal */}
        {showPreviewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#1a1a1a] rounded-lg border border-gray-700 w-full max-w-6xl max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Import Preview & Validation</h2>
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                {/* Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-900/20 border border-green-500/20 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">{previewData.length}</div>
                    <div className="text-sm text-green-300">Valid Products</div>
                  </div>
                  <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-400">{validationErrors.length}</div>
                    <div className="text-sm text-red-300">Invalid Products</div>
                  </div>
                  <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400">{previewData.length + validationErrors.length}</div>
                    <div className="text-sm text-blue-300">Total Rows</div>
                  </div>
                </div>

                {/* Validation Errors */}
                {validationErrors.length > 0 && (
                  <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4">
                    <h3 className="text-red-400 font-semibold mb-3">Validation Errors</h3>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {validationErrors.slice(0, 10).map((error, index) => (
                        <div key={index} className="text-sm">
                          <span className="text-red-300">Row {error.row}:</span>
                          <span className="text-gray-300 ml-2">{error.errors.join(', ')}</span>
                        </div>
                      ))}
                      {validationErrors.length > 10 && (
                        <div className="text-sm text-red-300">
                          ... and {validationErrors.length - 10} more errors
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Valid Products Preview */}
                {previewData.length > 0 && (
                  <div>
                    <h3 className="text-green-400 font-semibold mb-3">Valid Products (First 5)</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-[#0a0a0a]">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Name</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Brand</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">SKU</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Price</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Stock</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                          {previewData.slice(0, 5).map((product, index) => (
                            <tr key={index} className="hover:bg-[#0a0a0a]">
                              <td className="px-4 py-2 text-sm text-white">{product.name || product.product_name}</td>
                              <td className="px-4 py-2 text-sm text-gray-300">{product.brand}</td>
                              <td className="px-4 py-2 text-sm text-gray-300">{product.sku}</td>
                              <td className="px-4 py-2 text-sm text-gray-300">${product.regular_price || product.price}</td>
                              <td className="px-4 py-2 text-sm text-gray-300">{product.stock_quantity || product.stock}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-700">
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Close Preview
                  </button>
                  {previewData.length > 0 && (
                    <button
                      onClick={() => {
                        setShowPreviewModal(false);
                        handleBulkImport();
                      }}
                      className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Import {previewData.length} Valid Products
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Product Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#1a1a1a] rounded-lg border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Add New Product</h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handleAddProduct} className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00a8ff]"
                      placeholder="Enter product name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Brand *
                    </label>
                    <input
                      type="text"
                      required
                      value={newProduct.brand}
                      onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00a8ff]"
                      placeholder="Enter brand name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Model
                    </label>
                    <input
                      type="text"
                      value={newProduct.model}
                      onChange={(e) => setNewProduct({ ...newProduct, model: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00a8ff]"
                      placeholder="Enter model"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      SKU *
                    </label>
                    <input
                      type="text"
                      required
                      value={newProduct.sku}
                      onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00a8ff]"
                      placeholder="Enter SKU"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00a8ff]"
                    placeholder="Enter product description"
                  />
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Regular Price * ($)
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={newProduct.regularPrice}
                      onChange={(e) => setNewProduct({ ...newProduct, regularPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00a8ff]"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Sale Price ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newProduct.salePrice || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, salePrice: e.target.value ? parseFloat(e.target.value) : undefined })}
                      className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00a8ff]"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Cost ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newProduct.cost || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, cost: e.target.value ? parseFloat(e.target.value) : undefined })}
                      className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00a8ff]"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Inventory */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={newProduct.stockQuantity}
                      onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00a8ff]"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Min Order Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newProduct.minOrderQuantity}
                      onChange={(e) => setNewProduct({ ...newProduct, minOrderQuantity: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00a8ff]"
                      placeholder="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Max Order Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newProduct.maxOrderQuantity || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, maxOrderQuantity: e.target.value ? parseInt(e.target.value) : undefined })}
                      className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00a8ff]"
                      placeholder="No limit"
                    />
                  </div>
                </div>

                {/* Physical Properties */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newProduct.weight || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, weight: e.target.value ? parseFloat(e.target.value) : undefined })}
                      className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00a8ff]"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Dimensions (L x W x H)
                    </label>
                    <input
                      type="text"
                      value={newProduct.dimensions || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, dimensions: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00a8ff]"
                      placeholder="e.g., 30 x 20 x 10 cm"
                    />
                  </div>
                </div>

                {/* Featured Product */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={newProduct.featured}
                    onChange={(e) => setNewProduct({ ...newProduct, featured: e.target.checked })}
                    className="h-4 w-4 text-[#00a8ff] focus:ring-[#00a8ff] border-gray-700 rounded bg-[#0a0a0a]"
                  />
                  <label htmlFor="featured" className="ml-2 text-sm text-gray-300">
                    Mark as featured product
                  </label>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-700">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addingProduct}
                    className="px-6 py-2 bg-[#00a8ff] hover:bg-[#0090e0] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {addingProduct ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};