import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Button } from './components/Button';
import { Input } from './components/Input';
import { Select } from './components/Select';
import { Textarea } from './components/Textarea';
import { FeaturedProjectCard } from './components/FeaturedProjectCard';
import { DevelopmentCard } from './components/DevelopmentCard';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { PropertyCard } from './components/PropertyCard';
import { PropertyModal } from './components/PropertyModal';
import { LeadCaptureForm } from './components/LeadCaptureForm';
import { allProjects } from './data/projects';
import { sendContactEmailViaFormSubmit } from './services/emailService';
import { SUPABASE_PROJECT_ID, SUPABASE_ANON_KEY } from './config/supabase';
import logo from '../images/logo.svg';
import {
  MessageCircle,
  Award,
  TrendingUp,
  Shield,
  Building,
  ChevronRight,
  Search,
  MapPin
} from 'lucide-react';

// Aliases para compatibilidade
const projectId = SUPABASE_PROJECT_ID;
const publicAnonKey = SUPABASE_ANON_KEY;

async function fetchSupabaseData(endpoint: string) {
  try {
    if (!projectId || !publicAnonKey) return null;

    const url = `https://${projectId}.supabase.co/functions/v1/make-server-33b1e26f/${endpoint}?_t=${new Date().getTime()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      cache: 'no-store'
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.success ? data : null;
  } catch {
    return null;
  }
}

// Imóveis para alugar (dados padrão)
const defaultRentals = [
  {
    id: 1,
    title: 'Casa de Alto Padrão em Itaipava',
    location: 'Itaipava, Petrópolis',
    destination: 'Itaipava',
    price: 'R$ 8.500',
    period: 'mês',
    bedrooms: 4,
    bathrooms: 3,
    area: '280m²',
    images: [
      'https://images.unsplash.com/photo-1758448756880-01dbaf85597d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBob21lJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc3MjE4NDczOHww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1628746041543-f27904c01cd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3VzZSUyMGJlZHJvb20lMjBtb2Rlcm58ZW58MXx8fHwxNzczMzQwNzAyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1755624222023-621f7718950b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwbHV4dXJ5JTIwaG9tZXxlbnwxfHx8fDE3NzMzMDgxNTN8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    description: 'Linda casa de alto padrão em condomínio fechado, com acabamentos de primeira linha, piscina aquecida, sauna, home theater e amplo jardim com vista para as montanhas.',
    features: [
      'Piscina aquecida',
      'Sauna',
      'Home theater',
      'Churrasqueira gourmet',
      'Jardim amplo',
      'Garagem para 3 carros'
    ]
  },
  {
    id: 2,
    title: 'Cobertura Exclusiva em Araras',
    location: 'Araras, Petrópolis',
    destination: 'Araras',
    price: 'R$ 12.000',
    period: 'mês',
    bedrooms: 5,
    bathrooms: 4,
    area: '380m²',
    images: [
      'https://images.unsplash.com/photo-1758448756207-54505680d130?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwaG9tZSUyMGV4dGVyaW9yJTIwbmF0dXJlfGVufDF8fHx8MTc3MjE4NDczOXww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1640109478916-f445f8f19b11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob21lJTIwYmVkcm9vbSUyMGludGVyaW9yfGVufDF8fHx8MTc3MjE2NTc0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1758548157466-7c454382035a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiYXRocm9vbSUyMGVsZWdhbnR8ZW58MXx8fHwxNzczMzQwNzAyfDA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    description: 'Cobertura espetacular com vista 360 graus da Serra, living amplo com pé direito triplo, terraço gourmet completo e acabamentos importados de luxo.',
    features: [
      'Vista 360 graus',
      'Terraço gourmet',
      'Piscina privativa',
      'Elevador privativo',
      'Adega climatizada',
      'Sistema de automação completo'
    ]
  },
  {
    id: 3,
    title: 'Chalé Aconchegante em Nogueira',
    location: 'Nogueira, Petrópolis',
    destination: 'Nogueira',
    price: 'R$ 5.500',
    period: 'mês',
    bedrooms: 3,
    bathrooms: 2,
    area: '180m²',
    images: [
      'https://images.unsplash.com/photo-1770459202884-6b6effed0b84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGx1eHVyeSUyMHByb3BlcnR5JTIwdmlld3xlbnwxfHx8fDE3NzIxODQ3Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1710750473266-61b0b8cce0e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwaG91c2UlMjBpbnRlcmlvciUyMGVsZWdhbnR8ZW58MXx8fHwxNzcyMTg0NzM4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1629267274195-ed114a940c51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZXJyYSUyMG1vdW50YWlucyUyMG5hdHVyZSUyMGxhbmRzY2FwZSUyMGJyYXppbHxlbnwxfHx8fDE3NzIxODQ3Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    description: 'Chalé charmoso em meio à natureza, ideal para quem busca tranquilidade e aconchego. Lareira a lenha, varanda com rede e contato direto com a mata atlântica.',
    features: [
      'Lareira a lenha',
      'Varanda ampla',
      'Jardim com árvores frutíferas',
      'Churrasqueira',
      'Vista para montanhas',
      'Garagem coberta'
    ]
  },
  {
    id: 4,
    title: 'Casa Moderna em Areal',
    location: 'Areal, Região de Petrópolis',
    destination: 'Areal',
    price: 'R$ 6.800',
    period: 'mês',
    bedrooms: 4,
    bathrooms: 3,
    area: '250m²',
    images: [
      'https://images.unsplash.com/photo-1758448756880-01dbaf85597d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBob21lJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc3MjE4NDczOHww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1640109478916-f445f8f19b11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob21lJTIwYmVkcm9vbSUyMGludGVyaW9yfGVufDF8fHx8MTc3MjE2NTc0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1755624222023-621f7718950b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwbHV4dXJ5JTIwaG9tZXxlbnwxfHx8fDE3NzMzMDgxNTN8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    description: 'Casa moderna com arquitetura contemporânea em Areal. Ambiente tranquilo, espaçoso e com excelente acabamento. Piscina, churrasqueira e amplo quintal.',
    features: [
      'Arquitetura moderna',
      'Piscina',
      'Churrasqueira gourmet',
      'Quintal amplo',
      'Garagem para 2 carros',
      'Próximo a Petrópolis'
    ]
  },
  {
    id: 5,
    title: 'Casa Rústica em Sebollas',
    location: 'Sebollas, Região de Petrópolis',
    destination: 'Sebollas',
    price: 'R$ 4.200',
    period: 'mês',
    bedrooms: 3,
    bathrooms: 2,
    area: '160m²',
    images: [
      'https://images.unsplash.com/photo-1770459202884-6b6effed0b84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGx1eHVyeSUyMHByb3BlcnR5JTIwdmlld3xlbnwxfHx8fDE3NzIxODQ3Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1710750473266-61b0b8cce0e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwaG91c2UlMjBpbnRlcmlvciUyMGVsZWdhbnR8ZW58MXx8fHwxNzcyMTg0NzM4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1629267274195-ed114a940c51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZXJyYSUyMG1vdW50YWlucyUyMG5hdHVyZSUyMGxhbmRzY2FwZSUyMGJyYXppbHxlbnwxfHx8fDE3NzIxODQ3Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    description: 'Casa rústica charmosa em Sebollas, região tranquila próxima a Petrópolis. Ideal para quem busca sossego e contato com a natureza. Lareira e varanda.',
    features: [
      'Estilo rústico',
      'Lareira',
      'Varanda com vista',
      'Jardim',
      'Garagem',
      'Área rural tranquila'
    ]
  }
];

// Imóveis para venda (dados padrão)
const defaultSales = [
  {
    id: 1,
    title: 'Terreno Premium em Itaipava',
    location: 'Itaipava, Petrópolis',
    destination: 'Itaipava',
    price: 'R$ 2.500.000',
    period: 'à vista',
    bedrooms: 0,
    bathrooms: 0,
    area: '5.000m²',
    images: [
      'https://images.unsplash.com/photo-1561409037-c7be81613c1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXRyb3BvbGlzJTIwYnJhemlsJTIwbW91bnRhaW5zJTIwbHV4dXJ5JTIwaG9tZXxlbnwxfHx8fDE3NzIxODQ3Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1770459202884-6b6effed0b84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGx1eHVyeSUyMHByb3BlcnR5JTIwdmlld3xlbnwxfHx8fDE3NzIxODQ3Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1758448756207-54505680d130?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwaG9tZSUyMGV4dGVyaW9yJTIwbmF0dXJlfGVufDF8fHx8MTc3MjE4NDczOXww&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    description: 'Terreno de 5.000m² em localização privilegiada em Itaipava. Topografia favorável, infraestrutura completa e vista deslumbrante para as montanhas.',
    features: [
      'Localização privilegiada',
      'Topografia favorável',
      'Infraestrutura completa',
      'Vista para montanhas',
      'Documentação regularizada',
      'Alto potencial de valorização'
    ]
  },
  {
    id: 2,
    title: 'Lote em Areal',
    location: 'Areal, Região de Petrópolis',
    destination: 'Areal',
    price: 'R$ 420.000',
    period: 'à vista',
    bedrooms: 0,
    bathrooms: 0,
    area: '2.000m²',
    images: [
      'https://images.unsplash.com/photo-1758448756207-54505680d130?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwaG9tZSUyMGV4dGVyaW9yJTIwbmF0dXJlfGVufDF8fHx8MTc3MjE4NDczOXww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1770459202884-6b6effed0b84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGx1eHVyeSUyMHByb3BlcnR5JTIwdmlld3xlbnwxfHx8fDE3NzIxODQ3Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1561409037-c7be81613c1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXRyb3BvbGlzJTIwYnJhemlsJTIwbW91bnRhaW5zJTIwbHV4dXJ5JTIwaG9tZXxlbnwxfHx8fDE3NzIxODQ3Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    description: 'Lote de 2.000m² em Areal, próximo ao limite com Petrópolis. Ambiente tranquilo, rural e com excelente custo-benefício. Ótima oportunidade de investimento.',
    features: [
      'Amplo terreno de 2.500m²',
      'Ambiente rural preservado',
      'Excelente custo-benefício',
      'Documentação em ordem',
      'Potencial de valorização',
      'Limite com Petrópolis'
    ]
  },
  {
    id: 3,
    title: 'Casa Pronta em Areal',
    location: 'Areal, Região de Petrópolis',
    destination: 'Areal',
    price: 'R$ 1.850.000',
    period: 'à vista',
    bedrooms: 4,
    bathrooms: 3,
    area: '320m²',
    images: [
      'https://images.unsplash.com/photo-1758448756880-01dbaf85597d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBob21lJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc3MjE4NDczOHww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1640109478916-f445f8f19b11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob21lJTIwYmVkcm9vbSUyMGludGVyaW9yfGVufDF8fHx8MTc3MjE2NTc0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1755624222023-621f7718950b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwbHV4dXJ5JTIwaG9tZXxlbnwxfHx8fDE3NzMzMDgxNTN8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    description: 'Casa moderna de 320m² pronta para morar em Areal. Arquitetura contemporânea com 4 suítes, área gourmet completa, piscina e acabamentos de alto padrão.',
    features: [
      '4 suítes com closet',
      'Piscina aquecida',
      'Área gourmet completa',
      'Home office',
      'Garagem para 3 carros',
      'Pronta para morar'
    ]
  },
  {
    id: 4,
    title: 'Lote em Sebollas com Projeto',
    location: 'Sebollas, Região de Petrópolis',
    destination: 'Sebollas',
    price: 'R$ 380.000',
    period: 'à vista',
    bedrooms: 0,
    bathrooms: 0,
    area: '1.800m²',
    images: [
      'https://images.unsplash.com/photo-1758448756207-54505680d130?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwaG9tZSUyMGV4dGVyaW9yJTIwbmF0dXJlfGVufDF8fHx8MTc3MjE4NDczOXww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1770459202884-6b6effed0b84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGx1eHVyeSUyMHByb3BlcnR5JTIwdmlld3xlbnwxfHx8fDE3NzIxODQ3Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1561409037-c7be81613c1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXRyb3BvbGlzJTIwYnJhemlsJTIwbW91bnRhaW5zJTIwbHV4dXJ5JTIwaG9tZXxlbnwxfHx8fDE3NzIxODQ3Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    description: 'Lote de 1.800m² em Sebollas com projeto arquitetônico aprovado incluso. Localização estratégica no limite com Petrópolis, excelente oportunidade de investimento.',
    features: [
      'Projeto aprovado incluso',
      'Localização estratégica',
      'Infraestrutura disponível',
      'Vista para montanhas',
      'Facilidade de acesso',
      'Documentação regular'
    ]
  }
];

export function MainSite() {
  const [selectedProject, setSelectedProject] = useState<typeof allProjects[0] | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [selectedSaleProperty, setSelectedSaleProperty] = useState<any>(null);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [searchDestination, setSearchDestination] = useState('');
  const [searchSaleDestination, setSearchSaleDestination] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [rentals, setRentals] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [siteTexts, setSiteTexts] = useState<any>({});
  const [siteLogo, setSiteLogo] = useState('');
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Carrega dados do Supabase. silent=true evita o spinner de loading no topo.
  const loadData = React.useCallback(async (silent = false) => {
    if (!silent) setIsLoadingData(true);

    let [projectsData, rentalsData, salesData] = await Promise.all([
      fetchSupabaseData('projects'),
      fetchSupabaseData('rentals'),
      fetchSupabaseData('sales'),
    ]);

    const missingImages =
      projectsData?.data?.some((p: any) => !p.image) ||
      rentalsData?.data?.some((r: any) => !r.images || r.images.length === 0) ||
      salesData?.data?.some((s: any) => !s.images || s.images.length === 0);

    if (missingImages) {
      try {
        await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-33b1e26f/restore-all-images`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${publicAnonKey}`, 'Content-Type': 'application/json' }
        });
        [projectsData, rentalsData, salesData] = await Promise.all([
          fetchSupabaseData('projects'),
          fetchSupabaseData('rentals'),
          fetchSupabaseData('sales'),
        ]);
      } catch (_) {}
    }

    if (projectsData?.data) setProjects(projectsData.data);
    else setProjects(allProjects);

    if (rentalsData?.data) setRentals(rentalsData.data);
    else setRentals(defaultRentals);

    if (salesData?.data) setSales(salesData.data);
    else setSales(defaultSales);

    const [textsData, logoData] = await Promise.all([
      fetchSupabaseData('site-texts'),
      fetchSupabaseData('logo'),
    ]);
    if (textsData?.data) setSiteTexts(textsData.data);
    if (logoData?.url) setSiteLogo(logoData.url);

    setIsLoadingData(false);
  }, []);

  // Carga inicial
  useEffect(() => { loadData(); }, [loadData]);

  // Polling a cada 30 segundos para atualizar automaticamente quando o admin salvar
  useEffect(() => {
    const interval = setInterval(() => loadData(true), 30000);
    return () => clearInterval(interval);
  }, [loadData]);

  // BroadcastChannel: recebe sinal imediato do painel admin quando dados são salvos
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('teto-terra-admin');
      channel.onmessage = (event) => {
        if (event.data?.type === 'DATA_UPDATED') {
          console.log('📡 Admin salvou dados – recarregando imediatamente...');
          loadData(true);
        }
      };
    } catch (_) {
      // BroadcastChannel não suportado (Safari iOS antigo) – polling já cobre
    }
    return () => { channel?.close(); };
  }, [loadData]);

  const premiumProjects = useMemo(() => projects.filter(p => p.premium), [projects]);
  const secondaryProjects = useMemo(() => projects.filter(p => !p.premium), [projects]);

  const filteredProperties = useMemo(() =>
    searchDestination.trim() === ''
      ? rentals
      : rentals.filter((p: any) => p.destination?.toLowerCase().includes(searchDestination.toLowerCase())),
    [rentals, searchDestination]
  );

  const filteredSaleProperties = useMemo(() =>
    searchSaleDestination.trim() === ''
      ? sales
      : sales.filter((p: any) => p.destination?.toLowerCase().includes(searchSaleDestination.toLowerCase())),
    [sales, searchSaleDestination]
  );

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      interest: formData.get('project') as string || 'Não especificado',
      project: formData.get('project') as string,
      message: formData.get('message') as string
    };

    try {
      await sendContactEmailViaFormSubmit(data);
      alert('✅ Mensagem enviada com sucesso! Entraremos em contato em breve.');
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      alert('❌ Erro ao enviar mensagem. Por favor, tente novamente ou entre em contato por telefone.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#dde2df]" style={{ fontFamily: 'Inter, sans-serif' }}>
      {isLoadingData && (
        <div className="fixed top-0 left-0 right-0 bg-[#7f9f5f] text-white py-2 px-4 text-center z-50 text-sm">
          Carregando dados atualizados...
        </div>
      )}


      <Header
        logoUrl={siteLogo || undefined}
        projects={projects.map(p => p.name)}
        onProjectSelect={(projectName) => {
          const project = projects.find(p => p.name === projectName);
          if (project) {
            setSelectedProject(project);
          }
        }}
      />

      {/* SEÇÃO HERO */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1561409037-c7be81613c1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXRyb3BvbGlzJTIwYnJhemlsJTIwbW91bnRhaW5zJTIwbHV4dXJ5JTIwaG9tZXxlbnwxfHx8fDE3NzIxODQ3Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#162936]/80 via-[#162936]/60 to-[#162936]/80" />

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-16 py-20 text-center">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: 'Playfair Display, serif', whiteSpace: 'pre-line' }}
          >
            {siteTexts.heroTitle || 'Seu refúgio na serra.\nSeu investimento com futuro.'}
          </h1>
          <p className="text-lg md:text-xl text-[#dde2df] mb-4 max-w-3xl mx-auto">
            {siteTexts.heroSubtitle || 'Empreendimentos exclusivos em Petrópolis e Região Serrana'}
          </p>
          <p className="text-sm md:text-base text-[#dde2df]/80 mb-8">
            {siteTexts.heroCompany || 'Teto & Terra Real Estate | Especializada em Petrópolis e Região Serrana'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#empreendimentos">
              <Button variant="primary" className="!py-3 !px-8">
                Conhecer Empreendimentos
              </Button>
            </a>
            <a href="#contato">
              <Button variant="secondary" className="!py-3 !px-8">
                Agendar Visita
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* SEÇÃO EMPREENDIMENTOS PREMIUM */}
      <section id="empreendimentos" className="py-20 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#162936] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Empreendimentos em Destaque
            </h2>
            <p className="text-lg text-[#747c80] max-w-3xl mx-auto">
              Conheça nossos empreendimentos exclusivos que redefinem o conceito de morar bem na Serra
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {premiumProjects.map((project, idx) => (
              <FeaturedProjectCard
                key={idx}
                name={project.name}
                location={project.location}
                status={project.status}
                image={project.image}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>

          <div className="text-center mb-8">
            <h3 className="text-2xl lg:text-3xl font-bold text-[#162936] mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
              Outros Empreendimentos
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(showAllProjects ? secondaryProjects : secondaryProjects.slice(0, 6)).map((project, idx) => (
              <DevelopmentCard
                key={idx}
                name={project.name}
                location={project.location}
                image={project.image}
                status={project.status}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>

          {secondaryProjects.length > 6 && (
            <div className="text-center mt-12">
              <Button
                variant="outline"
                onClick={() => setShowAllProjects(!showAllProjects)}
                className="!px-8"
              >
                {showAllProjects ? 'Ver Menos' : `Ver Todos (${secondaryProjects.length})`}
                <ChevronRight className={`w-5 h-5 ml-2 transition-transform ${showAllProjects ? 'rotate-90' : ''}`} />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* SEÇÃO ALUGAR */}
      <section id="alugar" className="py-20 bg-[#dde2df]/50">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#162936] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Imóveis para Alugar
            </h2>
            <p className="text-lg text-[#747c80] max-w-3xl mx-auto mb-8">
              Encontre sua casa dos sonhos na serra. Imóveis selecionados com qualidade e conforto.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
              <div className="relative flex-1 w-full">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#747c80]" />
                <Input
                  placeholder="Digite o destino (ex: Itaipava, Araras, Nogueira, Areal, Sebollas)"
                  value={searchDestination}
                  onChange={(e) => setSearchDestination(e.target.value)}
                  className="!pl-10"
                />
              </div>
              <Button variant="primary" className="w-full sm:w-auto">
                <Search className="w-4 h-4 mr-2" />
                Buscar
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                title={property.title}
                location={property.location}
                price={property.price}
                period={property.period}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                area={property.area}
                image={property.images?.[0] || ''}
                onClick={() => setSelectedProperty(property)}
              />
            ))}
          </div>

          {filteredProperties.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#747c80] text-lg">Nenhum imóvel encontrado para "{searchDestination}"</p>
              <Button variant="outline" onClick={() => setSearchDestination('')} className="mt-4">
                Ver todos os imóveis
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* SEÇÃO VENDA */}
      <section id="venda" className="py-20 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#162936] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Imóveis à Venda
            </h2>
            <p className="text-lg text-[#747c80] max-w-3xl mx-auto mb-8">
              Oportunidades únicas de investimento. Terrenos e casas prontas em localizações privilegiadas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
              <div className="relative flex-1 w-full">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#747c80]" />
                <Input
                  placeholder="Digite o destino (ex: Itaipava, Areal, Sebollas)"
                  value={searchSaleDestination}
                  onChange={(e) => setSearchSaleDestination(e.target.value)}
                  className="!pl-10"
                />
              </div>
              <Button variant="primary" className="w-full sm:w-auto">
                <Search className="w-4 h-4 mr-2" />
                Buscar
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSaleProperties.map((property) => (
              <PropertyCard
                key={property.id}
                title={property.title}
                location={property.location}
                price={property.price}
                period={property.period}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                area={property.area}
                image={property.images?.[0] || ''}
                onClick={() => setSelectedSaleProperty(property)}
              />
            ))}
          </div>

          {filteredSaleProperties.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#747c80] text-lg">Nenhum imóvel encontrado para "{searchSaleDestination}"</p>
              <Button variant="outline" onClick={() => setSearchSaleDestination('')} className="mt-4">
                Ver todos os imóveis
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* SEÇÃO SOBRE */}
      <section id="sobre" className="py-20 bg-[#dde2df]/50">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-[#162936] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                {siteTexts.aboutTitle || 'Construindo Excelência na Serra'}
              </h2>
              <p className="text-lg text-[#747c80] mb-6 leading-relaxed">
                {siteTexts.aboutText1 || 'A Teto & Terra Real Estate é especializada em empreendimentos residenciais premium em Petrópolis e Região Serrana. Com portfólio diversificado, representamos um novo padrão de excelência na Serra.'}
              </p>
              <p className="text-lg text-[#747c80] mb-8 leading-relaxed">
                {siteTexts.aboutText2 || 'Nosso portfólio abrange desde empreendimentos exclusivos até grandes condomínios fechados, cada um projetado com atenção à excelência arquitetônica, integração ambiental e valorização do estilo de vida.'}
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Award className="w-6 h-6 text-[#7f9f5f] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-[#162936] mb-1">Excelência</h4>
                    <p className="text-sm text-[#747c80]">Padrão superior em cada detalhe</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-[#7f9f5f] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-[#162936] mb-1">Confiança</h4>
                    <p className="text-sm text-[#747c80]">Transparência e segurança</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building className="w-6 h-6 text-[#7f9f5f] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-[#162936] mb-1">Qualidade</h4>
                    <p className="text-sm text-[#747c80]">Acabamentos premium</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-6 h-6 text-[#7f9f5f] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-[#162936] mb-1">Valorização</h4>
                    <p className="text-sm text-[#747c80]">Investimento inteligente</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1770459202884-6b6effed0b84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGx1eHVyeSUyMHByb3BlcnR5JTIwdmlld3xlbnwxfHx8fDE3NzIxODQ3Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Sobre a Teto & Terra"
                className="rounded-2xl shadow-2xl w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO INVESTIR */}
      <section id="investir" className="py-20 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#162936] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              {siteTexts.investTitle || 'Oportunidades de Investimento'}
            </h2>
            <p className="text-lg text-[#747c80] max-w-3xl mx-auto">
              {siteTexts.investDescription || 'O mercado imobiliário de Petrópolis oferece oportunidades excepcionais para investidores que buscam valorização, renda de aluguel e diversificação de portfólio em uma das regiões serranas mais prestigiadas do Brasil.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#dde2df]/30 rounded-2xl p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#7f9f5f] rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#162936] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Valorização Consistente
              </h3>
              <p className="text-[#747c80] leading-relaxed">
                Região com histórico de valorização imobiliária superior à média nacional, impulsionada pela demanda crescente por qualidade de vida
              </p>
            </div>

            <div className="bg-[#dde2df]/30 rounded-2xl p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#7f9f5f] rounded-full flex items-center justify-center mx-auto mb-6">
                <Building className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#162936] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Renda de Aluguel
              </h3>
              <p className="text-[#747c80] leading-relaxed">
                Mercado de locação aquecido, com demanda de executivos, turistas e famílias buscando morar na serra
              </p>
            </div>

            <div className="bg-[#dde2df]/30 rounded-2xl p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#7f9f5f] rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#162936] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Segurança Jurídica
              </h3>
              <p className="text-[#747c80] leading-relaxed">
                Todos os empreendimentos com documentação regularizada e registro em cartório, garantindo tranquilidade ao investidor
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <a href="#contato">
              <Button variant="primary" className="!px-8">
                <MessageCircle className="w-4 h-4 mr-2" />
                Falar com Especialista
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* SEÇÃO CONTATO */}
      <section id="contato" className="py-20 bg-[#162936]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-[#162936] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                {siteTexts.contactTitle || 'Agende uma Visita'}
              </h3>
              <p className="text-[#747c80] mb-6">
                {siteTexts.contactDescription || 'Entre em contato com nossa equipe para agendar uma visita a qualquer um dos nossos empreendimentos ou receber informações detalhadas sobre oportunidades de investimento.'}
              </p>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <Input
                  name="name"
                  label="Nome Completo"
                  placeholder="Seu nome"
                  required
                />
                <Input
                  name="email"
                  label="E-mail"
                  type="email"
                  placeholder="seu@email.com"
                  required
                />
                <Input
                  name="phone"
                  label="Telefone"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  required
                />
                <Select
                  name="project"
                  label="Empreendimento de Interesse"
                  options={[
                    { value: '', label: 'Selecione um projeto' },
                    ...projects.map(p => ({ value: p.name, label: p.name }))
                  ]}
                />
                <Textarea name="message" label="Mensagem" placeholder="Conte-nos mais sobre seu interesse..." />
                <Button variant="primary" className="w-full" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                </Button>
              </form>
            </div>

            <div className="flex flex-col justify-center space-y-8">
              <div>
                <h3 className="text-3xl lg:text-4xl font-bold text-white mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Teto & Terra Real Estate
                </h3>
                <p className="text-[#dde2df] text-lg leading-relaxed mb-8">
                  Especializada em empreendimentos exclusivos na Serra de Petrópolis
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#7f9f5f] rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-2">WhatsApp</h4>
                    <p className="text-[#dde2df]">{siteTexts.phone || '(24) 99999-9999'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#7f9f5f] rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-2">E-mail</h4>
                    <p className="text-[#dde2df]">{siteTexts.email || 'tetoeterrarealstate@hotmail.com'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#7f9f5f] rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-2">Localização</h4>
                    <p className="text-[#dde2df]">Petrópolis e Região Serrana - RJ</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0f1f29] py-12">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <img
                src={siteLogo || logo}
                alt="Teto & Terra Real Estate"
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-[#dde2df]/60 text-sm text-center">
              © 2026 Teto & Terra Real Estate. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* MODAIS */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          whatsappPhone={siteTexts.phone}
        />
      )}

      {selectedProperty && (
        <PropertyModal
          property={selectedProperty}
          isOpen={!!selectedProperty}
          onClose={() => setSelectedProperty(null)}
          whatsappPhone={siteTexts.phone}
        />
      )}

      {selectedSaleProperty && (
        <PropertyModal
          property={selectedSaleProperty}
          isOpen={!!selectedSaleProperty}
          onClose={() => setSelectedSaleProperty(null)}
          whatsappPhone={siteTexts.phone}
        />
      )}
    </div>
  );
}
