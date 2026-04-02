import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Toast from '../common/Toast';

const Layout = ({ children }) => {
  return (
    <>
      <Sidebar />
      <Navbar />
      <main className="container animate-fade-in">
        {children}
      </main>
      <Toast />
    </>
  );
};

export default Layout;
