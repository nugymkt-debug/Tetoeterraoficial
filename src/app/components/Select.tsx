import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className = '', ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm text-[#747c80]" style={{ fontFamily: 'Inter, sans-serif' }}>
          {label}
        </label>
      )}
      <select
        className={`px-4 py-3 rounded-2xl border-2 border-[#8494a4] bg-white text-[#162936] focus:outline-none focus:border-[#7f9f5f] transition-colors appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23162936%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[position:right_1rem_center] bg-[size:20px] bg-no-repeat pr-12 ${className}`}
        style={{ fontFamily: 'Inter, sans-serif' }}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
