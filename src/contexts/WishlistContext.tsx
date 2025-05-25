import React, { createContext, useContext, useState } from 'react';

interface WishlistContextType {
  items: any[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

interface WishlistProviderProps {
  children: React.ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [items, setItems] = useState<any[]>([]);

  const addToWishlist = (productId: string) => {
    // TODO: Implement wishlist functionality
    console.log('Add to wishlist:', productId);
  };

  const removeFromWishlist = (productId: string) => {
    // TODO: Implement wishlist functionality
    console.log('Remove from wishlist:', productId);
  };

  const value: WishlistContextType = {
    items,
    addToWishlist,
    removeFromWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
