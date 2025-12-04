const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      category,
      material,
      color,
      gemstone_type,
      min_price,
      max_price,
      search,
      sort = 'newest',
      page = 1,
      limit = 12,
    } = req.query;

    // Build query
    const query = { is_active: true };

    if (category) query.category = category;
    if (material) query.material = material;
    if (color) query.color = color;
    if (gemstone_type) query.gemstone_type = gemstone_type;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort
    let sortOption = {};
    switch (sort) {
      case 'price_low':
        sortOption = { discount_price: 1, price: 1 };
        break;
      case 'price_high':
        sortOption = { discount_price: -1, price: -1 };
        break;
      case 'popular':
        sortOption = { sales_count: -1, views_count: -1 };
        break;
      case 'newest':
      default:
        sortOption = { createdAt: -1 };
        break;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    let products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    // Filter by price range if specified (post-query filtering for effective price)
    if (min_price || max_price) {
      products = products.filter(product => {
        const effectivePrice = product.discount_price || product.price;
        if (min_price && effectivePrice < parseFloat(min_price)) return false;
        if (max_price && effectivePrice > parseFloat(max_price)) return false;
        return true;
      });
    }

    // Get total count (approximate, may need adjustment for price filtering)
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

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({ _id: id, is_active: true });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Increment views
    product.views_count += 1;
    await product.save();

    // Get related products (same category)
    const related = await Product.find({
      category: product.category,
      _id: { $ne: id },
      is_active: true,
    }).limit(4);

    res.json({
      product,
      related,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/products/categories/list
// @desc    Get all categories
// @access  Public
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Product.distinct('category', { is_active: true });
    res.json({ categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/products/filters/options
// @desc    Get filter options
// @access  Public
router.get('/filters/options', async (req, res) => {
  try {
    const materials = await Product.distinct('material', { is_active: true, material: { $ne: null } });
    const colors = await Product.distinct('color', { is_active: true, color: { $ne: null } });
    const gemstones = await Product.distinct('gemstone_type', { is_active: true, gemstone_type: { $ne: null } });

    const priceAggregation = await Product.aggregate([
      { $match: { is_active: true } },
      {
        $project: {
          price: { $ifNull: ['$discount_price', '$price'] },
        },
      },
      {
        $group: {
          _id: null,
          min: { $min: '$price' },
          max: { $max: '$price' },
        },
      },
    ]);

    const priceRange = priceAggregation[0] || { min: 0, max: 0 };

    res.json({
      materials,
      colors,
      gemstones,
      priceRange,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
