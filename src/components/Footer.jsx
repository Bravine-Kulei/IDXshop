import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import PaymentOptions from './PaymentOptions';

const Footer = () => {
  return (
    <footer className="bg-[#0a0a0a] border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">TechGear</h3>
            <p className="text-gray-400 text-sm mb-4">
              Your one-stop shop for premium laptop and PC accessories, with expert repair and maintenance services.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#00a8ff]">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#00a8ff]">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#00a8ff]">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#00a8ff]">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-[#00a8ff] text-sm">Home</Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-[#00a8ff] text-sm">Products</Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-[#00a8ff] text-sm">Services</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-[#00a8ff] text-sm">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-[#00a8ff] text-sm">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=mice" className="text-gray-400 hover:text-[#00a8ff] text-sm">Mice</Link>
              </li>
              <li>
                <Link to="/products?category=keyboards" className="text-gray-400 hover:text-[#00a8ff] text-sm">Keyboards</Link>
              </li>
              <li>
                <Link to="/products?category=headsets" className="text-gray-400 hover:text-[#00a8ff] text-sm">Headsets</Link>
              </li>
              <li>
                <Link to="/products?category=mousepads" className="text-gray-400 hover:text-[#00a8ff] text-sm">Mousepads</Link>
              </li>
              <li>
                <Link to="/products?category=accessories" className="text-gray-400 hover:text-[#00a8ff] text-sm">Accessories</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <span className="text-gray-400 text-sm">123 Tech Street, Digital City, 10001</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-2" />
                <a href="tel:+1234567890" className="text-gray-400 hover:text-[#00a8ff] text-sm">+1 (234) 567-890</a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-2" />
                <a href="mailto:info@techgear.com" className="text-gray-400 hover:text-[#00a8ff] text-sm">info@techgear.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="mb-8">
            <PaymentOptions variant="footer" className="max-w-md mx-auto" />
          </div>
        </div>

        {/* Copyright and Links */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} TechGear. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy-policy" className="text-gray-400 hover:text-[#00a8ff] text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-gray-400 hover:text-[#00a8ff] text-sm">
              Terms of Service
            </Link>
            <Link to="/shipping-policy" className="text-gray-400 hover:text-[#00a8ff] text-sm">
              Shipping Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
