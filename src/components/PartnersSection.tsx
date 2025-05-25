import React from 'react';
export const PartnersSection = () => {
  return <section className="py-16 bg-[#121212]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-medium mb-12 text-center">
          The world's greatest esports teams choose us
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(item => <div key={item} className="bg-[#1a1a1a] p-4 rounded-lg flex items-center justify-center">
              <div className="h-12 w-12 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-[#00a8ff] text-xl font-bold">
                  P{item}
                </span>
              </div>
            </div>)}
        </div>
      </div>
    </section>;
};