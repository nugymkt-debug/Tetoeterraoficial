import React, { useState } from 'react';
import { X, Bed, Maximize, MapPin, Car, Bath, MessageCircle } from 'lucide-react';
import { Button } from './Button';
import { Tag } from './Tag';
import { ImageLightbox } from './ImageLightbox';
import { buildWhatsAppUrl } from '../utils/whatsapp';

interface PropertyModalProps {
  property: {
    /** Nome/título do imóvel (campo principal) */
    title?: string;
    /** Legado: alguns dados antigos usam 'neighborhood' */
    neighborhood?: string;
    location?: string;
    images: string[];
    exclusive?: boolean;
    price: string;
    period?: string;
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
  /** Telefone do WhatsApp vindo dos textos do site */
  whatsappPhone?: string;
}

export function PropertyModal({ property, isOpen, onClose, whatsappPhone }: PropertyModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(-1);

  // Usa title se disponível; fallback para neighborhood (dados legados)
  const displayTitle = property.title || property.neighborhood || 'Imóvel';
  const displayLocation = property.location || '';

  const handleScheduleVisit = () => {
    window.open(buildWhatsAppUrl(whatsappPhone, `Olá! Quero agendar uma visita no imóvel: ${displayTitle} em ${displayLocation}.`), '_blank');
  };

  const handleInterest = () => {
    window.open(buildWhatsAppUrl(whatsappPhone, `Olá! Tenho interesse no imóvel: ${displayTitle}${displayLocation ? ' em ' + displayLocation : ''}. Podem me passar mais informações?`), '_blank');
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
              <h2 className="text-3xl mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                {displayTitle}
              </h2>
              {displayLocation && (
                <div className="flex items-center gap-1 text-[#747c80] text-sm mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{displayLocation}</span>
                </div>
              )}
              <p className="text-2xl text-[#7f9f5f]" style={{ fontFamily: 'Playfair Display, serif' }}>
                {property.price}{property.period ? `/${property.period}` : ''}
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
            {property.images && property.images.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                {property.images.map((image, index) => (
                  <div
                    key={index}
                    className={`${index === 0 ? 'col-span-2' : ''} relative aspect-[16/10] rounded-xl overflow-hidden cursor-pointer group`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img
                      src={image}
                      alt={`${displayTitle} - Imagem ${index + 1}`}
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
            )}

            {/* Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-[#dde2df] rounded-xl">
                <Maximize className="w-6 h-6 text-[#7f9f5f]" />
                <div>
                  <p className="text-sm text-[#747c80]">Área</p>
                  <p className="font-medium text-[#162936]">{property.area}</p>
                </div>
              </div>
              {property.bedrooms > 0 && (
                <div className="flex items-center gap-3 p-4 bg-[#dde2df] rounded-xl">
                  <Bed className="w-6 h-6 text-[#7f9f5f]" />
                  <div>
                    <p className="text-sm text-[#747c80]">Dormitórios</p>
                    <p className="font-medium text-[#162936]">{property.bedrooms}</p>
                  </div>
                </div>
              )}
              {property.bathrooms != null && property.bathrooms > 0 && (
                <div className="flex items-center gap-3 p-4 bg-[#dde2df] rounded-xl">
                  <Bath className="w-6 h-6 text-[#7f9f5f]" />
                  <div>
                    <p className="text-sm text-[#747c80]">Banheiros</p>
                    <p className="font-medium text-[#162936]">{property.bathrooms}</p>
                  </div>
                </div>
              )}
              {property.parking != null && property.parking > 0 && (
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
            {property.description && (
              <div className="mb-8">
                <h3 className="text-2xl mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Descrição
                </h3>
                <p className="text-[#747c80] leading-relaxed">{property.description}</p>
              </div>
            )}

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Características
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#7f9f5f] rounded-full flex-shrink-0"></div>
                      <span className="text-[#162936]">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="primary" className="flex-1" onClick={handleScheduleVisit}>
                <MessageCircle className="w-4 h-4 mr-2" />
                Agendar Visita
              </Button>
              <Button variant="secondary" className="flex-1" onClick={handleInterest}>
                <MessageCircle className="w-4 h-4 mr-2" />
                Tenho Interesse
              </Button>
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
