import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard, Smartphone, Copy, CheckCircle,
  ShieldCheck, Zap, Wallet, ExternalLink,
} from 'lucide-react';
import { clearCart, saveOrderToHistory } from '../store/cartSlice';
import './Checkout.css';

const BACKEND      = 'http://localhost:5000';
const MERCHANT_UPI = '8904062827@ibl';
const MERCHANT_NAME= 'SwiftCart';

// QR that encodes the full UPI deep link (amount pre-filled)
const makeUpiLink = (amount) =>
  `upi://pay?pa=${MERCHANT_UPI}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent('SwiftCart Order')}`;

const makeQrUrl = (upiStr) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=12&data=${encodeURIComponent(upiStr)}`;

// App-specific deep links
const APP_LINKS = (amount) => [
  { label: 'PhonePe', emoji: '📱', color: '#7B3FE4', link: `phonepe://pay?pa=${MERCHANT_UPI}&pn=SwiftCart&am=${amount}&cu=INR` },
  { label: 'GPay',    emoji: '💳', color: '#34d399', link: `tez://upi/pay?pa=${MERCHANT_UPI}&pn=SwiftCart&am=${amount}&cu=INR` },
  { label: 'Paytm',   emoji: '🔵', color: '#38bdf8', link: `paytmmp://pay?pa=${MERCHANT_UPI}&pn=SwiftCart&am=${amount}&cu=INR` },
];

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload  = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

