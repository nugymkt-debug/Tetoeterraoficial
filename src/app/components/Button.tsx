import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const baseStyles = 'px-8 py-4 rounded-2xl font-semibold transition-all duration-300 inline-flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-[#162936] text-[#dde2df] hover:bg-[#1f3a4a]',
    secondary: 'bg-[#7f9f5f] text-white hover:bg-[#6d8850]',
    outline: 'border-2 border-[#dde2df] text-[#dde2df] hover:bg-[#dde2df] hover:text-[#162936]',
    ghost: 'text-[#162936] hover:text-[#7f9f5f]'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
