import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { Header } from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import { AboutPage } from './pages/AboutPage';
import { SupportPage } from './pages/SupportPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminInventory } from './pages/admin/AdminInventory';
import { AdminUsers } from './pages/admin/AdminUsers';
import NotFoundPage from './pages/NotFoundPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminRoute } from './components/auth/AdminRoute';
import { SignInPage, SignUpPage } from './pages/auth';
import { CartProvider } from './contexts/CartContext';
import { MpesaProvider } from './features/mpesa/contexts/MpesaContext';
import { MpesaDashboard } from './features/mpesa/pages/MpesaDashboard';
import { WishlistProvider } from './contexts/WishlistContext';
import { RecentlyViewedProvider } from './contexts/RecentlyViewedContext';

export default function App() {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a] text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <CartProvider>
      <WishlistProvider>
        <RecentlyViewedProvider>
          <MpesaProvider>
            <Router>
            <div className="flex flex-col min-h-screen bg-[#0a0a0a] text-white">
              <Header />
              <main className="flex-grow">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:slug" element={<ProductPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/support" element={<SupportPage />} />

                  {/* Auth Routes */}
                  <Route path="/sign-in" element={<SignInPage />} />
                  <Route path="/sign-up" element={<SignUpPage />} />

                  {/* Protected Routes - Require Authentication */}
                  <Route path="/cart" element={
                    <ProtectedRoute>
                      <CartPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/checkout" element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } />
                  <Route path="/mpesa" element={
                    <ProtectedRoute>
                      <MpesaDashboard />
                    </ProtectedRoute>
                  } />

                  {/* Admin Routes - Require Admin Role */}
                  <Route path="/admin" element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  } />
                  <Route path="/admin/inventory" element={
                    <AdminRoute>
                      <AdminInventory />
                    </AdminRoute>
                  } />
                  <Route path="/admin/users" element={
                    <AdminRoute>
                      <AdminUsers />
                    </AdminRoute>
                  } />

                  {/* 404 Page */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
            </Router>
          </MpesaProvider>
        </RecentlyViewedProvider>
      </WishlistProvider>
    </CartProvider>
  );
}