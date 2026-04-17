import React from 'react';
import { ArrowRight } from 'lucide-react';

interface FeaturedProjectCardProps {
  name: string;
  location: string;
  status: 'Lançamento' | 'Em Construção' | 'Pronto para Morar';
  image: string;
  onClick: () => void;
}

export function FeaturedProjectCard({ 
  name, 
  location, 
  status, 
  image, 
  onClick 
}: FeaturedProjectCardProps) {
  const statusColors = {
    'Lançamento': 'bg-[#7f9f5f] text-white',
    'Em Construção': 'bg-[#8494a4] text-white',
    'Pronto para Morar': 'bg-[#162936] text-white'
  };

  return (
    <div 
      onClick={onClick}
      className="relative h-[60vh] min-h-[500px] rounded-2xl overflow-hidden shadow-2xl cursor-pointer group"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#162936]/90 via-[#162936]/50 to-[#162936]/30"></div>
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-12">
        {/* Status Badge */}
        <div className="mb-6">
          <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${statusColors[status]}`}>
            {status}
          </span>
        </div>

        {/* Project Name */}
        <h3 
          className="text-4xl lg:text-5xl xl:text-6xl text-white mb-3"
          style={{ fontFamily: 'Playfair Display, serif', lineHeight: '1.1' }}
        >
          {name}
        </h3>

        {/* Location */}
        <p className="text-xl lg:text-2xl text-[#dde2df] mb-8" style={{ fontFamily: 'Inter, sans-serif' }}>
          {location}
        </p>

        {/* CTA Button */}
        <button className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-full hover:bg-white hover:text-[#162936] transition-all duration-300 group-hover:gap-4 w-fit">
          <span className="font-medium">Explorar Empreendimento</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}