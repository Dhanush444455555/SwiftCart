'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useCartStore } from '@/lib/store';
import apiClient from '@/lib/apiClient';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const { addItem } = useCartStore();

  useEffect(() => {
    fetchProducts();
  }, [filter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const url = filter ? `/products?category=${filter}` : '/products';
      const response = await apiClient.get(url);
      setProducts(response.data);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addItem(product);
    toast.success(`${product.name} added to cart!`);
  };

  const categories = [
    'Electronics',
    'Groceries',
    'Clothing',
    'Books',
    'Home',
    'Beauty',
    'Sports',
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Products</h1>

      {/* Category Filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('')}
          className={`px-4 py-2 rounded-lg ${
            filter === '' ? 'btn-primary' : 'btn-secondary'
          }`}
        >
          All Products
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-lg ${
              filter === cat ? 'btn-primary' : 'btn-secondary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="card hover:shadow-lg transition-shadow">
              <div className="mb-4 relative h-48 -mx-6 -mt-6">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {product.discount > 0 && (
                  <div className="absolute top-2 right-2 badge badge-danger">
                    -{product.discount}%
                  </div>
                )}
              </div>

              <h3 className="text-lg font-bold mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{product.description}</p>

              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="text-2xl font-bold text-blue-600">
                    ₹{(product.price * (1 - (product.discount || 0) / 100)).toFixed(2)}
                  </span>
                  {product.discount > 0 && (
                    <span className="text-sm text-gray-500 line-through ml-2">
                      ₹{product.price}
                    </span>
                  )}
                </div>
                <span className={`badge ${product.stock > 0 ? 'badge-success' : 'badge-danger'}`}>
                  {product.stock > 0 ? `Stock: ${product.stock}` : 'Out of Stock'}
                </span>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/products/${product._id}`}
                  className="btn-secondary flex-1 text-center"
                >
                  View Details
                </Link>
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                  className="btn-primary flex-1"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found</p>
        </div>
      )}
    </div>
  );
}
