import React from 'react';
export const ProductsSection = () => {
  const products = [{
    id: 1,
    name: 'Mice',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  }, {
    id: 2,
    name: 'Keyboards',
    image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  }, {
    id: 3,
    name: 'Headsets',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  }];
  return <section className="py-16 bg-[#121212]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-10 text-center">PRODUCTS</h2>
        <p className="text-gray-400 text-center mb-12">
          Which type of gear are you looking for?
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map(product => <div key={product.id} className="bg-[#1a1a1a] rounded-lg overflow-hidden hover:shadow-lg hover:shadow-[#00a8ff]/20 transition-all duration-300">
              <div className="h-48 overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-medium text-lg">{product.name}</h3>
              </div>
            </div>)}
        </div>
      </div>
    </section>;
};