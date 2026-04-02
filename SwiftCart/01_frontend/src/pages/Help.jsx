import React, { useState } from 'react';
import {
  HelpCircle, ChevronDown, ChevronUp, Search,
  MessageSquare, Phone, Mail, Package, CreditCard,
  RefreshCw, ShieldCheck, Wifi, ScanLine, Star, Send
} from 'lucide-react';
import './Help.css';

const faqs = [
  {
    category: 'Orders',
    icon: <Package size={18} />,
    items: [
      {
        q: 'How do I track my order?',
        a: 'Go to My Profile → Order History. Each order shows its status. Once shipped, you\'ll see a tracking ID updated in real time.',
      },
      {
        q: 'Can I cancel an order after placing it?',
        a: 'Orders can be cancelled within 30 minutes of placement. After that, please contact our support team who will assist you with the process.',
      },
      {
        q: 'What if I received a wrong item?',
        a: 'Sorry about that! Raise a return request from Order History → View Details → Report Issue. We\'ll arrange a free pickup and replacement within 48 hours.',
      },
    ],
  },
  {
    category: 'Payments',
    icon: <CreditCard size={18} />,
    items: [
      {
        q: 'Which payment methods are accepted?',
        a: 'We accept UPI, debit/credit cards (Visa, Mastercard, Rupay), net banking, and wallet payments via Razorpay — all secured with 256-bit encryption.',
      },
      {
        q: 'Why was my payment declined?',
        a: 'Payment failures can occur due to insufficient balance, incorrect OTP, or bank timeout. Try again or use a different payment method. Your money is never debited on failed transactions.',
      },
      {
        q: 'When will I get my refund?',
        a: 'Refunds are processed within 2–5 business days for UPI/cards and 5–7 days for net banking. You\'ll receive an email confirmation when the refund is initiated.',
      },
    ],
  },
  {
    category: 'Returns & Refunds',
    icon: <RefreshCw size={18} />,
    items: [
      {
        q: 'What is SwiftCart\'s return policy?',
        a: 'We offer a 7-day return window for most products. Items must be unused, in original packaging. Some categories like groceries and personal care are non-returnable.',
      },
      {
        q: 'How do I initiate a return?',
        a: 'Go to Profile → Order History → View Details → Request Return. Select the items, provide a reason, and submit. Our team will review within 24 hours.',
      },
    ],
  },
  {
    category: 'Barcode Scanner',
    icon: <ScanLine size={18} />,
    items: [
      {
        q: 'How does the barcode scanner work?',
        a: 'SwiftCart\'s scanner reads product barcodes instantly and adds them to your cart. Use it for fast, queue-free shopping in partnered stores. Allow camera access when prompted.',
      },
      {
        q: 'What if a product is not found after scanning?',
        a: 'If the barcode isn\'t in our database, you\'ll see a fallback option to search manually or report the missing product. Our team updates the database daily.',
      },
    ],
  },
  {
    category: 'Account & Security',
    icon: <ShieldCheck size={18} />,
    items: [
      {
        q: 'How do I change my password?',
        a: 'Go to Profile → Settings → Security → Change Password. You\'ll receive an OTP on your registered email to confirm the change.',
      },
      {
        q: 'Is my data secure?',
        a: 'Yes. All user data is encrypted at rest and in transit. We never share personal data with third parties. Our systems are GDPR and IT Act compliant.',
      },
      {
        q: 'How do I delete my account?',
        a: 'Go to Profile → Settings → Delete Account. This permanently deletes all your data. This action cannot be undone.',
      },
    ],
  },
  {
    category: 'App & Connectivity',
    icon: <Wifi size={18} />,
    items: [
      {
        q: 'The app is loading slowly. What should I do?',
        a: 'Try refreshing the page or clearing browser cache. Make sure you have a stable internet connection. If the issue persists, contact support.',
      },
      {
        q: 'Is SwiftCart available as a mobile app?',
        a: 'SwiftCart is currently available as a progressive web app (PWA). Install it from your browser for an app-like experience. A native app is coming soon!',
      },
    ],
  },
];

