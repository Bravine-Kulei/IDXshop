import React from 'react';
import { Clock, AlertTriangle, User, Calendar } from 'lucide-react';

export const ServiceRequests: React.FC = () => {
  const requests = [
    {
      id: 'SR-001',
      customer: 'John Doe',
      device: 'MacBook Pro 2021',
      issue: 'Screen flickering and random shutdowns',
      priority: 'high',
      status: 'pending',
      created: '2024-01-15',
      estimatedTime: '2-3 hours'
    },
    {
      id: 'SR-002',
      customer: 'Jane Smith',
      device: 'Dell XPS 13',
      issue: 'Keyboard not responding',
      priority: 'medium',
      status: 'in-progress',
      created: '2024-01-14',
      estimatedTime: '1-2 hours'
    },
    {
      id: 'SR-003',
      customer: 'Mike Johnson',
      device: 'HP Pavilion',
      issue: 'Slow performance and overheating',
      priority: 'low',
      status: 'pending',
      created: '2024-01-13',
      estimatedTime: '3-4 hours'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'low': return 'text-green-400 bg-green-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-400/20';
      case 'in-progress': return 'text-blue-400 bg-blue-400/20';
      case 'completed': return 'text-green-400 bg-green-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Service Requests</h2>
          <p className="text-gray-400">Manage incoming service and repair requests</p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-3">
          <select className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-[#00a8ff] focus:ring-1 focus:ring-[#00a8ff]">
            <option value="">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-[#00a8ff] focus:ring-1 focus:ring-[#00a8ff]">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Request Cards */}
      <div className="grid gap-6">
        {requests.map((request) => (
          <div key={request.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <h3 className="text-lg font-semibold text-white">{request.id}</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(request.priority)}`}>
                    {request.priority} priority
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-300">
                    <User className="w-4 h-4" />
                    <span>{request.customer}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="w-4 h-4" />
                    <span>{request.created}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-white font-medium mb-1">{request.device}</p>
                  <p className="text-gray-400">{request.issue}</p>
                </div>
                
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Estimated: {request.estimatedTime}</span>
                </div>
              </div>
              
              <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col gap-2">
                <button className="bg-[#00a8ff] hover:bg-[#0090e0] text-white px-4 py-2 rounded-lg transition-colors">
                  Start Work
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
