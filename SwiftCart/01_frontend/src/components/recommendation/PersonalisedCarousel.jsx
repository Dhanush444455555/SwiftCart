import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './PersonalisedCarousel.css';

const PersonalisedCarousel = () => {
  const { user } = useSelector(state => state.auth);
  const { list } = useSelector(state => state.products);
  const navigate = useNavigate();

  const [currentSlide, setCurrentSlide] = useState(0);
  const slideTimer = useRef(null);

  const firstName = user?.name ? user.name.split(' ')[0] : 'You';

  // Build promotional banner slides
  const bannerSlides = [
    { 
      title: 'Redmi Note 15 SE', 
      subtitle: 'From ₹17,999*', 
      note: 'Sale starts 7th April', 
      badge: 'BIG BACHAT DAYS',
      isAd: true,
      image: '/promo1.png', 
      bg: 'linear-gradient(135deg, #3d0000 0%, #7b0000 50%, #aa0000 100%)'
    },
    { 
      title: 'Samsung Galaxy S24', 
      subtitle: 'From ₹65,999*', 
      note: 'Pre-book Now', 
      badge: 'NEW LAUNCH',
      isAd: true,
      image: '/promo2.png',
      bg: 'linear-gradient(135deg, #001f3f 0%, #003366 50%, #0059b3 100%)'
    },
    { 
      title: 'iPhone 15 Pro Max', 
      subtitle: 'Starting ₹1,40,000', 
      note: 'Titanium built', 
      badge: 'PREMIUM DEALS',
      isAd: false,
      image: '/promo3.png',
      bg: 'linear-gradient(135deg, #1f1f1f 0%, #383838 50%, #525252 100%)'
    },
    { 
      title: 'Sony Alpha ZV-E10', 
      subtitle: 'Content Creator Kit', 
      note: 'Extra 10% Off via Bank Cards', 
      badge: 'CLEARANCE',
      isAd: true,
      image: '/promo2.png', // Reusing a placeholder
      bg: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)'
    },
    { 
      title: 'MacBook Pro M3', 
      subtitle: 'Space Black Edition', 
      note: 'No Cost EMI Available', 
      badge: 'HOT DEAL',
      isAd: true,
      image: '/promo3.png', // Reusing a placeholder
      bg: 'linear-gradient(135deg, #111 0%, #444 100%)'
    }
  ];

  // Auto-advance slides
  useEffect(() => {
    slideTimer.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % bannerSlides.length);
    }, 3500);
    return () => clearInterval(slideTimer.current);
  }, [bannerSlides.length]);

  const goToSlide = (idx) => {
    setCurrentSlide(idx);
    clearInterval(slideTimer.current);
    slideTimer.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % bannerSlides.length);
    }, 3500);
  };

  // Grab personalised product row
  const displayItems = list && list.length > 0 ? list.slice(0, 8) : [];

  if (displayItems.length === 0) return null;

  return (
    <div className="pc-banner-wrapper" style={{ borderRadius: '16px', marginBottom: '24px' }}>
      <div
        className="pc-banner-track"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {bannerSlides.map((slide, idx) => (
          <div
            key={idx}
            className="pc-banner-slide"
            onClick={() => navigate('/offers')}
            style={{ background: slide.bg }}
          >
            {slide.badge && (
              <div className="pc-banner-badge">{slide.badge}</div>
            )}
            {slide.isAd && (
              <div className="pc-banner-ad">AD</div>
            )}
            <div className="pc-banner-content">
              <h3 className="pc-banner-title">{slide.title}</h3>
              <p className="pc-banner-sub">{slide.subtitle}</p>
              <span className="pc-banner-note">{slide.note}</span>
            </div>
            {slide.image && (
              <img src={slide.image} alt={slide.title} className="pc-banner-img" />
            )}
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="pc-dots">
        {bannerSlides.map((_, idx) => (
          <button
            key={idx}
            className={`pc-dot ${currentSlide === idx ? 'pc-dot--active' : ''}`}
            onClick={() => goToSlide(idx)}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PersonalisedCarousel;
