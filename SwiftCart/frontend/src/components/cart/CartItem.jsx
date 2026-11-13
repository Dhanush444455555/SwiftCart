import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Minus, Plus, Trash2, Bookmark, CheckCircle, AlertTriangle } from 'lucide-react';
import { updateQuantity, removeFromCart, saveForLater } from '../../store/cartSlice';
import './CartItem.css';

const CartItem = ({ item, index = 0 }) => {
  const dispatch = useDispatch();
  const { product, quantity } = item;

  const [qtyAnim, setQtyAnim] = useState('');  // 'up' | 'down' | ''
  const [removing, setRemoving] = useState(false);

  const originalPrice = product.originalPrice || product.price * 1.2;
  const hasDiscount   = originalPrice > product.price;
  const discountPct   = hasDiscount
    ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
    : 0;

  const stock = product.stockCount ?? 99;
  const isLow = stock > 0 && stock <= 10;
  const isOut = stock <= 0;

  const animateQty = (dir) => {
    setQtyAnim(dir);
    setTimeout(() => setQtyAnim(''), 320);
  };

  const handleIncrease = () => {
    if (isOut) return;
    animateQty('up');
    dispatch(updateQuantity({ id: product._id, quantity: quantity + 1 }));
  };

  const handleDecrease = () => {
    if (quantity <= 1) return handleRemove();
    animateQty('down');
    dispatch(updateQuantity({ id: product._id, quantity: quantity - 1 }));
  };

  const handleRemove = () => {
    setRemoving(true);
    setTimeout(() => dispatch(removeFromCart(product)), 280);
  };

  const handleSaveForLater = () => {
    setRemoving(true);
    setTimeout(() => dispatch(saveForLater(product)), 280);
  };

  const lineTotal = (product.price * quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 });

  return (
    <div
      className={`ci-card ${removing ? 'ci-removing' : 'ci-enter'}`}
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      {/* Discount ribbon */}
      {hasDiscount && (
        <div className="ci-ribbon">{discountPct}% OFF</div>
      )}

      {/* Product image */}
      <div className="ci-img-wrap">
        <img
          src={product.image}
          alt={product.name}
          className="ci-img"
          onError={(e) => {
            e.target.src = `https://placehold.co/100x100/1e293b/6366f1?text=${encodeURIComponent(product.name?.[0] || '?')}`;
          }}
        />
        {product.category && (
          <span className="ci-cat-badge">{product.category}</span>
        )}
      </div>

      {/* Info */}
      <div className="ci-info">
        <h4 className="ci-name">{product.name}</h4>

        {/* Stock badge */}
        <div className="ci-stock-row">
          {isOut ? (
            <span className="ci-stock ci-out">
              <AlertTriangle size={11} /> Out of Stock
            </span>
          ) : isLow ? (
            <span className="ci-stock ci-low">
              <AlertTriangle size={11} /> Only {stock} left
            </span>
          ) : (
            <span className="ci-stock ci-in">
              <CheckCircle size={11} /> In Stock
            </span>
          )}
        </div>

        {/* Price */}
        <div className="ci-price-row">
          <span className="ci-price">₹{product.price.toLocaleString('en-IN')}</span>
          {hasDiscount && (
            <span className="ci-orig-price">₹{Math.round(originalPrice).toLocaleString('en-IN')}</span>
          )}
        </div>

        {/* Actions */}
        <div className="ci-actions">
          <button className="ci-action-btn ci-save-btn" onClick={handleSaveForLater} title="Save for later">
            <Bookmark size={13} /> Save for later
          </button>
          <button className="ci-action-btn ci-remove-btn" onClick={handleRemove} title="Remove">
            <Trash2 size={13} /> Remove
          </button>
        </div>
      </div>

      {/* Quantity + Total */}
      <div className="ci-right">
        {/* Qty controls */}
        <div className="ci-qty-wrap">
          <button
            className="ci-qty-btn ci-minus"
            onClick={handleDecrease}
            aria-label="Decrease"
          >
            {quantity === 1 ? <Trash2 size={13} /> : <Minus size={13} />}
          </button>
          <span className={`ci-qty-num ${qtyAnim === 'up' ? 'qty-anim-up' : qtyAnim === 'down' ? 'qty-anim-down' : ''}`}>
            {quantity}
          </span>
          <button
            className="ci-qty-btn ci-plus"
            onClick={handleIncrease}
            disabled={isOut}
            aria-label="Increase"
          >
            <Plus size={13} />
          </button>
        </div>

        {/* Line total */}
        <div className="ci-total-wrap">
          <span className="ci-total-label">Total</span>
          <span className="ci-total">₹{lineTotal}</span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
