import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag, Tag, CreditCard, ShieldCheck,
  Zap, Truck, ChevronRight, X, CheckCircle,
} from 'lucide-react';
import { applyCoupon, removeCoupon, clearCart } from '../../store/cartSlice';
import './CartSummary.css';

// Valid coupons
const COUPONS = {
  SWIFT10:  { discount: 10,  label: '10% OFF' },
  SWIFTCART20: { discount: 20, label: '20% OFF' },
  FIRST50:  { discount: 50,  label: '50% OFF — First Order!' },
  SAVE30:   { discount: 30,  label: '30% OFF' },
};

const CartSummary = () => {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { items, totalPrice, coupon } = useSelector(s => s.cart);

  const [code,       setCode]       = useState('');
  const [couponMsg,  setCouponMsg]  = useState('');
  const [couponErr,  setCouponErr]  = useState(false);
  const [pulsing,    setPulsing]    = useState(false);

  const itemCount    = items.reduce((a, i) => a + i.quantity, 0);
  const discountPct  = coupon?.discount || 0;
  const discount     = totalPrice * (discountPct / 100);
  const afterDisc    = totalPrice - discount;
  const tax          = afterDisc * 0.08;
  const delivery     = afterDisc > 499 ? 0 : 49;
  const grandTotal   = afterDisc + tax + delivery;

  // Pulse on total change
  useEffect(() => {
    setPulsing(true);
    const t = setTimeout(() => setPulsing(false), 350);
    return () => clearTimeout(t);
  }, [grandTotal]);

  const handleApplyCoupon = () => {
    const upper = code.trim().toUpperCase();
    if (COUPONS[upper]) {
      dispatch(applyCoupon({ code: upper, discount: COUPONS[upper].discount }));
      setCouponMsg(`✅ ${COUPONS[upper].label} applied!`);
      setCouponErr(false);
      setCode('');
    } else {
      setCouponMsg('❌ Invalid coupon code');
      setCouponErr(true);
    }
    setTimeout(() => setCouponMsg(''), 3000);
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    setCouponMsg('');
  };

  if (items.length === 0) {
    return (
      <div className="cs-card cs-empty animate-fade-in">
        <ShoppingBag size={52} className="cs-empty-icon" />
        <h3>Your cart is empty</h3>
        <p>Browse and add products to see your summary here.</p>
        <button className="cs-shop-btn" onClick={() => navigate('/search')}>
          <Zap size={16} /> Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cs-card animate-fade-in">

      {/* Header */}
      <div className="cs-header">
        <ShoppingBag size={19} className="cs-hd-icon" />
        <h3 className="cs-title">Order Summary</h3>
        <span className="cs-badge">{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
      </div>

      <div className="cs-divider" />

      {/* Price rows */}
      <div className="cs-rows">
        <div className="cs-row">
          <span className="cs-label">Subtotal</span>
          <span className="cs-val">₹{totalPrice.toFixed(2)}</span>
        </div>

        {discountPct > 0 && (
          <div className="cs-row cs-row-discount">
            <span className="cs-label">
              <Tag size={12} /> Coupon ({coupon.code})
              <button className="cs-rm-coupon" onClick={handleRemoveCoupon}><X size={11} /></button>
            </span>
            <span className="cs-val cs-discount-val">−₹{discount.toFixed(2)}</span>
          </div>
        )}

        <div className="cs-row">
          <span className="cs-label">Tax (8% GST)</span>
          <span className="cs-val">₹{tax.toFixed(2)}</span>
        </div>

        <div className="cs-row">
          <span className="cs-label"><Truck size={12} /> Delivery</span>
          <span className={`cs-val ${delivery === 0 ? 'cs-free' : ''}`}>
            {delivery === 0 ? 'FREE ✦' : `₹${delivery}`}
          </span>
        </div>

        {delivery === 0 && (
          <p className="cs-free-note">🎉 You qualify for free delivery!</p>
        )}
        {delivery > 0 && (
          <p className="cs-free-note cs-free-note-mid">
            Add ₹{(499 - afterDisc).toFixed(0)} more for free delivery
          </p>
        )}
      </div>

      <div className="cs-divider" />

      {/* Grand total */}
      <div className="cs-total-row">
        <span className="cs-total-label">Total Payable</span>
        <span className={`cs-total-val ${pulsing ? 'cs-pulse' : ''}`}>
          ₹{grandTotal.toFixed(2)}
        </span>
      </div>

      {discountPct > 0 && (
        <p className="cs-savings-line">
          🎉 You're saving <strong>₹{(discount + (delivery === 0 ? 49 : 0)).toFixed(2)}</strong> on this order!
        </p>
      )}

      {/* Promo code input */}
      {!coupon && (
        <div className="cs-coupon-wrap">
          <input
            className="cs-coupon-input"
            placeholder="Enter promo code"
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
          />
          <button className="cs-coupon-btn" onClick={handleApplyCoupon}>
            Apply
          </button>
        </div>
      )}

      {coupon && (
        <div className="cs-coupon-applied">
          <CheckCircle size={14} /> <span>{coupon.code} — {coupon.discount}% OFF applied</span>
          <button className="cs-rm-coupon-btn" onClick={handleRemoveCoupon}>Remove</button>
        </div>
      )}

      {couponMsg && (
        <p className={`cs-coupon-msg ${couponErr ? 'cs-coupon-err' : 'cs-coupon-ok'}`}>
          {couponMsg}
        </p>
      )}

      {/* Try codes hint */}
      {!coupon && (
        <p className="cs-coupon-hint">
          Try: <span onClick={() => setCode('SWIFT10')}>SWIFT10</span> ·{' '}
          <span onClick={() => setCode('SAVE30')}>SAVE30</span> ·{' '}
          <span onClick={() => setCode('FIRST50')}>FIRST50</span>
        </p>
      )}

      {/* Checkout CTA */}
      <button className="cs-checkout-btn" onClick={() => navigate('/checkout')}>
        <CreditCard size={17} /> Proceed to Payment
        <ChevronRight size={16} className="cs-chev" />
      </button>

      {/* Trust row */}
      <div className="cs-trust">
        <ShieldCheck size={13} />
        <span>100% Secure · SSL Encrypted · SwiftCart</span>
      </div>

      {/* Clear cart */}
      <button className="cs-clear-btn" onClick={() => dispatch(clearCart())}>
        Clear cart
      </button>
    </div>
  );
};

export default CartSummary;
