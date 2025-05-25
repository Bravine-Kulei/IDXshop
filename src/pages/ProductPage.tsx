import React from 'react';
import { useParams } from 'react-router-dom';

export const ProductPage: React.FC = () => {
  const { slug } = useParams();

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Product Details</h1>
          <p className="text-gray-400">Product slug: {slug}</p>
          <p className="text-gray-400 mt-4">This page will show detailed product information.</p>
        </div>
      </div>
    </div>
  );
};
