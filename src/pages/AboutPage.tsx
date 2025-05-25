import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface AboutContent {
  title: string;
  content: {
    mission: string;
    story: string;
    values: string[];
    services: string[];
  };
  contact: {
    email: string;
    phone: string;
    address: string;
  };
}

export const AboutPage: React.FC = () => {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const response = await axios.get('/about');
        setContent(response.data.data);
      } catch (error) {
        console.error('Error fetching about content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutContent();
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
          <h1 className="text-3xl font-bold text-white mb-8">About Us</h1>
          <p className="text-gray-400">Failed to load content.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">{content.title}</h1>
        
        <div className="space-y-8">
          <section className="bg-[#1a1a1a] p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Our Mission</h2>
            <p className="text-gray-300">{content.content.mission}</p>
          </section>
          
          <section className="bg-[#1a1a1a] p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Our Story</h2>
            <p className="text-gray-300">{content.content.story}</p>
          </section>
          
          <section className="bg-[#1a1a1a] p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Our Values</h2>
            <ul className="text-gray-300 space-y-2">
              {content.content.values.map((value, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-[#00a8ff] mr-2">•</span>
                  {value}
                </li>
              ))}
            </ul>
          </section>
          
          <section className="bg-[#1a1a1a] p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Our Services</h2>
            <ul className="text-gray-300 space-y-2">
              {content.content.services.map((service, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-[#00a8ff] mr-2">•</span>
                  {service}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};
