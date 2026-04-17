import React from 'react';
import { MapPin } from 'lucide-react';

interface DevelopmentCardProps {
  name: string;
  location: string;
  image: string;
  onClick: () => void;
}

export function DevelopmentCard({ name, location, image, onClick }: DevelopmentCardProps) {
  return (
    <div 
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden bg-[#dde2df]">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Dark Overlay on Hover */}
        <div className="absolute inset-0 bg-[#162936]/0 group-hover:bg-[#162936]/60 transition-all duration-300 flex items-center justify-center">
          <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-lg">
            Ver Detalhes
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 
          className="text-2xl text-[#162936] mb-2"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          {name}
        </h3>
        <div className="flex items-center gap-2 text-[#747c80]">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{location}</span>
        </div>
      </div>
    </div>
  );
}