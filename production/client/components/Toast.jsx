'use client';

import { Toaster } from 'react-hot-toast';

export default function Toast() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#fff',
          color: '#000',
        },
        success: {
          style: {
            background: '#10b981',
            color: '#fff',
          },
        },
        error: {
          style: {
            background: '#ef4444',
            color: '#fff',
          },
        },
      }}
    />
  );
}
