import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

// Layout Components
import { Header } from './components/Header.tsx';
import Footer from './components/Footer';

// Auth Components
import { ProtectedRoute, AdminRoute } from './components/auth';

// Auth Pages
import { SignInPage, SignUpPage } from './pages/auth';

// Admin Pages
import { AdminDashboard, AdminInventory, AdminUsers } from './pages/admin';

// Regular Pages
import App from './App'; // Landing page

// User Dashboard (placeholder)
const UserDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">User Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">My Orders</h3>
            <p className="text-gray-400">View your order history</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">My Profile</h3>
            <p className="text-gray-400">Update your account information</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Wishlist</h3>
            <p className="text-gray-400">Items you want to buy later</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

// Products Page (placeholder)
const ProductsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Products</h1>
        <p className="text-gray-400">Product catalog will be displayed here.</p>
      </div>
      <Footer />
    </div>
  );
};

// Admin Layout Component
const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="flex">
        {/* Admin Sidebar */}
        <div className="w-64 bg-gray-800 min-h-screen p-4">
          <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
          <nav className="space-y-2">
            <a href="/admin" className="block text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded">
              Dashboard
            </a>
            <a href="/admin/inventory" className="block text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded">
              Inventory
            </a>
            <a href="/admin/users" className="block text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded">
              Users
            </a>
            <a href="/admin/orders" className="block text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded">
              Orders
            </a>
          </nav>
        </div>

        {/* Admin Content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export const AppWithClerkRouting: React.FC = () => {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<App />} />
        <Route path="/products" element={<ProductsPage />} />

        {/* Auth Routes */}
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />

        {/* Protected User Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/inventory"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminInventory />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminUsers />
              </AdminLayout>
            </AdminRoute>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};
