import React, { useState } from 'react';
import {
  User, Package, Settings, LogOut, ChevronDown, ChevronUp,
  ShoppingBag, MapPin, Phone, Mail, Calendar, CreditCard, CheckCircle
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const user     = useSelector(selectUser);
  const orders   = useSelector(state => state.cart.pastOrders);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab]       = useState('orders');
  const [expandedOrder, setExpandedOrder] = useState(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const toggleOrder = (id) =>
    setExpandedOrder(prev => (prev === id ? null : id));

  const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const avatarInitials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'SC';

  return (
    <div className="profile-page animate-fade-in">

      {/* ── Header ── */}
      <div className="profile-header glass-card">
        <div className="profile-avatar">
          <span className="profile-avatar-initials">{avatarInitials}</span>
        </div>
        <div className="profile-info">
          <h1>{user?.name || 'Guest User'}</h1>
          <p><Mail size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />{user?.email || '—'}</p>
          <span className={`profile-role-badge ${user?.role === 'admin' ? 'admin' : ''}`}>
            {user?.role === 'admin' ? '🛡 Admin' : '🛍 Customer'}
          </span>
        </div>
        <div className="profile-stats">
          <div className="profile-stat">
            <span className="stat-value">{orders.length}</span>
            <span className="stat-label">Orders</span>
          </div>
          <div className="profile-stat">
            <span className="stat-value">
              ₹{orders.reduce((s, o) => s + (o.totalPrice || 0), 0).toFixed(0)}
            </span>
            <span className="stat-label">Total Spent</span>
          </div>
          <div className="profile-stat">
            <span className="stat-value">
              {orders.reduce((s, o) => s + (o.items?.length || 0), 0)}
            </span>
            <span className="stat-label">Items Bought</span>
          </div>
        </div>
      </div>

      <div className="profile-content">

        {/* ── Sidebar nav ── */}
        <div className="profile-nav glass-card">
          <button
            className={`profile-nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <Package size={18} /> Order History
          </button>
          <button
            className={`profile-nav-btn ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            <User size={18} /> Account Details
          </button>
          <button
            className={`profile-nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={18} /> Settings
          </button>
          <button className="profile-nav-btn logout" onClick={handleLogout}>
            <LogOut size={18} /> Logout
          </button>
        </div>

        {/* ── Main panel ── */}
        <div className="profile-main glass-card">

          {/* ORDER HISTORY */}
          {activeTab === 'orders' && (
            <>
              <h2><Package size={20} /> Order History</h2>
              {orders.length === 0 ? (
                <div className="profile-empty">
                  <ShoppingBag size={48} color="#444" />
                  <p>No orders yet.</p>
                  <button className="btn-gradient profile-cta" onClick={() => navigate('/')}>
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <div>
                          <span className="order-id">#{order.id}</span>
                          <span className="order-date">
                            <Calendar size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                            {formatDate(order.date)}
                          </span>
                        </div>
                        <span className="order-status text-success">
                          <CheckCircle size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                          Completed
                        </span>
                      </div>

                      <div className="order-body">
                        <div className="order-summary">
                          <span className="order-items-count">
                            <ShoppingBag size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                            {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                          </span>
                          <span className="order-total">
                            <CreditCard size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                            ₹{(order.totalPrice || 0).toFixed(2)}
                          </span>
                        </div>
                        <button
                          className="btn-view-details"
                          onClick={() => toggleOrder(order.id)}
                        >
                          {expandedOrder === order.id ? (
                            <><ChevronUp size={15} /> Hide Details</>
                          ) : (
                            <><ChevronDown size={15} /> View Details</>
                          )}
                        </button>
                      </div>

                      {/* Expanded details */}
                      {expandedOrder === order.id && (
                        <div className="order-details">
                          <p className="order-details-title">Items Purchased</p>
                          <div className="order-items-list">
                            {order.items?.map((item, idx) => (
                              <div key={idx} className="order-item-row">
                                {item.product?.image && (
                                  <img
                                    src={item.product.image}
                                    alt={item.product?.name}
                                    className="order-item-img"
                                    onError={e => { e.target.style.display = 'none'; }}
                                  />
                                )}
                                <div className="order-item-info">
                                  <span className="order-item-name">
                                    {item.product?.name || 'Product'}
                                  </span>
                                  <span className="order-item-brand">
                                    {item.product?.brand || item.product?.category || ''}
                                  </span>
                                </div>
                                <div className="order-item-right">
                                  <span className="order-item-qty">Qty: {item.quantity}</span>
                                  <span className="order-item-price">
                                    ₹{((item.product?.price || 0) * item.quantity).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="order-total-row">
                            <span>Total Paid</span>
                            <span className="order-grand-total">₹{(order.totalPrice || 0).toFixed(2)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ACCOUNT DETAILS */}
          {activeTab === 'account' && (
            <>
              <h2><User size={20} /> Account Details</h2>
              <div className="account-details">
                <div className="account-field">
                  <label><User size={14} /> Full Name</label>
                  <span>{user?.name || '—'}</span>
                </div>
                <div className="account-field">
                  <label><Mail size={14} /> Email Address</label>
                  <span>{user?.email || '—'}</span>
                </div>
                <div className="account-field">
                  <label><ShoppingBag size={14} /> Account Type</label>
                  <span style={{ textTransform: 'capitalize' }}>{user?.role || 'customer'}</span>
                </div>
                <div className="account-field">
                  <label><Phone size={14} /> Phone</label>
                  <span className="account-field-empty">Not added yet</span>
                </div>
                <div className="account-field">
                  <label><MapPin size={14} /> Delivery Address</label>
                  <span className="account-field-empty">Not added yet</span>
                </div>
              </div>
            </>
          )}

          {/* SETTINGS */}
          {activeTab === 'settings' && (
            <>
              <h2><Settings size={20} /> Settings</h2>
              <div className="settings-list">
                <div className="settings-item">
                  <div>
                    <p className="settings-item-title">Email Notifications</p>
                    <p className="settings-item-desc">Receive order updates and offers via email</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider" />
                  </label>
                </div>
                <div className="settings-item">
                  <div>
                    <p className="settings-item-title">Push Notifications</p>
                    <p className="settings-item-desc">Get real-time alerts in the app</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider" />
                  </label>
                </div>
                <div className="settings-item">
                  <div>
                    <p className="settings-item-title">Two-Factor Authentication</p>
                    <p className="settings-item-desc">Add an extra layer of security</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider" />
                  </label>
                </div>
                <div className="settings-item settings-danger">
                  <div>
                    <p className="settings-item-title">Delete Account</p>
                    <p className="settings-item-desc">Permanently remove your account and data</p>
                  </div>
                  <button className="btn-danger-sm">Delete</button>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;
