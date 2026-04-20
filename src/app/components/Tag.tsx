import React from 'react';

interface TagProps {
  children: React.ReactNode;
  className?: string;
}

export function Tag({ children, className = '' }: TagProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full bg-[#7f9f5f] text-white text-xs font-medium ${className}`}
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {children}
    </span>
  );
}
