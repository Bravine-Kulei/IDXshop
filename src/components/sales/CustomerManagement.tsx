import React from 'react';
import { Users, UserPlus, Search, Filter } from 'lucide-react';

export const CustomerManagement: React.FC = () => {
  const customers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', orders: 12, spent: '$2,450', status: 'active', joined: '2023-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', orders: 8, spent: '$1,890', status: 'active', joined: '2023-02-20' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', orders: 15, spent: '$3,200', status: 'vip', joined: '2022-11-10' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', orders: 5, spent: '$890', status: 'active', joined: '2023-03-05' },
    { id: 5, name: 'Tom Brown', email: 'tom@example.com', orders: 3, spent: '$450', status: 'inactive', joined: '2023-04-12' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'vip': return 'text-yellow-400 bg-yellow-400/20';
      case 'active': return 'text-green-400 bg-green-400/20';
      case 'inactive': return 'text-gray-400 bg-gray-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Customer Management</h2>
          <p className="text-gray-400">Manage customer relationships and track customer data</p>
        </div>
        <button className="mt-4 sm:mt-0 flex items-center gap-2 bg-[#00a8ff] hover:bg-[#0090e0] text-white px-4 py-2 rounded-lg transition-colors">
          <UserPlus className="w-5 h-5" />
          Add Customer
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search customers..."
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00a8ff] focus:ring-1 focus:ring-[#00a8ff]"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-[#00a8ff] focus:ring-1 focus:ring-[#00a8ff] appearance-none">
                <option value="">All Status</option>
                <option value="vip">VIP</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Customers</p>
              <p className="text-white text-2xl font-bold">892</p>
            </div>
            <Users className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">VIP Customers</p>
              <p className="text-white text-2xl font-bold">45</p>
            </div>
            <Users className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">New This Month</p>
              <p className="text-white text-2xl font-bold">24</p>
            </div>
            <Users className="w-8 h-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-white font-medium">{customer.name}</div>
                      <div className="text-gray-400 text-sm">{customer.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white">{customer.orders}</td>
                  <td className="px-6 py-4 text-white font-medium">{customer.spent}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{customer.joined}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[#00a8ff] hover:text-[#0090e0] text-sm font-medium">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
