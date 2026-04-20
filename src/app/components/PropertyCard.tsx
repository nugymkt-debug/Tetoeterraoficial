import React from 'react';
import { MapPin, Bed, Bath, Maximize } from 'lucide-react';

interface PropertyCardProps {
  title: string;
  location: string;
  price: string;
  period: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  image: string;
  onClick: () => void;
}

export function PropertyCard({ 
  title, 
  location, 
  price, 
  period, 
  bedrooms, 
  bathrooms, 
  area, 
  image, 
  onClick 
}: PropertyCardProps) {
  return (
    <div 
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-[#8494a4]/20"
    >
      {/* Imagem */}
      <div className="relative h-56 overflow-hidden bg-[#dde2df]">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Conteúdo */}
      <div className="p-6">
        <h3 
          className="text-xl text-[#162936] mb-2 line-clamp-1"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          {title}
        </h3>
        
        <div className="flex items-center gap-2 text-[#747c80] mb-4">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm">{location}</span>
        </div>

        <div 
          className="text-2xl text-[#7f9f5f] mb-4"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          {price}<span className="text-base text-[#747c80]">/{period}</span>
        </div>

        <div className="flex items-center gap-4 text-[#747c80] text-sm border-t border-[#8494a4]/20 pt-4">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            <span>{bedrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span>{bathrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize className="w-4 h-4" />
            <span>{area}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
