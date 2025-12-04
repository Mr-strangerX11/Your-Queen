const express = require('express');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All wishlist routes require authentication
router.use(protect);

// @route   GET /api/wishlist
// @desc    Get user's wishlist
// @access  Private
router.get('/', async (req, res) => {
  try {
    const wishlistItems = await Wishlist.find({ user_id: req.user.id })
      .populate('product_id')
      .sort({ createdAt: -1 });

    const items = wishlistItems.map(item => ({
      id: item._id,
      product_id: item.product_id._id,
      name: item.product_id.name,
      price: item.product_id.price,
      discount_price: item.product_id.discount_price,
      images: item.product_id.images,
      stock_quantity: item.product_id.stock_quantity,
      is_active: item.product_id.is_active,
    }));

    res.json({ items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/wishlist
// @desc    Add item to wishlist
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { product_id } = req.body;

    // Check if product exists
    const product = await Product.findOne({ _id: product_id, is_active: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if already in wishlist
    const existing = await Wishlist.findOne({ user_id: req.user.id, product_id });

    if (existing) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    await Wishlist.create({ user_id: req.user.id, product_id });
    res.status(201).json({ message: 'Item added to wishlist' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/wishlist/:id
// @desc    Remove item from wishlist
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Wishlist.findOneAndDelete({ _id: id, user_id: req.user.id });

    if (!result) {
      return res.status(404).json({ message: 'Wishlist item not found' });
    }

    res.json({ message: 'Item removed from wishlist' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/wishlist/check/:product_id
// @desc    Check if product is in wishlist
// @access  Private
router.get('/check/:product_id', async (req, res) => {
  try {
    const { product_id } = req.params;

    const result = await Wishlist.findOne({ user_id: req.user.id, product_id });

    res.json({ inWishlist: !!result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
