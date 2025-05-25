import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Filter, ChevronDown, Search, X } from 'lucide-react';
import axios from 'axios';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [productsPerPage] = useState(12);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/products/categories');
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    
    fetchCategories();
  }, []);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Build query parameters
        const params = {
          page: currentPage,
          limit: productsPerPage
        };
        
        if (selectedCategory) {
          params.category = selectedCategory;
        }
        
        if (priceRange.min) {
          params.minPrice = priceRange.min;
        }
        
        if (priceRange.max) {
          params.maxPrice = priceRange.max;
        }
        
        if (searchQuery) {
          params.search = searchQuery;
        }
        
        const response = await axios.get('/api/products', { params });
        
        setProducts(response.data.products);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (err) {
        setError('Failed to load products. Please try again.');
        setLoading(false);
        console.error('Error fetching products:', err);
      }
    };
    
    fetchProducts();
  }, [currentPage, selectedCategory, priceRange, searchQuery, productsPerPage]);
  
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };
  
  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target;
    setPriceRange(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };
  
  const handleClearFilters = () => {
    setSelectedCategory('');
    setPriceRange({ min: '', max: '' });
    setSearchQuery('');
    setCurrentPage(1);
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  
  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Products</h1>
          
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="w-full md:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full md:w-64 bg-[#1a1a1a] border border-gray-700 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#00a8ff] focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </form>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters - Mobile Toggle */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-between w-full bg-[#1a1a1a] border border-gray-700 rounded-md px-4 py-2"
            >
              <div className="flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                <span>Filters</span>
              </div>
              <ChevronDown className={`h-5 w-5 transition-transform ${showFilters ? 'transform rotate-180' : ''}`} />
            </button>
          </div>
          
          {/* Filters - Sidebar */}
          <div className={`md:w-1/4 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="bg-[#1a1a1a] rounded-lg p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Categories</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="all-categories"
                      name="category"
                      checked={selectedCategory === ''}
                      onChange={() => handleCategoryChange('')}
                      className="h-4 w-4 text-[#00a8ff] focus:ring-[#00a8ff] border-gray-700 bg-gray-900"
                    />
                    <label htmlFor="all-categories" className="ml-2 text-sm">
                      All Categories
                    </label>
                  </div>
                  
                  {categories.map(category => (
                    <div key={category.id} className="flex items-center">
                      <input
                        type="radio"
                        id={`category-${category.id}`}
                        name="category"
                        checked={selectedCategory === category.id}
                        onChange={() => handleCategoryChange(category.id)}
                        className="h-4 w-4 text-[#00a8ff] focus:ring-[#00a8ff] border-gray-700 bg-gray-900"
                      />
                      <label htmlFor={`category-${category.id}`} className="ml-2 text-sm">
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Price Range</h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    name="min"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={handlePriceRangeChange}
                    className="w-full bg-[#0a0a0a] border border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#00a8ff] focus:border-transparent"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    name="max"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={handlePriceRangeChange}
                    className="w-full bg-[#0a0a0a] border border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#00a8ff] focus:border-transparent"
                  />
                </div>
              </div>
              
              <button
                onClick={handleClearFilters}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-md transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
          
          {/* Products Grid */}
          <div className="md:w-3/4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00a8ff]"></div>
              </div>
            ) : error ? (
              <div className="bg-red-900 bg-opacity-20 border border-red-800 rounded-lg p-4 text-center">
                <p className="text-red-500">{error}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-gray-900 bg-opacity-50 border border-gray-800 rounded-lg p-8 text-center">
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-gray-400 mb-4">Try adjusting your filters or search query.</p>
                <button
                  onClick={handleClearFilters}
                  className="bg-[#00a8ff] hover:bg-[#0090e0] text-white px-4 py-2 rounded-md transition-colors duration-200"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map(product => (
                    <Link 
                      key={product.id} 
                      to={`/products/${product.slug}`}
                      className="bg-[#1a1a1a] rounded-lg overflow-hidden hover:shadow-lg hover:shadow-[#00a8ff]/10 transition-all duration-300"
                    >
                      <div className="h-48 overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <img 
                            src={product.images[0].imageUrl} 
                            alt={product.name} 
                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300" 
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                            <span className="text-gray-500">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium mb-1 truncate">{product.name}</h3>
                        <p className="text-gray-400 text-sm mb-2">{product.brand}</p>
                        <div className="flex justify-between items-center">
                          <div>
                            {product.salePrice ? (
                              <>
                                <span className="text-gray-400 line-through text-sm mr-2">${product.regularPrice}</span>
                                <span className="text-[#00a8ff] font-bold">${product.salePrice}</span>
                              </>
                            ) : (
                              <span className="font-bold">${product.regularPrice}</span>
                            )}
                          </div>
                          {product.stockQuantity === 0 && (
                            <span className="text-xs bg-red-900 text-red-300 px-2 py-1 rounded">Out of stock</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <nav className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === 1
                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-800 text-white hover:bg-gray-700'
                        }`}
                      >
                        Previous
                      </button>
                      
                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index}
                          onClick={() => handlePageChange(index + 1)}
                          className={`px-3 py-1 rounded-md ${
                            currentPage === index + 1
                              ? 'bg-[#00a8ff] text-white'
                              : 'bg-gray-800 text-white hover:bg-gray-700'
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === totalPages
                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-800 text-white hover:bg-gray-700'
                        }`}
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
