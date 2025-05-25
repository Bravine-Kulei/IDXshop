import React from 'react';
import { Stethoscope, Wrench, Cpu, Brush } from 'lucide-react';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-[#1a1a1a] p-6 rounded-lg transition-all duration-300 hover:bg-[#252525]">
      <div className="mb-4 text-[#00a8ff]">{icon}</div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
};

export const ServicesSection: React.FC = () => {
  const services = [
    {
      icon: <Stethoscope className="h-10 w-10" />,
      title: 'Diagnostics',
      description: 'Comprehensive hardware and software diagnostics to identify and resolve issues affecting your laptop performance.'
    },
    {
      icon: <Wrench className="h-10 w-10" />,
      title: 'Repairs',
      description: 'Expert repair services for hardware failures, screen replacements, keyboard issues, and other common laptop problems.'
    },
    {
      icon: <Cpu className="h-10 w-10" />,
      title: 'Upgrades',
      description: 'Performance upgrades including RAM expansion, SSD installation, and graphics card replacements to extend your laptop lifespan.'
    },
    {
      icon: <Brush className="h-10 w-10" />,
      title: 'Maintenance',
      description: 'Regular cleaning, thermal paste replacement, cooling system optimization, and preventive maintenance services.'
    },
  ];

  return (
    <section id="services" className="py-16 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-xl font-medium mb-4">Laptop Maintenance & Repair Services</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm">
            Professional laptop repair and maintenance services to keep your device running at peak performance.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

