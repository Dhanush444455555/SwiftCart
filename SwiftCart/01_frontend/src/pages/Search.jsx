import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Search as SearchIcon } from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import './Search.css';

const Search = () => {
  const { list: products } = useSelector((state) => state.products);
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      setFiltered(products);
    }
  }, [products]);

  const handleSearch = (e) => {
    const v = e.target.value.toLowerCase();
    setQuery(v);
    const results = products.filter(p => p.name.toLowerCase().includes(v) || p.category.toLowerCase().includes(v));
    setFiltered(results);
  };

  return (
    <div className="search-page">
      <div className="search-header glass-card">
        <h1>Discover Products</h1>
        <div className="search-bar-wrapper">
          <SearchIcon className="search-icon" size={20} />
          <input 
            type="text" 
            className="input-glass search-input" 
            placeholder="Search by name or category..." 
            value={query}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="search-results">
        <h2>Results ({filtered.length})</h2>
        <div className="products-grid">
          {filtered.length > 0 ? (
            filtered.map(p => <ProductCard key={p._id} product={p} />)
          ) : (
            <div className="no-results">No products found for "{query}"</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
