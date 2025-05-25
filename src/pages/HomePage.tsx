import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { ShoppingBag, Wrench, Shield, Truck } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { isSignedIn } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0a0a0a] to-[#1a1a1a] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Welcome to <span className="text-[#00a8ff]">G20Shop</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Your one-stop destination for laptop and PC accessories, plus professional repair and maintenance services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="bg-[#00a8ff] hover:bg-[#0090e0] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Shop Products
              </Link>
              <Link
                to="/support"
                className="border border-[#00a8ff] text-[#00a8ff] hover:bg-[#00a8ff] hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Get Support
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose G20Shop?</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              We provide quality products and expert services to keep your devices running at their best.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-[#00a8ff] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Quality Products</h3>
              <p className="text-gray-300">Premium laptop and PC accessories from trusted brands.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-[#00a8ff] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wrench className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Expert Repairs</h3>
              <p className="text-gray-300">Professional repair and maintenance services by certified technicians.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-[#00a8ff] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Warranty Protection</h3>
              <p className="text-gray-300">Comprehensive warranty coverage on all products and services.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-[#00a8ff] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Fast Delivery</h3>
              <p className="text-gray-300">Quick and reliable shipping to get your products fast.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Services</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              From sales to repairs, we've got all your tech needs covered.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#1a1a1a] p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">Product Sales</h3>
              <ul className="text-gray-300 space-y-2">
                <li>• Laptop accessories and peripherals</li>
                <li>• PC components and upgrades</li>
                <li>• Cables, adapters, and connectors</li>
                <li>• Storage solutions and memory</li>
              </ul>
              <Link
                to="/products"
                className="inline-block mt-4 text-[#00a8ff] hover:text-[#0090e0] font-semibold"
              >
                Browse Products →
              </Link>
            </div>
            
            <div className="bg-[#1a1a1a] p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">Repair Services</h3>
              <ul className="text-gray-300 space-y-2">
                <li>• Laptop screen replacement</li>
                <li>• Hardware diagnostics and repair</li>
                <li>• Software troubleshooting</li>
                <li>• Data recovery services</li>
              </ul>
              <Link
                to="/support"
                className="inline-block mt-4 text-[#00a8ff] hover:text-[#0090e0] font-semibold"
              >
                Get Support →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isSignedIn && (
        <section className="py-16 bg-gradient-to-r from-[#00a8ff] to-[#0090e0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of satisfied customers who trust G20Shop for their tech needs.
            </p>
            <Link
              to="/products"
              className="bg-white text-[#00a8ff] hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
            >
              Start Shopping
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};
