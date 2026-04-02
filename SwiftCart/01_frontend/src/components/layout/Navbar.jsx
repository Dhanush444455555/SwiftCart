import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Home, Store, ShieldCheck, LogOut, MessageSquare, Sparkles } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated, selectIsAdmin, selectUser, logout } from '../../store/authSlice';
import './Navbar.css';

const Navbar = () => {
  const dispatch        = useDispatch();
  const navigate        = useNavigate();
  const cartItems       = useSelector(state => state.cart.items);
  const cartCount       = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin         = useSelector(selectIsAdmin);
  const user            = useSelector(selectUser);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="navbar glass-card">
      <div className="container nav-content">
        <Link to="/" className="nav-logo">
          {/* SwiftCart logo mark — cart + lightning bolt */}
          <svg
            className="nav-logo-icon"
            width="36" height="36" viewBox="0 0 36 36"
            fill="none" xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Cart body */}
            <rect x="2" y="2" width="32" height="32" rx="8" fill="white"/>
            {/* Cart wheel left */}
            <circle cx="13" cy="27" r="2" fill="#111"/>
            {/* Cart wheel right */}
            <circle cx="23" cy="27" r="2" fill="#111"/>
            {/* Cart basket */}
            <path d="M6 10h3l2.5 10h13l2.5-8H11" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Lightning bolt */}
            <path d="M20 8l-5 7h4l-2 7 7-9h-4l3-5-3 0z" fill="#111"/>
          </svg>
          <span className="logo-text">SwiftCart</span>
        </Link>

        <div className="nav-links">
          <Link to="/" className="nav-icon-link" title="Home">
            <Home size={24} />
          </Link>
          <Link to="/search" className="nav-icon-link" title="Search">
            <Search size={24} />
          </Link>
          <Link to="/stores" className="nav-icon-link" title="Nearby Stores">
            <Store size={24} />
          </Link>
          <Link to="/offers" className="nav-icon-link" title="AI Offers">
            <Sparkles size={24} />
          </Link>
          <Link to="/feedback" className="nav-icon-link" title="Feedback">
            <MessageSquare size={24} />
          </Link>
          {!isAdmin && (
            <Link to="/cart" className="nav-icon-link cart-icon-wrapper" title="Cart">
              <ShoppingCart size={24} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="nav-icon-link nav-admin-icon" title="Admin Dashboard">
              <ShieldCheck size={24} />
            </Link>
          )}
          {isAuthenticated ? (
            <div className="nav-user-menu">
              <span className="nav-user-name">{user?.name?.split(' ')[0]}</span>
              <button className="nav-icon-link nav-logout-btn" onClick={handleLogout} title="Logout">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="nav-icon-link" title="Login">
              <User size={24} />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
