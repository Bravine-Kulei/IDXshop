import React, { useState } from 'react';
import { SalesHeader } from '../../components/sales/SalesHeader';
import { SalesMetrics } from '../../components/sales/SalesMetrics';
import { CustomerManagement } from '../../components/sales/CustomerManagement';
import { OrderManagement } from '../../components/sales/OrderManagement';
import { SalesReports } from '../../components/sales/SalesReports';
import { Users, ShoppingCart, TrendingUp, FileText } from 'lucide-react';

type SalesTab = 'overview' | 'customers' | 'orders' | 'reports';

export const SalesDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SalesTab>('overview');

  const tabs = [
    { id: 'overview' as SalesTab, label: 'Overview', icon: TrendingUp },
    { id: 'customers' as SalesTab, label: 'Customers', icon: Users },
    { id: 'orders' as SalesTab, label: 'Orders', icon: ShoppingCart },
    { id: 'reports' as SalesTab, label: 'Reports', icon: FileText },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <SalesMetrics />;
      case 'customers':
        return <CustomerManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'reports':
        return <SalesReports />;
      default:
        return <SalesMetrics />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <SalesHeader />

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      isActive
                        ? 'border-[#00a8ff] text-[#00a8ff]'
                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
