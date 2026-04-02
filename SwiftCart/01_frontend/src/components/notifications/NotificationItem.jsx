import React from 'react';
import { useDispatch } from 'react-redux';
import { markAsRead, removeNotification, NOTIFICATION_TYPES } from '../../store/slices/notificationSlice';
import { X } from 'lucide-react';

/* ── Icon map by type ── */
const ICONS = {
  [NOTIFICATION_TYPES.PAYMENT_SUCCESS]:  '✅',
  [NOTIFICATION_TYPES.PAYMENT_FAILED]:   '❌',
  [NOTIFICATION_TYPES.ORDER_PLACED]:     '🛍️',
  [NOTIFICATION_TYPES.ORDER_SHIPPED]:    '🚚',
  [NOTIFICATION_TYPES.ORDER_DELIVERED]:  '📦',
  [NOTIFICATION_TYPES.ORDER_CANCELLED]:  '🚫',
  [NOTIFICATION_TYPES.SPECIAL_OFFER]:    '🌟',
  [NOTIFICATION_TYPES.FLASH_SALE]:       '⚡',
  [NOTIFICATION_TYPES.PROMO_CODE]:       '🎁',
  [NOTIFICATION_TYPES.WISHLIST_ALERT]:   '💖',
  [NOTIFICATION_TYPES.ACCOUNT]:          '👤',
  [NOTIFICATION_TYPES.SYSTEM]:           '🔔',
};

/* ── Chip label map ── */
const CHIP_LABELS = {
  [NOTIFICATION_TYPES.PAYMENT_SUCCESS]:  'Paid',
  [NOTIFICATION_TYPES.PAYMENT_FAILED]:   'Failed',
  [NOTIFICATION_TYPES.ORDER_PLACED]:     'Order',
  [NOTIFICATION_TYPES.ORDER_SHIPPED]:    'Shipped',
  [NOTIFICATION_TYPES.ORDER_DELIVERED]:  'Delivered',
  [NOTIFICATION_TYPES.ORDER_CANCELLED]:  'Cancelled',
  [NOTIFICATION_TYPES.SPECIAL_OFFER]:    'Offer',
  [NOTIFICATION_TYPES.FLASH_SALE]:       'Flash',
  [NOTIFICATION_TYPES.PROMO_CODE]:       'Promo',
  [NOTIFICATION_TYPES.WISHLIST_ALERT]:   'Wishlist',
  [NOTIFICATION_TYPES.ACCOUNT]:          'Account',
  [NOTIFICATION_TYPES.SYSTEM]:           'System',
};

/* ── Relative time ── */
function relativeTime(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

const NotificationItem = ({ notification }) => {
  const dispatch = useDispatch();
  const { id, type, title, message, timestamp, read } = notification;

  const handleClick = (e) => {
    e.stopPropagation();
    if (!read) dispatch(markAsRead(id));
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    dispatch(removeNotification(id));
  };

  return (
    <div
      className={`notif-item ${!read ? 'notif-item--unread' : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick(e)}
    >
      {/* Unread indicator */}
      {!read && <span className="notif-unread-dot" aria-hidden="true" />}

      {/* Icon */}
      <div className={`notif-icon-box notif-icon--${type}`}>
        <span role="img" aria-label={type}>{ICONS[type] ?? '🔔'}</span>
      </div>

      {/* Content */}
      <div className="notif-content">
        <p className="notif-title">{title}</p>
        <p className="notif-message">{message}</p>
        <div className="notif-meta">
          <span className="notif-time">{relativeTime(timestamp)}</span>
          {type && (
            <span className={`notif-chip notif-chip--${type}`}>
              {CHIP_LABELS[type] ?? type}
            </span>
          )}
        </div>
      </div>

      {/* Remove */}
      <button
        className="notif-remove-btn"
        onClick={handleRemove}
        aria-label="Dismiss notification"
        title="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default NotificationItem;
