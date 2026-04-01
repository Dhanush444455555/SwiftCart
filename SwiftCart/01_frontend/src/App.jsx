import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Search from './pages/Search';
import Scan from './pages/Scan';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Profile from './pages/Profile';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<Success />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Layout>
  );
}

export default App;
