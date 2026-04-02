import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  Search as SearchIcon, Sparkles, X, TrendingUp,
  Clock, ChevronRight, ShoppingCart, Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { selectIsAdmin, selectIsAuthenticated } from '../store/authSlice';
import { formatCurrency } from '../utils/formatCurrency';
import './Search.css';

/* ── Static data ─────────────────────────────────────────── */
const CATEGORIES = [
  { id: 'all',         label: 'For You',      emoji: '✨' },
  { id: 'fresh',       label: 'Fresh',        emoji: '🍎' },
  { id: 'grocery',     label: 'Grocery',      emoji: '🛒' },
  { id: 'dairy',       label: 'Dairy',        emoji: '🥛' },
  { id: 'snacks',      label: 'Snacks',       emoji: '🍿' },
  { id: 'beverages',   label: 'Beverages',    emoji: '☕' },
  { id: 'electronics', label: 'Electronics',  emoji: '📱' },
  { id: 'clothing',    label: 'Clothing',     emoji: '👕' },
  { id: 'home',        label: 'Home',         emoji: '🏠' },
  { id: 'sports',      label: 'Sports',       emoji: '⚽' },
  { id: 'beauty',      label: 'Beauty',       emoji: '💄' },
  { id: 'health',      label: 'Health',       emoji: '💊' },
];

const ARCH_CATEGORIES = [
  { label: 'Refreshing Sips',  emoji: '🧃', color: '#1a1a1a', tag: 'beverages',   desc: 'Cold drinks & juices' },
  { label: 'Fresh Picks',      emoji: '🍉', color: '#1a1a1a', tag: 'fresh',       desc: 'Farm to door' },
  { label: 'Sun Essentials',   emoji: '🕶️', color: '#1a1a1a', tag: 'beauty',      desc: 'Skincare & protection' },
  { label: 'Home Needs',       emoji: '🏠', color: '#1a1a1a', tag: 'home',        desc: 'Cleaning & decor' },
  { label: 'Snack Attack',     emoji: '🍿', color: '#1a1a1a', tag: 'snacks',      desc: 'Munchies & bites' },
  { label: 'Stay Active',      emoji: '⚽', color: '#1a1a1a', tag: 'sports',      desc: 'Sports & fitness' },
];

const TRENDING = ['Sunscreen', 'Cold Coffee', 'Watermelon', 'Protein Bar', 'Headphones', 'Kurta'];
const RECENT   = ['Milk', 'Bread', 'Rice', 'Soap'];

