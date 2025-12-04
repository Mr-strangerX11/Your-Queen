const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      required: true,
      enum: ['earrings', 'necklaces', 'sets'],
    },
    price: {
      type: Number,
      required: true,
    },
    discount_price: {
      type: Number,
    },
    material: {
      type: String,
    },
    size: {
      type: String,
    },
    weight: {
      type: Number,
    },
    color: {
      type: String,
    },
    gemstone_type: {
      type: String,
    },
    stock_quantity: {
      type: Number,
      default: 0,
    },
    images: {
      type: [String],
      default: [],
    },
    badges: {
      type: [String],
      default: [],
    },
    care_instructions: {
      type: String,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    views_count: {
      type: Number,
      default: 0,
    },
    sales_count: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);

