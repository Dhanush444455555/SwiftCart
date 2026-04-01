'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar({ user, cartItems, onLogout }) {
  const router = useRouter();

  const handleLogout = () => {
    onLogout();
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          SwiftCart
        </Link>

        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <Link href="/products" className="btn-secondary">
                Products
              </Link>
              <Link href="/order-history" className="btn-secondary">
                Orders
              </Link>
              {user.role === 'admin' && (
                <Link href="/admin" className="btn-secondary">
                  Admin
                </Link>
              )}
              <Link href="/cart" className="btn-secondary relative">
                Cart ({cartItems})
              </Link>
              <span className="text-sm">Hello, {user.name}</span>
              <button onClick={handleLogout} className="btn-danger">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-primary">
                Login
              </Link>
              <Link href="/register" className="btn-secondary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
