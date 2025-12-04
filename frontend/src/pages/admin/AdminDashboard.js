import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPackage, FiUsers, FiDollarSign, FiAlertCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { isAuthenticated, isAdmin, isManager } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({});

  useEffect(() => {
    if (!isAuthenticated || (!isAdmin && !isManager)) {
      navigate('/');
      return;
    }
    fetchStats();
  }, [isAuthenticated, isAdmin, isManager]);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (!isAuthenticated || (!isAdmin && !isManager)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Users</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalUsers || 0}</p>
              </div>
              <FiUsers className="text-4xl text-blue-300" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Products</p>
                <p className="text-3xl font-bold text-green-600">{stats.totalProducts || 0}</p>
              </div>
              <FiPackage className="text-4xl text-green-300" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-primary-600">
                  Rs. {stats.totalRevenue?.toFixed(2) || '0.00'}
                </p>
              </div>
              <FiDollarSign className="text-4xl text-primary-300" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Pending Orders</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders || 0}</p>
              </div>
              <FiAlertCircle className="text-4xl text-yellow-300" />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/admin/products"
                className="block p-4 border rounded-lg hover:bg-primary-50 transition-colors"
              >
                <div className="flex items-center">
                  <FiPackage className="mr-3 text-primary-600" />
                  <span className="font-medium">Manage Products</span>
                </div>
              </Link>
              <Link
                to="/admin/orders"
                className="block p-4 border rounded-lg hover:bg-primary-50 transition-colors"
              >
                <div className="flex items-center">
                  <FiPackage className="mr-3 text-primary-600" />
                  <span className="font-medium">Manage Orders</span>
                </div>
              </Link>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Alerts</h2>
            {stats.lowStock > 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">
                  <strong>{stats.lowStock}</strong> products are running low on stock
                </p>
              </div>
            ) : (
              <p className="text-gray-600">No alerts at this time</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

