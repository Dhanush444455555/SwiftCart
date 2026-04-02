import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Camera, Store, Tag, Grid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
            <p>On Chocolates Today</p>
          </div>
          <div className="offer-card glass-card">
            <h3>Buy 1 Get 1</h3>
            <p>Snacks &amp; Beverages Aisle C</p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="featured-section">
        <div className="section-header">
          <h2><Grid size={20} /> All Products</h2>
        </div>
        <div className="products-grid">
          {products.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
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
