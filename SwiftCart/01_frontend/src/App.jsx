import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Search from './pages/Search';
import Scan from './pages/Scan';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Profile from './pages/Profile';
import Stores from './pages/Stores';
import Login from './pages/Login';
import AdminProducts from './pages/AdminProducts';
import Feedback from './pages/Feedback/Feedback';
import OffersPage from './pages/OffersPage';

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -20, scale: 0.98 }}
    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

function App() {
  const location = useLocation();
  
  return (
    <Layout>
      <Toaster position="top-right" />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/"         element={<PageTransition><Home /></PageTransition>} />
          <Route path="/search"   element={<PageTransition><Search /></PageTransition>} />
          <Route path="/scan"     element={<PageTransition><Scan /></PageTransition>} />
          <Route path="/cart"     element={<PageTransition><Cart /></PageTransition>} />
          <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
          <Route path="/success"  element={<PageTransition><Success /></PageTransition>} />
          <Route path="/profile"  element={<PageTransition><Profile /></PageTransition>} />
          <Route path="/stores"   element={<PageTransition><Stores /></PageTransition>} />
          <Route path="/login"    element={<PageTransition><Login /></PageTransition>} />
          <Route path="/admin"    element={<PageTransition><AdminProducts /></PageTransition>} />
          <Route path="/feedback" element={<PageTransition><Feedback /></PageTransition>} />
          <Route path="/offers"   element={<PageTransition><OffersPage /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}

export default App;
