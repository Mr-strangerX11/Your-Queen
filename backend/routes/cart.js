const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All cart routes require authentication
router.use(protect);

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', async (req, res) => {
  try {
    const cartItems = await Cart.find({ user_id: req.user.id })
      .populate('product_id')
      .sort({ createdAt: -1 });

    let subtotal = 0;
    const items = cartItems.map(item => {
      const product = item.product_id;
      const price = product.discount_price || product.price;
      const itemTotal = price * item.quantity;
      subtotal += itemTotal;
      return {
        id: item._id,
        product_id: product._id,
        name: product.name,
        price: product.price,
        discount_price: product.discount_price,
        images: product.images,
        stock_quantity: product.stock_quantity,
        is_active: product.is_active,
        quantity: item.quantity,
        current_price: price,
        item_total: itemTotal,
      };
    });

    res.json({
      items,
      subtotal: subtotal.toFixed(2),
      itemCount: items.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/cart
// @desc    Add item to cart
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;

    // Check if product exists and is active
    const product = await Product.findById(product_id);
    if (!product || !product.is_active) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock_quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    // Check if item already in cart
    const existing = await Cart.findOne({ user_id: req.user.id, product_id });

    if (existing) {
      // Update quantity
      const newQuantity = existing.quantity + quantity;
      if (newQuantity > product.stock_quantity) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
      existing.quantity = newQuantity;
      await existing.save();
      res.json({ message: 'Cart updated' });
    } else {
      // Add new item
      await Cart.create({ user_id: req.user.id, product_id, quantity });
      res.status(201).json({ message: 'Item added to cart' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/cart/:id
// @desc    Update cart item quantity
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    // Check if cart item belongs to user
    const cartItem = await Cart.findOne({ _id: id, user_id: req.user.id }).populate('product_id');
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    // Check stock
    if (cartItem.product_id.stock_quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    cartItem.quantity = quantity;
    await cartItem.save();
    res.json({ message: 'Cart updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/cart/:id
// @desc    Remove item from cart
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Cart.findOneAndDelete({ _id: id, user_id: req.user.id });

    if (!result) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/cart
// @desc    Clear entire cart
// @access  Private
router.delete('/', async (req, res) => {
  try {
    await Cart.deleteMany({ user_id: req.user.id });
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
