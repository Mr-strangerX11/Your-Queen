import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiStar } from 'react-icons/fi';
import api from '../utils/api';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const res = await api.get('/products?sort=popular&limit=8');
      setFeaturedProducts(res.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-gold-50 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-6">
              Your Queen
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Premium Jewelry for the Modern Woman
            </p>
            <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto">
              Express your style with elegant earrings, stunning necklaces, and exquisite jewelry sets
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products" className="btn-primary inline-flex items-center">
                Shop Now
                <FiArrowRight className="ml-2" />
              </Link>
              <Link to="/products?category=sets" className="btn-secondary inline-flex items-center">
                View Collections
                <FiStar className="ml-2" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Earrings', image: '💎', link: '/products?category=earrings' },
              { name: 'Necklaces', image: '✨', link: '/products?category=necklaces' },
              { name: 'Jewelry Sets', image: '👑', link: '/products?category=sets' },
            ].map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Link to={category.link} className="card p-8 text-center block">
                  <div className="text-6xl mb-4">{category.image}</div>
                  <h3 className="text-2xl font-serif font-semibold mb-2">{category.name}</h3>
                  <p className="text-gray-600">Explore our collection</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-serif font-bold">Featured Products</h2>
            <Link to="/products" className="text-primary-600 hover:text-primary-700 font-medium">
              View All →
            </Link>
          </div>
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Link to={`/products/${product.id}`} className="card overflow-hidden block">
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
                      {product.badges && product.badges.length > 0 && (
                        <div className="absolute top-2 left-2 flex flex-col gap-2">
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
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          {product.discount_price ? (
                            <>
                              <span className="text-primary-600 font-bold text-lg">
                                Rs. {product.discount_price}
                              </span>
                              <span className="text-gray-400 line-through ml-2">
                                Rs. {product.price}
                              </span>
                            </>
                          ) : (
                            <span className="text-primary-600 font-bold text-lg">
                              Rs. {product.price}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Join Our Community
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Get exclusive offers, early access to new collections, and style inspiration
          </p>
          <Link to="/register" className="btn-secondary bg-white text-primary-600 hover:bg-primary-50">
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

