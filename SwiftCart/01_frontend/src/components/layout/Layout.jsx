import React from 'react';
import Navbar from './Navbar';
import Toast from '../common/Toast';

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="container animate-fade-in">
        {children}
      </main>
      <Toast />
    </>
  );
};

export default Layout;
