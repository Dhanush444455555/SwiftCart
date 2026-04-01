import React from 'react';

const Button = ({ 
  children, 
  variant = 'gradient', 
  onClick, 
  className = '', 
  type = 'button',
  disabled = false,
  ...props 
}) => {
  const baseClass = variant === 'secondary' ? 'btn-secondary' : 'btn-gradient';
  
  return (
    <button
      type={type}
      className={`${baseClass} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
