import React from 'react';
import { Maximize2 } from 'lucide-react';

interface ClickableImageProps {
  src: string;
  alt: string;
  className?: string;
  onClick: () => void;
}

export function ClickableImage({ src, alt, className = '', onClick }: ClickableImageProps) {
  return (
    <div className={`relative group cursor-pointer ${className}`} onClick={onClick}>
      <img src={src} alt={alt} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 bg-white/90 px-4 py-2 rounded-full">
          <Maximize2 className="w-5 h-5 text-[#162936]" />
          <span className="text-[#162936] font-medium text-sm">Ver em tela cheia</span>
        </div>
      </div>
    </div>
  );
}
