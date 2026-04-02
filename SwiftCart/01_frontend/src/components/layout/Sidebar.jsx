import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  User, Home, Search, ShoppingCart, Package, MessageSquare,
  Store, Sparkles, Settings, LogOut, ShieldCheck, HelpCircle,
  ChevronRight, X, Menu
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated, selectIsAdmin, selectUser, logout } from '../../store/authSlice';
import { selectUnreadCount } from '../../store/slices/notificationSlice';
import NotificationPanel from '../notifications/NotificationPanel';
import './Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen]   = useState(false);
  const sidebarRef             = useRef(null);
  const dispatch               = useDispatch();
  const navigate               = useNavigate();
  const location               = useLocation();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin         = useSelector(selectIsAdmin);
  const user            = useSelector(selectUser);
  const cartItems       = useSelector(state => state.cart.items);
  const cartCount       = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  useEffect(() => {
    const handleClick = (e) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/',         icon: <Home size={19} />,         label: 'Home' },
    { to: '/search',   icon: <Search size={19} />,       label: 'Search' },
    { to: '/offers',   icon: <Sparkles size={19} />,     label: 'AI Offers' },
    { to: '/stores',   icon: <Store size={19} />,        label: 'Nearby Stores' },
    { to: '/feedback', icon: <MessageSquare size={19} />, label: 'Feedback' },
    ...(!isAdmin ? [{ to: '/cart', icon: <ShoppingCart size={19} />, label: 'Cart', badge: cartCount }] : []),
  ];

  const unreadCount = useSelector(selectUnreadCount);

  const accountLinks = isAuthenticated
    ? [
        { to: '/profile', icon: <User size={19} />,     label: 'My Profile' },
        { to: '/profile', icon: <Package size={19} />,  label: 'Order History' },
        ...(isAdmin ? [{ to: '/admin', icon: <ShieldCheck size={19} />, label: 'Admin Dashboard', admin: true }] : []),
        { to: '/profile', icon: <Settings size={19} />, label: 'Settings' },
      ]
    : [];

  const avatarInitials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'SC';

  return (
    <>
      {/* Toggle button */}
      <button
        id="sidebar-toggle"
        className={`sb-toggle ${isOpen ? 'sb-toggle--open' : ''}`}
        onClick={() => setIsOpen(prev => !prev)}
        aria-label="Toggle account menu"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Backdrop */}
      <div
        className={`sb-backdrop ${isOpen ? 'sb-backdrop--visible' : ''}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar panel */}
      <aside
        ref={sidebarRef}
        id="sidebar-panel"
        className={`sb-panel ${isOpen ? 'sb-panel--open' : ''}`}
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="sb-header">
          <span className="sb-brand">SwiftCart</span>
          <button className="sb-close" onClick={() => setIsOpen(false)} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* User card */}
        <div className="sb-user-card">
          {isAuthenticated ? (
            <>
              <div className="sb-avatar">
                <span>{avatarInitials}</span>
              </div>
              <div className="sb-user-info">
                <p className="sb-user-name">{user?.name || 'User'}</p>
                <p className="sb-user-email">{user?.email || ''}</p>
                {isAdmin && <span className="sb-admin-badge">Admin</span>}
              </div>
            </>
          ) : (
            <div className="sb-guest">
              <div className="sb-avatar sb-avatar--guest">
                <User size={22} color="#fff" />
              </div>
              <div className="sb-user-info">
                <p className="sb-user-name">Welcome, Guest</p>
                <Link to="/login" className="sb-signin-link" onClick={() => setIsOpen(false)}>
                  Sign in / Register
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="sb-nav">
          <p className="sb-section-label">Navigation</p>
          {navLinks.map(({ to, icon, label, badge }) => (
            <Link
              key={label}
              to={to}
              id={`sidebar-nav-${label.toLowerCase().replace(/\s/g, '-')}`}
              className={`sb-nav-item ${isActive(to) ? 'sb-nav-item--active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              <span className="sb-nav-icon-box">
                {icon}
              </span>
              <span className="sb-nav-label">{label}</span>
              {badge > 0 && <span className="sb-nav-badge">{badge}</span>}
              <ChevronRight size={15} className="sb-nav-arrow" />
            </Link>
          ))}
        </nav>

        {/* Account */}
        {isAuthenticated && accountLinks.length > 0 && (
          <nav className="sb-nav sb-nav--account">
            <p className="sb-section-label">Account</p>
            {accountLinks.map(({ to, icon, label, admin }) => (
              <Link
                key={label}
                to={to}
                id={`sidebar-account-${label.toLowerCase().replace(/\s/g, '-')}`}
                className={`sb-nav-item ${admin ? 'sb-nav-item--admin' : ''} ${isActive(to) ? 'sb-nav-item--active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <span className="sb-nav-icon-box">
                  {icon}
                </span>
                <span className="sb-nav-label">{label}</span>
                <ChevronRight size={15} className="sb-nav-arrow" />
              </Link>
            ))}

            {/* ── Notifications row ── */}
            <div className="sb-nav-item sb-nav-item--notif">
              <span className="sb-nav-icon-box">
                <span style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  🔔
                  {unreadCount > 0 && (
                    <span className="sb-nav-badge sb-notif-badge">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </span>
              </span>
              <span className="sb-nav-label">Notifications</span>
              <NotificationPanel />
            </div>
          </nav>
        )}

        {/* Footer */}
        <div className="sb-footer">
          <Link to="/help" className="sb-help-link" onClick={() => setIsOpen(false)}>
            <HelpCircle size={17} />
            <span>Help &amp; Support</span>
          </Link>
          {isAuthenticated && (
            <button className="sb-logout-btn" onClick={handleLogout} id="sidebar-logout">
              <span className="sb-logout-inner">
                <LogOut size={16} />
                <span>Logout</span>
              </span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
