import React, { useState, useEffect, useCallback } from 'react';
import { Store, RefreshCw, MapPin, Navigation, AlertTriangle, Loader2, ChevronDown } from 'lucide-react';
import ShopCard from './ShopCard';
import './NearbyShops.css';

const BACKEND = 'http://localhost:5000';

const NearbyShops = () => {
  const [shops, setShops]         = useState([]);
  const [filter, setFilter]       = useState('all');
  const [coords, setCoords]       = useState(null);
  const [locationName, setLocationName] = useState('');
  const [locError, setLocError]   = useState(false);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // ── fetch stores from backend with real coords ──────────────────
  const fetchStores = useCallback(async (lat, lng) => {
    try {
      const res = await fetch(`${BACKEND}/api/stores/nearby?lat=${lat}&lng=${lng}`);
      if (!res.ok) throw new Error('Backend error');
      const data = await res.json();
      setShops(data.stores || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to fetch stores:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // ── reverse geocode (Nominatim, free, no key) ──────────────────
  const reverseGeocode = async (lat, lng) => {
    try {
      const r = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const d = await r.json();
      const city  = d.address?.suburb || d.address?.city || d.address?.town || d.address?.village || '';
      const state = d.address?.state || '';
      setLocationName(`${city}${state ? ', ' + state : ''}`);
    } catch { setLocationName('your location'); }
  };

  // ── geolocation on mount ──────────────────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) {
      const fb = { lat: 13.3392, lng: 77.1017 }; // Tumakuru
      setCoords(fb); setLocError(true);
      setLocationName('Tumakuru, Karnataka');
      fetchStores(fb.lat, fb.lng);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCoords(loc); setLocError(false);
        reverseGeocode(loc.lat, loc.lng);
        fetchStores(loc.lat, loc.lng);
      },
      () => {
        // denied → use Tumakuru fallback
        const fb = { lat: 13.3392, lng: 77.1017 };
        setCoords(fb); setLocError(true);
        setLocationName('Tumakuru (default)');
        fetchStores(fb.lat, fb.lng);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, [fetchStores]);

  // ── manual refresh ──────────────────────────────────────────────
  const handleRefresh = () => {
    if (!coords || refreshing) return;
    setRefreshing(true);
    fetchStores(coords.lat, coords.lng);
  };

  // ── retry location ──────────────────────────────────────────────
  const retryLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCoords(loc); setLocError(false);
        reverseGeocode(loc.lat, loc.lng);
        fetchStores(loc.lat, loc.lng);
      },
      () => { setLoading(false); },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // ── map URL — centered on user's REAL coords ──────────────────
  const mapUrl = coords
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng - 0.025},${coords.lat - 0.018},${coords.lng + 0.025},${coords.lat + 0.018}&layer=mapnik&marker=${coords.lat},${coords.lng}`
    : null;

  const filtered = shops.filter(s => {
    if (filter === 'open')     return s.open_now;
    if (filter === 'low')      return s.crowd.pct < 40;
    return true;
  });

  return (
    <section className="ns-page">

      {/* ── Hero Header ── */}
      <div className="ns-hero">
        <div className="ns-hero-left">
          <div className="ns-hero-icon-wrap">
            <Store size={24} color="#a78bfa" />
          </div>
          <div>
            <h1 className="ns-hero-title">Nearby Stores</h1>
            <p className="ns-hero-sub">
              <MapPin size={12} className="ns-pin-icon" />
              {locationName
                ? `Live stock near ${locationName}`
                : loading ? 'Detecting your location…' : 'Locating…'}
            </p>
          </div>
        </div>
        <div className="ns-hero-right">
          {lastUpdated && (
            <span className="ns-updated">
              Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <button
            className={`ns-refresh-btn ${refreshing ? 'spinning' : ''}`}
            onClick={handleRefresh}
            disabled={refreshing}
            title="Refresh"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* ── Location banner ── */}
      {locError && (
        <div className="ns-loc-banner">
          <AlertTriangle size={14} />
          <span>Location access denied — showing stores near Tumakuru as default.</span>
          <button className="ns-loc-retry" onClick={retryLocation}>
            <Navigation size={11} /> Allow Location
          </button>
        </div>
      )}

      {/* ── Map ── */}
      {loading ? (
        <div className="ns-map-skeleton">
          <Loader2 size={28} className="ns-spin-icon" color="#6C63FF" />
          <span>Loading map & stores…</span>
        </div>
      ) : mapUrl ? (
        <div className="ns-map-card">
          <iframe
            title="Store Location Map"
            src={mapUrl}
            className="ns-map-frame"
            allowFullScreen
            loading="lazy"
          />
          <div className="ns-map-footer">
            <div className="ns-map-footer-left">
              <Navigation size={13} color="#6C63FF" />
              <span className="ns-map-loc">{locationName || 'Your location'}</span>
              {coords && (
                <span className="ns-map-coords">
                  {coords.lat.toFixed(4)}°N, {coords.lng.toFixed(4)}°E
                </span>
              )}
            </div>
            <span className="ns-map-count">{shops.length} stores found</span>
          </div>
        </div>
      ) : null}

      {/* ── Filter Tabs ── */}
      {!loading && shops.length > 0 && (
        <div className="ns-filters">
          <div className="ns-filter-group">
            {[
              { key: 'all',  emoji: '🏪', label: 'All Stores' },
              { key: 'open', emoji: '✅', label: 'Open Now'   },
              { key: 'low',  emoji: '🟢', label: 'Low Crowd'  },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`ns-filter-tab ${filter === f.key ? 'active' : ''}`}
              >
                {f.emoji} {f.label}
              </button>
            ))}
          </div>
          <span className="ns-filter-count">{filtered.length} stores</span>
        </div>
      )}

      {/* ── Store Cards ── */}
      {loading ? (
        <div className="ns-skeleton-grid">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="ns-skeleton-card" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="ns-cards-grid">
          {filtered.map((shop, i) => (
            <ShopCard key={shop.place_id} shop={shop} index={i} userCoords={coords} />
          ))}
        </div>
      ) : (
        <div className="ns-empty">
          <Store size={40} color="#334155" />
          <p>No stores match this filter.</p>
        </div>
      )}

    </section>
  );
};

export default NearbyShops;
