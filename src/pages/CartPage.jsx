import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const CartPage = () => {
  // Get cart data and functions from context (using TypeScript context API)
  const { items, totalAmount, loading, updateQuantity, removeFromCart } = useCart();

  // Calculate additional costs
  const subtotal = totalAmount;
  const shipping = items.length > 0 ? 10.00 : 0;
  const tax = subtotal * 0.07;
  const total = subtotal + shipping + tax;

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading cart...</p>
        </div>
      </div>
    );
  }

  // Update quantity wrapper
  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
  };

  // Remove item wrapper
  const removeItem = (id) => {
    removeFromCart(id);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-xl mb-4">Your cart is empty</p>
          <Link to="/products" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/3">
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left">Product</th>
                    <th className="py-3 px-4 text-center">Quantity</th>
                    <th className="py-3 px-4 text-right">Price</th>
                    <th className="py-3 px-4 text-right">Total</th>
                    <th className="py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.id} className="border-t border-gray-700">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <img src={item.product.imageUrl} alt={item.product.name} className="w-16 h-16 mr-4 rounded" />
                          <span>{item.product.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="bg-gray-700 hover:bg-gray-600 text-white w-8 h-8 rounded-l"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-12 h-8 text-center bg-gray-700 text-white border-0"
                          />
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="bg-gray-700 hover:bg-gray-600 text-white w-8 h-8 rounded-r"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">${(item.product.price || 0).toFixed(2)}</td>
                      <td className="py-4 px-4 text-right">${((item.product.price || 0) * item.quantity).toFixed(2)}</td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-400"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="md:w-1/3">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${(subtotal || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${(shipping || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${(tax || 0).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-700 pt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span>${(total || 0).toFixed(2)}</span>
                </div>
              </div>
              <Link
                to="/checkout"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-bold py-3 px-4 rounded transition duration-300"
              >
                Proceed to Checkout
              </Link>
              <Link
                to="/products"
                className="block w-full text-center mt-4 text-blue-500 hover:underline"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
