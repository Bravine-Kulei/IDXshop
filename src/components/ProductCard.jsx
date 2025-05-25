import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, ShoppingCart, Heart } from 'lucide-react';
import QuickView from './QuickView';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Handle quick view toggle
  const openQuickView = (e) => {
    e.preventDefault();
    setIsQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setIsQuickViewOpen(false);
  };

  // Get cart and wishlist functions from context
  const { addToCart: contextAddToCart } = useCart();
  const { isInWishlist, toggleWishlistItem } = useWishlist();

  // State for cart and wishlist feedback
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isAddedToWishlist, setIsAddedToWishlist] = useState(false);

  // Check if product is in wishlist on component mount
  useEffect(() => {
    setIsAddedToWishlist(isInWishlist(product.id));
  }, [isInWishlist, product.id]);

  // Function for adding to cart with visual feedback
  const addToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('Cart button clicked for product:', product);

    // Show visual feedback
    setIsAddedToCart(true);

    try {
      // Add to cart using context
      contextAddToCart(product, 1);
      console.log(`Successfully called contextAddToCart for ${product.name}`);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }

    // Reset visual feedback after delay
    setTimeout(() => {
      setIsAddedToCart(false);
    }, 1500);
  };

  // Function for adding to wishlist with visual feedback
  const addToWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Toggle wishlist using context
    toggleWishlistItem(product);

    // Update local state
    setIsAddedToWishlist(!isAddedToWishlist);

    console.log(isAddedToWishlist
      ? `Removed ${product.name} from wishlist`
      : `Added ${product.name} to wishlist`
    );
  };

  return (
    <>
      <div
        className="group bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link to={`/products/${product.id}`} className="block relative">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden bg-gray-900">
            <img
              src={product.image || 'https://placehold.co/300x300'}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />

            {/* Discount Badge (if applicable) */}
            {product.discount && (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                {product.discount}% OFF
              </div>
            )}

            {/* Quick Actions Overlay - Visible on hover (desktop) and always partially visible on mobile */}
            <div
              className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center gap-2 transition-opacity duration-300
                ${isHovered ? 'opacity-100' : 'md:opacity-0 opacity-100'}
                ${!isHovered ? 'bg-gradient-to-t from-black via-transparent to-transparent md:bg-black md:bg-opacity-40' : ''}
              `}
            >
              <div className={`flex gap-2 ${!isHovered ? 'absolute bottom-3 right-3 md:static' : ''}`}>
                <button
                  onClick={openQuickView}
                  className="bg-white text-gray-900 p-2 rounded-full hover:bg-blue-500 hover:text-white transition-colors touch-manipulation"
                  aria-label="Quick view"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={addToCart}
                  className={`p-2 rounded-full transition-colors touch-manipulation ${
                    isAddedToCart
                      ? 'bg-green-500 text-white'
                      : 'bg-white text-gray-900 hover:bg-blue-500 hover:text-white'
                  }`}
                  aria-label={isAddedToCart ? "Added to cart" : "Add to cart"}
                  disabled={isAddedToCart}
                >
                  <ShoppingCart size={18} className={isAddedToCart ? 'animate-bounce' : ''} />
                </button>
                <button
                  onClick={addToWishlist}
                  className={`p-2 rounded-full transition-colors touch-manipulation ${
                    isAddedToWishlist
                      ? 'bg-red-500 text-white'
                      : 'bg-white text-gray-900 hover:bg-blue-500 hover:text-white'
                  }`}
                  aria-label={isAddedToWishlist ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart
                    size={18}
                    className={isAddedToWishlist ? 'fill-current animate-pulse' : ''}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4">
            {/* Category */}
            <div className="text-gray-400 text-xs mb-1">{product.category || 'Category'}</div>

            {/* Product Name */}
            <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors line-clamp-2 min-h-[2.5rem]">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center mt-1 mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < (product.rating || 4) ? "text-yellow-400" : "text-gray-600"}>★</span>
                ))}
              </div>
              <span className="text-gray-400 text-xs ml-1">({product.reviews || '0'})</span>
            </div>

            {/* Price */}
            <div className="flex items-center mb-2">
              <span className="text-lg font-bold">${product.price?.toFixed(2) || '99.99'}</span>

              {product.originalPrice && (
                <span className="text-gray-400 text-sm line-through ml-2">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>


          </div>
        </Link>
      </div>

      {/* Quick View Modal */}
      <QuickView
        product={product}
        isOpen={isQuickViewOpen}
        onClose={closeQuickView}
      />
    </>
  );
};

export default ProductCard;
