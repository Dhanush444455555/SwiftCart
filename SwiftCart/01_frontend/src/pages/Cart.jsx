import React from 'react';
import { useSelector } from 'react-redux';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import './Cart.css';

const Cart = () => {
  const { items, pastOrders } = useSelector(state => state.cart);

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Your Cart</h1>
        <p>{items.length} {items.length === 1 ? 'item' : 'items'} in your basket</p>
      </div>

      <div className="cart-content">
        {/* Items List */}
        <div className="cart-items-list">
          {items.length === 0 ? (
            <div className="cart-items-empty-placeholder" />
          ) : (
            items.map(item => (
              <CartItem key={item.product._id} item={item} />
            ))
          )}
        </div>

        {/* Summary Sidebar */}
        <CartSummary />
      </div>

      {/* Order History */}
      {pastOrders && pastOrders.length > 0 && (
        <div className="order-history-section animate-fade-in" style={{ marginTop: '3rem' }}>
          <div className="cart-header">
            <h2>Order History</h2>
            <p>{pastOrders.length} past purchase{pastOrders.length !== 1 ? 's' : ''}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pastOrders.map(order => (
              <div key={order.id} className="history-card glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #6C63FF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 'bold', letterSpacing: '1px', color: '#a78bfa' }}>{order.id}</span>
                  <span style={{ color: '#64748b', fontSize: '0.85rem' }}>{new Date(order.date).toLocaleDateString()}</span>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.25rem' }}>
                      <span style={{ color: '#94A3B8' }}>{item.quantity}× <span style={{ color: '#e2e8f0' }}>{item.product.name}</span></span>
                      <span style={{ color: '#e2e8f0' }}>₹{(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', fontWeight: '700', fontSize: '1.05rem', color: '#34d399' }}>
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
