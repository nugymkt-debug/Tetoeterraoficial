import React, { useState } from 'react';
import { X, Bed, Maximize, MapPin, Car, Bath, Home as HomeIcon, MessageCircle } from 'lucide-react';
import { Button } from './Button';
import { Tag } from './Tag';
import { ImageLightbox } from './ImageLightbox';

interface PropertyModalProps {
  property: {
    title?: string;
    location?: string;
    images: string[];
    exclusive?: boolean;
    neighborhood: string;
    price: string;
    area: string;
    bedrooms: number;
    bathrooms?: number;
    parking?: number;
    description: string;
    features: string[];
  };
  isOpen: boolean;
  onClose: () => void;
  onContact?: () => void;
}

export function PropertyModal({ property, isOpen, onClose }: PropertyModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(-1);

  const handleScheduleVisit = () => {
    const message = encodeURIComponent(`Olá! Quero agendar uma visita no imóvel: ${property.title} em ${property.location}.`);
    window.open(`https://wa.link/phesg4?text=${message}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
        <div
          className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-[#8494a4]/20 p-6 flex items-center justify-between z-10">
            <div>
              <h2 className="text-3xl mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                {property.neighborhood}
              </h2>
              <p className="text-2xl text-[#7f9f5f]" style={{ fontFamily: 'Playfair Display, serif' }}>
                {property.price}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-[#dde2df] hover:bg-[#8494a4]/20 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-[#162936]" />
            </button>
          </div>

          {/* Images Grid */}
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              {property.images.map((image, index) => (
                <div
                  key={index}
                  className={`${index === 0 ? 'col-span-2' : ''} relative aspect-[16/10] rounded-xl overflow-hidden cursor-pointer group`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={image}
                    alt={`${property.neighborhood} - Imagem ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                      Ver em tela cheia
                    </span>
                  </div>
                  {index === 0 && property.exclusive && (
                    <div className="absolute top-4 left-4">
                      <Tag>Exclusivo</Tag>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-[#dde2df] rounded-xl">
                <Maximize className="w-6 h-6 text-[#7f9f5f]" />
                <div>
                  <p className="text-sm text-[#747c80]">Área</p>
                  <p className="font-medium text-[#162936]">{property.area}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-[#dde2df] rounded-xl">
                <Bed className="w-6 h-6 text-[#7f9f5f]" />
                <div>
                  <p className="text-sm text-[#747c80]">Dormitórios</p>
                  <p className="font-medium text-[#162936]">{property.bedrooms}</p>
                </div>
              </div>
              {property.bathrooms && (
                <div className="flex items-center gap-3 p-4 bg-[#dde2df] rounded-xl">
                  <Bath className="w-6 h-6 text-[#7f9f5f]" />
                  <div>
                    <p className="text-sm text-[#747c80]">Banheiros</p>
                    <p className="font-medium text-[#162936]">{property.bathrooms}</p>
                  </div>
                </div>
              )}
              {property.parking && (
                <div className="flex items-center gap-3 p-4 bg-[#dde2df] rounded-xl">
                  <Car className="w-6 h-6 text-[#7f9f5f]" />
                  <div>
                    <p className="text-sm text-[#747c80]">Vagas</p>
                    <p className="font-medium text-[#162936]">{property.parking}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-2xl mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Descrição
              </h3>
              <p className="text-[#747c80] leading-relaxed">{property.description}</p>
            </div>

            {/* Features */}
            <div className="mb-8">
              <h3 className="text-2xl mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Características
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {property.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#7f9f5f] rounded-full"></div>
                    <span className="text-[#162936]">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleScheduleVisit}
              >
                Agendar visita
              </Button>
              <a
                href="https://wa.link/phesg4?text=Olá!%20Gostaria%20de%20mais%20informações%20sobre%20os%20imóveis%20para%20alugar."
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="primary" className="w-full">
                  Tenho interesse
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {currentImageIndex !== -1 && (
        <ImageLightbox
          images={property.images}
          currentIndex={currentImageIndex}
          onClose={() => setCurrentImageIndex(-1)}
          onNext={() => setCurrentImageIndex((prev) => (prev + 1) % property.images.length)}
          onPrev={() => setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length)}
        />
      )}
    </>
  );
}