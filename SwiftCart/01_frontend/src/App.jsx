import React from 'react';
import { Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Layout>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/search"   element={<Search />} />
        <Route path="/scan"     element={<Scan />} />
        <Route path="/cart"     element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success"  element={<Success />} />
        <Route path="/profile"  element={<Profile />} />
        <Route path="/stores"   element={<Stores />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/admin"    element={<AdminProducts />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/offers"   element={<OffersPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
