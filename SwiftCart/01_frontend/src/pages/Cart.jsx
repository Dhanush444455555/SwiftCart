import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Bookmark, Trash2, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import { moveToCart, removeSaved, addToCart } from '../store/cartSlice';
import './Cart.css';

// Pick 3 recommended products based on cart categories
const pickRecommended = (items, allProducts) => {
  if (!allProducts?.length) return [];
  const cartIds = new Set(items.map(i => i.product._id));
  const cartCats = [...new Set(items.map(i => i.product.category).filter(Boolean))];
  const related = allProducts.filter(p =>
    !cartIds.has(p._id) && cartCats.includes(p.category)
  );
  const others = allProducts.filter(p => !cartIds.has(p._id) && !related.includes(p));
  return [...related, ...others].slice(0, 4);
};

const Cart = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { items, savedItems, pastOrders } = useSelector(s => s.cart);
  const { list: allProducts }             = useSelector(s => s.products);

  const recommended = pickRecommended(items, allProducts);

  // ── Empty cart ────────────────────────────────────────────────
  if (items.length === 0 && savedItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty-state animate-fade-in">
          <div className="cart-empty-icon-wrap">
            <ShoppingCart size={64} className="cart-empty-icon" />
          </div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet.</p>
          <div className="cart-empty-actions">
            <button className="btn-gradient cart-empty-btn" onClick={() => navigate('/search')}>
              <ShoppingBag size={18} /> Browse Products
            </button>
            <button className="cart-empty-btn-sec" onClick={() => navigate('/scan')}>
              Scan a Barcode
            </button>
          </div>

          {/* Recommended even on empty */}
          {recommended.length > 0 && (
            <div className="cart-reco-section" style={{ marginTop: '2.5rem' }}>
              <div className="creco-header">
                <Sparkles size={18} className="creco-icon" />
                <h3>Start with these picks</h3>
              </div>
              <div className="creco-grid">
                {recommended.map(p => (
                  <RecoCard key={p._id} product={p} onAdd={() => dispatch(addToCart(p))} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">

      {/* ── Header ── */}
      <div className="cart-header">
        <div>
          <h1 className="cart-title">
            <ShoppingCart size={24} /> Your Cart
          </h1>
          <p className="cart-subtitle">
            {items.length} item{items.length !== 1 ? 's' : ''} ·{' '}
            {items.reduce((a, i) => a + i.quantity, 0)} qty
          </p>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div className="cart-layout">

        {/* ── Left: items ── */}
        <div className="cart-left">

          {/* Active items */}
          <div className="cart-items-list">
            {items.map((item, idx) => (
              <CartItem key={item.product._id} item={item} index={idx} />
            ))}
          </div>

          {/* ── Saved for later ── */}
          {savedItems.length > 0 && (
            <div className="cart-saved-section animate-fade-in">
              <div className="cart-section-header">
                <Bookmark size={16} className="cs-sec-icon" />
                <h3>Saved for Later ({savedItems.length})</h3>
              </div>
              <div className="saved-items-list">
                {savedItems.map(item => (
                  <div key={item.product._id} className="saved-item-card">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="saved-item-img"
                      onError={e => { e.target.src = 'https://placehold.co/60x60/1e293b/6366f1?text=?'; }}
                    />
                    <div className="saved-item-info">
                      <p className="saved-item-name">{item.product.name}</p>
                      <p className="saved-item-price">₹{item.product.price.toFixed(2)}</p>
                    </div>
                    <div className="saved-item-actions">
                      <button
                        className="saved-move-btn"
                        onClick={() => dispatch(moveToCart(item.product))}
                      >
                        Move to Cart
                      </button>
                      <button
                        className="saved-remove-btn"
                        onClick={() => dispatch(removeSaved(item.product))}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── You may also like ── */}
          {recommended.length > 0 && (
            <div className="cart-reco-section animate-fade-in">
              <div className="creco-header">
                <Sparkles size={16} className="creco-icon" />
                <h3>You may also like</h3>
                <button className="creco-view-all" onClick={() => navigate('/search')}>
                  View all <ArrowRight size={13} />
                </button>
              </div>
              <div className="creco-grid">
                {recommended.map(p => (
                  <RecoCard key={p._id} product={p} onAdd={() => dispatch(addToCart(p))} />
                ))}
              </div>
            </div>
          )}

          {/* ── Order history ── */}
          {pastOrders?.length > 0 && (
            <div className="cart-orders-section animate-fade-in">
              <div className="cart-section-header">
                <h3>Order History ({pastOrders.length})</h3>
              </div>
              {pastOrders.map(order => (
                <div key={order.id} className="order-card">
                  <div className="order-card-top">
                    <span className="order-id">{order.id}</span>
                    <span className="order-date">{new Date(order.date).toLocaleDateString('en-IN')}</span>
                  </div>
                  <div className="order-items-list">
                    {order.items.map((it, idx) => (
                      <span key={idx} className="order-item-chip">
                        {it.quantity}× {it.product.name}
                      </span>
                    ))}
                  </div>
                  <div className="order-total">Paid: ₹{order.totalPrice.toFixed(2)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: Summary ── */}
        <div className="cart-right">
          <CartSummary />
        </div>
      </div>
    </div>
  );
};

/* ── Recommendation mini-card ── */
const RecoCard = ({ product, onAdd }) => (
  <div className="creco-card">
    <img
      src={product.image}
      alt={product.name}
      className="creco-img"
      onError={e => { e.target.src = 'https://placehold.co/80x80/1e293b/6366f1?text=?'; }}
    />
    <p className="creco-name">{product.name}</p>
    <p className="creco-price">₹{product.price?.toLocaleString('en-IN')}</p>
    <button className="creco-add-btn" onClick={onAdd}>+ Add</button>
  </div>
);

export default Cart;
