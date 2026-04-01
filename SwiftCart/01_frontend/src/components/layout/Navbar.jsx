import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Search, Home } from 'lucide-react';
import { useSelector } from 'react-redux';
import './Navbar.css';

const Navbar = () => {
  const cartItems = useSelector(state => state.cart.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="navbar glass-card">
      <div className="container nav-content">
        <Link to="/" className="nav-logo">
          <span className="logo-text">SwiftCart</span>
        </Link>
        
        <div className="nav-links">
          <Link to="/" className="nav-icon-link" title="Home">
            <Home size={24} />
          </Link>
          <Link to="/search" className="nav-icon-link" title="Search">
            <Search size={24} />
          </Link>
          <Link to="/cart" className="nav-icon-link cart-icon-wrapper" title="Cart">
            <ShoppingCart size={24} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          <Link to="/profile" className="nav-icon-link" title="Profile">
            <User size={24} />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
