import React, { useState } from 'react';
import { MessageSquare, User, Phone, Star, Send, CheckCircle } from 'lucide-react';
import './Feedback.css';

const RATINGS = [1, 2, 3, 4, 5];

const RATING_LABELS = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Great',
  5: 'Excellent',
};

const Feedback = () => {
  const [form, setForm]         = useState({ name: '', phone: '', message: '' });
  const [rating, setRating]     = useState(0);
  const [hovered, setHovered]   = useState(0);
  const [loading, setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]       = useState('');

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      setError('All fields are required.');
      return;
    }
    if (rating === 0) {
      setError('Please select a star rating.');
      return;
    }
    const phoneRegex = /^[0-9+\-\s()]{7,15}$/;
    if (!phoneRegex.test(form.phone.trim())) {
      setError('Please enter a valid phone number.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        access_key: '50939d9b-5291-47cf-849b-aab464731a08',
        subject: `SwiftCart Feedback from ${form.name}`,
        from_name: 'SwiftCart Feedback',
        name: form.name,
        phone: form.phone,
        rating: `${rating} / 5 — ${RATING_LABELS[rating]}`,
        message: form.message,
      };

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Submission failed.');
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ name: '', phone: '', message: '' });
    setRating(0);
    setHovered(0);
    setSubmitted(false);
    setError('');
  };

  if (submitted) {
    return (
      <div className="feedback-page">
        <div className="feedback-success glass-card animate-fade-in">
          <div className="success-icon-wrap">
            <CheckCircle className="success-icon" />
          </div>
          <h2 className="success-title">Thank You!</h2>
          <p className="success-msg">
            Your feedback has been received. We truly appreciate you taking the time to share your shopping experience with us.
          </p>
          <div className="success-rating-display">
            {RATINGS.map(s => (
              <Star key={s} size={20} className={s <= rating ? 'star-filled' : 'star-empty'} fill={s <= rating ? '#FBBF24' : 'none'} />
            ))}
            <span className="success-rating-label">{RATING_LABELS[rating]}</span>
          </div>
          <button className="btn-gradient feedback-reset-btn" onClick={handleReset}>
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-page">
      {/* Background blobs */}
      <div className="fb-blob fb-blob-1" />
      <div className="fb-blob fb-blob-2" />

      <div className="feedback-wrapper animate-fade-in">
        {/* Header */}
        <div className="feedback-header">
          <div className="feedback-icon-wrap">
            <MessageSquare className="feedback-icon" />
          </div>
          <h1 className="feedback-title">Share Your Experience</h1>
          <p className="feedback-subtitle">
            Your opinion helps us make SwiftCart better for everyone.
          </p>
        </div>

        {/* Card */}
        <div className="feedback-card glass-card">
          <form className="feedback-form" onSubmit={handleSubmit} noValidate>

            {/* Name */}
            <div className="fb-field">
              <label htmlFor="fb-name" className="fb-label">
                <User size={14} /> Full Name
              </label>
              <input
                id="fb-name"
                name="name"
                type="text"
                className="input-glass fb-input"
                placeholder="e.g. Dhanush Kumar"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>

            {/* Phone */}
            <div className="fb-field">
              <label htmlFor="fb-phone" className="fb-label">
                <Phone size={14} /> Phone Number
              </label>
              <input
                id="fb-phone"
                name="phone"
                type="tel"
                className="input-glass fb-input"
                placeholder="e.g. +91 98765 43210"
                value={form.phone}
                onChange={handleChange}
                autoComplete="tel"
              />
            </div>

            {/* Star Rating */}
            <div className="fb-field">
              <label className="fb-label">
                <Star size={14} /> Overall Rating
              </label>
              <div className="star-row">
                {RATINGS.map(s => (
                  <button
                    key={s}
                    type="button"
                    className={`star-btn ${(hovered || rating) >= s ? 'active' : ''}`}
                    onMouseEnter={() => setHovered(s)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => setRating(s)}
                    aria-label={`Rate ${s} out of 5`}
                  >
                    <Star size={28} fill={(hovered || rating) >= s ? '#FBBF24' : 'none'} />
                  </button>
                ))}
                {(hovered || rating) > 0 && (
                  <span className="rating-label-text">
                    {RATING_LABELS[hovered || rating]}
                  </span>
                )}
              </div>
            </div>

            {/* Message */}
            <div className="fb-field">
              <label htmlFor="fb-message" className="fb-label">
                <MessageSquare size={14} /> Your Feedback
              </label>
              <textarea
                id="fb-message"
                name="message"
                className="input-glass fb-textarea"
                placeholder="Tell us about your shopping experience — what you loved, what we can improve..."
                value={form.message}
                onChange={handleChange}
                rows={4}
              />
              <span className="char-count">{form.message.length} / 500</span>
            </div>

            {/* Error */}
            {error && (
              <div className="fb-error">
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="btn-gradient fb-submit"
              disabled={loading}
            >
              {loading ? (
                <span className="fb-spinner" />
              ) : (
                <>
                  <Send size={17} />
                  Submit Feedback
                </>
              )}
            </button>
          </form>
        </div>

        {/* Privacy note */}
        <p className="fb-privacy">
          🔒 Your information is private and will only be used to improve your experience.
        </p>
      </div>
    </div>
  );
};

export default Feedback;
