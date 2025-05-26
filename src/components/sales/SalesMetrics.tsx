import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Target } from 'lucide-react';

export const SalesMetrics: React.FC = () => {
  const metrics = [
    {
      title: 'Total Revenue',
      value: '$45,230',
      change: '+12.5%',
      trend: 'up',
      period: 'vs last month',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Orders',
      value: '1,234',
      change: '+8.2%',
      trend: 'up',
      period: 'vs last month',
      icon: ShoppingCart,
      color: 'blue'
    },
    {
      title: 'Customers',
      value: '892',
      change: '+15.3%',
      trend: 'up',
      period: 'vs last month',
      icon: Users,
      color: 'purple'
    },
    {
      title: 'Avg Order Value',
      value: '$36.70',
      change: '-2.1%',
      trend: 'down',
      period: 'vs last month',
      icon: Target,
      color: 'orange'
    }
  ];

  const recentOrders = [
    { id: '#ORD-001', customer: 'John Doe', amount: '$299.99', status: 'completed', time: '2 hours ago' },
    { id: '#ORD-002', customer: 'Jane Smith', amount: '$149.50', status: 'processing', time: '4 hours ago' },
    { id: '#ORD-003', customer: 'Mike Johnson', amount: '$89.99', status: 'shipped', time: '6 hours ago' },
    { id: '#ORD-004', customer: 'Sarah Wilson', amount: '$199.99', status: 'completed', time: '8 hours ago' },
    { id: '#ORD-005', customer: 'Tom Brown', amount: '$349.99', status: 'pending', time: '10 hours ago' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/20';
      case 'processing': return 'text-yellow-400 bg-yellow-400/20';
      case 'shipped': return 'text-blue-400 bg-blue-400/20';
      case 'pending': return 'text-orange-400 bg-orange-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const isPositive = metric.trend === 'up';
          
          return (
            <div key={metric.title} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  metric.color === 'green' ? 'bg-green-500/20' :
                  metric.color === 'blue' ? 'bg-blue-500/20' :
                  metric.color === 'purple' ? 'bg-purple-500/20' :
                  'bg-orange-500/20'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    metric.color === 'green' ? 'text-green-400' :
                    metric.color === 'blue' ? 'text-blue-400' :
                    metric.color === 'purple' ? 'text-purple-400' :
                    'text-orange-400'
                  }`} />
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  isPositive ? 'text-green-400' : 'text-red-400'
                }`}>
                  {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {metric.change}
                </div>
              </div>
              <div>
                <h3 className="text-gray-400 text-sm">{metric.title}</h3>
                <p className="text-white text-2xl font-bold">{metric.value}</p>
                <p className="text-gray-500 text-xs">{metric.period}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
          <p className="text-gray-400 text-sm">Latest customer orders and their status</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {order.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {order.time}
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
