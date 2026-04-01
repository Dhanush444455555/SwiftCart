'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { useCartStore } from '@/lib/store';
import { useEffect } from 'react';
import Navbar from './Navbar';
import Toast from './Toast';

export default function RootLayout({ children }) {
  const { user, logout } = useAuthStore();
  const cartItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    const { restoreAuth } = useAuthStore.getState();
    restoreAuth();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar user={user} cartItems={cartItems} onLogout={logout} />
      <main className="flex-1 container py-8">
        {children}
      </main>
      <Toast />
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container text-center">
          <p>&copy; 2024 SwiftCart. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
