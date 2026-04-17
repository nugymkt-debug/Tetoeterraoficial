import React from 'react';
import { ArrowRight, LucideIcon } from 'lucide-react';

interface JourneyCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaText: string;
  onClick?: () => void;
}

export function JourneyCard({ icon: Icon, title, description, ctaText, onClick }: JourneyCardProps) {
  return (
    <div className="bg-white rounded-2xl p-8 border border-[#8494a4]/20 hover:border-[#7f9f5f]/40 transition-all duration-300 hover:shadow-md">
      <div className="space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#7f9f5f]/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-[#7f9f5f]" />
        </div>
        <h3 className="text-2xl" style={{ fontFamily: 'Playfair Display, serif' }}>
          {title}
        </h3>
        <p className="text-[#747c80] leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
          {description}
        </p>
        <button
          onClick={onClick}
          className="inline-flex items-center gap-2 text-[#162936] hover:text-[#7f9f5f] transition-colors"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <span className="font-medium">{ctaText}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}