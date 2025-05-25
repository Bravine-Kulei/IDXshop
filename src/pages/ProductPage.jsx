import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Heart,
  Share2,
  Mail,
  Clock,
  ChevronRight,
  ChevronLeft,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useRecentlyViewed } from '../contexts/RecentlyViewedContext';
import RecentlyViewedProducts from '../components/RecentlyViewedProducts';
import ShippingInfo from '../components/ShippingInfo';
import ReturnPolicy from '../components/ReturnPolicy';
import WarrantyInfo from '../components/WarrantyInfo';
import PaymentOptions from '../components/PaymentOptions';
import LiveChatSupport from '../components/LiveChatSupport';

const ProductPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);

  // Refs for cleanup and tracking
  const timeoutRef = useRef(null);
  const productAddedToRecentlyViewedRef = useRef(false);

  // Get context hooks
  const { addToCart } = useCart();
  const { isInWishlist: checkIsInWishlist, toggleWishlistItem } = useWishlist();
  const { addToRecentlyViewed } = useRecentlyViewed();

  // Track if product is in wishlist
  const [inWishlist, setInWishlist] = useState(false);

  // Reset the ref when slug changes
  useEffect(() => {
    productAddedToRecentlyViewedRef.current = false;
  }, [slug]);

  // Cleanup effect to clear timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        // For demo purposes, let's create a mock product instead of making an API call
        // In a real app, you would use the API call below
        // const response = await axios.get(`/api/products/${slug}`);

        // Mock product data
        const mockProduct = {
          id: parseInt(slug),
          name: "Premium Gaming Laptop",
          brand: "TechPro",
          model: "X9000",
          description: "High-performance gaming laptop with the latest graphics and processing power. Perfect for gaming and content creation.",
          regularPrice: 1299.99,
          salePrice: 1099.99,
          stockQuantity: 15,
          sku: "GP-X9000-01",
          minOrderQuantity: 1,
          maxOrderQuantity: 5,
          categories: [
            { id: 1, name: "Laptops" },
            { id: 2, name: "Gaming" }
          ],
          images: [
            {
              imageUrl: "https://placehold.co/600x400?text=Gaming+Laptop",
              altText: "TechPro X9000 Gaming Laptop"
            },
            {
              imageUrl: "https://placehold.co/600x400?text=Side+View",
              altText: "TechPro X9000 Side View"
            },
            {
              imageUrl: "https://placehold.co/600x400?text=Keyboard",
              altText: "TechPro X9000 Keyboard"
            }
          ]
        };

        setProduct(mockProduct);
        setLoading(false);

        // Check if product is in wishlist
        if (mockProduct && mockProduct.id) {
          setInWishlist(checkIsInWishlist(mockProduct.id));
        }

        // Add to recently viewed (only once)
        if (mockProduct && !productAddedToRecentlyViewedRef.current) {
          addToRecentlyViewed(mockProduct);
          productAddedToRecentlyViewedRef.current = true;
        }
      } catch (err) {
        setError('Failed to load product. Please try again.');
        setLoading(false);
        console.error('Error fetching product:', err);
      }
    };

    fetchProduct();
  }, [slug, checkIsInWishlist]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleQuantityChange = (newQuantity) => {
    // Ensure quantity is within allowed range
    const min = product.minOrderQuantity || 1;
    const max = product.maxOrderQuantity || 10;

    if (newQuantity >= min && newQuantity <= max) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    try {
      setAddingToCart(true);

      // Add to cart using context
      addToCart(product, quantity);

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Show success message
      setAddedToCart(true);
      timeoutRef.current = setTimeout(() => setAddedToCart(false), 3000);
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError('Failed to add product to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleWishlist = () => {
    try {
      setAddingToWishlist(true);

      // Toggle wishlist using context
      toggleWishlistItem(product);

      // Update local state
      setInWishlist(!inWishlist);
    } catch (err) {
      console.error('Error updating wishlist:', err);
    } finally {
      setAddingToWishlist(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Product Not Found</h2>
        <p className="text-gray-400 mb-4">{error || 'This product could not be found.'}</p>
        <Link to="/products" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      {/* Product watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 z-0">
        <h1 className="text-[20vw] font-bold uppercase text-gray-700">
          {product.categories[0]?.name || 'PRODUCT'}
        </h1>
      </div>

      {/* Social sharing sidebar */}
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-6 z-10">
        <button className="text-gray-400 hover:text-white transition-colors">
          <Share2 className="h-5 w-5" />
        </button>
        <button className="text-gray-400 hover:text-white transition-colors">
          <Heart className="h-5 w-5" />
        </button>
        <button className="text-gray-400 hover:text-white transition-colors">
          <Mail className="h-5 w-5" />
        </button>
        <button className="text-gray-400 hover:text-white transition-colors">
          <Clock className="h-5 w-5" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 relative z-10">
        <div className="flex flex-col md:flex-row">
          {/* Product details - left side */}
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              {product.brand} — {product.name}
              <br />
              {product.model}
            </h1>

            {/* Pricing */}
            <div className="mt-6 mb-8">
              {product.salePrice ? (
                <>
                  <span className="text-gray-400 line-through mr-3">${product.regularPrice}</span>
                  <span className="text-[#00a8ff] text-3xl font-bold">${product.salePrice}</span>
                </>
              ) : (
                <span className="text-[#00a8ff] text-3xl font-bold">${product.regularPrice}</span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-400 mb-8">
              {product.description}
            </p>

            {/* Add to cart section */}
            <div className="flex items-center space-x-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || product.stockQuantity === 0}
                className={`
                  px-6 py-3 rounded-md font-medium transition-colors duration-200
                  ${product.stockQuantity === 0
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-[#00a8ff] hover:bg-[#0090e0] text-white'
                  }
                `}
              >
                {addingToCart ? 'Adding...' : product.stockQuantity === 0 ? 'Out of Stock' : 'Add to cart'}
              </button>

              <button
                onClick={handleToggleWishlist}
                disabled={addingToWishlist}
                className={`
                  p-3 rounded-md transition-colors duration-200
                  ${inWishlist
                    ? 'bg-pink-600 text-white'
                    : 'bg-transparent border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500'
                  }
                `}
              >
                <Heart className="h-5 w-5" />
              </button>
            </div>

            {/* Quantity selector */}
            <div className="mb-8">
              <h3 className="text-sm font-medium mb-2">Quantity</h3>
              <div className="flex items-center">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= (product.minOrderQuantity || 1)}
                  className="p-2 border border-gray-700 rounded-l-md text-gray-400 hover:text-white"
                >
                  -
                </button>
                <span className="px-4 py-2 border-t border-b border-gray-700 text-center min-w-[50px]">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= (product.maxOrderQuantity || 10)}
                  className="p-2 border border-gray-700 rounded-r-md text-gray-400 hover:text-white"
                >
                  +
                </button>

                <div className="ml-4 flex items-center">
                  <span className="text-gray-400 mr-2">1</span>
                  <div className="w-32 h-1 bg-gray-700 rounded-full">
                    <div
                      className="h-1 bg-[#00a8ff] rounded-full"
                      style={{ width: `${(quantity / (product.maxOrderQuantity || 4)) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-400 ml-2">{product.maxOrderQuantity || 4}</span>
                </div>
              </div>
            </div>

            {/* Additional info */}
            <div className="border-t border-gray-800 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">SKU</h3>
                  <p>{product.sku}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Category</h3>
                  <p>{product.categories.map(cat => cat.name).join(', ')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product image - right side */}
          <div className="md:w-1/2 relative">
            <div className="relative">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[currentImageIndex].imageUrl}
                  alt={product.images[currentImageIndex].altText || product.name}
                  className="w-full h-auto object-contain"
                  loading={currentImageIndex === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
              ) : (
                <div className="w-full h-96 bg-gray-800 flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}

              {/* Image navigation */}
              {product.images && product.images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full"
                  >
                    <ChevronLeft className="h-6 w-6 text-white" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full"
                  >
                    <ChevronRight className="h-6 w-6 text-white" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail navigation */}
            {product.images && product.images.length > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-16 h-16 border-2 ${
                      currentImageIndex === index
                        ? 'border-[#00a8ff]'
                        : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image.imageUrl}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>



        {/* Product Information Accordions */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-4">Product Information</h2>
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <ShippingInfo />
            <ReturnPolicy />
            <WarrantyInfo warrantyLength={product.warranty || "1-Year"} />
            <PaymentOptions />
          </div>
        </div>

        {/* Recently Viewed Products */}
        <div className="mt-8 mb-12">
          <h2 className="text-xl font-bold mb-4">Recently Viewed</h2>
          <RecentlyViewedProducts maxItems={4} />
        </div>

        {/* Live Chat Support */}
        <LiveChatSupport />

        {/* Success message */}
        {addedToCart && (
          <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-md shadow-lg">
            Product added to cart successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
