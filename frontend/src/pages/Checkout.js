import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCreditCard, FiLock } from 'react-icons/fi';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], subtotal: 0 });
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [shippingAddress, setShippingAddress] = useState({
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Nepal',
  });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchCart();
    fetchAddresses();
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart');
      setCart(res.data);
      if (res.data.items.length === 0) {
        navigate('/cart');
      }
    } catch (error) {
      navigate('/cart');
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const res = await api.get('/users/addresses');
      setAddresses(res.data.addresses);
      const defaultAddress = res.data.addresses.find((addr) => addr.is_default);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress.id);
        setShippingAddress(defaultAddress);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress({ ...shippingAddress, [name]: value });
  };

  const handlePlaceOrder = async () => {
    if (!shippingAddress.full_name || !shippingAddress.phone || !shippingAddress.address_line1) {
      toast.error('Please fill in all required address fields');
      return;
    }

    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    setProcessing(true);

    try {
      const res = await api.post('/orders', {
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
      });

      // Process payment based on method
      if (paymentMethod === 'khalti') {
        const paymentRes = await api.post('/payments/khalti', {
          amount: parseFloat(cart.subtotal) + 200 + parseFloat(cart.subtotal) * 0.13,
          order_id: res.data.order.id,
        });
        // Redirect to Khalti payment page
        window.location.href = paymentRes.data.payment_url;
      } else if (paymentMethod === 'esewa') {
        const paymentRes = await api.post('/payments/esewa', {
          amount: parseFloat(cart.subtotal) + 200 + parseFloat(cart.subtotal) * 0.13,
          order_id: res.data.order.id,
        });
        // Redirect to eSewa payment page
        window.location.href = paymentRes.data.payment_url;
      } else {
        // Card payment
        const paymentRes = await api.post('/payments/card', {
          amount: parseFloat(cart.subtotal) + 200 + parseFloat(cart.subtotal) * 0.13,
          order_id: res.data.order.id,
          token: 'mock_token', // In production, get from Stripe
        });

        if (paymentRes.data.success) {
          toast.success('Order placed successfully!');
          navigate(`/orders/${res.data.order.id}`);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setProcessing(false);
    }
  };

  if (!isAuthenticated || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const shippingFee = 200;
  const tax = parseFloat(cart.subtotal) * 0.13;
  const total = parseFloat(cart.subtotal) + shippingFee + tax;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>

              {addresses.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Saved Addresses</label>
                  <select
                    value={selectedAddress || ''}
                    onChange={(e) => {
                      const addr = addresses.find((a) => a.id === parseInt(e.target.value));
                      if (addr) {
                        setSelectedAddress(addr.id);
                        setShippingAddress(addr);
                      }
                    }}
                    className="input-field"
                  >
                    <option value="">Select saved address</option>
                    {addresses.map((addr) => (
                      <option key={addr.id} value={addr.id}>
                        {addr.full_name} - {addr.city}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="full_name"
                      value={shippingAddress.full_name}
                      onChange={handleAddressChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={handleAddressChange}
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Address Line 1 *</label>
                  <input
                    type="text"
                    name="address_line1"
                    value={shippingAddress.address_line1}
                    onChange={handleAddressChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Address Line 2</label>
                  <input
                    type="text"
                    name="address_line2"
                    value={shippingAddress.address_line2}
                    onChange={handleAddressChange}
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleAddressChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleAddressChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Postal Code *</label>
                    <input
                      type="text"
                      name="postal_code"
                      value={shippingAddress.postal_code}
                      onChange={handleAddressChange}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-3">
                {['khalti', 'esewa', 'card'].map((method) => (
                  <label
                    key={method}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === method
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-300 hover:border-primary-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-semibold capitalize">{method}</div>
                      {method === 'card' && (
                        <div className="text-sm text-gray-600 flex items-center mt-1">
                          <FiCreditCard className="mr-1" />
                          Credit/Debit Card
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} x {item.quantity}</span>
                    <span>Rs. {item.item_total}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs. {parseFloat(cart.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Rs. {shippingFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (13%)</span>
                  <span>Rs. {tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary-600">Rs. {total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={processing}
                className="btn-primary w-full mt-6 flex items-center justify-center"
              >
                <FiLock className="mr-2" />
                {processing ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

