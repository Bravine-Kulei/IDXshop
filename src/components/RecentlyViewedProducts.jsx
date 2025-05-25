import React from 'react';
import { Link } from 'react-router-dom';
import { useRecentlyViewed } from '../contexts/RecentlyViewedContext';
import { Clock, X } from 'lucide-react';

const RecentlyViewedProducts = ({ maxItems = 4, showTitle = true }) => {
  const { recentlyViewed, removeFromRecentlyViewed, clearRecentlyViewed } = useRecentlyViewed();

  // If there are no recently viewed products, don't render anything
  if (!recentlyViewed || recentlyViewed.length === 0) {
    return null;
  }

  // Limit the number of items to display
  const displayItems = recentlyViewed.slice(0, maxItems);

  return (
    <div className="bg-gray-900 rounded-lg p-4 mb-8">
      {showTitle && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <Clock className="h-5 w-5 mr-2 text-blue-400" />
            Recently Viewed
          </h2>
          {recentlyViewed.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearRecentlyViewed();
              }}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      )}

      {/* Mobile: Horizontal scrollable list, Desktop: Grid */}
      <div className="flex md:hidden overflow-x-auto pb-4 snap-x gap-3 px-1">
        {displayItems.map((product) => (
          <div key={product.id} className="relative group flex-shrink-0 w-[160px] snap-start">
            <Link
              to={`/products/${product.id}`}
              className="block bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 h-full"
            >
              <div className="aspect-square overflow-hidden bg-gray-900">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0].imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <img
                    src={`https://placehold.co/300x300?text=${encodeURIComponent(product.name || 'Product')}`}
                    alt={product.name || 'Product'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                )}
              </div>

              <div className="p-3">
                <h3 className="text-sm font-medium line-clamp-1 group-hover:text-blue-400 transition-colors">
                  {product.name}
                </h3>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-blue-500 font-bold text-sm">
                    ${product.salePrice || product.regularPrice || product.price}
                  </span>
                  {product.salePrice && product.regularPrice && (
                    <span className="text-xs text-gray-400 line-through">
                      ${product.regularPrice}
                    </span>
                  )}
                </div>
              </div>
            </Link>

            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                removeFromRecentlyViewed(product.id);
              }}
              className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity touch-manipulation"
              aria-label="Remove from recently viewed"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>
        ))}
      </div>

      {/* Desktop Grid View */}
      <div className="hidden md:grid grid-cols-2 md:grid-cols-4 gap-4">
        {displayItems.map((product) => (
          <div key={product.id} className="relative group">
            <Link
              to={`/products/${product.id}`}
              className="block bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="aspect-square overflow-hidden bg-gray-900">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0].imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <img
                    src={`https://placehold.co/300x300?text=${encodeURIComponent(product.name || 'Product')}`}
                    alt={product.name || 'Product'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                )}
              </div>

              <div className="p-3">
                <h3 className="text-sm font-medium line-clamp-1 group-hover:text-blue-400 transition-colors">
                  {product.name}
                </h3>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-blue-500 font-bold">
                    ${product.salePrice || product.regularPrice || product.price}
                  </span>
                  {product.salePrice && product.regularPrice && (
                    <span className="text-xs text-gray-400 line-through">
                      ${product.regularPrice}
                    </span>
                  )}
                </div>
              </div>
            </Link>

            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                removeFromRecentlyViewed(product.id);
              }}
              className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove from recently viewed"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewedProducts;
