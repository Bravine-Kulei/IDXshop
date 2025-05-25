import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Filter, ChevronDown, Search, X } from 'lucide-react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import LazyLoad from '../components/LazyLoad';

// Mock data for products
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'Gaming Laptop Pro X',
    category: 'Laptops',
    price: 1299.99,
    originalPrice: 1499.99,
    image: 'https://placehold.co/300x300?text=Gaming+Laptop',
    rating: 4.5,
    reviews: 128,
    discount: 13
  },
  {
    id: 2,
    name: 'Mechanical RGB Keyboard',
    category: 'Peripherals',
    price: 129.99,
    image: 'https://placehold.co/300x300?text=Keyboard',
    rating: 4.7,
    reviews: 245
  },
  {
    id: 3,
    name: 'Wireless Gaming Mouse',
    category: 'Peripherals',
    price: 79.99,
    originalPrice: 99.99,
    image: 'https://placehold.co/300x300?text=Mouse',
    rating: 4.6,
    reviews: 189,
    discount: 20
  },
  {
    id: 4,
    name: 'RTX 4070 Graphics Card',
    category: 'Components',
    price: 599.99,
    image: 'https://placehold.co/300x300?text=GPU',
    rating: 4.8,
    reviews: 156
  },
  {
    id: 5,
    name: '1TB NVMe SSD',
    category: 'Storage',
    price: 119.99,
    originalPrice: 149.99,
    image: 'https://placehold.co/300x300?text=SSD',
    rating: 4.9,
    reviews: 312,
    discount: 20
  },
  {
    id: 6,
    name: '27" 144Hz Gaming Monitor',
    category: 'Displays',
    price: 299.99,
    image: 'https://placehold.co/300x300?text=Monitor',
    rating: 4.7,
    reviews: 178
  },
  {
    id: 7,
    name: 'USB-C Hub 7-in-1',
    category: 'Accessories',
    price: 39.99,
    image: 'https://placehold.co/300x300?text=USB+Hub',
    rating: 4.4,
    reviews: 95
  },
  {
    id: 8,
    name: 'Laptop Cooling Pad',
    category: 'Accessories',
    price: 29.99,
    image: 'https://placehold.co/300x300?text=Cooling+Pad',
    rating: 4.3,
    reviews: 87
  }
];

// Mock data for categories
const MOCK_CATEGORIES = [
  { id: 'laptops', name: 'Laptops' },
  { id: 'peripherals', name: 'Peripherals' },
  { id: 'components', name: 'Components' },
  { id: 'storage', name: 'Storage' },
  { id: 'displays', name: 'Displays' },
  { id: 'accessories', name: 'Accessories' }
];

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

  // Responsive state
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screens
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    // Use mock categories instead of API call
    setCategories(MOCK_CATEGORIES);
  }, []);

  useEffect(() => {
    // Simulate loading
    setLoading(true);

    // Simulate API delay
    const timer = setTimeout(() => {
      try {
        // Filter products based on selected filters
        let filteredProducts = [...MOCK_PRODUCTS];

        // Filter by category
        if (selectedCategory) {
          filteredProducts = filteredProducts.filter(
            product => product.category.toLowerCase() === selectedCategory.toLowerCase()
          );
        }

        // Filter by price range
        if (priceRange.min) {
          filteredProducts = filteredProducts.filter(
            product => product.price >= Number(priceRange.min)
          );
        }

        if (priceRange.max) {
          filteredProducts = filteredProducts.filter(
            product => product.price <= Number(priceRange.max)
          );
        }

        // Filter by search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredProducts = filteredProducts.filter(
            product =>
              product.name.toLowerCase().includes(query) ||
              product.category.toLowerCase().includes(query)
          );
        }

        // Calculate pagination
        const totalItems = filteredProducts.length;
        const calculatedTotalPages = Math.ceil(totalItems / productsPerPage);

        // Get current page items
        const startIndex = (currentPage - 1) * productsPerPage;
        const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

        setProducts(paginatedProducts);
        setTotalPages(calculatedTotalPages);
        setLoading(false);
      } catch (err) {
        setError('Failed to load products. Please try again.');
        setLoading(false);
        console.error('Error processing products:', err);
      }
    }, 500); // Simulate network delay

    return () => clearTimeout(timer);
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
                className="w-full md:w-64 bg-[#1a1a1a] border border-gray-700 rounded-md py-3 sm:py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#00a8ff] focus:border-transparent"
                autoComplete="off"
                autoCapitalize="off"
                spellCheck="false"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white touch-manipulation"
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
                    className="w-full bg-[#0a0a0a] border border-gray-700 rounded-md py-3 sm:py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#00a8ff] focus:border-transparent"
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    name="max"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={handlePriceRangeChange}
                    className="w-full bg-[#0a0a0a] border border-gray-700 rounded-md py-3 sm:py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#00a8ff] focus:border-transparent"
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                </div>
              </div>

              <button
                onClick={handleClearFilters}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 sm:py-2 rounded-md transition-colors duration-200 touch-manipulation"
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
                    <LazyLoad
                      key={product.id}
                      placeholder={
                        <div className="bg-gray-800 rounded-lg aspect-square animate-pulse">
                          <div className="h-full w-full flex items-center justify-center">
                            <div className="w-12 h-12 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
                          </div>
                        </div>
                      }
                      rootMargin="200px"
                    >
                      <ProductCard product={product} />
                    </LazyLoad>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <nav className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 sm:px-3 sm:py-1 rounded-md touch-manipulation ${
                          currentPage === 1
                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-800 text-white hover:bg-gray-700'
                        }`}
                        aria-label="Previous page"
                      >
                        Previous
                      </button>

                      {/* Show limited pagination on mobile */}
                      {[...Array(totalPages)].map((_, index) => {
                        // On mobile, only show current page, first, last, and adjacent pages
                        const showOnMobile =
                          index === 0 ||
                          index === totalPages - 1 ||
                          Math.abs(index + 1 - currentPage) <= 1;

                        if (isMobile && !showOnMobile) return null;

                        return (
                          <button
                            key={index}
                            onClick={() => handlePageChange(index + 1)}
                            className={`px-4 py-2 sm:px-3 sm:py-1 rounded-md touch-manipulation ${
                              currentPage === index + 1
                                ? 'bg-[#00a8ff] text-white'
                                : 'bg-gray-800 text-white hover:bg-gray-700'
                            }`}
                            aria-label={`Page ${index + 1}`}
                            aria-current={currentPage === index + 1 ? 'page' : undefined}
                          >
                            {index + 1}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 sm:px-3 sm:py-1 rounded-md touch-manipulation ${
                          currentPage === totalPages
                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-800 text-white hover:bg-gray-700'
                        }`}
                        aria-label="Next page"
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
