import React, { createContext, useContext, useState, useEffect } from 'react';

// Maximum number of recently viewed products to store
const MAX_RECENTLY_VIEWED = 8;

// Create context
const RecentlyViewedContext = createContext();

// Custom hook to use the recently viewed context
export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
};

// Provider component
export const RecentlyViewedProvider = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Load recently viewed products from localStorage on mount
  useEffect(() => {
    try {
      const storedProducts = JSON.parse(localStorage.getItem('recentlyViewedProducts')) || [];
      setRecentlyViewed(storedProducts);
    } catch (error) {
      console.error('Error loading recently viewed products:', error);
      // If there's an error, reset the storage
      localStorage.removeItem('recentlyViewedProducts');
      setRecentlyViewed([]);
    }
  }, []);

  // Save to localStorage whenever recentlyViewed changes
  useEffect(() => {
    try {
      localStorage.setItem('recentlyViewedProducts', JSON.stringify(recentlyViewed));
    } catch (error) {
      console.error('Error saving recently viewed products to localStorage:', error);
    }
  }, [recentlyViewed]);

  // Add a product to recently viewed
  const addToRecentlyViewed = (product) => {
    if (!product || !product.id) {
      console.error('Invalid product:', product);
      return;
    }

    setRecentlyViewed(prevProducts => {
      // Remove the product if it already exists (to move it to the front)
      const filteredProducts = prevProducts.filter(item => item.id !== product.id);

      // Add the product to the beginning of the array
      const newProducts = [
        {
          ...product,
          viewedAt: new Date().toISOString()
        },
        ...filteredProducts
      ];

      // Limit to MAX_RECENTLY_VIEWED items
      return newProducts.slice(0, MAX_RECENTLY_VIEWED);
    });
  };

  // Remove a product from recently viewed
  const removeFromRecentlyViewed = (productId) => {
    setRecentlyViewed(prevProducts =>
      prevProducts.filter(product => product.id !== productId)
    );
  };

  // Clear all recently viewed products
  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
    try {
      localStorage.removeItem('recentlyViewedProducts');
    } catch (error) {
      console.error('Error clearing recently viewed products from localStorage:', error);
    }
  };

  // Context value
  const value = {
    recentlyViewed,
    addToRecentlyViewed,
    removeFromRecentlyViewed,
    clearRecentlyViewed
  };

  return (
    <RecentlyViewedContext.Provider value={value}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};

export default RecentlyViewedContext;
