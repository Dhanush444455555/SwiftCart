import React, { useEffect } from 'react';
import { X, MapPin, Star, Users, ExternalLink, ShoppingCart, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/cartSlice';
import './ShopDetailModal.css';

// ── Product catalog per shop type ─────────────────────────────────
const SHOP_PRODUCTS = {
  supermarket: [
    { id: 1,  name: 'Fresh Milk (1L)',         price: 68,   category: 'Dairy',         img: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=300&q=80' },
    { id: 2,  name: 'Whole Wheat Bread',        price: 45,   category: 'Bakery',        img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&q=80' },
    { id: 3,  name: 'Farm Eggs (12pcs)',         price: 90,   category: 'Dairy',         img: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300&q=80' },
    { id: 4,  name: 'Mixed Vegetables (500g)',   price: 55,   category: 'Fresh Produce', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&q=80' },
    { id: 5,  name: 'Tropicana Orange Juice',    price: 120,  category: 'Beverages',     img: 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=300&q=80' },
    { id: 6,  name: 'Basmati Rice (5kg)',         price: 420,  category: 'Grains',        img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&q=80' },
    { id: 7,  name: 'Organic Bananas (6pcs)',     price: 40,   category: 'Fresh Produce', img: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&q=80' },
    { id: 8,  name: 'Greek Yogurt (400g)',        price: 85,   category: 'Dairy',         img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&q=80' },
    { id: 9,  name: 'Mineral Water (2L)',         price: 30,   category: 'Beverages',     img: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=300&q=80' },
  ],
  hypermarket: [
    { id: 10, name: 'Samsung 55" Smart TV',      price: 54999, category: 'Electronics',  img: 'https://images.unsplash.com/photo-1593359677879-a4bb92f4418c?w=300&q=80' },
    { id: 11, name: 'Printed Cotton Kurta',       price: 799,   category: 'Clothing',     img: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=300&q=80' },
    { id: 12, name: 'Pressure Cooker 5L',         price: 1299,  category: 'Kitchen',      img: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=300&q=80' },
    { id: 13, name: 'Fresh Milk (1L)',             price: 68,    category: 'Dairy',        img: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=300&q=80' },
    { id: 14, name: 'Dettol Hand Wash 500ml',      price: 130,   category: 'Personal Care',img: 'https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=300&q=80' },
    { id: 15, name: 'Lays Chips (Party Pack)',     price: 90,    category: 'Snacks',       img: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300&q=80' },
    { id: 16, name: 'Mixed Vegetables (500g)',     price: 55,    category: 'Fresh Produce',img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&q=80' },
    { id: 17, name: 'Running Shoes (Nike)',        price: 4999,  category: 'Footwear',     img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80' },
  ],
  mall: [
    { id: 18, name: 'Men\'s Casual T-Shirt',       price: 599,   category: 'Clothing',     img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&q=80' },
    { id: 19, name: 'Women\'s Handbag (Leather)',  price: 1999,  category: 'Accessories',  img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&q=80' },
    { id: 20, name: 'Analog Wristwatch',           price: 2499,  category: 'Accessories',  img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80' },
    { id: 21, name: 'Denim Jeans (Slim Fit)',       price: 1299,  category: 'Clothing',     img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&q=80' },
    { id: 22, name: 'Sunglasses (UV400)',           price: 799,   category: 'Accessories',  img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&q=80' },
    { id: 23, name: 'Sports Sneakers',             price: 2999,  category: 'Footwear',     img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300&q=80' },
    { id: 24, name: 'Cotton Formal Shirt',         price: 899,   category: 'Clothing',     img: 'https://images.unsplash.com/photo-1598961942613-ba897716405b?w=300&q=80' },
  ],
  electronics: [
    { id: 25, name: 'iPhone 15 (128GB)',           price: 79999, category: 'Phones',       img: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&q=80' },
    { id: 26, name: 'Samsung Galaxy S24',          price: 74999, category: 'Phones',       img: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300&q=80' },
    { id: 27, name: 'Apple AirPods Pro',           price: 24900, category: 'Audio',        img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300&q=80' },
    { id: 28, name: 'Dell Inspiron 15 Laptop',    price: 65000, category: 'Computers',    img: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300&q=80' },
    { id: 29, name: 'Sony WH-1000XM5 Headphones', price: 29990, category: 'Audio',        img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80' },
    { id: 30, name: 'Logitech Gaming Mouse',       price: 2999,  category: 'Accessories',  img: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&q=80' },
    { id: 31, name: 'Portable Power Bank 20000mAh',price: 1899,  category: 'Accessories',  img: 'https://images.unsplash.com/photo-1618578934953-a3d8e85e4c4b?w=300&q=80' },
  ],
  convenience: [
    { id: 32, name: 'Maggi Noodles (12 pack)',     price: 180,  category: 'Snacks',        img: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=300&q=80' },
    { id: 33, name: 'Amul Butter 500g',            price: 245,  category: 'Dairy',         img: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=300&q=80' },
    { id: 34, name: 'Coca-Cola 2L',               price: 95,   category: 'Beverages',     img: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=300&q=80' },
    { id: 35, name: 'Parle-G Biscuits',           price: 25,   category: 'Snacks',        img: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300&q=80' },
    { id: 36, name: 'Dettol Soap (3 pack)',        price: 75,   category: 'Personal Care', img: 'https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=300&q=80' },
    { id: 37, name: 'Colgate Toothpaste 200g',    price: 80,   category: 'Personal Care', img: 'https://images.unsplash.com/photo-1609587312208-cea54be969e7?w=300&q=80' },
  ],
  default: [
    { id: 38, name: 'Premium Product A',          price: 499,  category: 'General',       img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80' },
    { id: 39, name: 'Premium Product B',          price: 299,  category: 'General',       img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80' },
    { id: 40, name: 'Premium Product C',          price: 799,  category: 'General',       img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80' },
  ],
};

// Determine available stock for each product based on store's stock array
function getProductStock(storeStock, category) {
  const match = storeStock?.find(s =>
    s.name?.toLowerCase().includes(category.toLowerCase()) ||
    category.toLowerCase().includes(s.name?.toLowerCase())
  );
  if (!match) return { label: 'In Stock', color: '#34d399', bg: 'rgba(52,211,153,0.12)' };
  return { label: match.label, color: match.color, bg: match.bg };
}

function StockIcon({ label }) {
  if (label === 'In Stock')     return <CheckCircle  size={14} color="#34d399" />;
  if (label === 'Low Stock')    return <AlertCircle  size={14} color="#fbbf24" />;
  return                               <XCircle      size={14} color="#f43f5e" />;
}

const ShopDetailModal = ({ shop, onClose }) => {
  const dispatch   = useDispatch();
  const { isAuthenticated, user } = useSelector(s => s.auth);
  const isAdmin    = user?.role === 'admin';

  // Map shop type → product list
  const typeKey = Object.keys(SHOP_PRODUCTS).find(k =>
    shop.type?.toLowerCase().includes(k)
  ) || 'default';
  const products = SHOP_PRODUCTS[typeKey];

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleAddToCart = (product) => {
    dispatch(addToCart({
      _id:      product.id,
      name:     product.name,
      price:    product.price,
      image:    product.img,
      quantity: 1,
    }));
  };

  const mapsUrl = shop.lat && shop.lng
    ? `https://www.openstreetmap.org/?mlat=${shop.lat}&mlon=${shop.lng}#map=17/${shop.lat}/${shop.lng}`
    : null;

  return (
    <div className="sdm-backdrop" onClick={onClose}>
      <div className="sdm-panel" onClick={e => e.stopPropagation()}>

        {/* ── Banner ── */}
        <div className="sdm-banner">
          <img src={shop.banner} alt={shop.name} className="sdm-banner-img"
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&q=80'; }} />
          <div className="sdm-banner-grad" />
          <button className="sdm-close" onClick={onClose}><X size={18} /></button>

          {/* Status badges on banner */}
          <div className="sdm-banner-badges">
            <span className={`sdm-open-badge ${shop.open_now ? 'open' : 'closed'}`}>
              <span className="sdm-badge-dot" /> {shop.open_now ? 'Open Now' : 'Closed'}
            </span>
            <span className="sdm-crowd-badge" style={{
              color: shop.crowd.color,
              background: `${shop.crowd.color}18`,
              borderColor: `${shop.crowd.color}44`,
            }}>
              {shop.crowd.emoji} {shop.crowd.label} · {shop.crowd.pct}%
            </span>
          </div>

          {/* Shop name on banner */}
          <div className="sdm-banner-info">
            <h2 className="sdm-shop-name">{shop.name}</h2>
            <div className="sdm-shop-meta">
              <span className="sdm-shop-type">{shop.type}</span>
              <MapPin size={12} color="#a78bfa" />
              <span>{shop.address}</span>
              {shop.dist && <><span>·</span><span className="sdm-dist">{shop.dist}</span></>}
              {mapsUrl && (
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="sdm-map-link">
                  <ExternalLink size={12} /> View on Map
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ── Crowd Meter ── */}
        <div className="sdm-crowd-row">
          <div className="sdm-crowd-left">
            <Users size={14} color="#6C63FF" />
            <span className="sdm-crowd-label">Live Crowd Level</span>
          </div>
          <div className="sdm-crowd-bar-wrap">
            <div className="sdm-crowd-track">
              <div className="sdm-crowd-fill" style={{
                width: `${shop.crowd.pct}%`,
                background: `linear-gradient(90deg, ${shop.crowd.color}77, ${shop.crowd.color})`,
              }} />
            </div>
            <span className="sdm-crowd-pct" style={{ color: shop.crowd.color }}>
              {shop.crowd.pct}% — {shop.crowd.label}
            </span>
          </div>
        </div>

        {/* ── Products ── */}
        <div className="sdm-body">
          <h3 className="sdm-section-title">
            🛒 Products Available at this Store
          </h3>
          <div className="sdm-products-grid">
            {products.map(product => {
              const stockInfo = getProductStock(shop.stock, product.category);
              const isOutOfStock = stockInfo.label === 'Out of Stock';
              return (
                <div key={product.id} className={`sdm-product-card ${isOutOfStock ? 'out-of-stock' : ''}`}>
                  <div className="sdm-product-img-wrap">
                    <img
                      src={product.img}
                      alt={product.name}
                      className="sdm-product-img"
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                    {isOutOfStock && <div className="sdm-out-overlay">Out of Stock</div>}
                  </div>
                  <div className="sdm-product-info">
                    <span className="sdm-product-cat">{product.category}</span>
                    <p className="sdm-product-name">{product.name}</p>
                    <div className="sdm-product-bottom">
                      <span className="sdm-product-price">₹{product.price.toLocaleString('en-IN')}</span>
                      <span className="sdm-stock-chip" style={{ color: stockInfo.color, background: stockInfo.bg }}>
                        <StockIcon label={stockInfo.label} />
                        {stockInfo.label}
                      </span>
                    </div>
                    {!isAdmin && !isOutOfStock && (
                      <button
                        className="sdm-add-btn"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart size={13} /> Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ShopDetailModal;
