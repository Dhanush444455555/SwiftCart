import React, { useState } from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import './CartItem.css';

const CartItem = ({ item }) => {
  const { addItem, removeItem } = useCart();
  const [animating, setAnimating] = useState(null); // 'inc' | 'dec' | null

  const triggerAnimation = (type) => {
    setAnimating(type);
    setTimeout(() => setAnimating(null), 300);
  };

  const handleIncrease = () => {
    triggerAnimation('inc');
    addItem(item.product);
  };

  const handleDecrease = () => {
    triggerAnimation('dec');
    removeItem(item.product);
  };

  const lineTotal = (item.product.price * item.quantity).toFixed(2);

  return (
    <div className="cart-item-card glass-card animate-fade-in">
      {/* Product Image */}
      <div className="cart-item-img-wrap">
        <img
          src={item.product.image}
          alt={item.product.name}
          className="cart-item-img"
          onError={(e) => { e.target.src = 'https://placehold.co/90x90/1e3a8a/ffffff?text=IMG'; }}
        />
        {item.product.category && (
          <span className="cart-item-badge">{item.product.category}</span>
        )}
      </div>

      {/* Details */}
      <div className="cart-item-info">
        <h4 className="cart-item-name">{item.product.name}</h4>
        <p className="cart-item-unit-price">₹{item.product.price.toFixed(2)} / unit</p>
      </div>

      {/* Quantity Controls */}
      <div className="cart-item-qty">
        <button
          className="qty-ctrl-btn dec"
          onClick={handleDecrease}
          aria-label="Decrease quantity"
        >
          {item.quantity === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
        </button>
        <span className={`qty-number ${animating === 'inc' ? 'qty-up' : ''} ${animating === 'dec' ? 'qty-down' : ''}`}>
          {item.quantity}
        </span>
        <button
          className="qty-ctrl-btn inc"
          onClick={handleIncrease}
          aria-label="Increase quantity"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Total Price */}
      <div className="cart-item-total-price">
        <span className="total-label">Total</span>
        <span className="total-amount">₹{lineTotal}</span>
      </div>
    </div>
  );
};

export default CartItem;
