import React, { useState } from 'react';
import { TechnicianHeader } from '../../components/technician/TechnicianHeader';
import { ServiceRequests } from '../../components/technician/ServiceRequests';
import { RepairTracking } from '../../components/technician/RepairTracking';
import { TechnicianSchedule } from '../../components/technician/TechnicianSchedule';
import { KnowledgeBase } from '../../components/technician/KnowledgeBase';
import { Wrench, Calendar, BookOpen, ClipboardList } from 'lucide-react';

type TechnicianTab = 'requests' | 'repairs' | 'schedule' | 'knowledge';

export const TechnicianDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TechnicianTab>('requests');

  const tabs = [
    { id: 'requests' as TechnicianTab, label: 'Service Requests', icon: ClipboardList },
    { id: 'repairs' as TechnicianTab, label: 'Repairs', icon: Wrench },
    { id: 'schedule' as TechnicianTab, label: 'Schedule', icon: Calendar },
    { id: 'knowledge' as TechnicianTab, label: 'Knowledge Base', icon: BookOpen },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'requests':
        return <ServiceRequests />;
      case 'repairs':
        return <RepairTracking />;
      case 'schedule':
        return <TechnicianSchedule />;
      case 'knowledge':
        return <KnowledgeBase />;
      default:
        return <ServiceRequests />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <TechnicianHeader />

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
