import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Camera, Store, Tag, Grid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tilt } from 'react-tilt';
import { motion, useScroll, useTransform } from 'framer-motion';
import ProductCard from '../components/common/ProductCard';
import Button from '../components/common/Button';
import BarcodeScannerModal from '../components/scanner/BarcodeScannerModal';
import PersonalisedCarousel from '../components/recommendation/PersonalisedCarousel';
import './Home.css';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: products } = useSelector((state) => state.products);
  const { user, token } = useSelector((state) => state.auth || {});
  const [loading, setLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const [aiOffers, setAiOffers] = useState([]);
  const [offersLoading, setOffersLoading] = useState(true);

  useEffect(() => {
    const fetchDynamicOffers = async () => {
      try {
        let preferences = [];
        
        // 1. If user is logged in, fetch their previous orders to learn their preferences
        if (user && token) {
           try {
             const orderRes = await fetch('/api/orders', {
                headers: { 'Authorization': `Bearer ${token}` }
             });
             const orders = await orderRes.json();
             if (Array.isArray(orders)) {
                orders.forEach(order => {
                   order.items?.forEach(item => {
                      if (item.category) preferences.push(item.category.toLowerCase());
                      if (item.name) preferences.push(item.name.split(' ')[0].toLowerCase());
                   });
                });
             }
           } catch { /* ignore order fetch error and fallback to generic */ }
        }

        // 2. Fetch predicted offers from the AI model engine on port 5001
        const res = await fetch('/api/offers/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category: 'all', preferences, limit: 2 })
        });
        const data = await res.json();
        setAiOffers(data.offers || []);
      } catch (error) {
        console.error("Failed to fetch AI offers:", error);
      } finally {
        setOffersLoading(false);
      }
    };
    fetchDynamicOffers();
  }, [user, token]);

  // Parallax Scroll Hooks
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 500], [0, 150]);
  const opacityHero = useTransform(scrollY, [0, 300], [1, 0]);

  const floatingVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 1, ease: 'easeOut', staggerChildren: 0.2 }
    },
    float: {
      y: [-10, 10],
      transition: { duration: 3, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }
    }
  };

  const tiltOptions = {
    max: 15, perspective: 1000, scale: 1.05, speed: 1000,
    transition: true, axis: null, reset: true,
    easing: "cubic-bezier(.03,.98,.52,.99)",
    glare: true, "max-glare": 0.4
  };

  return (
    <>
    <div className="home-container">
      {/* Hero Section — Revolving Spiral */}
      <motion.section
        className="hero-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{ y: yHero, opacity: opacityHero }}
      >
        {/* Animated spiral rings */}
        <div className="hero-spiral-wrap" aria-hidden="true">
          <div className="spiral-ring spiral-ring-1" />
          <div className="spiral-ring spiral-ring-2" />
          <div className="spiral-ring spiral-ring-3" />
          <div className="spiral-ring spiral-ring-4" />
        </div>

        {/* Glow blobs */}
        <div className="hero-blob hero-blob-purple" />
        <div className="hero-blob hero-blob-orange" />

        <div className="hero-content">
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Welcome to <span className="text-gradient">SwiftCart</span>
          </motion.h1>
          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            Smart Shopping, Zero Queues.
          </motion.p>
          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
          >
            <Button variant="gradient" className="action-btn" onClick={() => setShowScanner(true)}>
              <Camera size={24} className="btn-icon" />
              Scan Barcode
            </Button>
            <Button variant="secondary" className="action-btn" onClick={() => navigate('/stores')}>
              <Store size={24} className="btn-icon" />
              Nearby Stores
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* AI Offers Section */}
      <section className="offers-section">
        <div className="section-header">
          <h2><Tag size={24} /> Personalized For You</h2>
        </div>
        
        {/* Promotional Slides inside Personalized For You */}
        <PersonalisedCarousel />
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

    {/* Footer */}
    <footer className="home-footer">
      <div className="footer-inner">
        {/* Brand */}
        <div className="footer-brand">
          <span className="footer-logo">SWIFTCART</span>
          <p className="footer-tagline">Smart Shopping, Zero Queues.</p>
          <div className="footer-socials">
            <a href="#" className="social-link" aria-label="Twitter">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/></svg>
            </a>
            <a href="#" className="social-link" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="#" className="social-link" aria-label="GitHub">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4 className="footer-col-title">Shop</h4>
          <ul className="footer-links">
            <li><a href="#" onClick={() => navigate('/')}>Home</a></li>
            <li><a href="#" onClick={() => navigate('/products')}>All Products</a></li>
            <li><a href="#" onClick={() => navigate('/stores')}>Nearby Stores</a></li>
            <li><a href="#" onClick={() => navigate('/cart')}>My Cart</a></li>
          </ul>
        </div>

        {/* Account */}
        <div className="footer-col">
          <h4 className="footer-col-title">Account</h4>
          <ul className="footer-links">
            <li><a href="#" onClick={() => navigate('/login')}>Login</a></li>
            <li><a href="#" onClick={() => navigate('/orders')}>My Orders</a></li>
            <li><a href="#" onClick={() => navigate('/feedback')}>Feedback</a></li>
            <li><a href="#" onClick={() => navigate('/ai-offers')}>AI Offers</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <h4 className="footer-col-title">Contact</h4>
          <ul className="footer-links footer-contact">
            <li>
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>
              support@swiftcart.in
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
              +91 98765 43210
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              Bengaluru, Karnataka
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} SwiftCart. All rights reserved.</span>
        <span className="footer-bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </span>
      </div>
    </footer>

    {/* Barcode Scanner Modal */}
    {showScanner && (
      <BarcodeScannerModal onClose={() => setShowScanner(false)} />
    )}
    </>
  );
};

export default Home;