const Checkout = () => {
  const { totalPrice } = useSelector((s) => s.cart);
  const { user }       = useSelector((s) => s.auth);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const [method,   setMethod]  = useState('upi');
  const [copied,   setCopied]  = useState(false);
  const [paying,   setPaying]  = useState(false);
  const [waiting,  setWaiting] = useState(false); // "waiting for user to pay in app"
  const [rzpReady, setRzpReady]= useState(true);  // false if backend not configured

  const finalAmount = (totalPrice * 1.08).toFixed(2);
  const upiLink     = makeUpiLink(finalAmount);
  const qrUrl       = makeQrUrl(upiLink);

  /* ── Confirm order after payment ── */
  const finishOrder = () => {
    dispatch(saveOrderToHistory({ finalAmount: parseFloat(finalAmount) }));
    dispatch(clearCart());
    navigate('/success');
  };

  /* ── Razorpay flow ── */
  const handleRazorpayPay = async () => {
    setPaying(true);
    const loaded = await loadRazorpay();
    if (!loaded) { setPaying(false); setRzpReady(false); return; }

    let orderData;
    try {
      const res = await fetch(`${BACKEND}/api/payment/create-order`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ amount: finalAmount }),
      });
      orderData = await res.json();
      if (!res.ok || !orderData.order_id) throw new Error(orderData.message || 'Order creation failed');
    } catch {
      // ── Razorpay not configured → fall back to QR/UPI ──
      setPaying(false);
      setRzpReady(false);
      return;
    }

    const options = {
      key:         orderData.key_id,
      amount:      orderData.amount,
      currency:    orderData.currency,
      name:        'SwiftCart',
      description: 'Order Payment',
      order_id:    orderData.order_id,
      prefill:     { name: user?.name || '', email: user?.email || '' },
      theme:       { color: '#6C63FF' },
      handler: async (response) => {
        try {
          const vRes = await fetch(`${BACKEND}/api/payment/verify`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            }),
          });
          const vData = await vRes.json();
          if (vData.success) finishOrder();
        } catch { /* ignore */ }
        setPaying(false);
      },
      modal: { ondismiss: () => setPaying(false) },
    };
    new window.Razorpay(options).open();
  };

  /* ── Open UPI app (mobile) ── */
  const openUpiApp = (link) => {
    window.location.href = link;
    setWaiting(true);
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(MERCHANT_UPI).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  /* ── QR / UPI panel (always shown, primary on fallback) ── */
  const UpiPanel = () => (
    <div className="ck-upi-panel">

      {/* ── If Razorpay is configured, show its button first ── */}
      {rzpReady && (
        <>
          <button className="ck-rzp-btn" onClick={handleRazorpayPay} disabled={paying}>
            {paying
              ? <><span className="ck-spinner" /> Opening payment…</>
              : <><Wallet size={18} /> Pay ₹{finalAmount} via Razorpay</>}
          </button>
          <div className="ck-divider"><span>or pay directly via UPI</span></div>
        </>
      )}

      {/* ── QR Code ── */}
      <div className="ck-qr-wrap">
        <img src={qrUrl} alt="Scan to pay" className="ck-qr-img"
             onError={(e) => { e.target.style.display = 'none'; }} />
        <div className="ck-qr-badge">
          <Zap size={11} /> ₹{finalAmount} pre-filled · scan from phone
        </div>
      </div>

      {/* Supported apps */}
      <div className="ck-apps-row">
        <span className="ck-apps-label">Scan with</span>
        {['PhonePe', 'GPay', 'Paytm', 'BHIM'].map((a) => (
          <span key={a} className="ck-app-chip">{a}</span>
        ))}
      </div>

      {/* Quick-launch buttons (mobile) */}
      <div className="ck-quick-apps">
        {APP_LINKS(finalAmount).map(({ label, emoji, color, link }) => (
          <button key={label} className="ck-app-btn" style={{ '--app-color': color }}
                  onClick={() => openUpiApp(link)}>
            <span className="ck-app-icon">{emoji}</span>
            {label}
          </button>
        ))}
      </div>

      {/* UPI ID copy */}
      <div className="ck-upi-id-row">
        <span className="ck-upi-id-label">UPI ID</span>
        <span className="ck-upi-id-val">{MERCHANT_UPI}</span>
        <button className="ck-copy-btn" onClick={copyUpiId}>
          {copied ? <CheckCircle size={13} color="#34d399" /> : <Copy size={13} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* After opening the UPI app */}
      {waiting ? (
        <div className="ck-waiting-box">
          <span className="ck-spinner-lg" />
          <div>
            <p className="ck-waiting-title">Waiting for payment…</p>
            <p className="ck-waiting-sub">Complete payment in your UPI app, then tap below</p>
          </div>
          <button className="ck-paid-btn" onClick={finishOrder}>✅ I've Paid</button>
        </div>
      ) : (
        /* Direct "Pay Now" → opens system UPI chooser */
        <button className="ck-pay-btn" onClick={() => openUpiApp(upiLink)}>
          <Wallet size={17} /> Pay ₹{finalAmount} Now
          <span className="ck-pay-sub">Opens your UPI app</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="checkout-page animate-fade-in">
      <div className="checkout-container glass-card">

        {/* Header */}
        <div className="ck-header">
          <ShieldCheck size={20} color="#34d399" />
          <h1>Complete Payment</h1>
        </div>

        {/* Amount */}
        <div className="ck-amount-row">
          <span className="ck-amount-label">Total (incl. 8% tax)</span>
          <span className="ck-amount-value">₹{finalAmount}</span>
        </div>

        {/* Method tabs */}
        <div className="payment-methods">
          <button className={`method-btn ${method === 'upi' ? 'active' : ''}`} onClick={() => setMethod('upi')}>
            <Smartphone size={18} /> UPI / QR Code
          </button>
          <button className={`method-btn ${method === 'card' ? 'active' : ''}`} onClick={() => setMethod('card')}>
            <CreditCard size={18} /> Credit / Debit Card
          </button>
        </div>

        {method === 'upi'  && <UpiPanel />}

        {method === 'card' && (
          <div className="card-details">
            <p className="ck-rzp-note">Enter card details — payment secured by Razorpay.</p>
            <input type="text" className="input-glass mb-3" placeholder="Card Number" maxLength={19} />
            <div className="ck-card-row">
              <input type="text" className="input-glass" placeholder="MM / YY" maxLength={5} />
              <input type="text" className="input-glass" placeholder="CVV" maxLength={3} />
            </div>
            <input type="text" className="input-glass mt-3" placeholder="Name on Card" />
            <button className="ck-rzp-btn" style={{ marginTop: '1rem' }}
                    onClick={handleRazorpayPay} disabled={paying}>
              {paying ? <><span className="ck-spinner" /> Processing…</> : <>Pay ₹{finalAmount}</>}
            </button>
          </div>
        )}

        <p className="ck-secure-note">
          <ShieldCheck size={11} /> Secured · Payments go to {MERCHANT_UPI}
        </p>
      </div>
    </div>
  );
};

export default Checkout;
