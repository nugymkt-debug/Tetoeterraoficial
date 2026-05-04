import React from 'react';
import { X, MapPin, Calendar, Home, ArrowRight } from 'lucide-react';
import { Button } from './Button';

interface Project {
  id: number;
  name: string;
  location: string;
  status: 'Lançamento' | 'Em Construção' | 'Pronto para Morar';
  image: string;
  description: string;
  features: string[];
  units?: string;
  deliveryDate?: string;
}

interface ProjectDetailModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onScheduleVisit?: () => void;
  /** Telefone do WhatsApp configurado no painel admin */
  whatsappPhone?: string;
}

export function ProjectDetailModal({ project, isOpen, onClose, onScheduleVisit, whatsappPhone }: ProjectDetailModalProps) {
  const buildWhatsAppUrl = (message: string) => {
    if (whatsappPhone) {
      const digits = whatsappPhone.replace(/\D/g, '');
      const intl = digits.startsWith('55') ? digits : `55${digits}`;
      return `https://wa.me/${intl}?text=${encodeURIComponent(message)}`;
    }
    return `https://wa.link/phesg4?text=${encodeURIComponent(message)}`;
  };

  const handleScheduleVisit = () => {
    window.open(buildWhatsAppUrl(`Olá! Quero agendar uma visita no empreendimento ${project.name}.`), '_blank');
    if (onScheduleVisit) onScheduleVisit();
  };

  const handleWhatsApp = () => {
    window.open(buildWhatsAppUrl(`Olá! Gostaria de mais informações sobre o empreendimento ${project.name}.`), '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#162936]/80 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-lg"
        >
          <X className="w-5 h-5 text-[#162936]" />
        </button>

        <div className="overflow-y-auto max-h-[90vh]">
          {/* Hero Image */}
          <div className="relative h-96">
            <img 
              src={project.image} 
              alt={project.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#162936]/80 to-transparent"></div>
            
            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
              <h2 
                className="text-4xl lg:text-5xl text-white mb-3"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {project.name}
              </h2>
              <div className="flex items-center gap-2 text-[#dde2df] text-lg">
                <MapPin className="w-5 h-5" />
                <span>{project.location}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 lg:p-12">
            {/* Status & Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#7f9f5f]/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-[#7f9f5f]" />
                </div>
                <div>
                  <p className="text-sm text-[#747c80]">Status</p>
                  <p className="font-medium text-[#162936]">{project.status}</p>
                </div>
              </div>
              
              {project.units && (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#7f9f5f]/10 flex items-center justify-center flex-shrink-0">
                    <Home className="w-6 h-6 text-[#7f9f5f]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#747c80]">Unidades</p>
                    <p className="font-medium text-[#162936]">{project.units}</p>
                  </div>
                </div>
              )}

              {project.deliveryDate && (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#7f9f5f]/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-[#7f9f5f]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#747c80]">Entrega</p>
                    <p className="font-medium text-[#162936]">{project.deliveryDate}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-10">
              <h3 
                className="text-2xl text-[#162936] mb-4"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Sobre este empreendimento
              </h3>
              <p className="text-lg text-[#747c80] leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Features */}
            {project.features.length > 0 && (
              <div className="mb-10">
                <h3 
                  className="text-2xl text-[#162936] mb-6"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  Diferenciais do Empreendimento
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-[#dde2df]/30 rounded-lg p-4">
                      <ArrowRight className="w-5 h-5 text-[#7f9f5f] flex-shrink-0" />
                      <span className="text-[#162936]">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-[#8494a4]/20">
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleScheduleVisit}
              >
                Agendar Visita
              </Button>
              <Button
                variant="secondary"
                className="flex-1"
                onClick={handleWhatsApp}
              >
                Contato via WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}