import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Camera, Store, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { setProducts } from '../store/productSlice';
import ProductCard from '../components/common/ProductCard';
import Button from '../components/common/Button';
import BarcodeScannerModal from '../components/scanner/BarcodeScannerModal';
import './Home.css';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: products } = useSelector((state) => state.products);
  const [loading, setLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts();
        dispatch(setProducts(data));
      } catch (err) {
        console.error('Failed to load products from service:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [dispatch]);

  return (
    <>
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section glass-card">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to <span className="text-gradient">SwiftCart</span></h1>
          <p className="hero-subtitle">Smart Shopping, Zero Queues.</p>
          
          <div className="hero-actions">
            <Button variant="gradient" className="action-btn" onClick={() => setShowScanner(true)}>
              <Camera size={24} className="btn-icon" />
              Scan Barcode
            </Button>
            <Button variant="secondary" className="action-btn" onClick={() => navigate('/stores')}>
              <Store size={24} className="btn-icon" />
              Nearby Stores
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

    {/* Barcode Scanner Modal */}
    {showScanner && (
      <BarcodeScannerModal onClose={() => setShowScanner(false)} />
    )}
    </>
  );
};

export default Home;
