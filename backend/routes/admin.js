const express = require('express');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const { protect, admin, manager } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// configure multer storage to backend/uploads
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const safeName = file.originalname.replace(/\s+/g, '-');
    cb(null, `${unique}-${safeName}`);
  },
});
const upload = multer({ storage });

// All admin routes require authentication and admin/manager role
router.use(protect);

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
// @access  Private (Admin/Manager)
router.get('/stats', admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const revenueResult = await Order.aggregate([
      { $match: { payment_status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$total_amount' } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;
    const pendingOrders = await Order.countDocuments({ order_status: 'pending' });
    const lowStock = await Product.countDocuments({ stock_quantity: { $lt: 10 }, is_active: true });

    res.json({
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        pendingOrders,
        lowStock,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/products
// @desc    Get all products (admin view)
// @access  Private (Admin/Manager)
router.get('/products', manager, async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = search
      ? { $or: [{ name: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }] }
      : {};

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/admin/products
// @desc    Create new product
// @access  Private (Admin/Manager)
// Accept multipart/form-data with field name 'images'
router.post('/products', manager, upload.array('images', 8), async (req, res) => {
  try {
    // req.body fields come as strings; parse where necessary
    const body = { ...req.body };

    // convert numeric fields
    if (body.price) body.price = parseFloat(body.price);
    if (body.discount_price) body.discount_price = parseFloat(body.discount_price);
    if (body.stock_quantity) body.stock_quantity = parseInt(body.stock_quantity, 10);

    // badges may be sent as comma separated
    if (body.badges && typeof body.badges === 'string') {
      body.badges = body.badges.split(',').map((b) => b.trim()).filter(Boolean);
    }

    // handle uploaded files
    const files = req.files || [];
    const host = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
    const imageUrls = files.map((f) => `${host}/uploads/${f.filename}`);
    if (imageUrls.length) body.images = imageUrls;

    const product = await Product.create(body);

    res.status(201).json({ product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/products/:id
// @desc    Update product
// @access  Private (Admin/Manager)
// Update product, allow new images to be uploaded (multipart)
router.put('/products/:id', manager, upload.array('images', 8), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    delete updates._id;

    if (updates.price) updates.price = parseFloat(updates.price);
    if (updates.discount_price) updates.discount_price = parseFloat(updates.discount_price);
    if (updates.stock_quantity) updates.stock_quantity = parseInt(updates.stock_quantity, 10);

    if (updates.badges && typeof updates.badges === 'string') {
      updates.badges = updates.badges.split(',').map((b) => b.trim()).filter(Boolean);
    }

    // handle uploaded files
    const files = req.files || [];
    const host = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
    const imageUrls = files.map((f) => `${host}/uploads/${f.filename}`);

    // If there are uploaded images, merge with existing images (if provided)
    if (imageUrls.length) {
      // fetch existing product images and merge
      const existing = await Product.findById(id).select('images');
      const existingImages = existing?.images || [];
      updates.images = existingImages.concat(imageUrls);
    }

    const product = await Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admin/products/:id
// @desc    Delete product (soft delete)
// @access  Private (Admin)
router.delete('/products/:id', admin, async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(id, { is_active: false }, { new: true });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/orders
// @desc    Get all orders
// @access  Private (Admin/Manager)
router.get('/orders', manager, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = status ? { order_status: status } : {};

    const orders = await Order.find(query)
      .populate('user_id', 'email first_name last_name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/orders/:id/status
// @desc    Update order status
// @access  Private (Admin/Manager)
router.put('/orders/:id/status', manager, async (req, res) => {
  try {
    const { id } = req.params;
    const { order_status, payment_status } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order_status) order.order_status = order_status;
    if (payment_status) order.payment_status = payment_status;

    await order.save();

    res.json({ order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin)
router.get('/users', admin, async (req, res) => {
  try {
    const { page = 1, limit = 20, role } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = role ? { role } : {};

    const users = await User.find(query)
      .select('email first_name last_name phone role loyalty_points createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
