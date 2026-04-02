import { createSlice } from '@reduxjs/toolkit';

const NOTIFICATION_TYPES = {
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
    message: 'Up to 50% off on Fashion, Home & Kitchen. Grab it before it\'s gone!',
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

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: defaultNotifications,
  },
  reducers: {
    // Add any new notification (payment, order, offer, etc.)
    addNotification: (state, action) => {
      const notification = {
        id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        read: false,
        timestamp: new Date().toISOString(),
        meta: {},
        ...action.payload,
      };
      state.items.unshift(notification); // newest first
    },

    // Convenience: payment success
    notifyPaymentSuccess: (state, action) => {
      const { orderId, amount, method } = action.payload || {};
      state.items.unshift({
        id: `notif-pay-${Date.now()}`,
        type: NOTIFICATION_TYPES.PAYMENT_SUCCESS,
        title: 'Payment Successful ✅',
        message: `Your payment of ₹${amount ?? '—'} via ${method ?? 'online'} was successful. Order #${orderId ?? '—'} is confirmed!`,
        timestamp: new Date().toISOString(),
        read: false,
        meta: { orderId, amount, method },
      });
    },

    // Convenience: payment failed
    notifyPaymentFailed: (state, action) => {
      const { orderId, reason } = action.payload || {};
      state.items.unshift({
        id: `notif-payfail-${Date.now()}`,
        type: NOTIFICATION_TYPES.PAYMENT_FAILED,
        title: 'Payment Failed ❌',
        message: `Payment for order #${orderId ?? '—'} failed. ${reason ?? 'Please try again or use a different method.'}`,
        timestamp: new Date().toISOString(),
        read: false,
        meta: { orderId, reason },
      });
    },

    // Convenience: order placed
    notifyOrderPlaced: (state, action) => {
      const { orderId, itemCount, total } = action.payload || {};
      state.items.unshift({
        id: `notif-order-${Date.now()}`,
        type: NOTIFICATION_TYPES.ORDER_PLACED,
        title: 'Order Placed Successfully 🛍️',
        message: `Your order #${orderId ?? '—'} with ${itemCount ?? '?'} item(s) totalling ₹${total ?? '—'} has been placed!`,
        timestamp: new Date().toISOString(),
        read: false,
        meta: { orderId, itemCount, total },
      });
    },

    // Convenience: order shipped
    notifyOrderShipped: (state, action) => {
      const { orderId, trackingId, estimatedDate } = action.payload || {};
      state.items.unshift({
        id: `notif-ship-${Date.now()}`,
        type: NOTIFICATION_TYPES.ORDER_SHIPPED,
        title: 'Order Shipped 🚚',
        message: `Order #${orderId ?? '—'} is on its way! Tracking ID: ${trackingId ?? 'N/A'}. Expected by ${estimatedDate ?? 'soon'}.`,
        timestamp: new Date().toISOString(),
        read: false,
        meta: { orderId, trackingId, estimatedDate },
      });
    },

    // Convenience: order delivered
    notifyOrderDelivered: (state, action) => {
      const { orderId } = action.payload || {};
      state.items.unshift({
        id: `notif-del-${Date.now()}`,
        type: NOTIFICATION_TYPES.ORDER_DELIVERED,
        title: 'Order Delivered 📦',
        message: `Your order #${orderId ?? '—'} has been delivered. Enjoy your purchase! Rate your experience.`,
        timestamp: new Date().toISOString(),
        read: false,
        meta: { orderId },
      });
    },

    // Convenience: special offer
    notifySpecialOffer: (state, action) => {
      const { title, message, discount, category } = action.payload || {};
      state.items.unshift({
        id: `notif-offer-${Date.now()}`,
        type: NOTIFICATION_TYPES.SPECIAL_OFFER,
        title: title ?? '🌟 Special Offer Just for You!',
        message: message ?? `Get ${discount ?? 'amazing'} off on ${category ?? 'selected items'}.`,
        timestamp: new Date().toISOString(),
        read: false,
        meta: { discount, category },
      });
    },

    markAsRead: (state, action) => {
      const notif = state.items.find(n => n.id === action.payload);
      if (notif) notif.read = true;
    },

    markAllAsRead: (state) => {
      state.items.forEach(n => { n.read = true; });
    },

    removeNotification: (state, action) => {
      state.items = state.items.filter(n => n.id !== action.payload);
    },

    clearAll: (state) => {
      state.items = [];
    },
  },
});

export const {
  addNotification,
  notifyPaymentSuccess,
  notifyPaymentFailed,
  notifyOrderPlaced,
  notifyOrderShipped,
  notifyOrderDelivered,
  notifySpecialOffer,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAll,
} = notificationSlice.actions;

// Selectors
export const selectAllNotifications  = state => state.notifications.items;
export const selectUnreadCount       = state => state.notifications.items.filter(n => !n.read).length;
export const selectUnreadNotifications = state => state.notifications.items.filter(n => !n.read);

export { NOTIFICATION_TYPES };
export default notificationSlice.reducer;
