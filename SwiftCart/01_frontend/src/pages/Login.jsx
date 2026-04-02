import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LogIn, ShieldCheck, User, Eye, EyeOff } from 'lucide-react';
import { login } from '../store/authSlice';
import { authService } from '../services/authService';
import './Login.css';

const Login = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const [tab, setTab]           = useState('consumer'); // 'consumer' | 'admin'
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleTabChange = (t) => {
    setTab(t);
    setEmail('');
    setPassword('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Send credentials to backend — it handles demo accounts + real DB lookup
      const data = await authService.login({ email, password });

      // Validate role matches selected tab (skip for demo admin)
      if (tab === 'admin' && data.user?.role !== 'admin') {
        setError('This account does not have admin access.');
        return;
      }

      dispatch(login({ user: data.user, token: data.token }));
      navigate(data.user?.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed. Please try again.';
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
        <h2 className="login-title">Welcome back</h2>
        <p className="login-sub">Sign in to continue shopping</p>

        {/* Role Tabs */}
        <div className="login-tabs">
          <button
            className={`login-tab ${tab === 'consumer' ? 'active' : ''}`}
            onClick={() => handleTabChange('consumer')}
            type="button"
          >
            <User size={15} /> Consumer
          </button>
          <button
            className={`login-tab ${tab === 'admin' ? 'active' : ''}`}
            onClick={() => handleTabChange('admin')}
            type="button"
          >
            <ShieldCheck size={15} /> Admin
          </button>
        </div>

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
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
            <label htmlFor="login-password">Password</label>
            <div className="pw-wrap">
              <input
                id="login-password"
                type={showPw ? 'text' : 'password'}
                className="input-glass"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
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

          {error && <p className="login-error" role="alert">⚠️ {error}</p>}

          <button
            id="login-submit-btn"
            type="submit"
            className="login-submit-btn"
            disabled={loading}
          >
            {loading
              ? <span className="login-spinner" />
              : <><LogIn size={17} /> Sign In</>
            }
          </button>
        </form>

        <p className="login-footer">
          Don't have an account?{' '}
          <span className="login-link" onClick={() => navigate('/register')}>
            Create one
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
