const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All order routes require authentication
router.use(protect);

// Generate unique order number
const generateOrderNumber = () => {
  return 'YQ-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { shipping_address, payment_method, notes } = req.body;

    // Get cart items
    const cartItems = await Cart.find({ user_id: req.user.id }).populate('product_id');

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const cartItem of cartItems) {
      const product = cartItem.product_id;
      const price = product.discount_price || product.price;
      const itemTotal = price * cartItem.quantity;
      subtotal += itemTotal;

      // Check stock
      if (product.stock_quantity < cartItem.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      orderItems.push({
        product_id: product._id,
        product_name: product.name,
        product_price: price,
        quantity: cartItem.quantity,
        subtotal: itemTotal,
      });
    }

    const shipping_fee = 200;
    const tax = subtotal * 0.13;
    const total = subtotal + shipping_fee + tax;

    // Create order
    const orderNumber = generateOrderNumber();
    const order = await Order.create({
      user_id: req.user.id,
      order_number: orderNumber,
      total_amount: total,
      subtotal,
      shipping_fee,
      tax,
      payment_method,
      shipping_address,
      items: orderItems,
      notes: notes || null,
    });

    // Update product stock and sales count
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product_id, {
        $inc: { stock_quantity: -item.quantity, sales_count: item.quantity },
      });
    }

    // Clear cart
    await Cart.deleteMany({ user_id: req.user.id });

    // Add loyalty points
    const points = Math.floor(total / 100);
    if (points > 0) {
      await User.findByIdAndUpdate(req.user.id, {
        $inc: { loyalty_points: points },
      });
    }

    res.status(201).json({ order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({ user_id: req.user.id }).sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({ _id: id, user_id: req.user.id });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status (for user to cancel)
// @access  Private
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { order_status } = req.body;

    const order = await Order.findOne({ _id: id, user_id: req.user.id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Users can only cancel pending orders
    if (order_status === 'cancelled' && order.order_status === 'pending') {
      order.order_status = order_status;
      await order.save();
      res.json({ message: 'Order cancelled' });
    } else {
      res.status(400).json({ message: 'Cannot update order status' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
