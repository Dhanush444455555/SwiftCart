/**
 * emailService.js
 * Sends notification emails via EmailJS.
 *
 * Template variables: {{name}}, {{product}}, {{amount}}
 * "To Email" is fixed to the owner's email in the EmailJS template.
 * {{name}} = customer name, so you know who triggered the event.
 */

import emailjs from '@emailjs/browser';

const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

emailjs.init(PUBLIC_KEY);

/* ─────────────────────────────────────────────────────────
   Builders – map every notification type to the 3 template
   vars your EmailJS template expects: name, product, amount
   ───────────────────────────────────────────────────────── */
const builders = {
  payment_success: ({ user, meta }) => ({
    name:    user?.name || 'A Customer',
    product: `Payment for Order #${meta?.orderId ?? '—'} via ${meta?.method ?? 'Online'}`,
    amount:  `₹${meta?.amount ?? '—'}`,
  }),

  payment_failed: ({ user, meta }) => ({
    name:    user?.name || 'A Customer',
    product: `FAILED payment for Order #${meta?.orderId ?? '—'}. ${meta?.reason ?? 'Please retry.'}`,
    amount:  '—',
  }),

  order_placed: ({ user, meta }) => ({
    name:    user?.name || 'A Customer',
    product: `Order #${meta?.orderId ?? '—'} (${meta?.itemCount ?? '?'} item${meta?.itemCount !== 1 ? 's' : ''})`,
    amount:  `₹${meta?.total ?? '—'}`,
  }),

  order_shipped: ({ user, meta }) => ({
    name:    user?.name || 'A Customer',
    product: `Order #${meta?.orderId ?? '—'} shipped | Tracking: ${meta?.trackingId ?? 'N/A'} | ETA: ${meta?.estimatedDate ?? 'Soon'}`,
    amount:  '—',
  }),

  order_delivered: ({ user, meta }) => ({
    name:    user?.name || 'A Customer',
    product: `Order #${meta?.orderId ?? '—'} has been DELIVERED.`,
    amount:  '—',
  }),

  order_cancelled: ({ user, meta }) => ({
    name:    user?.name || 'A Customer',
    product: `Order #${meta?.orderId ?? '—'} CANCELLED. ${meta?.reason ?? ''}`,
    amount:  '—',
  }),

  special_offer: ({ user, meta }) => ({
    name:    user?.name || 'A Customer',
    product: `Special Offer on ${meta?.category ?? 'selected products'}`,
    amount:  meta?.discount ?? 'Limited Discount',
  }),

  flash_sale: ({ user, meta }) => ({
    name:    user?.name || 'A Customer',
    product: 'Flash Sale triggered for user',
    amount:  `Up to ${meta?.discount ?? '50%'} off`,
  }),

  promo_code: ({ user, meta }) => ({
    name:    user?.name || 'A Customer',
    product: `Promo Code: ${meta?.code ?? 'SWIFT20'} | Min Order: ₹${meta?.minOrder ?? 999}`,
    amount:  '₹200 off',
  }),

  wishlist_alert: ({ user, meta }) => ({
    name:    user?.name || 'A Customer',
    product: meta?.productName ?? 'Wishlist item',
    amount:  `₹${meta?.newPrice ?? '—'}`,
  }),

  account: ({ user, meta }) => ({
    name:    user?.name || 'A Customer',
    product: meta?.message ?? 'Account activity',
    amount:  '—',
  }),

  system: ({ user, meta }) => ({
    name:    user?.name || 'A Customer',
    product: meta?.message ?? 'System notification',
    amount:  '—',
  }),
};

/**
 * sendNotificationEmail
 * Sends an email to YOUR inbox (owner) via the fixed To Email in the template.
 *
 * @param {string} type  - Notification type e.g. 'payment_success'
 * @param {object} user  - Logged-in user { name, email } (used in {{name}})
 * @param {object} meta  - Context data (orderId, amount, etc.)
 */
export const sendNotificationEmail = async (type, user, meta = {}) => {
  const builder = builders[type];
  if (!builder) {
    console.warn(`[EmailJS] No builder for type: "${type}"`);
    return;
  }

  const templateParams = builder({ user, meta });

  try {
    const res = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
    console.log(`[EmailJS] ✅ "${type}" sent →`, res.status, res.text);
  } catch (err) {
    console.error(`[EmailJS] ❌ Failed for "${type}":`, err);
    // Silent fail – never block the UI
  }
};

export default sendNotificationEmail;
