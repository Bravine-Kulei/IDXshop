import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
    slug: string;
  };
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  loading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { isSignedIn, getToken } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const refreshCart = async () => {
    if (!isSignedIn) {
      setItems([]);
      return;
    }

    try {
      setLoading(true);
      const token = await getToken();
      const response = await axios.get('/cart', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setItems(response.data.data.items || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!isSignedIn) {
      throw new Error('Please sign in to add items to cart');
    }

    try {
      const token = await getToken();
      await axios.post('/cart/add', {
        productId,
        quantity
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      await refreshCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (!isSignedIn) return;

    try {
      const token = await getToken();
      await axios.delete(`/cart/items/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      await refreshCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!isSignedIn) return;

    try {
      const token = await getToken();
      await axios.put(`/cart/items/${itemId}`, {
        quantity
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      await refreshCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    if (!isSignedIn) return;

    try {
      const token = await getToken();
      await axios.delete('/cart', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      refreshCart();
    } else {
      setItems([]);
    }
  }, [isSignedIn]);

  const value: CartContextType = {
    items,
    totalItems,
    totalAmount,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    refreshCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