/* ── Component ───────────────────────────────────────────── */
const Search = () => {
  const { list: products }  = useSelector(state => state.products);
  const isAdmin             = useSelector(selectIsAdmin);
  const isAuthenticated     = useSelector(selectIsAuthenticated);
  const { addItem }         = useCart();
  const navigate            = useNavigate();
  const inputRef            = useRef(null);

  const [query,       setQuery]       = useState('');
  const [activeTab,   setActiveTab]   = useState('all');
  const [filtered,    setFiltered]    = useState([]);
  const [showResults, setShowResults] = useState(false);

  /* Filter products whenever query or tab changes */
  useEffect(() => {
    let base = products;
    if (activeTab !== 'all') {
      base = base.filter(p => p.category?.toLowerCase().includes(activeTab));
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      base = base.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }
    setFiltered(base);
    setShowResults(query.trim().length > 0 || activeTab !== 'all');
  }, [query, activeTab, products]);

  const handleArchClick = (tag) => {
    setActiveTab(tag);
    setShowResults(true);
    inputRef.current?.focus();
  };

  const handleQuickSearch = (term) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  const handleAddToCart = (product) => {
    if (!isAuthenticated) { navigate('/login'); return; }
    addItem(product);
  };

  const clearSearch = () => { setQuery(''); setActiveTab('all'); setShowResults(false); };

  return (
    <div className="sp-page">

      {/* ── Search bar ── */}
      <div className="sp-searchbar-wrap">
        <SearchIcon size={20} className="sp-search-icon" />
        <input
          ref={inputRef}
          type="text"
          className="sp-input"
          placeholder="Search in Minutes — products, brands, categories..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoComplete="off"
        />
        {query && (
          <button className="sp-clear-btn" onClick={clearSearch} aria-label="Clear">
            <X size={16} />
          </button>
        )}
      </div>

      {/* ── Category tabs (horizontal scroll) ── */}
      <div className="sp-tabs-track">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            id={`search-tab-${cat.id}`}
            className={`sp-tab ${activeTab === cat.id ? 'sp-tab--active' : ''}`}
            onClick={() => setActiveTab(cat.id)}
          >
            <span className="sp-tab-emoji">{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* ── DISCOVER mode (no search yet) ── */}
      {!showResults && (
        <>
          {/* Seasonal banner */}
          <div className="sp-banner">
            <div className="sp-banner-text">
              <p className="sp-banner-eyebrow">🌞 Trending Now</p>
              <h2 className="sp-banner-title">Summer<br />days are here!</h2>
              <p className="sp-banner-sub">Best deals on seasonal picks</p>
              <button className="sp-banner-btn" onClick={() => handleArchClick('fresh')}>
                Shop Now <ChevronRight size={16} />
              </button>
            </div>
            <div className="sp-banner-decor">
              <span className="sp-banner-emoji sp-banner-e1">🍉</span>
              <span className="sp-banner-emoji sp-banner-e2">🟡</span>
              <span className="sp-banner-emoji sp-banner-e3">🍊</span>
              <span className="sp-banner-emoji sp-banner-e4">🏖️</span>
              <span className="sp-banner-emoji sp-banner-e5">🌴</span>
            </div>
          </div>

          {/* Arch category grid */}
          <section className="sp-section">
            <h3 className="sp-section-title">Browse Categories</h3>
            <div className="sp-arch-grid">
              {ARCH_CATEGORIES.map(cat => (
                <button
                  key={cat.label}
                  className="sp-arch-card"
                  onClick={() => handleArchClick(cat.tag)}
                  id={`arch-cat-${cat.tag}`}
                >
                  <div className="sp-arch-img">
                    <span className="sp-arch-emoji">{cat.emoji}</span>
                  </div>
                  <div className="sp-arch-label">
                    <span>{cat.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Trending & Recent */}
          <div className="sp-quick-row">
            {/* Trending */}
            <section className="sp-quick-box">
              <div className="sp-quick-header">
                <TrendingUp size={16} />
                <span>Trending Searches</span>
              </div>
              <div className="sp-quick-pills">
                {TRENDING.map(t => (
                  <button key={t} className="sp-pill" onClick={() => handleQuickSearch(t)}>
                    {t}
                  </button>
                ))}
              </div>
            </section>

            {/* Recent */}
            <section className="sp-quick-box">
              <div className="sp-quick-header">
                <Clock size={16} />
                <span>Recent Searches</span>
              </div>
              <div className="sp-quick-pills">
                {RECENT.map(t => (
                  <button key={t} className="sp-pill sp-pill--recent" onClick={() => handleQuickSearch(t)}>
                    <Clock size={11} /> {t}
                  </button>
                ))}
              </div>
            </section>
          </div>
        </>
      )}

      {/* ── RESULTS mode ── */}
      {showResults && (
        <section className="sp-results-section">
          <div className="sp-results-header">
            <span className="sp-results-count">
              <Sparkles size={15} />
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              {query && <> for "<strong>{query}</strong>"</>}
            </span>
            <button className="sp-results-clear" onClick={clearSearch}>
              Clear <X size={13} />
            </button>
          </div>

          {filtered.length > 0 ? (
            <div className="sp-product-grid">
              {filtered.map(p => (
                <div className="sp-product-card" key={p._id}>
                  <div className="sp-product-img-wrap">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="sp-product-img"
                      onError={e => { e.target.src = 'https://placehold.co/300x200/111/fff?text=Product'; }}
                    />
                    <span className="sp-product-badge">{p.category}</span>
                  </div>
                  <div className="sp-product-body">
                    <p className="sp-product-name">{p.name}</p>
                    <p className="sp-product-desc">{p.description}</p>
                    <div className="sp-product-footer">
                      <span className="sp-product-price">{formatCurrency(p.price)}</span>
                      <button
                        className="sp-add-btn"
                        onClick={() => isAdmin ? navigate('/admin') : handleAddToCart(p)}
                        title={isAdmin ? 'Manage in Admin' : 'Add to Cart'}
                      >
                        {isAdmin ? <Plus size={16} /> : <ShoppingCart size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="sp-no-results">
              <span className="sp-no-results-emoji">🔍</span>
              <h3>No results found</h3>
              <p>Try a different keyword or browse categories above</p>
              <button className="sp-no-results-btn" onClick={clearSearch}>
                Browse All
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default Search;
