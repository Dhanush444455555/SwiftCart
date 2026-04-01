import React, { useState } from 'react';
import { MapPin, Star, Users, ExternalLink } from 'lucide-react';
import ShopDetailModal from './ShopDetailModal';
import './ShopCard.css';

const STORE_BANNERS = {
  supermarket:        'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80',
  mall:               'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&q=80',
  'department store': 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&q=80',
  convenience:        'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&q=80',
  hypermarket:        'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&q=80',
  electronics:        'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=600&q=80',
  default:            'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&q=80',
};

const ShopCard = ({ shop, index }) => {
  const [showModal, setShowModal] = useState(false);
  const { name, type, address, dist, rating, open_now, crowd, banner, lat, lng } = shop;

  const bannerUrl = banner || STORE_BANNERS[type] || STORE_BANNERS.default;

  const mapsUrl = lat && lng
    ? `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`
    : null;

  return (
    <>
      <article
        className="sc-card"
        style={{ animationDelay: `${index * 0.08}s` }}
        onClick={() => setShowModal(true)}
        title={`View ${name} products`}
      >
        {/* ── Banner Image (always visible) ── */}
        <div className="sc-banner">
          <img
            src={bannerUrl}
            alt={name}
            className="sc-banner-img"
            onError={e => { e.target.src = STORE_BANNERS.default; }}
          />
          <div className="sc-banner-grad" />

          {/* Open/Closed pill */}
          <span className={`sc-open-pill ${open_now ? 'open' : 'closed'}`}>
            <span className="sc-pill-dot" />
            {open_now ? 'Open Now' : 'Closed'}
          </span>

          {/* Crowd pill */}
          <span className="sc-crowd-pill" style={{
            color: crowd.color,
            background: `${crowd.color}18`,
            borderColor: `${crowd.color}44`,
          }}>
            {crowd.emoji} {crowd.label} · {crowd.pct}%
          </span>

          {/* "Click to explore" label */}
          <div className="sc-explore-hint">
            Tap to see products →
          </div>
        </div>

        {/* ── Body ── */}
        <div className="sc-body">
          {/* Store info row */}
          <div className="sc-info-row">
            <div className="sc-info-left">
              <h3 className="sc-name">{name}</h3>
              <div className="sc-meta">
                <span className="sc-type">{type}</span>
                <span className="sc-sep">·</span>
                <MapPin size={11} color="#6C63FF" />
                <span className="sc-addr">{address}</span>
                {dist && <><span className="sc-sep">·</span><span className="sc-dist">{dist}</span></>}
              </div>
            </div>
            <div className="sc-right-col">
              {rating && (
                <div className="sc-rating">
                  <Star size={12} fill="#fbbf24" color="#fbbf24" />
                  <span>{typeof rating === 'number' ? rating.toFixed(1) : rating}</span>
                </div>
              )}
              {mapsUrl && (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sc-maps-link"
                  title="View on map"
                  onClick={e => e.stopPropagation()}
                >
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>

          {/* Crowd meter */}
          <div className="sc-crowd-section">
            <div className="sc-crowd-label-row">
              <span className="sc-crowd-label"><Users size={11} /> Live Crowd</span>
              <span className="sc-crowd-pct" style={{ color: crowd.color }}>{crowd.pct}%</span>
            </div>
            <div className="sc-bar-track">
              <div
                className="sc-bar-fill"
                style={{
                  width: `${crowd.pct}%`,
                  background: `linear-gradient(90deg, ${crowd.color}88, ${crowd.color})`,
                }}
              />
            </div>
          </div>

          {/* Stock category pills (compact overview) */}
          {shop.stock && (
            <div className="sc-stock-pills">
              {shop.stock.slice(0, 6).map(s => (
                <span
                  key={s.name}
                  className="sc-stock-pill-item"
                  style={{ color: s.color, background: s.bg || `${s.color}12` }}
                >
                  <span className="sc-stock-pill-dot" style={{ background: s.color }} />
                  {s.name}
                </span>
              ))}
            </div>
          )}

          {/* CTA */}
          <button className="sc-cta-btn">
            View All Products
          </button>
        </div>
      </article>

      {/* Modal */}
      {showModal && (
        <ShopDetailModal shop={shop} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default ShopCard;
