import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFilter, FiX, FiHeart } from 'react-icons/fi';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    material: '',
    color: '',
    gemstone_type: '',
    min_price: '',
    max_price: '',
    search: searchParams.get('search') || '',
    sort: 'newest',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState({});
  const [pagination, setPagination] = useState({});
  const { isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState(new Set());

  useEffect(() => {
    fetchFilterOptions();
    fetchProducts();
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [filters, isAuthenticated]);

  const fetchFilterOptions = async () => {
    try {
      const res = await api.get('/products/filters/options');
      setFilterOptions(res.data);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });
      params.append('page', '1');
      params.append('limit', '12');

      const res = await api.get(`/products?${params.toString()}`);
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      const res = await api.get('/wishlist');
      const ids = new Set(res.data.items.map((item) => item.product_id));
      setWishlistItems(ids);
    } catch (error) {
      // Wishlist might be empty
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const toggleWishlist = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      return;
    }

    try {
      if (wishlistItems.has(productId)) {
        // Remove from wishlist
        const res = await api.get('/wishlist');
        const item = res.data.items.find((i) => i.product_id === productId);
        if (item) {
          await api.delete(`/wishlist/${item.id}`);
          setWishlistItems(new Set([...wishlistItems].filter((id) => id !== productId)));
          toast.success('Removed from wishlist');
        }
      } else {
        // Add to wishlist
        await api.post('/wishlist', { product_id: productId });
        setWishlistItems(new Set([...wishlistItems, productId]));
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={`${
              showFilters ? 'block' : 'hidden'
            } md:block w-full md:w-64 bg-white rounded-lg shadow-md p-6 h-fit sticky top-24`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="md:hidden text-gray-500"
              >
                <FiX />
              </button>
            </div>

            <div className="space-y-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="input-field"
                >
                  <option value="">All Categories</option>
                  <option value="earrings">Earrings</option>
                  <option value="necklaces">Necklaces</option>
                  <option value="sets">Jewelry Sets</option>
                </select>
              </div>

              {/* Material */}
              {filterOptions.materials && (
                <div>
                  <label className="block text-sm font-medium mb-2">Material</label>
                  <select
                    value={filters.material}
                    onChange={(e) => handleFilterChange('material', e.target.value)}
                    className="input-field"
                  >
                    <option value="">All Materials</option>
                    {filterOptions.materials.map((material) => (
                      <option key={material} value={material}>
                        {material}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Color */}
              {filterOptions.colors && (
                <div>
                  <label className="block text-sm font-medium mb-2">Color</label>
                  <select
                    value={filters.color}
                    onChange={(e) => handleFilterChange('color', e.target.value)}
                    className="input-field"
                  >
                    <option value="">All Colors</option>
                    {filterOptions.colors.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Price Range */}
              {filterOptions.priceRange && (
                <div>
                  <label className="block text-sm font-medium mb-2">Price Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.min_price}
                      onChange={(e) => handleFilterChange('min_price', e.target.value)}
                      className="input-field"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.max_price}
                      onChange={(e) => handleFilterChange('max_price', e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  setFilters({
                    category: '',
                    material: '',
                    color: '',
                    gemstone_type: '',
                    min_price: '',
                    max_price: '',
                    search: '',
                    sort: 'newest',
                  });
                }}
                className="w-full btn-outline text-sm"
              >
                Clear Filters
              </button>
            </div>
          </motion.div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(true)}
                  className="md:hidden btn-outline flex items-center"
                >
                  <FiFilter className="mr-2" />
                  Filters
                </button>
                <h2 className="text-2xl font-serif font-bold">
                  {filters.search ? `Search: ${filters.search}` : 'All Products'}
                </h2>
              </div>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="input-field w-auto"
              >
                <option value="newest">Newest</option>
                <option value="popular">Most Popular</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>

            {loading ? (
              <div className="text-center py-12">Loading...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -5 }}
                    className="card overflow-hidden relative"
                  >
                    <Link to={`/products/${product.id}`}>
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
                    </Link>
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-primary-50 transition-colors z-10"
                    >
                      <FiHeart
                        className={wishlistItems.has(product.id) ? 'text-primary-600 fill-current' : 'text-gray-600'}
                        size={20}
                      />
                    </button>
                    <div className="p-4">
                      <Link to={`/products/${product.id}`}>
                        <h3 className="font-semibold text-lg mb-2 hover:text-primary-600 transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center justify-between">
                        <div>
                          {product.discount_price ? (
                            <>
                              <span className="text-primary-600 font-bold text-lg">
                                Rs. {product.discount_price}
                              </span>
                              <span className="text-gray-400 line-through ml-2 text-sm">
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
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;

