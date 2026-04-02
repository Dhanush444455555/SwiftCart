/**
 * storeController.js
 * Fetches REAL nearby supermarkets/malls from OpenStreetMap Overpass API
 * then adds mock stock + crowd data on top.
 */
const https = require('https');

// ── Categories & Images shown per store ──────────────────────────
const CATEGORIES = [
  { name: 'Fresh Produce',  icon: '🥦', img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=80&q=75' },
  { name: 'Dairy',          icon: '🥛', img: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=80&q=75' },
  { name: 'Bakery',         icon: '🍞', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=80&q=75' },
  { name: 'Electronics',    icon: '📱', img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=80&q=75' },
  { name: 'Clothing',       icon: '👗', img: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=80&q=75' },
  { name: 'Beverages',      icon: '🧃', img: 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=80&q=75' },
];

const STATUSES = [
  { label: 'In Stock',     color: '#34d399', bg: 'rgba(52,211,153,0.12)'  },
  { label: 'Low Stock',    color: '#fbbf24', bg: 'rgba(251,191,36,0.12)'  },
  { label: 'Out of Stock', color: '#f43f5e', bg: 'rgba(244,63,94,0.10)'   },
];

function getMockStock(storeIdx) {
  const hour = new Date().getHours();
  return CATEGORIES.map((cat, ci) => {
    const seed     = (storeIdx * 7 + ci * 3 + Math.floor(hour / 3)) % 3;
    const status   = STATUSES[seed];
    return { ...cat, ...status };
  });
}

function getMockCrowd(storeIdx) {
  const hour = new Date().getHours();
  const pct  = ((storeIdx * 13 + hour * 3) % 55) + 20; // 20–74%
  if (pct < 35) return { pct, label: 'Low Crowd',    color: '#34d399', emoji: '🟢' };
  if (pct < 60) return { pct, label: 'Moderate',     color: '#fbbf24', emoji: '🟡' };
  return         { pct, label: 'Busy',           color: '#f97316', emoji: '🟠' };
}

// ── Store banner images keyed by OSM shop tag ─────────────────────
const BANNER = {
  supermarket:       'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80',
  mall:              'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&q=80',
  department_store:  'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&q=80',
  convenience:       'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&q=80',
  hypermarket:       'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&q=80',
  electronics:       'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=600&q=80',
  default:           'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&q=80',
};

// ── Fetch from Overpass API — 5 km radius ─────────────────────────
function fetchOverpass(lat, lng, radius = 5000) {
  const query = `[out:json][timeout:15];
(
  node["shop"~"supermarket|mall|department_store|convenience|hypermarket|electronics|shopping_centre"](around:${radius},${lat},${lng});
  way["shop"~"supermarket|mall|department_store|convenience|hypermarket|electronics|shopping_centre"](around:${radius},${lat},${lng});
  relation["building"~"mall|retail|commercial"](around:${radius},${lat},${lng});
  node["amenity"~"marketplace"](around:${radius},${lat},${lng});
);
out center 15;`;

  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

  return new Promise((resolve, reject) => {
    https.get(url, { timeout: 12000 }, (res) => {
      let raw = '';
      res.on('data', chunk => { raw += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(raw)); }
        catch { reject(new Error('Invalid Overpass response')); }
      });
    }).on('error', reject).on('timeout', () => reject(new Error('Overpass timeout')));
  });
}

// ── Distance in km (Haversine) ────────────────────────────────────
function distKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return +(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2);
}

// ── Fallback stores (when Overpass is unreachable) ────────────────
const FALLBACK = [
  { name: 'D-Mart Superstore',     type: 'supermarket',    lat_off: -0.005, lng_off: -0.007 },
  { name: 'Reliance Smart Bazaar', type: 'department_store', lat_off:  0.007, lng_off:  0.003 },
  { name: 'Big Bazaar Hypermarket',type: 'hypermarket',    lat_off: -0.002, lng_off:  0.009 },
  { name: 'Croma Electronics',     type: 'electronics',    lat_off:  0.011, lng_off: -0.004 },
  { name: 'More Supermarket',      type: 'supermarket',    lat_off:  0.003, lng_off: -0.011 },
  { name: "Spencer's Retail",      type: 'convenience',    lat_off: -0.009, lng_off:  0.006 },
];

// ── Main Controller ───────────────────────────────────────────────
const getNearbyStores = async (req, res) => {
  const lat = parseFloat(req.query.lat);
  const lng = parseFloat(req.query.lng);
  if (isNaN(lat) || isNaN(lng)) {
    return res.status(400).json({ message: 'lat and lng params are required' });
  }

  let stores = [];

  try {
    const data    = await fetchOverpass(lat, lng);
    const elements = (data.elements || []).filter(e => e.tags && e.tags.name);

    stores = elements.slice(0, 10).map((el, i) => {
      const elLat = el.lat ?? el.center?.lat ?? lat;
      const elLng = el.lon ?? el.center?.lon ?? lng;
      const shopType = el.tags.shop || 'default';
      const dist  = distKm(lat, lng, elLat, elLng);
      return {
        place_id:  `osm-${el.id}`,
        name:       el.tags.name,
        type:       shopType.replace(/_/g, ' '),
        address:    [el.tags['addr:street'], el.tags['addr:city']].filter(Boolean).join(', ') || 'Nearby',
        dist:       `${dist} km`,
        lat:        elLat,
        lng:        elLng,
        banner:     BANNER[shopType] || BANNER.default,
        open_now:   true, // OSM doesn't always have hours
        crowd:      getMockCrowd(i),
        stock:      getMockStock(i),
        source:     'osm',
      };
    });
  } catch (err) {
    console.warn('Overpass unavailable, using fallback stores:', err.message);
  }

  // If Overpass returned nothing, use fallback seeded from user's real coords
  if (stores.length === 0) {
    stores = FALLBACK.map((tpl, i) => {
      const sLat = +(lat + tpl.lat_off).toFixed(6);
      const sLng = +(lng + tpl.lng_off).toFixed(6);
      return {
        place_id: `fallback-${i}`,
        name:      tpl.name,
        type:      tpl.type.replace(/_/g, ' '),
        address:   'Near your location',
        dist:      `${distKm(lat, lng, sLat, sLng)} km`,
        lat:       sLat,
        lng:       sLng,
        banner:    BANNER[tpl.type] || BANNER.default,
        open_now:  true,
        crowd:     getMockCrowd(i),
        stock:     getMockStock(i),
        source:    'fallback',
      };
    });
  }

  res.json({ lat, lng, count: stores.length, stores });
};

module.exports = { getNearbyStores };
