import { createSlice } from '@reduxjs/toolkit';
import sendNotificationEmail from '../../services/emailService';

export const NOTIFICATION_TYPES = {
  PAYMENT_SUCCESS:  'payment_success',
  PAYMENT_FAILED:   'payment_failed',
  ORDER_PLACED:     'order_placed',
  ORDER_SHIPPED:    'order_shipped',
  ORDER_DELIVERED:  'order_delivered',
  ORDER_CANCELLED:  'order_cancelled',
  SPECIAL_OFFER:    'special_offer',
  FLASH_SALE:       'flash_sale',
  PROMO_CODE:       'promo_code',
  WISHLIST_ALERT:   'wishlist_alert',
  ACCOUNT:          'account',
  SYSTEM:           'system',
};

// Default demo notifications so the panel isn't empty on first load
const defaultNotifications = [
  {
    id: 'notif-welcome',
    type: NOTIFICATION_TYPES.ACCOUNT,
    title: 'Welcome to SwiftCart! 🎉',
    message: 'Your account is all set. Start exploring thousands of products.',
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    read: false,
    meta: {},
  },
  {
    id: 'notif-offer-1',
    type: NOTIFICATION_TYPES.SPECIAL_OFFER,
    title: 'Exclusive Deal – 30% Off Electronics',
    message: 'Shop top brands and save big. Offer valid until midnight tonight.',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    read: false,
    meta: { discount: '30%', category: 'Electronics' },
  },
  {
    id: 'notif-flash',
    type: NOTIFICATION_TYPES.FLASH_SALE,
    title: '⚡ Flash Sale – Next 2 Hours Only!',
    message: "Up to 50% off on Fashion, Home & Kitchen. Grab it before it's gone!",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
    meta: { discount: '50%' },
  },
  {
    id: 'notif-promo',
    type: NOTIFICATION_TYPES.PROMO_CODE,
    title: 'Promo Code Unlocked 🎁',
    message: 'Use code SWIFT20 at checkout to get ₹200 off on orders above ₹999.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    read: true,
    meta: { code: 'SWIFT20', minOrder: 999 },
  },
];

/* ─────────────────────────────────────────────────────
   Slice (pure reducers – no side effects here)
   ───────────────────────────────────────────────────── */
const notificationSlice = createSlice({
  name: 'notifications',
  initialState: { items: defaultNotifications },
  reducers: {
    _addNotification: (state, action) => {
      state.items.unshift({
        id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        read: false,
        timestamp: new Date().toISOString(),
        meta: {},
        ...action.payload,
      });
    },
    markAsRead: (state, action) => {
      const n = state.items.find(n => n.id === action.payload);
      if (n) n.read = true;
    },
    markAllAsRead: (state) => { state.items.forEach(n => { n.read = true; }); },
    removeNotification: (state, action) => {
      state.items = state.items.filter(n => n.id !== action.payload);
    },
    clearAll: (state) => { state.items = []; },
  },
});

const { _addNotification } = notificationSlice.actions;

/* ─────────────────────────────────────────────────────
   Helper – builds the notification object & also fires
   an email to the logged-in user via EmailJS.
   ───────────────────────────────────────────────────── */
const makeThunk = (type, buildItem) => (payload) => (dispatch, getState) => {
  const item = buildItem(payload || {});
  dispatch(_addNotification(item));

  // Get current user from auth state for email
  const user = getState().auth?.user;
  sendNotificationEmail(type, user, item.meta);
};

/* ─────────────────────────────────────────────────────
   Public thunk action creators
   Usage: dispatch(notifyPaymentSuccess({ orderId, amount, method }))
   ───────────────────────────────────────────────────── */

export const addNotification = (payload) => (dispatch) => {
  dispatch(_addNotification(payload));
};

export const notifyPaymentSuccess = makeThunk(
  NOTIFICATION_TYPES.PAYMENT_SUCCESS,
  ({ orderId, amount, method } = {}) => ({
    type: NOTIFICATION_TYPES.PAYMENT_SUCCESS,
    title: 'Payment Successful ✅',
    message: `Your payment of ₹${amount ?? '—'} via ${method ?? 'online'} was successful. Order #${orderId ?? '—'} is confirmed!`,
    meta: { orderId, amount, method },
  }),
);

