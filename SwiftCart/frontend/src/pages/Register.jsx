import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import { login } from '../store/authSlice';
import { authService } from '../services/authService';
import './Login.css';  // Reuse the same dark theme styles
import './Register.css';

const Register = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const data = await authService.register({ name, email, password });
      // Auto-login after register
      dispatch(login({ user: data.user, token: data.token }));
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card glass-card animate-fade-in">

        {/* Logo */}
        <div className="login-logo">
          <span className="login-logo-text">SwiftCart</span>
        </div>
        <h2 className="login-title">Create Account</h2>
        <p className="login-sub">Join SwiftCart and start shopping smarter</p>

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="reg-name">Full Name</label>
            <input
              id="reg-name"
              type="text"
              className="input-glass"
              placeholder="John Doe"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>

          <div className="login-field">
            <label htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              type="email"
              className="input-glass"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="login-field">
            <label htmlFor="reg-password">Password</label>
            <div className="pw-wrap">
              <input
                id="reg-password"
                type={showPw ? 'text' : 'password'}
                className="input-glass"
                placeholder="Min. 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="pw-toggle"
                onClick={() => setShowPw(v => !v)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="reg-confirm">Confirm Password</label>
            <input
              id="reg-confirm"
              type={showPw ? 'text' : 'password'}
              className="input-glass"
              placeholder="Re-enter password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          {/* Password strength bar */}
          {password && (
            <div className="reg-strength-bar">
              <div
                className={`reg-strength-fill ${
                  password.length < 6 ? 'weak' :
                  password.length < 10 ? 'medium' : 'strong'
                }`}
                style={{
                  width: password.length < 6 ? '33%' :
                         password.length < 10 ? '66%' : '100%'
                }}
              />
              <span className="reg-strength-label">
                {password.length < 6 ? 'Weak' :
                 password.length < 10 ? 'Medium' : 'Strong'}
              </span>
            </div>
          )}

          {error && <p className="login-error" role="alert">⚠️ {error}</p>}

          <button
            id="register-submit-btn"
            type="submit"
            className="login-submit-btn"
            disabled={loading}
          >
            {loading
              ? <span className="login-spinner" />
              : <><UserPlus size={17} /> Create Account</>
            }
          </button>
        </form>

        <p className="login-footer">
          Already have an account?{' '}
          <span className="login-link" onClick={() => navigate('/login')}>
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
