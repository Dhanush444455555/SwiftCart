import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ShieldCheck, Zap } from 'lucide-react';
import { clearCart, saveOrderToHistory } from '../store/cartSlice';
import { decreaseStock } from '../store/productSlice';
import { orderService } from '../services/orderService';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const { items, totalPrice } = useSelector(state => state.cart);
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [method, setMethod] = useState('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);

  const finalAmount = (totalPrice).toFixed(2);

  useEffect(() => {
    loadScript('https://checkout.razorpay.com/v1/checkout.js');
  }, []);

  const handlePayment = async () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      setIsProcessing(true);
      
      const orderItems = items.map(i => ({
         product: i.product._id,
         quantity: i.quantity,
         price: i.product.price
      }));

      // 1. Create Order on Server
      const res = await orderService.createRazorpayOrder({ items: orderItems, totalAmount: finalAmount });
      const { razorpayOrder, order: dbOrder } = res.data;

      // 2. Initialize Razorpay Checkout
      const options = {
        key: 'rzp_test_mockkey', // In real app, fetch from backend or env
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "SwiftCart Smart Checkout",
        description: "Zero Queue Checkout Payment",
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
             // 3. Verify Payment
             const verifyRes = await orderService.verifyPayment({
               razorpay_order_id: response.razorpay_order_id,
               razorpay_payment_id: response.razorpay_payment_id,
               razorpay_signature: response.razorpay_signature
             });
             
             if(verifyRes.status === 200) {
               toast.success("Payment Successful!");
               // Decrease stock for each purchased item
               dispatch(decreaseStock(items.map(i => ({ productId: i.product._id, quantity: i.quantity }))));
               dispatch(saveOrderToHistory({ finalAmount: parseFloat(finalAmount) }));
               dispatch(clearCart());
               navigate('/success');
             }
          } catch (err) {
             toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: user?.name || "Demo User",
          email: user?.email || "user@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#6C63FF"
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response){
        toast.error(`Payment failed: ${response.error.description}`);
      });
      rzp1.open();

    } catch (err) {
      toast.error('Failed to initiate payment');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
         <h2 className="text-2xl font-bold mb-4">Cart is Empty</h2>
         <button onClick={() => navigate('/scan')} className="btn-gradient px-6 py-2">Go to Scanner</button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 flex justify-center animate-fade-in">
      <div className="glass-card w-full max-w-lg p-8 relative overflow-hidden rounded-3xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
        
        <h1 className="text-3xl font-bold text-white mb-2 relative z-10">Checkout</h1>
        <p className="text-slate-400 mb-8 relative z-10">Complete your secure payment to exit the store.</p>
        
        <div className="bg-slate-800/50 p-6 rounded-2xl mb-8 border border-slate-700 relative z-10">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-700">
             <span className="text-slate-300">Items ({items.length})</span>
             <span className="text-white font-medium">₹{finalAmount}</span>
          </div>
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-700">
             <span className="text-slate-300">Taxes</span>
             <span className="text-white font-medium">Inclusive</span>
          </div>
          <div className="flex justify-between items-center">
             <span className="text-xl font-bold text-white">Total Amount</span>
             <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent to-cyan-400">
               ₹{finalAmount}
             </span>
          </div>
        </div>

        <div className="mb-8 relative z-10">
          <h3 className="text-lg font-medium text-white mb-4">Payment Method</h3>
          <div className="grid grid-cols-2 gap-4">
            <button 
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all duration-200 ${method === 'razorpay' ? 'bg-accent/20 border-accent text-white' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500'}`}
              onClick={() => setMethod('razorpay')}
            >
              <ShieldCheck size={28} className={method === 'razorpay' ? 'text-accent' : ''} />
              <span className="font-medium">Razorpay</span>
               <span className="text-xs opacity-70">UPI/Cards</span>
            </button>
            <button 
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all duration-200 cursor-not-allowed opacity-50 bg-slate-800/50 border-slate-700 text-slate-400`}
            >
              <CreditCard size={28} />
              <span className="font-medium">Card In-Store</span>
              <span className="text-xs text-red-400">Not Available</span>
            </button>
          </div>
        </div>

        <div className="flex gap-4 relative z-10 flex-col">
          <div className="flex gap-4">
            <button onClick={() => navigate('/cart')} className="btn-secondary flex-1 py-4 text-lg">
              Back to Cart
            </button>
            <button onClick={handlePayment} disabled={isProcessing} className="btn-gradient flex-1 py-4 text-lg font-bold flex justify-center items-center">
              {isProcessing ? 'Processing...' : `Pay ₹${finalAmount}`}
            </button>
          </div>

          <button
            onClick={() => {
              dispatch(decreaseStock(items.map(i => ({ productId: i.product._id, quantity: i.quantity }))));
              dispatch(saveOrderToHistory({ finalAmount: parseFloat(finalAmount) }));
              dispatch(clearCart());
              toast.success('Order placed! Stock updated.');
              navigate('/success');
            }}
            className="btn-gradient w-full py-3 font-bold flex justify-center items-center gap-2"
            style={{background:'linear-gradient(90deg,#34d399,#06B6D4)'}}
          >
            <Zap size={17} /> Pay Now (Demo — No Backend)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
