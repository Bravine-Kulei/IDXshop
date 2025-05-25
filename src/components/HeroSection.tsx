import React from 'react';
import mouseImage from "../assests/mouse_hero_section.png";
export const HeroSection = () => {
  return (
    <section className="relative bg-black py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-8 md:pt-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
              G502 HERO<br />WIRELESS
            </h1>
            <p className="text-gray-400 mb-10 text-lg max-w-md">
              Ultimate gaming performance with our most advanced wireless technology.
              Experience precision, speed, and comfort like never before.
            </p>
            <div className="flex space-x-4">
              <a
                href="/products"
                className="bg-[#00a8ff] hover:bg-[#0090e0] text-white px-8 py-3 rounded-md font-medium transition-colors duration-200 inline-block text-center"
              >
                Shop Now
              </a>
              <a
                href="/about"
                className="bg-transparent border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 px-8 py-3 rounded-md font-medium transition-colors duration-200 inline-block text-center"
              >
                Learn More
              </a>
            </div>
          </div>
          <div className="md:w-1/2 relative h-full flex items-center justify-center md:justify-end">
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={mouseImage}
                alt="G502 Hero Wireless Gaming Mouse"
                className="w-auto h-[350px] md:h-[450px] object-contain z-10"
              />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[#00a8ff] font-bold text-6xl md:text-8xl opacity-90 z-0 flex flex-col leading-none">
                <span>G</span>
                <span>5</span>
                <span>0</span>
                <span>2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};






