import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({ label, className = '', ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm text-[#747c80]" style={{ fontFamily: 'Inter, sans-serif' }}>
          {label}
        </label>
      )}
      <textarea
        className={`px-4 py-3 rounded-2xl border-2 border-[#8494a4] bg-white text-[#162936] placeholder:text-[#8494a4] focus:outline-none focus:border-[#7f9f5f] transition-colors min-h-[120px] resize-y ${className}`}
        style={{ fontFamily: 'Inter, sans-serif' }}
        {...props}
      />
    </div>
  );
}
