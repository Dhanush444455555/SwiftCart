import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Button from '../components/common/Button';
import './Success.css';

const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // We could dynamically import js-confetti or install it, 
    // but just CSS animation + simple confetti effect mock here
    const el = document.querySelector('.success-page');
    el.classList.add('animate-success');
  }, []);

  return (
    <div className="success-page">
      <div className="success-card glass-card">
        <CheckCircle className="success-icon bounce" size={80} color="#06B6D4" />
        
        <h1 className="success-title">Order Successful!</h1>
        <p className="success-message">
          Your payment was processed successfully. You can now walk out of the store. No queues, no waiting!
        </p>

        <div className="receipt-mock">
          <div className="receipt-row">
            <span>Transaction ID</span>
            <span className="receipt-value">#SWIFT-{(Math.random()*1000000).toFixed(0)}</span>
          </div>
          <div className="receipt-row">
            <span>Date & Time</span>
            <span className="receipt-value">{new Date().toLocaleString()}</span>
          </div>
        </div>

        <div className="success-actions">
           <Button variant="secondary" onClick={() => navigate('/profile')}>View Receipt</Button>
           <Button variant="gradient" onClick={() => navigate('/')}>Continue Shopping</Button>
        </div>
      </div>
    </div>
  );
};

export default Success;
