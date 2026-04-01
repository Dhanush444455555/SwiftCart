import React from 'react';
import { Plus, ShoppingCart } from 'lucide-react';
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

  const handleAddToCart = () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    addItem(product);
  };

  return (
    <div className="product-card glass-card">
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          onError={e => { e.target.src = 'https://placehold.co/300x200/1e3a8a/ffffff?text=Product'; }}
        />
        <div className="product-badge">{product.category}</div>
      </div>
      <div className="product-content">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-desc">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">{formatCurrency(product.price)}</span>
          {isAdmin ? (
            <Button variant="secondary" className="product-add-btn" onClick={() => navigate('/admin')} title="Manage in Admin">
              <Plus size={18} />
            </Button>
          ) : (
            <Button onClick={handleAddToCart} variant="gradient" className="product-add-btn" title="Add to Cart">
              <ShoppingCart size={18} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
