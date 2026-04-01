import React, { useState, useEffect } from 'react';
import { Camera, CheckCircle, RefreshCw } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { productService } from '../services/productService';
import toast from 'react-hot-toast';

const Scan = () => {
  const [scanning, setScanning] = useState(true);
  const [scannedProduct, setScannedProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    let scanner = null;
    if (scanning) {
      scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scanner.render(
        async (decodedText) => {
          // Success callback
          scanner.clear();
          try {
            // First fetch from DB via QR
            const response = await productService.getProductByQrCode(decodedText);
            setScannedProduct(response.data);
            setNotFound(false);
            setScanning(false);
            toast.success('Product found!');
          } catch (err) {
            // If not found in our DB, we could fallback, but let's show an error for reality
            console.error(err);
            setNotFound(true);
            setScanning(false);
            toast.error('Product not found in store.');
          }
        },
        (error) => {
          // Continuous scanning... ignore errors
        }
      );
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(console.error);
      }
    };
  }, [scanning]);

  const handleAdd = () => {
    if (scannedProduct) {
      // Map properties properly in case backend schema differs slightly
      dispatch(addToCart({ ...scannedProduct, quantity: 1 }));
      toast.success(`${scannedProduct.name} added to cart`);
      setScannedProduct(null);
      setNotFound(false);
      setScanning(true);
    }
  };

  const handleScanAgain = () => {
    setScannedProduct(null);
    setNotFound(false);
    setScanning(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Smart Scanner</h1>
        <p className="text-slate-400">Point your camera at the product QR code</p>
      </div>

      <div className="max-w-md mx-auto">
        {scanning ? (
          <div className="glass-card p-6 overflow-hidden rounded-3xl relative">
            {/* The div that html5-qrcode targets */}
            <div id="reader" className="w-full rounded-2xl overflow-hidden bg-slate-900 border-2 border-indigo-500/30"></div>
            <p className="text-center mt-6 text-cyan-400 flex items-center justify-center gap-2 animate-pulse">
              <Camera size={20} />
              Scanning for barcodes...
            </p>
          </div>
        ) : (
          <div className="glass-card p-8 text-center animate-fade-in rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
            
            {scannedProduct ? (
              <div className="relative z-10">
                <CheckCircle size={56} className="text-cyan-400 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
                <h2 className="text-2xl font-bold text-white mb-6">Product Found!</h2>
                
                <div className="bg-slate-800/50 rounded-2xl p-4 mb-8 border border-slate-700/50">
                  <img 
                    src={scannedProduct.image || 'https://via.placeholder.com/150'} 
                    alt={scannedProduct.name} 
                    className="w-32 h-32 object-cover rounded-xl mx-auto mb-4 shadow-lg"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">{scannedProduct.name}</h3>
                    <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent to-cyan-400">
                      ₹{scannedProduct.price?.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button onClick={handleAdd} className="btn-gradient w-full py-3 text-lg">
                    Add to Cart
                  </button>
                  <button onClick={handleScanAgain} className="btn-secondary w-full py-3">
                    Scan Next Item
                  </button>
                </div>
              </div>
            ) : notFound ? (
              <div className="relative z-10 py-10">
                <RefreshCw size={56} className="text-red-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Not Found</h2>
                <p className="text-slate-400 mb-8">This QR code does not belong to our catalog.</p>
                <button onClick={handleScanAgain} className="btn-gradient w-full py-3 text-lg">
                  Try Again
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default Scan;
