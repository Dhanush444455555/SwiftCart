import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LogIn, ShieldCheck, User, Eye, EyeOff } from 'lucide-react';
import { login } from '../store/authSlice';
import apiClient from '../services/apiClient';
import './Login.css';

const DEMO = {
  admin:    { email: 'admin@swiftcart.com',  password: 'admin123' },
  consumer: { email: 'user@swiftcart.com',   password: 'user123'  },
};

const Login = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const [tab, setTab]           = useState('consumer'); // 'consumer' | 'admin'
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const fillDemo = () => {
    setEmail(DEMO[tab].email);
    setPassword(DEMO[tab].password);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Handle demo accounts locally — no backend needed
      if (email === 'admin@swiftcart.com' && password === 'admin123') {
        dispatch(login({ user: { id: 'admin-id', name: 'Admin User', email, role: 'admin' }, token: 'mock-admin-token' }));
        navigate('/admin');
        return;
      }
      if (email === 'user@swiftcart.com' && password === 'user123') {
        dispatch(login({ user: { id: 'user-id', name: 'Demo User', email, role: 'user' }, token: 'mock-jwt-token' }));
        navigate('/');
        return;
      }
      // Real login via backend
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      dispatch(login({ user: data.user, token: data.token }));
      navigate(data.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.message);
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
        <p className="login-sub">Sign in to your account</p>

        {/* Role Tabs */}
        <div className="login-tabs">
          <button
            className={`login-tab ${tab === 'consumer' ? 'active' : ''}`}
            onClick={() => { setTab('consumer'); setEmail(''); setPassword(''); setError(''); }}
          >
            <User size={15} /> Consumer
          </button>
          <button
            className={`login-tab ${tab === 'admin' ? 'active' : ''}`}
            onClick={() => { setTab('admin'); setEmail(''); setPassword(''); setError(''); }}
          >
            <ShieldCheck size={15} /> Admin
          </button>
        </div>

        {/* Demo credentials notice */}
        <div className="login-demo-notice" onClick={fillDemo}>
          <span>🎯 Demo: click to fill {tab} credentials</span>
          <span className="demo-fill-btn">Auto-fill</span>
        </div>

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label>Email</label>
            <input
              type="email"
              className="input-glass"
              placeholder={DEMO[tab].email}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="login-field">
            <label>Password</label>
            <div className="pw-wrap">
              <input
                type={showPw ? 'text' : 'password'}
                className="input-glass"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button type="button" className="pw-toggle" onClick={() => setShowPw(v => !v)}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && <p className="login-error">⚠️ {error}</p>}

          <button type="submit" className="btn-gradient login-submit-btn" disabled={loading}>
            {loading ? <span className="login-spinner" /> : <><LogIn size={17} /> Sign In</>}
          </button>
        </form>

        <p className="login-footer">
          Don't have an account?{' '}
          <span className="login-link" onClick={() => navigate('/register')}>Register</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
