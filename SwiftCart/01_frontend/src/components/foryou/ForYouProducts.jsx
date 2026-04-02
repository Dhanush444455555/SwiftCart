import React from 'react';
import { Grid } from 'lucide-react';
import { useSelector } from 'react-redux';
import ProductCard from '../common/ProductCard';

const ForYouProducts = () => {
  const { list: products } = useSelector((state) => state.products);
  
  // Maybe show only some products for 'For You' - for now we'll just slice the first 8 randomly or so
  // In a real app this would be personalized
  const personalizedProducts = products.slice(0, 8);

  return (
    <section className="featured-section">
      <div className="section-header">
        <h2><Grid size={20} /> For You</h2>
      </div>
      <div className="products-grid">
        {personalizedProducts.map(p => (
          <ProductCard key={`foryou-${p._id}`} product={p} />
        ))}
      </div>
    </section>
  );
};

export default ForYouProducts;
