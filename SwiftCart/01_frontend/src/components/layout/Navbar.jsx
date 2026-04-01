import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Home, Store, ShieldCheck, LogOut, MessageSquare } from 'lucide-react';
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
