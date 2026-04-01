import React, { useState, useEffect } from 'react';
import { Sparkles, ShoppingCart, Tag, Clock, TrendingUp, Zap, ChevronRight, Star, RefreshCw } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import './OffersPage.css';

const AI_URL = 'http://localhost:5001';

const CATEGORY_CONFIG = [
  { key: 'all',         label: 'All Deals',          emoji: '🎯', desc: 'Best offers across all categories', color: '#6C63FF' },
  { key: 'ration',      label: 'Ration & Groceries',  emoji: '🛒', desc: 'Rice, dal, oil, milk & pantry',     color: '#34d399' },
  { key: 'clothing',    label: 'Clothing & Apparel',  emoji: '👗', desc: 'Ethnic, casuals, formals & more',   color: '#f472b6' },
  { key: 'electronics', label: 'Electronics',         emoji: '📱', desc: 'Gadgets, audio & accessories',      color: '#06b6d4' },
];

const PREF_TAGS = {
  ration:      ['staples', 'breakfast', 'dairy', 'cooking', 'snacks'],
  clothing:    ['ethnic', 'formal', 'casual', 'sports', 'kids'],
  electronics: ['audio', 'wireless', 'gaming'],
  all:         ['staples', 'ethnic', 'casual', 'audio', 'sports'],
};

function ConfidenceBar({ confidence, color }) {
  return (
    <div className="op-conf-wrap">
      <div className="op-conf-track">
        <div className="op-conf-fill" style={{ width: `${confidence}%`, background: color || '#6C63FF' }} />
      </div>
      <span className="op-conf-label">{confidence}% match</span>
    </div>
  );
}

const OffersPage = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(s => s.auth);
  const isAdmin = user?.role === 'admin';

  const [category, setCategory]     = useState('all');
  const [preferences, setPrefs]     = useState([]);
  const [offers, setOffers]         = useState([]);
  const [loading, setLoading]       = useState(false);
  const [meta, setMeta]             = useState(null);
  const [addedIds, setAddedIds]     = useState(new Set());

  const fetchOffers = async (cat = category, prefs = preferences) => {
    setLoading(true);
    try {
      const res = await fetch(`${AI_URL}/api/offers/predict`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ category: cat, preferences: prefs, limit: 6 }),
      });
      const data = await res.json();
      setOffers(data.offers || []);
      setMeta({ timeOfDay: data.timeOfDay, dayType: data.dayType });
    } catch (err) {
      console.error('AI service error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOffers(); }, []);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPrefs([]);
    fetchOffers(cat, []);
  };

  const togglePref = (tag) => {
    const next = preferences.includes(tag)
      ? preferences.filter(p => p !== tag)
      : [...preferences, tag];
    setPrefs(next);
    fetchOffers(category, next);
  };

  const handleAddToCart = (offer) => {
    dispatch(addToCart({
      _id:      offer.id,
      name:     offer.title,
      price:    offer.offerPrice,
      image:    offer.img,
      quantity: 1,
    }));
    setAddedIds(prev => new Set([...prev, offer.id]));
    setTimeout(() => {
      setAddedIds(prev => { const s = new Set(prev); s.delete(offer.id); return s; });
    }, 2000);
  };

  const catConf = CATEGORY_CONFIG.find(c => c.key === category);

  return (
    <div className="op-page">

      {/* ── Hero ── */}
      <div className="op-hero">
        <div className="op-hero-icon">
          <Sparkles size={28} color="#a78bfa" />
        </div>
        <div>
          <h1 className="op-hero-title">
            AI-Powered Offers
            <span className="op-hero-badge"><Zap size={12} /> Live</span>
          </h1>
          <p className="op-hero-sub">
            Smart deals predicted for you based on time, trends &amp; preferences
          </p>
        </div>
        <button className="op-refresh-btn" onClick={() => fetchOffers()} title="Re-predict offers">
          <RefreshCw size={15} className={loading ? 'op-spin' : ''} />
        </button>
      </div>

      {/* ── Context pills ── */}
      {meta && (
        <div className="op-context">
          <span className="op-ctx-pill"><Clock size={12} /> {meta.timeOfDay}</span>
          <span className="op-ctx-pill"><TrendingUp size={12} /> {meta.dayType} pricing</span>
          <span className="op-ctx-pill"><Sparkles size={12} /> AI scoring active</span>
        </div>
      )}

      {/* ── Category Tabs ── */}
      <div className="op-cat-grid">
        {CATEGORY_CONFIG.map(cat => (
          <button
            key={cat.key}
            onClick={() => handleCategoryChange(cat.key)}
            className={`op-cat-card ${category === cat.key ? 'active' : ''}`}
            style={category === cat.key ? { borderColor: cat.color, boxShadow: `0 0 20px ${cat.color}22` } : {}}
          >
            <span className="op-cat-emoji">{cat.emoji}</span>
            <span className="op-cat-label">{cat.label}</span>
            <span className="op-cat-desc">{cat.desc}</span>
          </button>
        ))}
      </div>

      {/* ── Preference Tags ── */}
      <div className="op-prefs">
        <span className="op-prefs-label">Refine by:</span>
        {(PREF_TAGS[category] || []).map(tag => (
          <button
            key={tag}
            onClick={() => togglePref(tag)}
            className={`op-pref-tag ${preferences.includes(tag) ? 'selected' : ''}`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* ── Offer Cards ── */}
      {loading ? (
        <div className="op-skeleton-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="op-skeleton" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      ) : offers.length > 0 ? (
        <div className="op-offers-grid">
          {offers.map((offer, i) => (
            <div
              key={offer.id}
              className="op-card"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              {/* Discount badge */}
              <div className="op-discount-badge">
                <Tag size={11} /> {offer.discount}% OFF
              </div>

              {/* Product image */}
              <div className="op-card-img-wrap">
                <img
                  src={offer.img}
                  alt={offer.title}
                  className="op-card-img"
                  onError={e => { e.target.style.display = 'none'; }}
                />
                <div className="op-card-img-grad" />
              </div>

              {/* Card body */}
              <div className="op-card-body">
                <span className="op-card-brand">{offer.brand}</span>
                <h3 className="op-card-title">{offer.title}</h3>
                <p className="op-card-qty">{offer.qty}</p>
                <p className="op-card-desc">{offer.description}</p>

                {/* AI Confidence */}
                <ConfidenceBar confidence={offer.confidence} color={catConf?.color} />

                {/* AI Reason */}
                <p className="op-ai-reason">{offer.aiReason}</p>

                {/* Price row */}
                <div className="op-price-row">
                  <div className="op-prices">
                    <span className="op-offer-price">₹{offer.offerPrice.toLocaleString('en-IN')}</span>
                    <span className="op-orig-price">₹{offer.originalPrice.toLocaleString('en-IN')}</span>
                    <span className="op-savings">Save ₹{offer.savingsAmt.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Action */}
                {!isAdmin && (
                  <button
                    className={`op-add-btn ${addedIds.has(offer.id) ? 'added' : ''}`}
                    onClick={() => handleAddToCart(offer)}
                  >
                    {addedIds.has(offer.id) ? (
                      <><Star size={14} fill="currentColor" /> Added!</>
                    ) : (
                      <><ShoppingCart size={14} /> Add to Cart</>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="op-empty">
          <Sparkles size={40} color="#334155" />
          <p>No offers found. Try changing preferences.</p>
        </div>
      )}

    </div>
  );
};

export default OffersPage;
