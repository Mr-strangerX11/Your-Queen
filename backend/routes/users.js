const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Address = require('../models/Address');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All user routes require authentication
router.use(protect);

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  body('first_name').optional().notEmpty().trim(),
  body('last_name').optional().notEmpty().trim(),
  body('phone').optional().isMobilePhone(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { first_name, last_name, phone, avatar_url } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (first_name) user.first_name = first_name;
    if (last_name) user.last_name = last_name;
    if (phone) user.phone = phone;
    if (avatar_url) user.avatar_url = avatar_url;

    await user.save();

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/password
// @desc    Update password
// @access  Private
router.put('/password', [
  body('current_password').notEmpty(),
  body('new_password').isLength({ min: 6 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { current_password, new_password } = req.body;

    const user = await User.findById(req.user.id);
    if (!user || !user.password) {
      return res.status(400).json({ message: 'Password cannot be changed for social login accounts' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(current_password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password (will be hashed by pre-save hook)
    user.password = new_password;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/addresses
// @desc    Get user addresses
// @access  Private
router.get('/addresses', async (req, res) => {
  try {
    const addresses = await Address.find({ user_id: req.user.id })
      .sort({ is_default: -1, createdAt: -1 });

    res.json({ addresses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users/addresses
// @desc    Add new address
// @access  Private
router.post('/addresses', [
  body('full_name').notEmpty(),
  body('phone').notEmpty(),
  body('address_line1').notEmpty(),
  body('city').notEmpty(),
  body('state').notEmpty(),
  body('postal_code').notEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { full_name, phone, address_line1, address_line2, city, state, postal_code, country, is_default } = req.body;

    // If this is set as default, unset other defaults
    if (is_default) {
      await Address.updateMany({ user_id: req.user.id }, { is_default: false });
    }

    const address = await Address.create({
      user_id: req.user.id,
      full_name,
      phone,
      address_line1,
      address_line2: address_line2 || null,
      city,
      state,
      postal_code,
      country: country || 'Nepal',
      is_default: is_default || false,
    });

    res.status(201).json({ address });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/addresses/:id
// @desc    Update address
// @access  Private
router.put('/addresses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, phone, address_line1, address_line2, city, state, postal_code, country, is_default } = req.body;

    const address = await Address.findOne({ _id: id, user_id: req.user.id });
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // If setting as default, unset other defaults
    if (is_default) {
      await Address.updateMany({ user_id: req.user.id, _id: { $ne: id } }, { is_default: false });
    }

    if (full_name) address.full_name = full_name;
    if (phone) address.phone = phone;
    if (address_line1) address.address_line1 = address_line1;
    if (address_line2 !== undefined) address.address_line2 = address_line2;
    if (city) address.city = city;
    if (state) address.state = state;
    if (postal_code) address.postal_code = postal_code;
    if (country) address.country = country;
    if (is_default !== undefined) address.is_default = is_default;

    await address.save();

    res.json({ address });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/users/addresses/:id
// @desc    Delete address
// @access  Private
router.delete('/addresses/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const address = await Address.findOneAndDelete({ _id: id, user_id: req.user.id });

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.json({ message: 'Address deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
