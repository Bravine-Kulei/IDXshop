import React from 'react';
import { Link } from 'react-router-dom';
import RecentlyViewedProducts from '../components/RecentlyViewedProducts';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to G20 Shop</h1>
          <p className="text-xl mb-6">Your one-stop shop for laptop and PC accessories</p>
          <Link
            to="/products"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
          >
            Browse Products
          </Link>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Featured Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold mb-3">Laptops</h3>
            <p className="mb-4">Explore our range of high-performance laptops</p>
            <Link to="/products?category=laptops" className="text-blue-500 hover:underline">View All</Link>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold mb-3">Accessories</h3>
            <p className="mb-4">Enhance your setup with our premium accessories</p>
            <Link to="/products?category=accessories" className="text-blue-500 hover:underline">View All</Link>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold mb-3">Components</h3>
            <p className="mb-4">Upgrade your PC with top-quality components</p>
            <Link to="/products?category=components" className="text-blue-500 hover:underline">View All</Link>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Laptop Repair</h3>
            <p className="mb-4">Professional laptop repair services with quick turnaround times</p>
            <Link to="/services/repair" className="text-blue-500 hover:underline">Learn More</Link>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">PC Maintenance</h3>
            <p className="mb-4">Keep your PC running smoothly with our maintenance services</p>
            <Link to="/services/maintenance" className="text-blue-500 hover:underline">Learn More</Link>
          </div>
        </div>
      </section>

      {/* Recently Viewed Products Section */}
      <section className="mb-12">
        <RecentlyViewedProducts />
      </section>
    </div>
  );
};

export default HomePage;
