import React from 'react';
import { Shield, Cpu, Laptop, Clock, Wrench } from 'lucide-react';
export const FeaturesSection = () => {
  const features = [{
    icon: <Shield className="h-10 w-10 text-[#00a8ff]" />,
    title: 'Lifetime Protection',
    description: 'All our products come with extended warranty and protection against manufacturing defects.'
  }, {
    icon: <Cpu className="h-10 w-10 text-[#00a8ff]" />,
    title: 'Advanced Technology',
    description: 'Cutting-edge components and software for the ultimate gaming experience.'
  }, {
    icon: <Laptop className="h-10 w-10 text-[#00a8ff]" />,
    title: 'Cross-Platform Support',
    description: 'Our devices work seamlessly across PC, Mac, and console systems.'
  }, {
    icon: <Clock className="h-10 w-10 text-[#00a8ff]" />,
    title: '24/7 Support',
    description: 'Our dedicated team is always available to help with any technical issues.'
  }, {
    icon: <Wrench className="h-10 w-10 text-[#00a8ff]" />,
    title: 'Expert Laptop Repairs',
    description: 'Professional repair services for all laptop brands with quick turnaround times and quality guarantees.'
  }];
  return <section className="py-16 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-medium mb-12 text-center">
          We provide more than high-quality products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {features.map((feature, index) => <div key={index} className="bg-[#1a1a1a] p-6 rounded-lg">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>)}
        </div>
      </div>
    </section>;
};