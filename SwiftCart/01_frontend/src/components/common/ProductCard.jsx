import React from 'react';
import { ShoppingCart, Package } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { selectIsAdmin, selectIsAuthenticated } from '../../store/authSlice';
import Button from './Button';
import './ProductCard.css';
import { formatCurrency } from '../../utils/formatCurrency';

const ProductCard = ({ product }) => {
  const { addItem } = useCart();
  const isAdmin = useSelector(selectIsAdmin);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  // Always read live stock from Redux store (reflects admin changes + purchases)
  const liveProduct = useSelector(state =>
    state.products.list.find(p => p._id === product._id)
  ) || product;

  const outOfStock = liveProduct.stockCount <= 0;

  const handleAddToCart = () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (outOfStock) return;
    addItem(liveProduct);
  };

  const stockColor = liveProduct.stockCount > 20 ? '#34d399' : liveProduct.stockCount > 5 ? '#fbbf24' : '#f87171';

  return (
    <div className="product-card glass-card">
      <div className="product-image-container">
        <img
          src={liveProduct.image}
          alt={liveProduct.name}
          className="product-image"
          onError={e => { e.target.src = 'https://placehold.co/300x200/1e3a8a/ffffff?text=Product'; }}
        />
        <div className="product-badge">{liveProduct.category}</div>
        {outOfStock && <div className="product-out-badge">Out of Stock</div>}
      </div>
      <div className="product-content">
        <h3 className="product-title">{liveProduct.name}</h3>
        <p className="product-desc">{liveProduct.description}</p>
        <div className="product-stock-row">
          <span className="product-stock-dot" style={{ background: stockColor }} />
          <span className="product-stock-text" style={{ color: stockColor }}>
            {outOfStock ? 'Out of stock' : `${liveProduct.stockCount} left`}
          </span>
          {liveProduct.aisle && <span className="product-aisle">Aisle {liveProduct.aisle}</span>}
        </div>
        <div className="product-footer">
          <span className="product-price">{formatCurrency(liveProduct.price)}</span>
          {!isAdmin && (
            <Button
              onClick={handleAddToCart}
              variant={outOfStock ? 'secondary' : 'gradient'}
              className="product-add-btn"
              title={outOfStock ? 'Out of Stock' : 'Add to Cart'}
              disabled={outOfStock}
            >
              <ShoppingCart size={18} />
            </Button>
          )}
          {isAdmin && (
            <Button variant="secondary" className="product-add-btn" onClick={() => navigate('/admin')} title="Manage in Admin">
              <Package size={18} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
