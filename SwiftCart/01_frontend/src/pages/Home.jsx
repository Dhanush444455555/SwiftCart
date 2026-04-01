import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Camera, MapPin, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { setProducts } from '../store/productSlice';
import ProductCard from '../components/common/ProductCard';
import Button from '../components/common/Button';
import './Home.css';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: products } = useSelector((state) => state.products);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts();
        dispatch(setProducts(data));
      } catch (err) {
        console.error('Failed to fetch from backend, maybe not running?', err);
        // Fallback dummy for demo UI
        const dummy = [
          { _id: '1', name: 'Wireless Headphones', description: 'Noise Canceling', price: 299, category: 'Electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', aisle: 'A12' },
          { _id: '2', name: 'Almond Milk', description: '1L unsweetened', price: 4.99, category: 'Groceries', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&q=80', aisle: 'G3' },
          { _id: '3', name: 'Minimalist Watch', description: 'Black leather', price: 199.50, category: 'Accessories', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80', aisle: 'A14' }
        ];
        dispatch(setProducts(dummy));
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [dispatch]);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section glass-card">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to <span className="text-gradient">SwiftCart</span></h1>
          <p className="hero-subtitle">Smart Shopping, Zero Queues.</p>
          
          <div className="hero-actions">
            <Button variant="gradient" className="action-btn" onClick={() => navigate('/scan')}>
              <Camera size={24} className="btn-icon" />
              Scan Item
            </Button>
            <Button variant="secondary" className="action-btn">
              <MapPin size={24} className="btn-icon" />
              Store Map
            </Button>
          </div>
        </div>
      </section>

      {/* AI Offers Section */}
      <section className="offers-section">
        <div className="section-header">
          <h2><Tag size={24} /> Personalized For You</h2>
        </div>
        <div className="offers-grid">
           <div className="offer-card glass-card">
              <h3>20% OFF</h3>
              <p>On Electronics Today</p>
           </div>
           <div className="offer-card glass-card">
              <h3>Buy 1 Get 1</h3>
              <p>Groceries Aisle 5</p>
           </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <h2>Featured Products</h2>
        {loading ? (
          <div className="spinner"></div>
        ) : (
          <div className="products-grid">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
