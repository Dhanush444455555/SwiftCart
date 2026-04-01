import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import Button from './Button';
import './CartItem.css';

const CartItem = ({ item }) => {
  const { addItem, removeItem } = useCart();

  const handleIncrease = () => {
    addItem(item.product);
  };

  const handleDecrease = () => {
    removeItem(item.product);
  };

  return (
    <div className="cart-item glass-card">
      <img src={item.product.image} alt={item.product.name} className="cart-item-image" />
      
      <div className="cart-item-details">
        <h4 className="cart-item-title">{item.product.name}</h4>
        <div className="cart-item-price">₹{item.product.price.toFixed(2)}</div>
      </div>
      
      <div className="cart-item-actions">
        <button className="qty-btn" onClick={handleDecrease}>
          {item.quantity === 1 ? <Trash2 size={16} color="#fb7185" /> : <Minus size={16} />}
        </button>
        <span className="qty-value">{item.quantity}</span>
        <button className="qty-btn" onClick={handleIncrease}>
          <Plus size={16} />
        </button>
      </div>
      
      <div className="cart-item-total">
        ₹{(item.product.price * item.quantity).toFixed(2)}
      </div>
    </div>
  );
};

export default CartItem;
