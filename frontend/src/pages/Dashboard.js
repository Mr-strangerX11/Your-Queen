import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPackage, FiHeart, FiUser, FiShoppingBag } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ orders: 0, wishlist: 0 });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchStats();
  }, [isAuthenticated]);

  const fetchStats = async () => {
    try {
      const ordersRes = await api.get('/orders');
      const wishlistRes = await api.get('/wishlist');
      setStats({
        orders: ordersRes.data.orders.length,
        wishlist: wishlistRes.data.items.length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold mb-8">
          Welcome back, {user?.first_name}!
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-primary-600">{stats.orders}</p>
              </div>
              <FiPackage className="text-4xl text-primary-300" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Wishlist Items</p>
                <p className="text-3xl font-bold text-gold-600">{stats.wishlist}</p>
              </div>
              <FiHeart className="text-4xl text-gold-300" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Loyalty Points</p>
                <p className="text-3xl font-bold text-green-600">{user?.loyalty_points || 0}</p>
              </div>
              <FiShoppingBag className="text-4xl text-green-300" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Account Status</p>
                <p className="text-lg font-bold text-gray-800">Active</p>
              </div>
              <FiUser className="text-4xl text-gray-300" />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Quick Actions</h2>
            </div>
            <div className="space-y-3">
              <Link
                to="/orders"
                className="block p-4 border rounded-lg hover:bg-primary-50 transition-colors"
              >
                <div className="flex items-center">
                  <FiPackage className="mr-3 text-primary-600" />
                  <span className="font-medium">View Orders</span>
                </div>
              </Link>
              <Link
                to="/wishlist"
                className="block p-4 border rounded-lg hover:bg-primary-50 transition-colors"
              >
                <div className="flex items-center">
                  <FiHeart className="mr-3 text-primary-600" />
                  <span className="font-medium">My Wishlist</span>
                </div>
              </Link>
              <Link
                to="/profile"
                className="block p-4 border rounded-lg hover:bg-primary-50 transition-colors"
              >
                <div className="flex items-center">
                  <FiUser className="mr-3 text-primary-600" />
                  <span className="font-medium">Edit Profile</span>
                </div>
              </Link>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
            <p className="text-gray-600">No recent orders</p>
            <Link to="/orders" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
              View all orders →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

