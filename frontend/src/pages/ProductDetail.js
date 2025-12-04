import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiShare2, FiMinus, FiPlus } from 'react-icons/fi';
import { FacebookShareButton, TwitterShareButton, PinterestShareButton } from 'react-share';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    fetchProduct();
    if (isAuthenticated) {
      checkWishlist();
    }
  }, [id, isAuthenticated]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data.product);
      setRelatedProducts(res.data.related || []);
    } catch (error) {
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const checkWishlist = async () => {
    try {
      const res = await api.get(`/wishlist/check/${id}`);
      setInWishlist(res.data.inWishlist);
    } catch (error) {
      // Not in wishlist
    }
  };

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      return;
    }

    try {
      if (inWishlist) {
        const res = await api.get('/wishlist');
        const item = res.data.items.find((i) => i.product_id === parseInt(id));
        if (item) {
          await api.delete(`/wishlist/${item.id}`);
          setInWishlist(false);
          toast.success('Removed from wishlist');
        }
      } else {
        await api.post('/wishlist', { product_id: parseInt(id) });
        setInWishlist(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  const addToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add to cart');
      navigate('/login');
      return;
    }

    try {
      await api.post('/cart', { product_id: parseInt(id), quantity });
      toast.success('Added to cart!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!product) {
    return null;
  }

  const currentPrice = product.discount_price || product.price;
  const shareUrl = window.location.href;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <div className="relative h-96 mb-4">
                {product.images && product.images[selectedImage] ? (
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    💎
                  </div>
                )}
              </div>
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded border-2 ${
                        selectedImage === index ? 'border-primary-600' : 'border-gray-300'
                      } overflow-hidden`}
                    >
                      <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-8">
              {product.badges && product.badges.length > 0 && (
                <div className="flex gap-2 mb-4">
                  {product.badges.map((badge) => (
                    <span
                      key={badge}
                      className={`badge-${
                        badge.toLowerCase().includes('new')
                          ? 'new'
                          : badge.toLowerCase().includes('sale')
                          ? 'sale'
                          : badge.toLowerCase().includes('bestseller')
                          ? 'bestseller'
                          : 'limited'
                      }`}
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              )}

              <h1 className="text-3xl font-serif font-bold mb-4">{product.name}</h1>

              <div className="mb-6">
                {product.discount_price ? (
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-primary-600">
                      Rs. {product.discount_price}
                    </span>
                    <span className="text-xl text-gray-400 line-through">
                      Rs. {product.price}
                    </span>
                    <span className="badge-sale">
                      {Math.round(((product.price - product.discount_price) / product.price) * 100)}% OFF
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-primary-600">
                    Rs. {product.price}
                  </span>
                )}
              </div>

              <div className="space-y-4 mb-6">
                {product.description && (
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-gray-600">{product.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {product.material && (
                    <div>
                      <span className="text-gray-500">Material:</span>
                      <p className="font-medium">{product.material}</p>
                    </div>
                  )}
                  {product.color && (
                    <div>
                      <span className="text-gray-500">Color:</span>
                      <p className="font-medium">{product.color}</p>
                    </div>
                  )}
                  {product.size && (
                    <div>
                      <span className="text-gray-500">Size:</span>
                      <p className="font-medium">{product.size}</p>
                    </div>
                  )}
                  {product.gemstone_type && (
                    <div>
                      <span className="text-gray-500">Gemstone:</span>
                      <p className="font-medium">{product.gemstone_type}</p>
                    </div>
                  )}
                </div>

                {product.care_instructions && (
                  <div>
                    <h3 className="font-semibold mb-2">Care Instructions</h3>
                    <p className="text-gray-600">{product.care_instructions}</p>
                  </div>
                )}

                <div>
                  <span className="text-gray-500">Stock:</span>
                  <p className={`font-medium ${product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock_quantity > 0 ? `In Stock (${product.stock_quantity} available)` : 'Out of Stock'}
                  </p>
                </div>
              </div>

              {/* Quantity & Actions */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="font-medium">Quantity:</span>
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-100"
                      disabled={quantity <= 1}
                    >
                      <FiMinus />
                    </button>
                    <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                      className="p-2 hover:bg-gray-100"
                      disabled={quantity >= product.stock_quantity}
                    >
                      <FiPlus />
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={addToCart}
                    disabled={product.stock_quantity === 0}
                    className="flex-1 btn-primary flex items-center justify-center"
                  >
                    <FiShoppingCart className="mr-2" />
                    Add to Cart
                  </button>
                  <button
                    onClick={toggleWishlist}
                    className={`p-4 rounded-lg border-2 ${
                      inWishlist
                        ? 'border-primary-600 bg-primary-50 text-primary-600'
                        : 'border-gray-300 hover:border-primary-600'
                    } transition-colors`}
                  >
                    <FiHeart className={inWishlist ? 'fill-current' : ''} size={20} />
                  </button>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t">
                  <span className="text-gray-600">Share:</span>
                  <FacebookShareButton url={shareUrl} className="hover:opacity-70">
                    <FiShare2 size={20} className="text-blue-600" />
                  </FacebookShareButton>
                  <TwitterShareButton url={shareUrl} className="hover:opacity-70">
                    <FiShare2 size={20} className="text-blue-400" />
                  </TwitterShareButton>
                  <PinterestShareButton url={shareUrl} media={product.images?.[0]} className="hover:opacity-70">
                    <FiShare2 size={20} className="text-red-600" />
                  </PinterestShareButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-serif font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ y: -5 }}
                  className="card overflow-hidden"
                >
                  <a href={`/products/${product.id}`} className="block">
                    <div className="relative h-64 bg-gray-100">
                      {product.images && product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                          💎
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">{product.name}</h3>
                      <div className="text-primary-600 font-bold">
                        Rs. {product.discount_price || product.price}
                      </div>
                    </div>
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;

