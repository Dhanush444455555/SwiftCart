import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Bell, BellOff } from 'lucide-react';
import {
  selectAllNotifications,
  selectUnreadCount,
  markAllAsRead,
  clearAll,
} from '../../store/slices/notificationSlice';
import NotificationItem from './NotificationItem';
import './Notifications.css';

/* ── Tab filter options ── */
const TABS = [
  { key: 'all',    label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'orders', label: 'Orders' },
  { key: 'offers', label: 'Offers' },
];

const ORDER_TYPES  = ['order_placed', 'order_shipped', 'order_delivered', 'order_cancelled'];
const OFFER_TYPES  = ['special_offer', 'flash_sale', 'promo_code'];

const filterByTab = (items, tab) => {
  if (tab === 'unread') return items.filter(n => !n.read);
  if (tab === 'orders') return items.filter(n => ORDER_TYPES.includes(n.type));
  if (tab === 'offers') return items.filter(n => OFFER_TYPES.includes(n.type));
  return items;
};

const NotificationPanel = () => {
  const dispatch       = useDispatch();
  const notifications  = useSelector(selectAllNotifications);
  const unreadCount    = useSelector(selectUnreadCount);

  const [open, setOpen]     = useState(false);
  const [tab,  setTab]      = useState('all');
  const panelRef            = useRef(null);

  /* Close when clicking outside */
  useEffect(() => {
    const handleOutside = (e) => {
      if (open && panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  const filtered = filterByTab(notifications, tab);

  return (
    <div className="notif-panel-wrapper" ref={panelRef}>
      {/* Bell Button */}
      <button
        id="notification-bell-btn"
        className="notif-bell-btn"
        onClick={() => setOpen(prev => !prev)}
        aria-label={`Notifications${unreadCount > 0 ? ` – ${unreadCount} unread` : ''}`}
        title="Notifications"
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="notif-bell-badge" aria-live="polite">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="notif-panel" role="dialog" aria-label="Notifications panel">
          {/* Header */}
          <div className="notif-panel-header">
            <span className="notif-panel-title">
              Notifications {unreadCount > 0 && `(${unreadCount})`}
            </span>
            <div className="notif-panel-actions">
              {unreadCount > 0 && (
                <button
                  className="notif-action-btn"
                  onClick={() => dispatch(markAllAsRead())}
                  title="Mark all as read"
                >
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  className="notif-action-btn"
                  onClick={() => dispatch(clearAll())}
                  title="Clear all notifications"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="notif-tabs" role="tablist">
            {TABS.map(t => (
              <button
                key={t.key}
                role="tab"
                aria-selected={tab === t.key}
                className={`notif-tab ${tab === t.key ? 'notif-tab--active' : ''}`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
                {t.key === 'unread' && unreadCount > 0 && ` (${unreadCount})`}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="notif-list" role="tabpanel">
            {filtered.length === 0 ? (
              <div className="notif-empty">
                <BellOff size={40} />
                <p>
                  {tab === 'all'
                    ? 'No notifications yet'
                    : `No ${tab} notifications`}
                </p>
              </div>
            ) : (
              filtered.map(n => (
                <NotificationItem key={n.id} notification={n} />
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="notif-panel-footer">
              <button
                className="notif-view-all-btn"
                onClick={() => setOpen(false)}
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
