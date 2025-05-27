import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight, Star, ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';

const QuickView = ({ product, isOpen, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const modalRef = useRef(null);

  // Mock product images - in a real app, these would come from the product data
  const productImages = [
    product?.image || 'https://placehold.co/600x400',
    'https://placehold.co/600x400?text=Image+2',
    'https://placehold.co/600x400?text=Image+3',
    'https://placehold.co/600x400?text=Image+4'
  ];

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedImage(0);
      setQuantity(1);
    }
  }, [isOpen]);

  if (!isOpen || !product) return null;

  // Handle image navigation
  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  // Handle quantity changes
  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Get cart and wishlist functions from context
  const { addToCart: contextAddToCart } = useCart();
  const { isInWishlist, toggleWishlistItem } = useWishlist();

  // State for wishlist UI
  const [productInWishlist, setProductInWishlist] = useState(false);

  // Check if product is in wishlist on component mount or when product changes
  useEffect(() => {
    if (product) {
      setProductInWishlist(isInWishlist(product.id));
    }
  }, [product, isInWishlist]);

  // Function for adding to cart
  const addToCart = async () => {
    if (product) {
      try {
        // Add to cart using context (pass productId instead of entire product)
        await contextAddToCart(product.id.toString(), quantity);

        console.log(`Added ${quantity} of ${product.name} to cart`);

        // Close the modal
        onClose();
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    }
  };

  // Function for toggling wishlist
  const toggleWishlist = () => {
    if (product) {
      // Toggle wishlist using context
      toggleWishlistItem(product);

      // Update local state
      setProductInWishlist(!productInWishlist);

      console.log(productInWishlist
        ? `Removed ${product.name} from wishlist`
        : `Added ${product.name} to wishlist`
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-2 sm:p-4">
      <div
        ref={modalRef}
        className="bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h2 className="text-xl font-semibold truncate">{product.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 p-3 sm:p-6">
            {/* Product Images */}
            <div className="space-y-3 sm:space-y-4">
              <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-square">
                <img
                  src={productImages[selectedImage]}
                  alt={`${product.name} - View ${selectedImage + 1}`}
                  className="w-full h-full object-contain"
                  loading={selectedImage === 0 ? "eager" : "lazy"}
                  decoding="async"
                />

                {/* Image navigation buttons */}
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-1 text-white transition-all touch-manipulation"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-1 text-white transition-all touch-manipulation"
                  aria-label="Next image"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Thumbnail navigation - scrollable on mobile */}
              <div className="flex space-x-2 overflow-x-auto pb-2 snap-x">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-md overflow-hidden border-2 snap-start ${
                      selectedImage === index ? 'border-blue-500' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-3 sm:space-y-4">
              <div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
                  <span className="text-xl sm:text-2xl font-bold mb-1 sm:mb-0">${product.price?.toFixed(2) || '99.99'}</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm sm:text-base">{product.rating || '4.5'}</span>
                    <span className="text-gray-400 ml-1 text-xs sm:text-sm">({product.reviews || '128'} reviews)</span>
                  </div>
                </div>

                {/* Availability */}
                <div className="text-xs sm:text-sm mb-3 sm:mb-4">
                  <span className="text-green-500">● In Stock</span>
                  <span className="text-gray-400 ml-2">SKU: {product.id || 'PROD-001'}</span>
                </div>
              </div>

              {/* Short Description - Collapsible on mobile */}
              <div className="text-sm sm:text-base text-gray-300">
                <p className="line-clamp-3 sm:line-clamp-none">
                  {product.description || 'This high-quality product features premium materials and exceptional craftsmanship. Perfect for both professional and personal use, it offers reliability and performance that exceeds expectations.'}
                </p>
              </div>

              {/* Key Features - Simplified on mobile */}
              <div className="hidden sm:block">
                <h3 className="font-semibold mb-2 text-sm sm:text-base">Key Features:</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm sm:text-base">
                  <li>Premium quality materials</li>
                  <li>Durable construction</li>
                  <li>Ergonomic design</li>
                  <li>1-year warranty</li>
                </ul>
              </div>

              {/* Quantity Selector - Touch-friendly */}
              <div className="flex items-center space-x-3 sm:space-x-4">
                <span className="text-gray-300 text-sm sm:text-base">Quantity:</span>
                <div className="flex items-center">
                  <button
                    onClick={decreaseQuantity}
                    className="bg-gray-800 hover:bg-gray-700 text-white w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-l-md touch-manipulation"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-12 h-9 sm:h-8 text-center bg-gray-800 border-x border-gray-700 text-white"
                    inputMode="numeric"
                  />
                  <button
                    onClick={increaseQuantity}
                    className="bg-gray-800 hover:bg-gray-700 text-white w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-r-md touch-manipulation"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons - Full width on mobile */}
              <div className="flex space-x-3 pt-2">
                <button
                  onClick={addToCart}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 sm:py-2 px-4 rounded-md flex items-center justify-center transition-colors touch-manipulation"
                >
                  <ShoppingCart size={18} className="mr-2" />
                  <span className="text-sm sm:text-base">Add to Cart</span>
                </button>
                <button
                  onClick={toggleWishlist}
                  className={`p-3 sm:p-2 rounded-md transition-colors touch-manipulation ${
                    productInWishlist
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-800 hover:bg-gray-700 text-white'
                  }`}
                  aria-label={productInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart
                    size={18}
                    className={productInWishlist ? 'fill-current' : ''}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-800 p-3 sm:p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
          <span className="text-gray-400 text-sm sm:text-base">Category: {product.category || 'Electronics'}</span>
          <Link
            to={`/products/${product.id}`}
            className="text-blue-500 hover:text-blue-400 transition-colors text-center sm:text-left text-sm sm:text-base py-1 sm:py-0"
            onClick={onClose}
          >
            View Full Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuickView;
