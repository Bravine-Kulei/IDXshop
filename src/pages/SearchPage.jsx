import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search } from 'lucide-react';

// Mock product data - using actual database UUIDs
const MOCK_PRODUCTS = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Gaming Laptop Pro X',
    category: 'Laptops',
    price: 1099.99,
    image: 'https://placehold.co/300x200?text=Gaming+Laptop+Pro+X',
    rating: 4.5,
    reviews: 128
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    name: 'Mechanical RGB Keyboard',
    category: 'Peripherals',
    price: 129.99,
    image: 'https://placehold.co/300x200?text=Mechanical+RGB+Keyboard',
    rating: 4.7,
    reviews: 245
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    name: 'Wireless Gaming Mouse',
    category: 'Peripherals',
    price: 69.99,
    image: 'https://placehold.co/300x200?text=Wireless+Gaming+Mouse',
    rating: 4.6,
    reviews: 189
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    name: 'RTX 4070 Graphics Card',
    category: 'Components',
    price: 599.99,
    image: 'https://placehold.co/300x200?text=RTX+4070+Graphics+Card',
    rating: 4.8,
    reviews: 156
  },
  {
    id: 5,
    name: '1TB NVMe SSD',
    category: 'Storage',
    price: 119.99,
    image: 'https://placehold.co/300x200',
    rating: 4.9,
    reviews: 312
  },
  {
    id: 6,
    name: '27" 144Hz Gaming Monitor',
    category: 'Displays',
    price: 299.99,
    image: 'https://placehold.co/300x200',
    rating: 4.7,
    reviews: 178
  },
  {
    id: 7,
    name: 'USB-C Hub 7-in-1',
    category: 'Accessories',
    price: 39.99,
    image: 'https://placehold.co/300x200',
    rating: 4.4,
    reviews: 95
  },
  {
    id: 8,
    name: 'Laptop Cooling Pad',
    category: 'Accessories',
    price: 29.99,
    image: 'https://placehold.co/300x200',
    rating: 4.3,
    reviews: 87
  }
];

// Categories for filtering
const CATEGORIES = [
  'All Categories',
  'Laptops',
  'Peripherals',
  'Components',
  'Storage',
  'Displays',
  'Accessories'
];

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState('relevance');

  // Update search term when URL parameter changes
  useEffect(() => {
    setSearchTerm(searchQuery);
  }, [searchQuery]);

  // Filter and sort products based on search term, category, and sort option
  useEffect(() => {
    let results = [...MOCK_PRODUCTS];

    // Filter by search term
    if (searchTerm) {
      results = results.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All Categories') {
      results = results.filter(product => product.category === selectedCategory);
    }

    // Sort results
    switch (sortOption) {
      case 'price-low':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'relevance':
      default:
        // For relevance, we could implement a more complex scoring algorithm
        // For now, we'll just keep the default order
        break;
    }

    setFilteredProducts(results);
  }, [searchTerm, selectedCategory, sortOption]);

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ q: searchTerm });

    // Add to search history
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    const newHistory = [
      searchTerm,
      ...history.filter(item => item !== searchTerm)
    ].slice(0, 5);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          {searchTerm ? `Search Results for "${searchTerm}"` : 'Search Products'}
        </h1>

        {/* Search form */}
        <form onSubmit={handleSearch} className="max-w-2xl">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for products..."
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <button
              type="submit"
              className="absolute right-3 top-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md transition duration-200"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Filters and sorting */}
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex items-center">
          <label htmlFor="sort" className="text-gray-400 mr-2">Sort by:</label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="relevance">Relevance</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Search results */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition duration-300">
              <Link to={`/products/${product.id}`}>
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                  <p className="text-gray-400 text-sm mb-2">{product.category}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-white">${product.price.toFixed(2)}</span>
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">★</span>
                      <span>{product.rating} ({product.reviews})</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">
            <Search className="h-24 w-24 mx-auto opacity-20" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">No results found</h2>
          <p className="text-gray-400 mb-6">
            {searchTerm
              ? `We couldn't find any products matching "${searchTerm}"`
              : 'Try searching for products using the search bar above'}
          </p>
          <Link to="/products" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-200">
            Browse All Products
          </Link>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
