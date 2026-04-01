import React, { useState, useEffect } from 'react';
import { Camera, CheckCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import Button from '../components/common/Button';
import './Scan.css';

const Scan = () => {
  const [scanning, setScanning] = useState(true);
  const [scannedProduct, setScannedProduct] = useState(null);
  const { list: products } = useSelector(state => state.products);
  const dispatch = useDispatch();

  // Mock scan effect
  useEffect(() => {
    if (scanning) {
      const timer = setTimeout(() => {
        if (products.length > 0) {
          const randomProduct = products[Math.floor(Math.random() * products.length)];
          setScannedProduct(randomProduct);
          setScanning(false);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [scanning, products]);

  const handleAdd = () => {
    if (scannedProduct) {
      dispatch(addToCart(scannedProduct));
      setScannedProduct(null);
      setScanning(true);
    }
  };

  return (
    <div className="scan-page">
      <div className="scan-header text-center">
        <h1>Smart Scanner</h1>
        <p>Point your camera at the product barcode</p>
      </div>

      <div className="scanner-container">
        {scanning ? (
          <div className="scanner-view glass-card">
            <div className="scan-reticle">
              <div className="scan-line"></div>
            </div>
            <p className="scanning-text"><Camera size={20} className="inline mr-2" /> Scanning for barcodes...</p>
          </div>
        ) : (
          <div className="scanned-result glass-card animate-fade-in">
             <CheckCircle size={48} color="#06B6D4" className="success-icon" />
             <h2>Product Found!</h2>
             
             {scannedProduct && (
               <div className="scanned-product-info">
                 <img src={scannedProduct.image} alt={scannedProduct.name} />
                 <div>
                   <h3>{scannedProduct.name}</h3>
                   <p className="price">₹{scannedProduct.price.toFixed(2)}</p>
                 </div>
               </div>
             )}

             <div className="scan-actions">
               <Button variant="gradient" onClick={handleAdd}>Add to Cart</Button>
               <Button variant="secondary" onClick={() => setScanning(true)}>Scan Again</Button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scan;
