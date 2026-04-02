import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '100px 20px', color: '#fff' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" style={{ color: '#a78bfa', textDecoration: 'none', fontWeight: 'bold' }}>
        Return Home
      </Link>
    </div>
  );
};

export default NotFound;
