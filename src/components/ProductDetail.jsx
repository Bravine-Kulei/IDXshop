import React, { useState, useEffect } from 'react';
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

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/products/${slug}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load product. Please try again.');
        setLoading(false);
        console.error('Error fetching product:', err);
      }
    };

    fetchProduct();
  }, [slug]);

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

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      
      await axios.post('/api/cart/items', {
        productId: product.id,
        quantity
      });
      
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError('Failed to add product to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    try {
      setAddingToWishlist(true);
      
      if (inWishlist) {
        // Remove from wishlist logic would go here
        setInWishlist(false);
      } else {
        // Add to wishlist
        await axios.post('/api/wishlist/default/items', {
          productId: product.id
        });
        setInWishlist(true);
      }
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
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
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

export default ProductDetail;
