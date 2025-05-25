import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import axios from 'axios';

interface Product {
  id: string;
  name: string;
  slug: string;
  regularPrice: number;
  salePrice?: number;
  imageUrl?: string;
  brand: string;
  stockQuantity: number;
}

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/products');
        setProducts(response.data.data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Products</h1>
          
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00a8ff]"
              />
            </div>
            <button className="flex items-center px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white hover:border-[#00a8ff] transition-colors">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.slug}`}
                className="bg-[#1a1a1a] rounded-lg overflow-hidden hover:bg-[#2a2a2a] transition-colors group"
              >
                <div className="aspect-square bg-gray-800 flex items-center justify-center">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-500 text-center">
                      <div className="text-4xl mb-2">📦</div>
                      <div className="text-sm">No Image</div>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold mb-2 group-hover:text-[#00a8ff] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">{product.brand}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {product.salePrice ? (
                        <>
                          <span className="text-[#00a8ff] font-bold">${product.salePrice}</span>
                          <span className="text-gray-500 line-through text-sm">${product.regularPrice}</span>
                        </>
                      ) : (
                        <span className="text-white font-bold">${product.regularPrice}</span>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      product.stockQuantity > 0 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
            <p className="text-gray-400">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};
