import React from 'react';
import { Plus } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import Button from './Button';
import './ProductCard.css';

import { formatCurrency } from '../../utils/formatCurrency';

const ProductCard = ({ product }) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(product);
  };

  return (
    <div className="product-card glass-card">
      <div className="product-image-container">
        <img src={product.image} alt={product.name} className="product-image" />
        <div className="product-badge">{product.category}</div>
      </div>
      <div className="product-content">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-desc">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">{formatCurrency(product.price)}</span>
          <Button onClick={handleAddToCart} variant="gradient" className="product-add-btn">
            <Plus size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
