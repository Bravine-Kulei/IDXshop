import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const CartContext = createContext();

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Provider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(storedCart);
  }, []);

  // Update cart count and total whenever cartItems changes
  useEffect(() => {
    // Calculate total items in cart
    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    setCartCount(itemCount);

    // Calculate cart total
    const total = cartItems.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0);
    setCartTotal(total);

    // Save to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    console.log('Adding to cart:', product, 'quantity:', quantity);

    if (!product || !product.id) {
      console.error('Invalid product:', product);
      return;
    }

    setCartItems(prevItems => {
      // Check if product is already in cart
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);

      let newItems;
      if (existingItemIndex >= 0) {
        // Update quantity if already in cart
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        // Ensure price is set correctly
        if (updatedItems[existingItemIndex].price === undefined) {
          updatedItems[existingItemIndex].price = product.salePrice || product.regularPrice || product.price || 0;
        }
        newItems = updatedItems;
        console.log('Updated existing item in cart, new quantity:', updatedItems[existingItemIndex].quantity);
      } else {
        // Add new item to cart
        const price = product.salePrice || product.regularPrice || product.price || 0;
        newItems = [...prevItems, {
          ...product,
          price, // Ensure price is set explicitly
          quantity,
          addedAt: new Date().toISOString()
        }];
        console.log('Added new item to cart');
      }

      // Log the new cart state
      console.log('New cart state:', newItems);
      return newItems;
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  // Context value
  const value = {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
