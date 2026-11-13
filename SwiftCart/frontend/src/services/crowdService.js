/* ============================================================
   crowdService.js — NO external APIs, fully local mock data
   ============================================================ */

// ── Crowd level based on time-of-day + store seed ────────────
export function getCrowdLevel(placeId = '', overrideHour = null) {
  const hour = overrideHour ?? new Date().getHours();
  const seed = placeId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const baseCurve = [10,8,6,5,5,7,12,22,35,48,60,72,75,65,58,50,55,68,72,60,45,35,25,15];
  const base = baseCurve[Math.min(hour, 23)];
  const variance = ((seed % 20) - 10);
  const raw = Math.max(5, Math.min(100, base + variance));

  let label, color, emoji;
  if (raw < 30)       { label = 'Low';       color = '#34d399'; emoji = '🟢'; }
  else if (raw < 55)  { label = 'Moderate';  color = '#fbbf24'; emoji = '🟡'; }
  else if (raw < 75)  { label = 'Busy';      color = '#f97316'; emoji = '🟠'; }
  else                { label = 'Very Busy'; color = '#f43f5e'; emoji = '🔴'; }

  return { percent: raw, label, color, emoji };
}

// ── Stock per shop based on seed ─────────────────────────────
const CATEGORIES = ['Electronics', 'Groceries', 'Apparel', 'Accessories', 'Home', 'Office'];

export function getStockForShop(placeId) {
  const seed = placeId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return CATEGORIES.map((cat, i) => {
    const raw = ((seed * (i + 3)) % 100) + 1;
    let status, color;
    if (raw > 60)      { status = 'In Stock';     color = '#34d399'; }
    else if (raw > 25) { status = 'Low Stock';    color = '#fbbf24'; }
    else               { status = 'Out of Stock'; color = '#f43f5e'; }
    return { category: cat, status, color, count: raw };
  });
}

// ── Mock shop data — realistic Indian retail stores ───────────
const MOCK_SHOPS = [
  { place_id: 'mock_001', name: 'D-Mart Superstore',       vicinity: 'MG Road · 1.2 km',        rating: 4.2, open_now: true,  type: '🛒 Supermarket',   distance: '1.2 km' },
  { place_id: 'mock_002', name: 'Reliance Smart Bazaar',   vicinity: 'Anna Nagar · 2.1 km',      rating: 4.0, open_now: true,  type: '🛍️ Department',   distance: '2.1 km' },
  { place_id: 'mock_003', name: 'Big Bazaar Hypermarket',  vicinity: 'Velachery · 3.4 km',       rating: 3.8, open_now: false, type: '🏪 Hypermarket',   distance: '3.4 km' },
  { place_id: 'mock_004', name: 'Croma Electronics',       vicinity: 'T.Nagar · 2.7 km',         rating: 4.4, open_now: true,  type: '📱 Electronics',   distance: '2.7 km' },
  { place_id: 'mock_005', name: 'More Supermarket',        vicinity: 'Adyar · 1.8 km',           rating: 4.1, open_now: true,  type: '🛒 Grocery',       distance: '1.8 km' },
  { place_id: 'mock_006', name: "Spencer's Retail",        vicinity: 'Nungambakkam · 3.0 km',    rating: 3.9, open_now: true,  type: '🛍️ Retail',       distance: '3.0 km' },
  { place_id: 'mock_007', name: 'Metro Cash & Carry',      vicinity: 'Perambur · 4.5 km',        rating: 4.3, open_now: true,  type: '📦 Wholesale',     distance: '4.5 km' },
  { place_id: 'mock_008', name: 'Nilgiris Supermarket',    vicinity: 'Mylapore · 2.2 km',        rating: 4.5, open_now: false, type: '🛒 Supermarket',   distance: '2.2 km' },
];

// ── Main exported function — returns enriched shops immediately ──
export function getNearbyShops() {
  return MOCK_SHOPS.map(s => ({
    ...s,
    crowd: getCrowdLevel(s.place_id),
    stock: getStockForShop(s.place_id),
  }));
}
