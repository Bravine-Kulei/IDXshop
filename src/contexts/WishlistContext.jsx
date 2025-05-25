import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const WishlistContext = createContext();

// Custom hook to use the wishlist context
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

// Provider component
export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  
  // Load wishlist from localStorage on mount
  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem('wishlistItems')) || [];
    setWishlistItems(storedWishlist);
  }, []);
  
  // Update wishlist count whenever wishlistItems changes
  useEffect(() => {
    setWishlistCount(wishlistItems.length);
    
    // Save to localStorage
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
  }, [wishlistItems]);
  
  // Add item to wishlist
  const addToWishlist = (product) => {
    // Check if product is already in wishlist
    if (!wishlistItems.some(item => item.id === product.id)) {
      setWishlistItems(prevItems => [
        ...prevItems, 
        {
          ...product,
          addedAt: new Date().toISOString()
        }
      ]);
    }
  };
  
  // Remove item from wishlist
  const removeFromWishlist = (productId) => {
    setWishlistItems(prevItems => prevItems.filter(item => item.id !== productId));
  };
  
  // Toggle wishlist item
  const toggleWishlistItem = (product) => {
    const isInWishlist = wishlistItems.some(item => item.id === product.id);
    
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };
  
  // Check if item is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };
  
  // Clear wishlist
  const clearWishlist = () => {
    setWishlistItems([]);
    localStorage.removeItem('wishlistItems');
  };
  
  // Context value
  const value = {
    wishlistItems,
    wishlistCount,
    addToWishlist,
    removeFromWishlist,
    toggleWishlistItem,
    isInWishlist,
    clearWishlist
  };
  
  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;
