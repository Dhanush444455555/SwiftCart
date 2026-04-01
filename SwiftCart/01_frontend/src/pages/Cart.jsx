import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import CartItem from '../components/common/CartItem';
import Button from '../components/common/Button';
import './Cart.css';

const Cart = () => {
  const { items, totalPrice, pastOrders } = useSelector(state => state.cart);
  const navigate = useNavigate();

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Your Cart</h1>
        <p>{items.length} items</p>
      </div>

      <div className="cart-content">
        <div className="cart-items-list">
          {items.length > 0 ? (
            items.map(item => <CartItem key={item.product._id} item={item} />)
          ) : (
             <div className="empty-cart glass-card">
               <ShoppingBag size={48} className="empty-icon" />
               <h2>Your cart is empty</h2>
               <p>Looks like you haven't added anything yet.</p>
               <Button onClick={() => navigate('/search')} className="mt-4">
                 Start Shopping
               </Button>
             </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-summary glass-card">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax (8%)</span>
              <span>₹{(totalPrice * 0.08).toFixed(2)}</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total-row">
              <span>Total</span>
              <span>₹{(totalPrice * 1.08).toFixed(2)}</span>
            </div>
            
            <Button 
              className="checkout-btn" 
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout <ArrowRight size={20} />
            </Button>
            
            <p className="secure-checkout-msg">
              Proceed without queues. Secure checkout powered by SwiftCart.
            </p>
          </div>
        )}
      </div>

      {pastOrders && pastOrders.length > 0 && (
        <div className="order-history-section animate-fade-in" style={{ marginTop: '3rem' }}>
          <div className="cart-header">
            <h2>Order History</h2>
            <p>{pastOrders.length} past purchases</p>
          </div>
          <div className="history-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pastOrders.map(order => (
              <div key={order.id} className="history-card glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 'bold', letterSpacing: '1px' }}>{order.id}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{new Date(order.date).toLocaleDateString()}</span>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{item.quantity}x <span style={{ color: 'var(--text-primary)' }}>{item.product.name}</span></span>
                      <span>₹{(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', fontWeight: 'bold', fontSize: '1.1rem', color: '#34d399' }}>
                  Paid: ₹{order.totalPrice.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
