import React, { useState, useEffect } from 'react';
import { Sparkles, ShoppingCart, Tag, Clock, TrendingUp, Zap, ChevronRight, Star, RefreshCw, Plus, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import './OffersPage.css';

const AI_URL = '';

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

// Rich offline AI dataset ensures the screen is never blank even before network returns
const FALLBACK_OFFERS = {
  ration: [
    {
      id: 'R001', title: 'Rice & Dal Combo Pack', brand: 'India Gate',
      originalPrice: 850, offerPrice: 649, discount: 24, qty: '5kg Rice + 1kg Dal',
      img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
      tags: ['staples', 'cooking'],
      confidence: 96, savingsAmt: 201,
      aiReason: '🕐 Peak evening grocery deal · Staples top seller',
      description: 'Premium basmati rice with farm-fresh toor dal combo pack.'
    },
    {
      id: 'R002', title: 'Cooking Oil Bonanza', brand: 'Fortune',
      originalPrice: 320, offerPrice: 229, discount: 28, qty: '1L Sunflower Oil',
      img: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80',
      tags: ['cooking', 'oil'],
      confidence: 94, savingsAmt: 91,
      aiReason: '⭐ Essential kitchen staple · 28% instant off',
      description: 'Light and heart-friendly refined sunflower oil for everyday cooking.'
    },
    {
      id: 'R003', title: 'Breakfast Super Saver', brand: 'Aashirvaad',
      originalPrice: 480, offerPrice: 349, discount: 27, qty: 'Atta 5kg + Poha 1kg',
      img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80',
      tags: ['breakfast', 'staples'],
      confidence: 92, savingsAmt: 131,
      aiReason: '🌅 Morning pantry builder · Fresh chakki ground',
      description: 'Wholesome breakfast pairing with 100% whole wheat atta.'
    },
    {
      id: 'R004', title: 'Dairy Daily Essentials', brand: 'Amul',
      originalPrice: 210, offerPrice: 159, discount: 24, qty: 'Milk 2L + Butter 200g',
      img: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&q=80',
      tags: ['dairy', 'breakfast'],
      confidence: 91, savingsAmt: 51,
      aiReason: '🥛 Daily fresh dairy bundle · Verified pure',
      description: 'Fresh Amul Taaza milk with delicious creamy salted table butter.'
    },
    {
      id: 'R005', title: 'Ferrero Rocher Festive Box', brand: 'Ferrero Rocher',
      originalPrice: 899, offerPrice: 699, discount: 22, qty: 'Box of 24 Chocolates',
      img: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&q=80',
      tags: ['snacks', 'luxury'],
      confidence: 89, savingsAmt: 200,
      aiReason: '🍫 Amazon Bestseller · Luxury gift treat',
      description: 'Whole hazelnut dipped in smooth chocolate cream inside a crisp wafer shell.'
    },
    {
      id: 'R006', title: 'Cadbury Dairy Milk Silk Hamper', brand: 'Cadbury',
      originalPrice: 500, offerPrice: 379, discount: 24, qty: 'Pack of 3 Bars',
      img: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400&q=80',
      tags: ['snacks', 'sweet'],
      confidence: 88, savingsAmt: 121,
      aiReason: '✨ Sweet cravings combo · Roasted Almond + Fruit & Nut',
      description: 'Silky smooth indulgence with real roasted California almonds.'
    }
  ],
  clothing: [
    {
      id: 'C001', title: 'Men Slim Fit Denim Jeans', brand: "Levi's",
      originalPrice: 2899, offerPrice: 1699, discount: 41, qty: 'Sizes 30-38',
      img: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=400&q=80',
      tags: ['casual'],
      confidence: 95, savingsAmt: 1200,
      aiReason: '🔥 Mega 41% off · Flipkart Trending Fashion',
      description: 'Stretchable premium indigo denim with comfort waist fit.'
    },
    {
      id: 'C002', title: 'Pure Cotton Anarkali Kurta', brand: 'Biba',
      originalPrice: 2499, offerPrice: 1299, discount: 48, qty: 'Sizes S-XXL',
      img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80',
      tags: ['ethnic'],
      confidence: 93, savingsAmt: 1200,
      aiReason: '🌸 Festive Collection Pick · Pure breathable cotton',
      description: 'Graceful floral printed flared anarkali kurta with dupatta set.'
    },
    {
      id: 'C003', title: 'Nike Air Max Sports Shoes', brand: 'Nike',
      originalPrice: 8495, offerPrice: 5499, discount: 35, qty: 'UK 6-11',
      img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
      tags: ['sports'],
      confidence: 96, savingsAmt: 2996,
      aiReason: '👟 High demand running sneaker · Max Air cushioning',
      description: 'Revolutionary cushioning with lightweight mesh for gym and road running.'
    },
    {
      id: 'C004', title: 'Formal Crisp White Shirt', brand: 'Raymond',
      originalPrice: 1999, offerPrice: 1199, discount: 40, qty: 'Sizes 38-44',
      img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80',
      tags: ['formal'],
      confidence: 91, savingsAmt: 800,
      aiReason: '💼 Office & Meeting Essential · 100% Giza Cotton',
      description: 'Wrinkle-resistant luxury formal shirt for all business occasions.'
    },
    {
      id: 'C005', title: 'Kids Festive Party Wear Dress', brand: 'Hopscotch',
      originalPrice: 1799, offerPrice: 999, discount: 44, qty: 'Ages 2-10 Yrs',
      img: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400&q=80',
      tags: ['kids'],
      confidence: 90, savingsAmt: 800,
      aiReason: '🎉 Special occasion outfit · Soft non-itchy lining',
      description: 'Delightful party frock with glitter tulle skirt and satin sash.'
    },
    {
      id: 'C006', title: 'Streetwear Graphic Hoodie', brand: 'Puma',
      originalPrice: 3499, offerPrice: 1999, discount: 43, qty: 'Sizes M-XL',
      img: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400&q=80',
      tags: ['casual', 'sports'],
      confidence: 89, savingsAmt: 1500,
      aiReason: '🎧 Weekend casual favourite · Fleece lined warm hoodie',
      description: 'Heavyweight cotton-blend hoodie with kangaroo pocket and rib cuffs.'
    }
  ],
  electronics: [
    {
      id: 'E001', title: 'Apple AirPods Pro (2nd Gen)', brand: 'Apple',
      originalPrice: 24900, offerPrice: 18999, discount: 24, qty: 'With MagSafe USB-C',
      img: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&q=80',
      tags: ['audio', 'wireless'],
      confidence: 98, savingsAmt: 5901,
      aiReason: '🎧 Flagship Active Noise Cancellation · Apple H2 Chip',
      description: 'Up to 2x more active noise cancellation with adaptive transparency.'
    },
    {
      id: 'E002', title: 'OnePlus Nord Buds 2 TWS', brand: 'OnePlus',
      originalPrice: 3299, offerPrice: 2299, discount: 30, qty: 'Thunder Gray',
      img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80',
      tags: ['audio', 'wireless'],
      confidence: 95, savingsAmt: 1000,
      aiReason: '⚡ 25dB ANC + BassWave boost · 36 hour battery life',
      description: 'Dual-mic noise cancellation with crystal clear calling performance.'
    },
    {
      id: 'E003', title: 'Sony WH-1000XM5 ANC Headphones', brand: 'Sony',
      originalPrice: 34990, offerPrice: 26990, discount: 23, qty: 'Black Edition',
      img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
      tags: ['audio', 'wireless'],
      confidence: 97, savingsAmt: 8000,
      aiReason: '🏆 Best Over-Ear Noise Cancelling · 30hr battery',
      description: 'Industry-leading noise cancellation powered by two processors.'
    },
    {
      id: 'E004', title: 'Samsung Galaxy Watch 6 LTE', brand: 'Samsung',
      originalPrice: 33999, offerPrice: 21999, discount: 35, qty: '44mm Sapphire Crystal',
      img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
      tags: ['wireless', 'sports'],
      confidence: 93, savingsAmt: 12000,
      aiReason: '⌚ Advanced sleep coaching & ECG sensor · LTE connectivity',
      description: 'Track daily wellness, heart zones, and body composition with ease.'
    },
    {
      id: 'E005', title: 'Logitech G502 HERO Gaming Mouse', brand: 'Logitech G',
      originalPrice: 4995, offerPrice: 3495, discount: 30, qty: '25,600 DPI Sensor',
      img: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&q=80',
      tags: ['gaming'],
      confidence: 94, savingsAmt: 1500,
      aiReason: '🎮 HERO 25K Sensor · 11 programmable buttons',
      description: 'High performance gaming mouse with customizable RGB lighting and weights.'
    },
    {
      id: 'E006', title: 'JBL Flip 6 Waterproof Speaker', brand: 'JBL',
      originalPrice: 13999, offerPrice: 9499, discount: 32, qty: 'IP67 Dust/Waterproof',
      img: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&q=80',
      tags: ['audio', 'wireless'],
      confidence: 92, savingsAmt: 4500,
      aiReason: '🔊 Powerful punchy bass · 12 hour non-stop playback',
      description: 'Bold JBL Original Pro sound with 2-way speaker system.'
    }
  ]
};

// Combine all for 'all' deals view
FALLBACK_OFFERS.all = [
  ...FALLBACK_OFFERS.electronics.slice(0, 4),
  ...FALLBACK_OFFERS.clothing.slice(0, 4),
  ...FALLBACK_OFFERS.ration.slice(0, 4),
];

function getLocalOffers(cat, prefs = []) {
  let pool = FALLBACK_OFFERS[cat] || FALLBACK_OFFERS.all;
  if (prefs.length > 0) {
    const matches = pool.filter(o => o.tags && prefs.some(p => o.tags.includes(p)));
    if (matches.length > 0) return matches;
  }
  return pool;
}

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
  const { user } = useSelector(s => s.auth || {});
  const isAdmin = user?.role === 'admin';

  const [category, setCategory]         = useState('all');
  const [preferences, setPrefs]         = useState([]);
  const [offers, setOffers]             = useState(() => getLocalOffers('all', []));
  const [loading, setLoading]           = useState(false);
  const [meta, setMeta]                 = useState({ timeOfDay: 'evening', dayType: 'weekday' });
  const [addedIds, setAddedIds]         = useState(new Set());
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm]           = useState({
    title: '', description: '', category: 'ration', originalPrice: '', offerPrice: '', brand: '', qty: '', tags: '', img: ''
  });

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const discount = Math.round((1 - (addForm.offerPrice / addForm.originalPrice)) * 100) || 0;
    const body = {
      ...addForm,
      originalPrice: Number(addForm.originalPrice),
      offerPrice: Number(addForm.offerPrice),
      discount,
      tags: addForm.tags.split(',').map(t => t.trim()).filter(Boolean)
    };
    
    try {
      const res = await fetch(`${AI_URL}/api/offers/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        setShowAddModal(false);
        setAddForm({ title: '', description: '', category: 'ration', originalPrice: '', offerPrice: '', brand: '', qty: '', tags: '', img: '' });
        fetchOffers();
      } else {
        alert('Failed to add offer');
      }
    } catch (err) {
      console.error(err);
      alert('Error adding offer');
    }
  };

  const fetchOffers = async (cat = category, prefs = preferences) => {
    setLoading(true);
    try {
      const res = await fetch(`${AI_URL}/api/offers/predict`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ category: cat, preferences: prefs, limit: 12 }),
      });
      const data = await res.json();
      if (data && Array.isArray(data.offers) && data.offers.length > 0) {
        setOffers(data.offers);
        setMeta({ timeOfDay: data.timeOfDay || 'evening', dayType: data.dayType || 'weekday' });
      } else {
        // Fallback to rich curated local dataset
        setOffers(getLocalOffers(cat, prefs));
      }
    } catch (err) {
      console.warn('AI backend unavailable, utilizing offline AI predictor:', err);
      setOffers(getLocalOffers(cat, prefs));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers(category, preferences);
  }, []);

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
        <div className="op-hero-actions">
          {isAdmin && (
            <button className="op-add-ai-btn" onClick={() => setShowAddModal(true)} title="Add AI Offer">
              <Plus size={15} /> Add Offer
            </button>
          )}
          <button className="op-refresh-btn" onClick={() => fetchOffers()} title="Re-predict offers">
            <RefreshCw size={15} className={loading ? 'op-spin' : ''} />
          </button>
        </div>
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
                    <span className="op-offer-price">₹{offer.offerPrice?.toLocaleString('en-IN')}</span>
                    <span className="op-orig-price">₹{offer.originalPrice?.toLocaleString('en-IN')}</span>
                    <span className="op-savings">Save ₹{offer.savingsAmt?.toLocaleString('en-IN')}</span>
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

      {/* ── Add Offer Modal ── */}
      {showAddModal && (
        <div className="op-modal-overlay">
          <div className="op-modal animate-fade-in">
            <div className="op-modal-header">
              <h2>Add AI Offer</h2>
              <button onClick={() => setShowAddModal(false)} className="op-modal-close"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddSubmit} className="op-modal-form">
              <div className="op-form-grid">
                <input required placeholder="Offer Title (e.g. Best Earbuds)" value={addForm.title} onChange={e => setAddForm({...addForm, title: e.target.value})} />
                <input required placeholder="Brand" value={addForm.brand} onChange={e => setAddForm({...addForm, brand: e.target.value})} />
                <select value={addForm.category} onChange={e => setAddForm({...addForm, category: e.target.value})}>
                  <option value="ration">Ration & Groceries</option>
                  <option value="clothing">Clothing & Apparel</option>
                  <option value="electronics">Electronics</option>
                </select>
                <input required placeholder="Quantity (e.g. 1kg)" value={addForm.qty} onChange={e => setAddForm({...addForm, qty: e.target.value})} />
                <input required type="number" placeholder="Original Price" value={addForm.originalPrice} onChange={e => setAddForm({...addForm, originalPrice: e.target.value})} />
                <input required type="number" placeholder="Offer Price" value={addForm.offerPrice} onChange={e => setAddForm({...addForm, offerPrice: e.target.value})} />
                <input required placeholder="Tags (comma separated)" value={addForm.tags} onChange={e => setAddForm({...addForm, tags: e.target.value})} />
                <input placeholder="Image URL" value={addForm.img} onChange={e => setAddForm({...addForm, img: e.target.value})} />
              </div>
              <textarea placeholder="Description" rows="2" value={addForm.description} onChange={e => setAddForm({...addForm, description: e.target.value})} />
              <button type="submit" className="op-modal-submit">Add Offer to AI Dataset</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default OffersPage;
