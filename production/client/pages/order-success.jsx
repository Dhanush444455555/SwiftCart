'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import QRCode from 'qrcode.react';
import toast from 'react-hot-toast';
import apiClient from '@/lib/apiClient';

export default function OrderSuccess() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await apiClient.get(`/orders/${orderId}`);
      setOrder(response.data);
    } catch (error) {
      toast.error('Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg mb-6">Order not found</p>
        <Link href="/products" className="btn-primary inline-block">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-4xl font-bold mb-2">Order Successful!</h1>
        <p className="text-gray-600 text-lg">Thank you for your purchase</p>
      </div>

      {/* Order Summary Card */}
      <div className="card mb-6">
        <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 pb-6 border-b">
          <div>
            <p className="text-gray-600 text-sm">Order ID</p>
            <p className="font-bold text-lg">{order._id}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Order Date</p>
            <p className="font-bold text-lg">
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Status</p>
            <p className="font-bold text-lg">
              <span className="badge badge-success">{order.orderStatus}</span>
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Payment Status</p>
            <p className="font-bold text-lg">
              <span className="badge badge-success">{order.paymentStatus}</span>
            </p>
          </div>
        </div>

        {/* Items */}
        <h3 className="text-xl font-bold mb-4">Items Ordered</h3>
        <div className="space-y-3 mb-6 pb-6 border-b">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between py-2">
              <div>
                <p className="font-semibold">{item.product.name}</p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        {/* Amount Details */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{(order.totalAmount - order.totalAmount * 0.18).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (18%)</span>
            <span>₹{(order.totalAmount * 0.18).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold pt-4 border-t">
            <span>Total Amount</span>
            <span className="text-blue-600">₹{order.finalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Delivery Address */}
      {order.deliveryAddress && (
        <div className="card mb-6">
          <h3 className="text-xl font-bold mb-4">Delivery Address</h3>
          <p className="text-gray-700">
            {order.deliveryAddress.street}, {order.deliveryAddress.city}
          </p>
          <p className="text-gray-700">
            {order.deliveryAddress.state}, {order.deliveryAddress.zipCode}
          </p>
          {order.deliveryAddress.phone && (
            <p className="text-gray-700">Phone: {order.deliveryAddress.phone}</p>
          )}
        </div>
      )}

      {/* QR Code */}
      <div className="card text-center mb-6">
        <h3 className="text-xl font-bold mb-4">Order Verification QR Code</h3>
        <div className="flex justify-center">
          <QRCode value={order._id} size={200} />
        </div>
        <p className="text-sm text-gray-600 mt-4">
          Show this QR code at checkout for verification
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Link href="/order-history" className="btn-primary block text-center">
          View Order History
        </Link>
        <Link href="/products" className="btn-secondary block text-center">
          Continue Shopping
        </Link>
      </div>

      {/* Note */}
      <div className="card bg-blue-50 mt-6">
        <p className="text-sm text-gray-700">
          <strong>📋 Note:</strong> A confirmation email has been sent to your registered email
          address. You can track your order status anytime from your order history.
        </p>
      </div>
    </div>
  );
}
