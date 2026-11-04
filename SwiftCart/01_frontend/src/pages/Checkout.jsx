import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard, Smartphone, Copy, CheckCircle,
  ShieldCheck, Zap, Wallet,
} from 'lucide-react';
import { clearCart, saveOrderToHistory } from '../store/cartSlice';
import { decreaseStock } from '../store/productSlice';
import { notifyPaymentSuccess, notifyOrderPlaced } from '../store/slices/notificationSlice';
import { orderService } from '../services/orderService';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import './Checkout.css';

const MERCHANT_UPI  = '8904062827@ibl';
const MERCHANT_NAME = 'SwiftCart';

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
  const { items, totalPrice } = useSelector(state => state.cart);
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [method,   setMethod]  = useState('upi');
  const [copied,   setCopied]  = useState(false);
  const [paying,   setPaying]  = useState(false);
  const [waiting,  setWaiting] = useState(false);
  const [rzpReady, setRzpReady]= useState(true);

  const finalAmount = (totalPrice * 1.08).toFixed(2);
  const upiLink     = makeUpiLink(finalAmount);
  const qrUrl       = makeQrUrl(upiLink);

  /* ── Confirm order after payment ── */
  const finishOrder = async () => {
    const orderId   = `SWIFT-${Math.floor(Math.random() * 900000 + 100000)}`;
    const itemCount = items.length;

    // Call backend to decrease stock in MySQL
    try {
      await orderService.updateStock(
        items.map(i => ({ productId: i.product._id ?? i.product.id, quantity: i.quantity }))
      );
    } catch (e) {
      console.warn("Stock update warning:", e?.message);
    }

    // Update stock and save order in Redux
    dispatch(decreaseStock(items.map(i => ({ productId: i.product._id ?? i.product.id, quantity: i.quantity }))));
    dispatch(saveOrderToHistory({ finalAmount: parseFloat(finalAmount) }));

    // Fire notifications — appear in navbar bell
    dispatch(notifyPaymentSuccess({ orderId, amount: finalAmount, method: method === 'upi' ? 'UPI' : 'Card' }));
    dispatch(notifyOrderPlaced({ orderId, itemCount, total: finalAmount }));

    dispatch(clearCart());
    toast.success('Payment Successful! Order placed.');
    navigate('/success');
  };

  /* ── Razorpay flow ── */
  const handleRazorpayPay = async () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setPaying(true);
    const loaded = await loadRazorpay();
    if (!loaded) {
      setPaying(false);
      setRzpReady(false);
      toast.error('Could not load Razorpay SDK');
      return;
    }

    try {
      // 1. Create Order on Server
      const orderItems = items.map(i => ({
         product: i.product._id ?? i.product.id,
         quantity: i.quantity,
         price: i.product.price
      }));

      const res = await orderService.createRazorpayOrder({ items: orderItems, totalAmount: finalAmount });
      const razorpayOrder = res?.razorpayOrder || res?.data?.razorpayOrder;
      if (!razorpayOrder) {
        throw new Error("Could not initialize payment order");
      }
      
      const options = {
        key:         process.env.REACT_APP_RAZORPAY_KEY || 'rzp_test_mockkey',
        amount:      razorpayOrder.amount,
        currency:    razorpayOrder.currency,
        name:        'SwiftCart Smart Checkout',
        description: 'Zero Queue Checkout Payment',
        order_id:    razorpayOrder.id,
        prefill:     { name: user?.name || '', email: user?.email || '', contact: "9999999999" },
        theme:       { color: '#6C63FF' },
        handler: async (response) => {
          try {
            // Verify Payment
            const vRes = await orderService.verifyPayment({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            });
            if (vRes?.order || vRes?.status === 200 || vRes?.message) {
              await finishOrder();
            }
          } catch (err) { 
            toast.error("Payment verification failed");
          }
          setPaying(false);
        },
        modal: { ondismiss: () => setPaying(false) },
      };
      new window.Razorpay(options).open();

    } catch (err) {
      setPaying(false);
      setRzpReady(false);
      toast.error(err.message || 'Razorpay initialization failed, using UPI fallback.');
    }
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

  /* ── QR / UPI panel ── */
  const UpiPanel = () => (
    <div className="ck-upi-panel">
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

      <div className="ck-qr-wrap">
        <img src={qrUrl} alt="Scan to pay" className="ck-qr-img"
             onError={(e) => { e.target.style.display = 'none'; }} />
        <div className="ck-qr-badge">
          <Zap size={11} /> ₹{finalAmount} pre-filled · scan from phone
        </div>
      </div>

      <div className="ck-apps-row">
        <span className="ck-apps-label">Scan with</span>
        {['PhonePe', 'GPay', 'Paytm', 'BHIM'].map((a) => (
          <span key={a} className="ck-app-chip">{a}</span>
        ))}
      </div>

      <div className="ck-quick-apps">
        {APP_LINKS(finalAmount).map(({ label, emoji, color, link }) => (
          <button key={label} className="ck-app-btn" style={{ '--app-color': color }}
                  onClick={() => openUpiApp(link)}>
            <span className="ck-app-icon">{emoji}</span>
            {label}
          </button>
        ))}
      </div>

      <div className="ck-upi-id-row">
        <span className="ck-upi-id-label">UPI ID</span>
        <span className="ck-upi-id-val">{MERCHANT_UPI}</span>
        <button className="ck-copy-btn" onClick={copyUpiId}>
          {copied ? <CheckCircle size={13} color="#34d399" /> : <Copy size={13} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

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
        <button className="ck-pay-btn" onClick={() => openUpiApp(upiLink)}>
          <Wallet size={17} /> Pay ₹{finalAmount} Now
          <span className="ck-pay-sub">Opens your UPI app</span>
        </button>
      )}

      {/* Instant Checkout Button (Always Works for seamless testing/demo) */}
      <button
        onClick={finishOrder}
        className="btn-gradient w-full py-3 mt-4 font-bold flex justify-center items-center gap-2"
        style={{background:'linear-gradient(90deg,#34d399,#06B6D4)', borderRadius: '12px', border:'none', color:'#fff', cursor:'pointer'}}
      >
        <Zap size={17} /> Instant Checkout & Print Receipt
      </button>
    </div>
  );

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
         <h2 className="text-2xl font-bold mb-4">Cart is Empty</h2>
         <button onClick={() => navigate('/scan')} className="btn-gradient px-6 py-2">Go to Scanner</button>
      </div>
    );
  }

  return (
    <div className="checkout-page animate-fade-in">
      <div className="checkout-container glass-card">
        <div className="ck-header">
          <ShieldCheck size={20} color="#34d399" />
          <h1>Complete Payment</h1>
        </div>
        <div className="ck-amount-row">
          <span className="ck-amount-label">Total (incl. 8% tax)</span>
          <span className="ck-amount-value">₹{finalAmount}</span>
        </div>
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
