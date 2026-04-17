import React from 'react';
import { Quote } from 'lucide-react';

interface TestimonialCardProps {
  text: string;
  author: string;
  role: string;
}

export function TestimonialCard({ text, author, role }: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-2xl p-8 border border-[#8494a4]/20 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="space-y-6">
        <Quote className="w-10 h-10 text-[#7f9f5f]/30" />
        <p className="text-[#162936] leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', fontSize: '17px' }}>
          {text}
        </p>
        <div className="pt-4 border-t border-[#8494a4]/20">
          <p className="font-medium text-[#162936]" style={{ fontFamily: 'Playfair Display, serif' }}>
            {author}
          </p>
          <p className="text-sm text-[#747c80]" style={{ fontFamily: 'Inter, sans-serif' }}>
            {role}
          </p>
        </div>
      </div>
    </div>
  );
}
