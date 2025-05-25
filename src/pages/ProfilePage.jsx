import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  // Mock user data - in a real app, this would come from an API or state management
  const [user, setUser] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    address: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zipCode: '12345',
    country: 'United States'
  });

  // Mock order history
  const [orders, setOrders] = useState([
    {
      id: 'ORD-1234',
      date: '2023-05-15',
      total: 249.98,
      status: 'Delivered',
      items: [
        { id: 1, name: 'Wireless Gaming Mouse', price: 49.99, quantity: 1 },
        { id: 2, name: 'Mechanical Keyboard', price: 89.99, quantity: 1 },
        { id: 3, name: 'Gaming Headset', price: 109.99, quantity: 1 }
      ]
    },
    {
      id: 'ORD-5678',
      date: '2023-04-02',
      total: 159.98,
      status: 'Delivered',
      items: [
        { id: 4, name: 'USB-C Hub', price: 39.99, quantity: 1 },
        { id: 5, name: 'External SSD 500GB', price: 119.99, quantity: 1 }
      ]
    }
  ]);

  // State for active tab
  const [activeTab, setActiveTab] = useState('profile');

  // Form state for profile editing
  const [formData, setFormData] = useState({ ...user });
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would call an API to update the user profile
    setUser(formData);
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-1/4">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </div>
              <div>
                <h2 className="font-bold">{user.firstName} {user.lastName}</h2>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>
            </div>
            
            <nav>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full text-left px-4 py-2 rounded ${activeTab === 'profile' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                  >
                    Profile
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full text-left px-4 py-2 rounded ${activeTab === 'orders' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                  >
                    Order History
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('wishlist')}
                    className={`w-full text-left px-4 py-2 rounded ${activeTab === 'wishlist' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                  >
                    Wishlist
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`w-full text-left px-4 py-2 rounded ${activeTab === 'security' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                  >
                    Security
                  </button>
                </li>
              </ul>
            </nav>
            
            <div className="mt-6 pt-6 border-t border-gray-700">
              <Link to="/logout" className="text-red-500 hover:underline">
                Logout
              </Link>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="md:w-3/4">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Profile Information</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
              
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Phone</label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block mb-1">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block mb-1">State/Province</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block mb-1">ZIP/Postal Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Country</label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...user });
                        setIsEditing(false);
                      }}
                      className="px-4 py-2 border border-gray-600 rounded hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-gray-400">First Name</h3>
                    <p>{user.firstName}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-400">Last Name</h3>
                    <p>{user.lastName}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-400">Email</h3>
                    <p>{user.email}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-400">Phone</h3>
                    <p>{user.phone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="text-gray-400">Address</h3>
                    <p>{user.address}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-400">City</h3>
                    <p>{user.city}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-400">State/Province</h3>
                    <p>{user.state}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-400">ZIP/Postal Code</h3>
                    <p>{user.zipCode}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-400">Country</h3>
                    <p>{user.country}</p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Order History</h2>
              
              {orders.length === 0 ? (
                <p>You haven't placed any orders yet.</p>
              ) : (
                <div className="space-y-6">
                  {orders.map(order => (
                    <div key={order.id} className="border border-gray-700 rounded-lg overflow-hidden">
                      <div className="bg-gray-700 p-4 flex justify-between items-center">
                        <div>
                          <h3 className="font-bold">{order.id}</h3>
                          <p className="text-sm text-gray-400">Placed on {order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${order.total.toFixed(2)}</p>
                          <span className="inline-block px-2 py-1 text-xs rounded bg-green-800 text-green-200">
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold mb-2">Items</h4>
                        <ul className="space-y-2">
                          {order.items.map(item => (
                            <li key={item.id} className="flex justify-between">
                              <span>{item.name} × {item.quantity}</span>
                              <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4 text-right">
                          <Link to={`/orders/${order.id}`} className="text-blue-500 hover:underline">
                            View Order Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
              <p>Your wishlist is empty.</p>
            </div>
          )}
          
          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Security Settings</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Change Password</h3>
                  <form className="space-y-4">
                    <div>
                      <label className="block mb-1">Current Password</label>
                      <input
                        type="password"
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block mb-1">New Password</label>
                      <input
                        type="password"
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                      Update Password
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
