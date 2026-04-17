import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Menu, X, ChevronDown } from 'lucide-react';
import logo from 'figma:asset/ede2134d47fbe39e398fb2fc4d4c6aae4284eef6.png';

interface HeaderProps {
  onProjectSelect: (projectName: string) => void;
  logoUrl?: string;
  projects?: string[];
}

export function Header({ onProjectSelect, logoUrl, projects: projectsProp }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [developmentsOpen, setDevelopmentsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('#developments-dropdown')) {
        setDevelopmentsOpen(false);
      }
    };
    
    if (developmentsOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [developmentsOpen]);

  const navLinks = [
    { label: 'Empreendimentos', href: '#empreendimentos', id: 'nav-empreendimentos', hasDropdown: true },
    { label: 'Alugar', href: '#alugar', id: 'nav-alugar' },
    { label: 'Comprar', href: '#venda', id: 'nav-venda' },
    { label: 'Sobre', href: '#sobre', id: 'nav-sobre' },
    { label: 'Investir', href: '#investir', id: 'nav-investir' },
    { label: 'Contato', href: '#contato', id: 'nav-contato' }
  ];

  const defaultProjects = [
    'Alto Mangalarga', 'Araltes Sebollas', 'Borgo Del Vino Grande', 'Farm Ville',
    'Fazenda Bela Vista', 'Fazenda Ouro Verde', 'Kabana Nogueira', 'Myo Araras',
    'Oni Araras', 'Quinta Portuguesa', 'Reserva Concórdia', 'Reserva do Barão',
    'Reserva Granja Brasil', 'Santommaso', 'Summit Valparaíso', 'Vila Dom Carlo',
    'Vinícula Maturano'
  ];

  const allProjects = projectsProp || defaultProjects;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileMenuOpen ? 'bg-[#162936] shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo */}
          <a href="#hero" className="flex items-center">
            <img
              src={logoUrl || logo}
              alt="Teto & Terra Real Estate"
              className="h-12 lg:h-14 w-auto object-contain"
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <div key={link.id} className="relative" id={link.hasDropdown ? 'developments-dropdown' : undefined}>
                {link.hasDropdown ? (
                  <button
                    onClick={() => setDevelopmentsOpen(!developmentsOpen)}
                    className="flex items-center gap-1 text-[#dde2df] hover:text-[#7f9f5f] transition-colors"
                    style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px' }}
                  >
                    {link.label}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                ) : (
                  <a
                    href={link.href}
                    className="text-[#dde2df] hover:text-[#7f9f5f] transition-colors"
                    style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px' }}
                  >
                    {link.label}
                  </a>
                )}

                {/* Dropdown Menu for Developments */}
                {link.hasDropdown && developmentsOpen && (
                  <div 
                    className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-2xl py-4 px-2 border border-[#8494a4]/20"
                  >
                    <div className="grid grid-cols-1 gap-1 max-h-96 overflow-y-auto">
                      {allProjects.map((project, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => {
                            e.preventDefault();
                            setDevelopmentsOpen(false);
                            onProjectSelect(project);
                          }}
                          className="w-full text-left px-4 py-2 text-[#162936] hover:bg-[#7f9f5f]/10 hover:text-[#7f9f5f] rounded-lg transition-colors text-sm"
                        >
                          {project}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <a href="#contato">
              <Button variant="secondary" className="!py-2 !px-5">
                Agendar Visita
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-[#dde2df] p-2"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-6 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-[#dde2df] hover:text-[#7f9f5f] transition-colors py-2"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {link.label}
              </a>
            ))}
            <a href="#contato" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="secondary" className="w-full !py-2">
                Agendar Visita
              </Button>
            </a>
          </div>
        )}
      </div>
    </header>
  );
}