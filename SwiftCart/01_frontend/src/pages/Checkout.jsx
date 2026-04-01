import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone } from 'lucide-react';
import { clearCart, saveOrderToHistory } from '../store/cartSlice';
import Button from '../components/common/Button';
import './Checkout.css';

const Checkout = () => {
  const { totalPrice } = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [method, setMethod] = useState('upi');

  const finalAmount = (totalPrice * 1.08).toFixed(2);

  const handlePayment = () => {
    // Mock processing delay
    setTimeout(() => {
      // Save order to history array first
      dispatch(saveOrderToHistory({ finalAmount: parseFloat(finalAmount) }));
      dispatch(clearCart());
      navigate('/success');
    }, 1500);
  };

  return (
    <div className="checkout-page animate-fade-in">
      <div className="checkout-container glass-card">
        <h1>Complete Payment</h1>
        <p className="amount-display">To Pay: <span>₹{finalAmount}</span></p>

        <div className="payment-methods">
          <button 
            className={`method-btn ${method === 'upi' ? 'active' : ''}`}
            onClick={() => setMethod('upi')}
          >
            <Smartphone size={24} />
            UPI / QR Code
          </button>
          
          <button 
            className={`method-btn ${method === 'card' ? 'active' : ''}`}
            onClick={() => setMethod('card')}
          >
            <CreditCard size={24} />
            Credit Card
          </button>
        </div>

        <div className="payment-details">
          {method === 'upi' ? (
            <div className="upi-details text-center">
              <div className="mock-qr">
                Scan via any UPI app
              </div>
              <p className="mt-4 text-secondary">swiftcart@upi</p>
            </div>
          ) : (
            <div className="card-details">
              <input type="text" className="input-glass mb-3" placeholder="Card Number (Mock)" />
              <div style={{display: 'flex', gap: '1rem'}}>
                <input type="text" className="input-glass" placeholder="MM/YY" />
                <input type="text" className="input-glass" placeholder="CVV" />
              </div>
            </div>
          )}
        </div>

        <Button variant="gradient" className="w-full mt-4 pay-btn" onClick={handlePayment}>
          Pay ₹{finalAmount}
        </Button>
      </div>
    </div>
  );
};

export default Checkout;
