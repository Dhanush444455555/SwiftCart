'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function Cart() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice, getTotalItems } =
    useCartStore();
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">Shopping Cart</h1>
        <p className="text-gray-500 text-lg mb-6">Your cart is empty</p>
        <Link href="/products" className="btn-primary inline-block">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Shopping Cart ({totalItems} items)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {items.map((item) => {
            const discountedPrice = item.product.price * (1 - (item.product.discount || 0) / 100);
            const itemTotal = discountedPrice * item.quantity;

            return (
              <div key={item.product._id} className="card mb-4 flex gap-4">
                <div className="relative w-24 h-24 flex-shrink-0">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold">{item.product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{item.product.description}</p>

                  <div className="flex items-center gap-4 mb-2">
                    <span className="font-bold text-lg">₹{discountedPrice.toFixed(2)}</span>
                    {item.product.discount > 0 && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{item.product.price}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm font-semibold">Qty:</label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.product._id, parseInt(e.target.value))
                      }
                      min="1"
                      max={item.product.stock}
                      className="w-16 px-2 py-1 border border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-600">
                      (Max: {item.product.stock})
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold mb-4">₹{itemTotal.toFixed(2)}</p>
                  <button
                    onClick={() => removeItem(item.product._id)}
                    className="btn-danger"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="card h-fit sticky top-4">
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

          <div className="space-y-3 mb-6 pb-6 border-b">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span className="text-green-600">-₹0.00</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (18%)</span>
              <span>₹{(totalPrice * 0.18).toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6 text-xl font-bold">
            <span>Total</span>
            <span className="text-blue-600">
              ₹{(totalPrice * 1.18).toFixed(2)}
            </span>
          </div>

          <Link href="/checkout" className="btn-primary w-full text-center">
            Proceed to Checkout
          </Link>

          <button
            onClick={() => {
              clearCart();
            }}
            className="btn-secondary w-full mt-2"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
