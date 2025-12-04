const express = require('express');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All payment routes require authentication
router.use(protect);

// @route   POST /api/payments/khalti
// @desc    Initialize Khalti payment
// @access  Private
router.post('/khalti', async (req, res) => {
  try {
    const { amount, order_id } = req.body;

    // In production, use Khalti SDK
    // For now, return mock response
    const khaltiResponse = {
      pidx: 'mock_khalti_pidx_' + Date.now(),
      payment_url: 'https://khalti.com/payment/mock',
      expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    };

    // Update order with payment info
    await Order.findByIdAndUpdate(order_id, {
      payment_method: 'khalti',
      payment_status: 'pending',
    });

    res.json(khaltiResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Payment initialization failed' });
  }
});

// @route   POST /api/payments/khalti/verify
// @desc    Verify Khalti payment
// @access  Private
router.post('/khalti/verify', async (req, res) => {
  try {
    const { pidx, order_id } = req.body;

    // In production, verify with Khalti API
    // Mock verification
    const verified = true;

    if (verified) {
      await Order.findByIdAndUpdate(order_id, {
        payment_status: 'completed',
        order_status: 'processing',
      });

      res.json({ success: true, message: 'Payment verified' });
    } else {
      res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Payment verification failed' });
  }
});

// @route   POST /api/payments/esewa
// @desc    Initialize eSewa payment
// @access  Private
router.post('/esewa', async (req, res) => {
  try {
    const { amount, order_id } = req.body;

    // In production, use eSewa SDK
    const esewaResponse = {
      payment_url: 'https://esewa.com.np/payment/mock',
      transaction_id: 'mock_esewa_' + Date.now(),
    };

    await Order.findByIdAndUpdate(order_id, {
      payment_method: 'esewa',
      payment_status: 'pending',
    });

    res.json(esewaResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Payment initialization failed' });
  }
});

// @route   POST /api/payments/card
// @desc    Process card payment (Stripe)
// @access  Private
router.post('/card', async (req, res) => {
  try {
    const { amount, order_id, token } = req.body;

    // In production, use Stripe SDK
    // Mock payment processing
    const paymentResult = {
      success: true,
      transaction_id: 'mock_stripe_' + Date.now(),
    };

    if (paymentResult.success) {
      await Order.findByIdAndUpdate(order_id, {
        payment_method: 'card',
        payment_status: 'completed',
        order_status: 'processing',
      });

      res.json({ success: true, message: 'Payment successful', ...paymentResult });
    } else {
      res.status(400).json({ success: false, message: 'Payment failed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Payment processing failed' });
  }
});

module.exports = router;
