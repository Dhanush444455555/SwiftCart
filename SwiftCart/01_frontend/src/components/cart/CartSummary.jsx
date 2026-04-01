import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Tag, CreditCard, ShieldCheck, Zap } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import './CartSummary.css';

const CartSummary = ({ discountCode = null, discountPercent = 0 }) => {
  const { items, totalPrice, emptyCart } = useCart();
  const navigate = useNavigate();
  const [animatedTotal, setAnimatedTotal] = useState(totalPrice);
  const [pulsing, setPulsing] = useState(false);

  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const discount = totalPrice * (discountPercent / 100);
  const tax = (totalPrice - discount) * 0.08;
  const finalTotal = totalPrice - discount + tax;

  // Pulse animation when total changes
  useEffect(() => {
    setPulsing(true);
    const t = setTimeout(() => {
      setAnimatedTotal(finalTotal);
      setPulsing(false);
    }, 250);
    return () => clearTimeout(t);
  }, [finalTotal]);

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="cart-summary-card glass-card cart-summary-empty animate-fade-in">
        <ShoppingBag size={52} className="empty-bag-icon" />
        <h3>Your cart is empty</h3>
        <p>Add items to see your summary here.</p>
        <button className="btn-gradient summary-shop-btn" onClick={() => navigate('/search')}>
          <Zap size={16} /> Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-summary-card glass-card animate-fade-in">
      {/* Header */}
      <div className="cs-header">
        <ShoppingBag size={20} className="cs-header-icon" />
        <h3 className="cs-title">Order Summary</h3>
        <span className="cs-item-count">{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
      </div>

      <div className="cs-divider" />

      {/* Price Rows */}
      <div className="cs-rows">
        <div className="cs-row">
          <span className="cs-label">Subtotal</span>
          <span className="cs-value">₹{totalPrice.toFixed(2)}</span>
        </div>

        {discountPercent > 0 && (
          <div className="cs-row discount">
            <span className="cs-label">
              <Tag size={13} style={{ marginRight: '4px' }} />
              Discount {discountCode ? `(${discountCode})` : `(${discountPercent}%)`}
            </span>
            <span className="cs-value discount-val">-₹{discount.toFixed(2)}</span>
          </div>
        )}

        <div className="cs-row">
          <span className="cs-label">Tax (8% GST)</span>
          <span className="cs-value">₹{tax.toFixed(2)}</span>
        </div>

        <div className="cs-row delivery">
          <span className="cs-label">Delivery</span>
          <span className="cs-value free-tag">FREE ✦</span>
        </div>
      </div>

      <div className="cs-divider" />

      {/* Total */}
      <div className="cs-total-row">
        <span className="cs-total-label">Total Payable</span>
        <span className={`cs-total-amount ${pulsing ? 'total-pulse' : ''}`}>
          ₹{finalTotal.toFixed(2)}
        </span>
      </div>

      {/* Checkout Button */}
      <button className="btn-gradient cs-checkout-btn" onClick={handleCheckout}>
        <CreditCard size={18} />
        Proceed to Payment
      </button>

      {/* Trust Badge */}
      <div className="cs-trust">
        <ShieldCheck size={14} className="trust-icon" />
        <span>100% Secure Checkout · Powered by SwiftCart</span>
      </div>

      {/* Clear Cart */}
      <button className="cs-clear-btn" onClick={emptyCart}>
        Clear Cart
      </button>
    </div>
  );
};

export default CartSummary;
