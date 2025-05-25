import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface SupportContent {
  title: string;
  content: {
    description: string;
    supportChannels: Array<{
      type: string;
      description: string;
      availability?: string;
      contact?: string;
      responseTime?: string;
      status?: string;
    }>;
    commonIssues: Array<{
      title: string;
      description: string;
    }>;
    repairServices: {
      description: string;
      services: string[];
      turnaroundTime: string;
      warranty: string;
    };
  };
}

export const SupportPage: React.FC = () => {
  const [content, setContent] = useState<SupportContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSupportContent = async () => {
      try {
        const response = await axios.get('/support');
        setContent(response.data.data);
      } catch (error) {
        console.error('Error fetching support content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSupportContent();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-8">Support</h1>
          <p className="text-gray-400">Failed to load content.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">{content.title}</h1>
        <p className="text-gray-300 mb-8">{content.content.description}</p>
        
        <div className="space-y-8">
          <section className="bg-[#1a1a1a] p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Support Channels</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.content.supportChannels.map((channel, index) => (
                <div key={index} className="bg-[#2a2a2a] p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-[#00a8ff] mb-2">{channel.type}</h3>
                  <p className="text-gray-300 text-sm mb-2">{channel.description}</p>
                  {channel.contact && (
                    <p className="text-gray-400 text-sm">Contact: {channel.contact}</p>
                  )}
                  {channel.availability && (
                    <p className="text-gray-400 text-sm">Available: {channel.availability}</p>
                  )}
                  {channel.responseTime && (
                    <p className="text-gray-400 text-sm">Response: {channel.responseTime}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
          
          <section className="bg-[#1a1a1a] p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Common Issues</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.content.commonIssues.map((issue, index) => (
                <div key={index} className="bg-[#2a2a2a] p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">{issue.title}</h3>
                  <p className="text-gray-300 text-sm">{issue.description}</p>
                </div>
              ))}
            </div>
          </section>
          
          <section className="bg-[#1a1a1a] p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Repair Services</h2>
            <p className="text-gray-300 mb-4">{content.content.repairServices.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-[#00a8ff] mb-2">Services Offered</h3>
                <ul className="text-gray-300 space-y-1">
                  {content.content.repairServices.services.map((service, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-[#00a8ff] mr-2">•</span>
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-[#00a8ff] mb-2">Service Details</h3>
                <p className="text-gray-300 mb-2">
                  <strong>Turnaround Time:</strong> {content.content.repairServices.turnaroundTime}
                </p>
                <p className="text-gray-300">
                  <strong>Warranty:</strong> {content.content.repairServices.warranty}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
