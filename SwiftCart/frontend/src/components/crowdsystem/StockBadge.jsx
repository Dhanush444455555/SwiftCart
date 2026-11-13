import React from 'react';
import './StockBadge.css';

/**
 * StockBadge — chip showing product category availability
 * Props: category (string), status ('In Stock'|'Low Stock'|'Out of Stock'), color
 */
const StockBadge = ({ category, status, color }) => {
  return (
    <div className="stock-badge" style={{ borderColor: `${color}55` }}>
      <span className="sb-dot" style={{ background: color }} />
      <span className="sb-cat">{category}</span>
      <span className="sb-status" style={{ color }}>{status}</span>
    </div>
  );
};

export default StockBadge;
