import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm text-[#747c80]" style={{ fontFamily: 'Inter, sans-serif' }}>
          {label}
        </label>
      )}
      <input
        className={`px-4 py-3 rounded-2xl border-2 border-[#8494a4] bg-white text-[#162936] placeholder:text-[#8494a4] focus:outline-none focus:border-[#7f9f5f] transition-colors ${className}`}
        style={{ fontFamily: 'Inter, sans-serif' }}
        {...props}
      />
    </div>
  );
}
