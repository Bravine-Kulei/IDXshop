import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import { UserButton, SignInButton, SignUpButton } from './auth';
import { MenuIcon, ShoppingCartIcon, SearchIcon, Settings } from 'lucide-react';

export const Header = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userRole = user?.publicMetadata?.role as string || 'customer';

  return (
    <header className="bg-[#0a0a0a] sticky top-0 z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-[#00a8ff] font-bold text-xl hover:text-[#0090e0] transition-colors duration-200">
                G20Shop
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:block ml-10">
              <div className="flex space-x-6">
                <Link to="/" className="text-gray-300 hover:text-[#00a8ff] px-3 py-2 text-sm font-medium transition-colors">
                  Home
                </Link>
                <Link to="/products" className="text-gray-300 hover:text-[#00a8ff] px-3 py-2 text-sm font-medium transition-colors">
                  Products
                </Link>
                <Link to="/support" className="text-gray-300 hover:text-[#00a8ff] px-3 py-2 text-sm font-medium transition-colors">
                  Support
                </Link>
                <Link to="/about" className="text-gray-300 hover:text-[#00a8ff] px-3 py-2 text-sm font-medium transition-colors">
                  About
                </Link>
              </div>
            </nav>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/search" className="text-gray-300 hover:text-white transition-colors">
              <SearchIcon className="h-5 w-5" />
            </Link>

            {/* Authentication Section */}
            {!isLoaded ? (
              <div className="animate-pulse bg-gray-700 h-8 w-20 rounded"></div>
            ) : isSignedIn ? (
              <>
                <Link to="/cart" className="text-gray-300 hover:text-white transition-colors">
                  <ShoppingCartIcon className="h-5 w-5" />
                </Link>

                {userRole === 'admin' && (
                  <Link
                    to="/admin"
                    className="text-gray-300 hover:text-[#00a8ff] transition-colors"
                    title="Admin Dashboard"
                  >
                    <Settings className="h-5 w-5" />
                  </Link>
                )}

                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8"
                    }
                  }}
                />
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <SignInButton mode="modal">
                  <button className="text-gray-300 hover:text-[#00a8ff] px-3 py-2 text-sm font-medium transition-colors">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="bg-[#00a8ff] hover:bg-[#0090e0] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              className="text-gray-300 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <MenuIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-800">
              <Link
                to="/"
                className="text-gray-300 hover:text-[#00a8ff] block px-3 py-2 text-base font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-gray-300 hover:text-[#00a8ff] block px-3 py-2 text-base font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                to="/support"
                className="text-gray-300 hover:text-[#00a8ff] block px-3 py-2 text-base font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Support
              </Link>
              <Link
                to="/about"
                className="text-gray-300 hover:text-[#00a8ff] block px-3 py-2 text-base font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>

              {/* Mobile Authentication */}
              <div className="border-t border-gray-700 pt-4">
                {!isLoaded ? (
                  <div className="animate-pulse bg-gray-700 h-8 w-20 rounded mx-3"></div>
                ) : isSignedIn ? (
                  <>
                    <Link
                      to="/cart"
                      className="text-gray-300 hover:text-[#00a8ff] block px-3 py-2 text-base font-medium transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Cart
                    </Link>
                    <Link
                      to="/profile"
                      className="text-gray-300 hover:text-[#00a8ff] block px-3 py-2 text-base font-medium transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    {userRole === 'admin' && (
                      <Link
                        to="/admin"
                        className="text-gray-300 hover:text-[#00a8ff] block px-3 py-2 text-base font-medium transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <div className="flex items-center justify-between px-3 pt-2">
                      <span className="text-gray-300 text-sm">
                        {user?.firstName || user?.emailAddresses[0]?.emailAddress}
                      </span>
                      <UserButton afterSignOutUrl="/" />
                    </div>
                  </>
                ) : (
                  <div className="px-3 py-2 space-y-2">
                    <SignInButton mode="modal">
                      <button className="w-full text-left text-gray-300 hover:text-[#00a8ff] text-base font-medium transition-colors">
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="w-full bg-[#00a8ff] hover:bg-[#0090e0] text-white px-4 py-2 rounded-md text-base font-medium transition-colors">
                        Sign Up
                      </button>
                    </SignUpButton>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};