const Help = () => {
  const [searchQuery, setSearchQuery]   = useState('');
  const [openIndex, setOpenIndex]       = useState(null);
  const [feedbackMsg, setFeedbackMsg]   = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  const toggle = (key) => setOpenIndex(prev => prev === key ? null : key);

  const filtered = faqs.map(cat => ({
    ...cat,
    items: cat.items.filter(
      item =>
        !searchQuery ||
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(cat => cat.items.length > 0);

  const handleSendFeedback = (e) => {
    e.preventDefault();
    if (!feedbackMsg.trim()) return;
    setFeedbackSent(true);
    setFeedbackMsg('');
    setTimeout(() => setFeedbackSent(false), 5000);
  };

  return (
    <div className="help-page animate-fade-in">

      {/* ── Hero ── */}
      <div className="help-hero glass-card">
        <HelpCircle size={40} color="#fff" />
        <h1>Help & Support</h1>
        <p>Find answers, contact us, or leave feedback — we're here 24/7.</p>

        <div className="help-search-wrap">
          <Search size={17} className="help-search-icon" />
          <input
            className="help-search-input"
            type="text"
            placeholder="Search FAQs — e.g. refund, scanner, order..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ── Contact cards ── */}
      <div className="help-contact-row">
        <div className="help-contact-card glass-card">
          <MessageSquare size={26} color="#fff" />
          <h3>Live Chat</h3>
          <p>Chat with our support team instantly. Available 9 AM – 10 PM IST.</p>
          <button className="help-contact-btn">Start Chat</button>
        </div>
        <div className="help-contact-card glass-card">
          <Mail size={26} color="#fff" />
          <h3>Email Us</h3>
          <p>Send us a detailed query and we'll respond within 24 hours.</p>
          <a href="mailto:support@swiftcart.com" className="help-contact-btn">
            support@swiftcart.com
          </a>
        </div>
        <div className="help-contact-card glass-card">
          <Phone size={26} color="#fff" />
          <h3>Call Support</h3>
          <p>Talk to a human. Toll-free number available 24/7 for urgent issues.</p>
          <a href="tel:18001234567" className="help-contact-btn">1800-123-4567</a>
        </div>
      </div>

      {/* ── FAQs ── */}
      <div className="help-faq-section">
        <h2 className="help-section-title">Frequently Asked Questions</h2>

        {filtered.length === 0 && (
          <div className="help-no-results">
            <Search size={36} color="#333" />
            <p>No results for "<strong>{searchQuery}</strong>". Try a different keyword.</p>
          </div>
        )}

        {filtered.map((cat) => (
          <div key={cat.category} className="help-faq-category">
            <div className="help-faq-cat-title">
              {cat.icon}
              <span>{cat.category}</span>
            </div>
            {cat.items.map((item, idx) => {
              const key = `${cat.category}-${idx}`;
              const isOpen = openIndex === key;
              return (
                <div key={key} className={`help-faq-item ${isOpen ? 'open' : ''}`}>
                  <button className="help-faq-question" onClick={() => toggle(key)}>
                    <span>{item.q}</span>
                    {isOpen ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
                  </button>
                  {isOpen && <div className="help-faq-answer">{item.a}</div>}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* ── Feedback ── */}
      <div className="help-feedback glass-card">
        <Star size={24} color="#fff" />
        <h2>Was this helpful?</h2>
        <p>Leave us a message — your feedback helps us improve SwiftCart.</p>
        {feedbackSent ? (
          <div className="help-feedback-success">
            ✅ Thank you! Your feedback has been received.
          </div>
        ) : (
          <form className="help-feedback-form" onSubmit={handleSendFeedback}>
            <textarea
              className="help-feedback-input"
              rows={3}
              placeholder="Tell us how we can improve..."
              value={feedbackMsg}
              onChange={e => setFeedbackMsg(e.target.value)}
            />
            <button type="submit" className="help-feedback-btn">
              <Send size={15} /> Send Feedback
            </button>
          </form>
        )}
      </div>

    </div>
  );
};

export default Help;
