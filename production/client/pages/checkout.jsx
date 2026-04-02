'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useCartStore, useAuthStore } from '@/lib/store';
import apiClient from '@/lib/apiClient';

export default function Checkout() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
  });

  if (!user) {
    return router.push('/login');
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg mb-6">Your cart is empty</p>
        <Link href="/products" className="btn-primary inline-block">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const totalAmount = getTotalPrice() * 1.18; // Including 18% tax

  const handleAddressChange = (e) => {
    setDeliveryAddress({
      ...deliveryAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handlePayment = async () => {
    if (!deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.zipCode) {
      toast.error('Please fill in all address fields');
      return;
    }

    setLoading(true);

    try {
      // Create order on backend
      const orderResponse = await apiClient.post('/orders', {
        items: items.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        })),
        deliveryAddress,
        notes: 'Order placed via SwiftCart',
      });

      const orderId = orderResponse.data.order._id;

      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
          amount: Math.round(totalAmount * 100), // Amount in paise
          currency: 'INR',
          name: 'SwiftCart',
          description: `Order ${orderId}`,
          order_id: orderId,
          handler: async (response) => {
            try {
              // Update order payment status
              await apiClient.patch(`/orders/${orderId}/payment`, {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                paymentStatus: 'completed',
              });

              clearCart();
              toast.success('Payment successful!');
              router.push(`/order-success?orderId=${orderId}`);
            } catch (error) {
              toast.error('Failed to update payment status');
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: deliveryAddress.phone,
          },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      };
      document.head.appendChild(script);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card mb-6">
            <h2 className="text-2xl font-bold mb-4">Delivery Address</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Street</label>
                <input
                  type="text"
                  name="street"
                  value={deliveryAddress.street}
                  onChange={handleAddressChange}
                  className="input"
                  placeholder="123 Main Street"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={deliveryAddress.city}
                  onChange={handleAddressChange}
                  className="input"
                  placeholder="New York"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">State</label>
                <input
                  type="text"
                  name="state"
                  value={deliveryAddress.state}
                  onChange={handleAddressChange}
                  className="input"
                  placeholder="NY"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={deliveryAddress.zipCode}
                  onChange={handleAddressChange}
                  className="input"
                  placeholder="10001"
                  required
                />
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={deliveryAddress.phone}
                  onChange={handleAddressChange}
                  className="input"
                  placeholder="+91 9999999999"
                />
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Order Items</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.product._id} className="flex justify-between py-2 border-b">
                  <div>
                    <p className="font-semibold">{item.product.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">
                    ₹
                    {(
                      item.product.price *
                      (1 - (item.product.discount || 0) / 100) *
                      item.quantity
                    ).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card h-fit lg:sticky lg:top-4 mt-6 lg:mt-0">
          <h2 className="text-2xl font-bold mb-6">Payment Summary</h2>

          <div className="space-y-3 mb-6 pb-6 border-b">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{(getTotalPrice()).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (18%)</span>
              <span>₹{(getTotalPrice() * 0.18).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>FREE</span>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6 text-xl font-bold">
            <span>Total Amount</span>
            <span className="text-blue-600">₹{totalAmount.toFixed(2)}</span>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="btn-success w-full mb-2"
          >
            {loading ? 'Processing...' : 'Pay with Razorpay'}
          </button>

          <Link href="/cart" className="btn-secondary w-full block text-center">
            Back to Cart
          </Link>
        </div>
      </div>
    </div>
  );
}
