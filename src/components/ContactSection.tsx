import React from 'react';
export const ContactSection = () => {
  return <section className="py-16 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 mb-8 md:mb-0">
            <h2 className="text-2xl font-bold mb-4">techgear</h2>
            <p className="text-gray-400 mb-4">
              Get in touch with us for exclusive deals and product updates.
            </p>
          </div>
          <div className="md:w-2/3 md:pl-12">
            <h3 className="text-lg font-medium mb-6">Contact Us</h3>
            <form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <input type="text" placeholder="Name" className="w-full bg-[#1a1a1a] border border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:border-[#00a8ff]" />
                </div>
                <div>
                  <input type="email" placeholder="Email" className="w-full bg-[#1a1a1a] border border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:border-[#00a8ff]" />
                </div>
              </div>
              <div className="mb-6">
                <textarea placeholder="Message" rows={4} className="w-full bg-[#1a1a1a] border border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:border-[#00a8ff]"></textarea>
              </div>
              <button type="submit" className="bg-[#00a8ff] hover:bg-[#0090e0] text-white px-6 py-3 rounded-md font-medium w-full">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>;
};