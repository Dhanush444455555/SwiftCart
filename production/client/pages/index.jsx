'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store';

export default function Home() {
  const { user } = useAuthStore();

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 md:py-20 px-4 md:px-6 rounded-lg mb-8 md:mb-12">
        <div className="container text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Welcome to SwiftCart</h1>
          <p className="text-lg md:text-xl mb-8">
            Scan. Shop. Pay. Exit. No queues, no hassle. The future of retail is here.
          </p>
          {user ? (
            <Link href="/products" className="btn-primary inline-block px-8 py-3 text-lg">
              Start Shopping
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/login" className="btn-primary w-full sm:w-auto px-8 py-3">
                Login
              </Link>
              <Link href="/register" className="btn-secondary w-full sm:w-auto px-8 py-3">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card text-center">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-bold mb-2">Scan QR Code</h3>
            <p className="text-gray-600">Simply scan the product QR code with your phone camera</p>
          </div>
          <div className="card text-center">
            <div className="text-4xl mb-4">🛒</div>
            <h3 className="text-xl font-bold mb-2">Add to Cart</h3>
            <p className="text-gray-600">Add items to your digital cart instantly</p>
          </div>
          <div className="card text-center">
            <div className="text-4xl mb-4">💳</div>
            <h3 className="text-xl font-bold mb-2">Pay Online</h3>
            <p className="text-gray-600">Secure payment through Razorpay</p>
          </div>
          <div className="card text-center">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-bold mb-2">Exit Fast</h3>
            <p className="text-gray-600">Walk out without waiting in queues</p>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="card bg-gradient-to-r from-green-50 to-blue-50 mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Why Choose SwiftCart?</h2>
        <ul className="space-y-3">
          <li className="flex items-center">
            <span className="text-2xl mr-4">✓</span>
            <span>No billing queues - save time</span>
          </li>
          <li className="flex items-center">
            <span className="text-2xl mr-4">✓</span>
            <span>Secure digital payments</span>
          </li>
          <li className="flex items-center">
            <span className="text-2xl mr-4">✓</span>
            <span>Real-time inventory tracking</span>
          </li>
          <li className="flex items-center">
            <span className="text-2xl mr-4">✓</span>
            <span>Order history and receipts</span>
          </li>
          <li className="flex items-center">
            <span className="text-2xl mr-4">✓</span>
            <span>Special discounts and offers</span>
          </li>
        </ul>
      </div>

      {/* CTA Section */}
      {user && (
        <div className="card text-center bg-blue-50">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Ready to Shop Smarter?</h2>
          <Link href="/products" className="btn-primary w-full sm:w-auto inline-block">
            Explore Products
          </Link>
        </div>
      )}
    </div>
  );
}
