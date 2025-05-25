import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { Package, Users, ShoppingCart, TrendingUp, Plus, Settings } from 'lucide-react';
import axios from 'axios';

interface DashboardStats {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  User: {
    name: string;
    email: string;
  };
}

export const AdminDashboard: React.FC = () => {
  const { getToken } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = await getToken();
        const response = await axios.get('/admin/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setStats(response.data.data.statistics);
        setRecentOrders(response.data.data.recentOrders);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [getToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="bg-red-500 text-white p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage your G20Shop inventory and users</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Products</p>
                <p className="text-2xl font-bold text-white">{stats?.totalProducts || 0}</p>
              </div>
              <Package className="h-8 w-8 text-[#00a8ff]" />
            </div>
          </div>
          
          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{stats?.totalUsers || 0}</p>
              </div>
              <Users className="h-8 w-8 text-[#00a8ff]" />
            </div>
          </div>
          
          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-white">{stats?.totalOrders || 0}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-[#00a8ff]" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link
            to="/admin/inventory"
            className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800 hover:border-[#00a8ff] transition-colors group"
          >
            <div className="flex items-center mb-4">
              <Package className="h-6 w-6 text-[#00a8ff] mr-3" />
              <h3 className="text-lg font-semibold text-white">Manage Inventory</h3>
            </div>
            <p className="text-gray-400 mb-4">Add, edit, and manage your product inventory</p>
            <div className="flex items-center text-[#00a8ff] group-hover:text-[#0090e0]">
              <span className="text-sm font-medium">Go to Inventory</span>
              <TrendingUp className="h-4 w-4 ml-2" />
            </div>
          </Link>
          
          <Link
            to="/admin/users"
            className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800 hover:border-[#00a8ff] transition-colors group"
          >
            <div className="flex items-center mb-4">
              <Users className="h-6 w-6 text-[#00a8ff] mr-3" />
              <h3 className="text-lg font-semibold text-white">Manage Users</h3>
            </div>
            <p className="text-gray-400 mb-4">View and manage user accounts and roles</p>
            <div className="flex items-center text-[#00a8ff] group-hover:text-[#0090e0]">
              <span className="text-sm font-medium">Go to Users</span>
              <TrendingUp className="h-4 w-4 ml-2" />
            </div>
          </Link>
          
          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
            <div className="flex items-center mb-4">
              <Settings className="h-6 w-6 text-[#00a8ff] mr-3" />
              <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
            </div>
            <div className="space-y-2">
              <button className="w-full bg-[#00a8ff] hover:bg-[#0090e0] text-white px-4 py-2 rounded text-sm transition-colors">
                <Plus className="h-4 w-4 inline mr-2" />
                Add New Product
              </button>
              <button className="w-full border border-gray-600 text-gray-300 hover:border-gray-500 px-4 py-2 rounded text-sm transition-colors">
                Export Data
              </button>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-[#1a1a1a] rounded-lg border border-gray-800">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
          </div>
          <div className="p-6">
            {recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 text-sm">
                      <th className="pb-3">Order #</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="text-white">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-t border-gray-800">
                        <td className="py-3 font-medium">{order.orderNumber}</td>
                        <td className="py-3">
                          <div>
                            <div className="font-medium">{order.User.name}</div>
                            <div className="text-sm text-gray-400">{order.User.email}</div>
                          </div>
                        </td>
                        <td className="py-3">${order.totalAmount}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'completed' ? 'bg-green-500 text-white' :
                            order.status === 'processing' ? 'bg-yellow-500 text-black' :
                            order.status === 'pending' ? 'bg-blue-500 text-white' :
                            'bg-gray-500 text-white'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No recent orders</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