export const notifyPaymentFailed = makeThunk(
  NOTIFICATION_TYPES.PAYMENT_FAILED,
  ({ orderId, reason } = {}) => ({
    type: NOTIFICATION_TYPES.PAYMENT_FAILED,
    title: 'Payment Failed ❌',
    message: `Payment for order #${orderId ?? '—'} failed. ${reason ?? 'Please try again or use a different method.'}`,
    meta: { orderId, reason },
  }),
);

export const notifyOrderPlaced = makeThunk(
  NOTIFICATION_TYPES.ORDER_PLACED,
  ({ orderId, itemCount, total } = {}) => ({
    type: NOTIFICATION_TYPES.ORDER_PLACED,
    title: 'Order Placed Successfully 🛍️',
    message: `Your order #${orderId ?? '—'} with ${itemCount ?? '?'} item(s) totalling ₹${total ?? '—'} has been placed!`,
    meta: { orderId, itemCount, total },
  }),
);

export const notifyOrderShipped = makeThunk(
  NOTIFICATION_TYPES.ORDER_SHIPPED,
  ({ orderId, trackingId, estimatedDate } = {}) => ({
    type: NOTIFICATION_TYPES.ORDER_SHIPPED,
    title: 'Order Shipped 🚚',
    message: `Order #${orderId ?? '—'} is on its way! Tracking ID: ${trackingId ?? 'N/A'}. Expected by ${estimatedDate ?? 'soon'}.`,
    meta: { orderId, trackingId, estimatedDate },
  }),
);

export const notifyOrderDelivered = makeThunk(
  NOTIFICATION_TYPES.ORDER_DELIVERED,
  ({ orderId } = {}) => ({
    type: NOTIFICATION_TYPES.ORDER_DELIVERED,
    title: 'Order Delivered 📦',
    message: `Your order #${orderId ?? '—'} has been delivered. Enjoy your purchase! Rate your experience.`,
    meta: { orderId },
  }),
);

export const notifyOrderCancelled = makeThunk(
  NOTIFICATION_TYPES.ORDER_CANCELLED,
  ({ orderId, reason } = {}) => ({
    type: NOTIFICATION_TYPES.ORDER_CANCELLED,
    title: 'Order Cancelled 🚫',
    message: `Your order #${orderId ?? '—'} has been cancelled. ${reason ?? ''}`,
    meta: { orderId, reason },
  }),
);

export const notifySpecialOffer = makeThunk(
  NOTIFICATION_TYPES.SPECIAL_OFFER,
  ({ title, message, discount, category } = {}) => ({
    type: NOTIFICATION_TYPES.SPECIAL_OFFER,
    title: title ?? '🌟 Special Offer Just for You!',
    message: message ?? `Get ${discount ?? 'amazing'} off on ${category ?? 'selected items'}.`,
    meta: { discount, category },
  }),
);

export const notifyFlashSale = makeThunk(
  NOTIFICATION_TYPES.FLASH_SALE,
  ({ title, message, discount } = {}) => ({
    type: NOTIFICATION_TYPES.FLASH_SALE,
    title: title ?? '⚡ Flash Sale – Limited Time!',
    message: message ?? `Up to ${discount ?? '50%'} off — shop now before it ends!`,
    meta: { discount },
  }),
);

export const notifyPromoCode = makeThunk(
  NOTIFICATION_TYPES.PROMO_CODE,
  ({ code, minOrder } = {}) => ({
    type: NOTIFICATION_TYPES.PROMO_CODE,
    title: 'Promo Code Unlocked 🎁',
    message: `Use code ${code ?? 'SWIFT20'} at checkout to save on your next order!`,
    meta: { code, minOrder },
  }),
);

export const notifyWishlistAlert = makeThunk(
  NOTIFICATION_TYPES.WISHLIST_ALERT,
  ({ productName, oldPrice, newPrice } = {}) => ({
    type: NOTIFICATION_TYPES.WISHLIST_ALERT,
    title: '💖 Price Drop on Your Wishlist!',
    message: `"${productName ?? 'An item'}" dropped from ₹${oldPrice ?? '—'} to ₹${newPrice ?? '—'}. Grab it now!`,
    meta: { productName, oldPrice, newPrice },
  }),
);

/* ── Re-export other slice actions ── */
export const { markAsRead, markAllAsRead, removeNotification, clearAll } = notificationSlice.actions;

/* ── Selectors ── */
export const selectAllNotifications    = state => state.notifications.items;
export const selectUnreadCount         = state => state.notifications.items.filter(n => !n.read).length;
export const selectUnreadNotifications = state => state.notifications.items.filter(n => !n.read);

export default notificationSlice.reducer;
