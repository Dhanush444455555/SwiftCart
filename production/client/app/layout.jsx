import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Toast from '@/components/Toast';
import '@/styles/globals.css';

export const metadata = {
  title: 'SwiftCart - QR-Based Retail Checkout',
  description: 'Scan. Shop. Pay. Exit. The future of retail is here.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <div className="min-h-screen flex flex-col">
          <Navbar />
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
      </body>
    </html>
  );
}
