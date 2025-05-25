import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock, ArrowRight } from 'lucide-react';

// Mock data for search suggestions - in a real app, this would come from an API
const MOCK_SUGGESTIONS = [
  { id: 1, name: 'Gaming Laptops', category: 'Laptops' },
  { id: 2, name: 'Mechanical Keyboards', category: 'Peripherals' },
  { id: 3, name: 'Wireless Mouse', category: 'Peripherals' },
  { id: 4, name: 'Graphics Cards', category: 'Components' },
  { id: 5, name: 'SSD Storage', category: 'Storage' },
  { id: 6, name: 'Gaming Monitors', category: 'Displays' },
  { id: 7, name: 'USB-C Hubs', category: 'Accessories' },
  { id: 8, name: 'Laptop Cooling Pads', category: 'Accessories' }
];

const SearchBar = ({ isOpen, onClose, className }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const navigate = useNavigate();

  // Load search history from localStorage on component mount
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    setSearchHistory(history);
  }, []);

  // Focus the input when the search bar is opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle clicks outside the search container to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsFocused(false);
        if (searchTerm.trim() === '') {
          onClose();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, searchTerm]);

  // Filter suggestions based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSuggestions([]);
      return;
    }

    const filteredSuggestions = MOCK_SUGGESTIONS.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5); // Limit to 5 suggestions

    setSuggestions(filteredSuggestions);
  }, [searchTerm]);

  // Add search term to history and navigate to search results
  const handleSearch = (term) => {
    if (!term.trim()) return;

    // Add to search history (avoid duplicates and limit to 5 items)
    const newHistory = [
      term,
      ...searchHistory.filter(item => item !== term)
    ].slice(0, 5);

    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));

    // Navigate to search results
    navigate(`/products?search=${encodeURIComponent(term)}`);
    setSearchTerm('');
    onClose();
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };

  // Clear search history
  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  // Remove a single item from search history
  const removeHistoryItem = (index) => {
    const newHistory = [...searchHistory];
    newHistory.splice(index, 1);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  if (!isOpen) return null;

  return (
    <div
      className={`search-container ${className}`}
      ref={searchContainerRef}
    >
      <div className="relative">
        <form onSubmit={handleSubmit} className="relative">
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Search for products..."
            className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg py-3 sm:py-2 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
            aria-label="Search"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white touch-manipulation"
              aria-label="Clear search"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </form>

        {/* Dropdown for suggestions and history */}
        {isFocused && (searchTerm || searchHistory.length > 0) && (
          <div className="absolute z-50 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden max-h-[60vh] sm:max-h-[50vh] overflow-y-auto">
            {/* Search suggestions */}
            {searchTerm && suggestions.length > 0 && (
              <div className="p-2">
                <h3 className="text-xs text-gray-400 uppercase mb-2 px-2">Suggestions</h3>
                <ul>
                  {suggestions.map((suggestion) => (
                    <li key={suggestion.id}>
                      <button
                        onClick={() => handleSearch(suggestion.name)}
                        className="w-full text-left px-2 py-3 sm:py-2 hover:bg-gray-700 rounded flex items-center justify-between group touch-manipulation"
                      >
                        <div className="flex items-center flex-1 min-w-0">
                          <Search className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                          <span className="text-white truncate">{suggestion.name}</span>
                        </div>
                        <span className="text-gray-400 text-sm ml-2 flex-shrink-0">{suggestion.category}</span>
                        <ArrowRight className="h-4 w-4 text-gray-400 ml-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Search history */}
            {searchHistory.length > 0 && (
              <div className="p-2 border-t border-gray-700">
                <div className="flex justify-between items-center mb-2 px-2">
                  <h3 className="text-xs text-gray-400 uppercase">Recent Searches</h3>
                  <button
                    onClick={clearSearchHistory}
                    className="text-xs text-blue-400 hover:text-blue-300 py-1 px-2 touch-manipulation"
                  >
                    Clear All
                  </button>
                </div>
                <ul>
                  {searchHistory.map((term, index) => (
                    <li key={index} className="flex items-center justify-between group">
                      <button
                        onClick={() => handleSearch(term)}
                        className="flex-grow text-left px-2 py-3 sm:py-2 hover:bg-gray-700 rounded flex items-center touch-manipulation"
                      >
                        <Clock className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                        <span className="text-white truncate">{term}</span>
                      </button>
                      <button
                        onClick={() => removeHistoryItem(index)}
                        className="p-2 text-gray-400 hover:text-white md:opacity-0 opacity-100 md:group-hover:opacity-100 transition-opacity touch-manipulation"
                        aria-label="Remove from history"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* No results */}
            {searchTerm && suggestions.length === 0 && (
              <div className="p-4 text-center text-gray-400 text-sm sm:text-base">
                No results found for "{searchTerm}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
