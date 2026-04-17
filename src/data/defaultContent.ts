import type { SiteContent } from '../types/content'

/**
 * Conteúdo padrão do site. Serve como fallback quando o painel admin
 * ainda não salvou nenhuma edição no localStorage.
 *
 * IMPORTANTE: todas as imagens abaixo são de banco de imagens (Unsplash)
 * e devem ser substituídas pelas fotos reais dos empreendimentos
 * diretamente no painel /admin ou editando este arquivo.
 */

const UNSPLASH = (q: string) =>
  `https://images.unsplash.com/photo-${q}?auto=format&fit=crop&w=1600&q=80`

export const defaultContent: SiteContent = {
  brand: {
    name: 'Teto & Terra Real Estate',
    tagline: 'Especializada em empreendimentos exclusivos na Serra de Petrópolis',
  },

  hero: {
    title: 'Seu refúgio na serra.',
    subtitle: 'Seu investimento com futuro.',
    tagline: 'Empreendimentos exclusivos em Petrópolis e Região Serrana',
    primaryCtaLabel: 'Conhecer Empreendimentos',
    primaryCtaHref: '#empreendimentos',
    secondaryCtaLabel: 'Agendar Visita',
    secondaryCtaHref: '#contato',
    backgroundImage: UNSPLASH('1464822759023-fed622ff2c3b&ixlib=rb-4.0.3'),
  },

  projects: [
    {
      id: '1',
      slug: 'alto-mangalarga',
      name: 'Alto Mangalarga',
      location: 'Mangalarga, Petrópolis',
      description:
        'Condomínio fechado com lotes amplos em área nobre de Petrópolis, cercado por mata atlântica preservada.',
      image: UNSPLASH('1580587771525-78b9dba3b914&ixlib=rb-4.0.3'),
      status: 'lancamento',
      highlights: ['Lotes a partir de 1.000 m²', 'Área verde preservada', 'Segurança 24h'],
      featured: true,
    },
    {
      id: '2',
      slug: 'borgo-del-vino-grande',
      name: 'Borgo Del Vino Grande',
      location: 'Areal, Região de Petrópolis',
      description:
        'Residencial com inspiração toscana, vinhedos e clima ameno durante todo o ano.',
      image: UNSPLASH('1600585154340-be6161a56a0c&ixlib=rb-4.0.3'),
      status: 'em_obras',
      highlights: ['Inspiração toscana', 'Vinhedos', 'Clube e lazer completo'],
      featured: true,
    },
    {
      id: '3',
      slug: 'farm-ville',
      name: 'Farm Ville',
      location: 'Itaipava, Petrópolis',
      description:
        'Empreendimento com conceito farm-to-home em Itaipava, com hortas orgânicas e áreas de convivência rural.',
      image: UNSPLASH('1605146769289-440113cc3d00&ixlib=rb-4.0.3'),
      status: 'em_obras',
      highlights: ['Conceito farm-to-home', 'Hortas orgânicas', 'Trilhas'],
      featured: true,
    },
    {
      id: '4',
      slug: 'fazenda-bela-vista',
      name: 'Fazenda Bela Vista',
      location: 'Itaipava, Petrópolis',
      description:
        'Loteamento em antiga fazenda com vistas amplas do vale e natureza exuberante.',
      image: UNSPLASH('1502672260266-1c1ef2d93688&ixlib=rb-4.0.3'),
      status: 'pronto',
      highlights: ['Vista panorâmica', 'Lotes planos', 'Infraestrutura completa'],
      featured: false,
    },
    {
      id: '5',
      slug: 'fazenda-ouro-verde',
      name: 'Fazenda Ouro Verde',
      location: 'Sebollas, Petrópolis',
      description:
        'Casas prontas para morar em condomínio com clube, piscina e segurança 24h.',
      image: UNSPLASH('1600585154526-990dced4db0d&ixlib=rb-4.0.3'),
      status: 'pronto',
      highlights: ['Casas prontas', 'Clube e piscina', 'Documentação regular'],
      featured: false,
    },
    {
      id: '6',
      slug: 'kabana-nogueira',
      name: 'Kabana Nogueira',
      location: 'Nogueira, Petrópolis',
      description:
        'Cabanas de alto padrão em Nogueira, ideais para segunda residência ou renda de temporada.',
      image: UNSPLASH('1449844908441-8829872d2607&ixlib=rb-4.0.3'),
      status: 'pronto',
      highlights: ['Cabanas de alto padrão', 'Renda de temporada', 'Lareiras e decks'],
      featured: false,
    },
    {
      id: '7',
      slug: 'myo-araras',
      name: 'Myo Araras',
      location: 'Araras, Petrópolis',
      description:
        'Residências modernas em Araras, integradas à natureza com linhas contemporâneas.',
      image: UNSPLASH('1600596542815-ffad4c1539a9&ixlib=rb-4.0.3'),
      status: 'em_obras',
      highlights: ['Arquitetura contemporânea', 'Integração com a natureza'],
      featured: false,
    },
    {
      id: '8',
      slug: 'quinta-portuguesa',
      name: 'Quinta Portuguesa',
      location: 'Itaipava, Petrópolis',
      description:
        'Empreendimento com inspiração portuguesa, azulejos decorativos e pátios internos.',
      image: UNSPLASH('1512917774080-9991f1c4c750&ixlib=rb-4.0.3'),
      status: 'lancamento',
      highlights: ['Inspiração portuguesa', 'Áreas comuns decoradas'],
      featured: false,
    },
    {
      id: '9',
      slug: 'reserva-concordia',
      name: 'Reserva Concórdia',
      location: 'Petrópolis',
      description:
        'Reserva ambiental com lotes generosos e baixa densidade construtiva.',
      image: UNSPLASH('1508675801627-066c1eab47d0&ixlib=rb-4.0.3'),
      status: 'pronto',
      highlights: ['Baixa densidade', 'Reserva ambiental'],
      featured: false,
    },
    {
      id: '10',
      slug: 'reserva-do-barao',
      name: 'Reserva do Barão',
      location: 'Região Serrana, Petrópolis',
      description:
        'Condomínio de alto padrão com referência aos nobres da história de Petrópolis.',
      image: UNSPLASH('1568605114967-8130f3a36994&ixlib=rb-4.0.3'),
      status: 'pronto',
      highlights: ['Alto padrão', 'Áreas de lazer amplas'],
      featured: false,
    },
    {
      id: '11',
      slug: 'reserva-granja-brasil',
      name: 'Reserva Granja Brasil',
      location: 'Itaipava, Petrópolis',
      description:
        'Um dos condomínios mais valorizados da região, com golf, ecoparque e segurança reforçada.',
      image: UNSPLASH('1542314831-068cd1dbfeeb&ixlib=rb-4.0.3'),
      status: 'pronto',
      highlights: ['Campo de golf', 'Ecoparque', 'Alta valorização'],
      featured: false,
    },
    {
      id: '12',
      slug: 'santommaso',
      name: 'Santommaso',
      location: 'Petrópolis',
      description:
        'Empreendimento boutique com poucas unidades, acabamento impecável e vistas privilegiadas.',
      image: UNSPLASH('1600607687939-ce8a6c25118c&ixlib=rb-4.0.3'),
      status: 'em_obras',
      highlights: ['Boutique', 'Poucas unidades', 'Acabamento premium'],
      featured: false,
    },
    {
      id: '13',
      slug: 'summit-valparaiso',
      name: 'Summit Valparaíso',
      location: 'Valparaíso, Petrópolis',
      description:
        'Residências em ponto alto da serra com vistas de 360° e arquitetura moderna.',
      image: UNSPLASH('1519974719765-e6559eac2575&ixlib=rb-4.0.3'),
      status: 'lancamento',
      highlights: ['Vista 360°', 'Arquitetura moderna'],
      featured: false,
    },
    {
      id: '14',
      slug: 'vila-dom-carlo',
      name: 'Vila Dom Carlo',
      location: 'Petrópolis',
      description:
        'Vila de casas em estilo clássico europeu, com praças internas e muita arborização.',
      image: UNSPLASH('1572120360610-d971b9d7767c&ixlib=rb-4.0.3'),
      status: 'pronto',
      highlights: ['Estilo clássico europeu', 'Praças arborizadas'],
      featured: false,
    },
    {
      id: '15',
      slug: 'vinicola-maturano',
      name: 'Vinícola Maturano',
      location: 'Região Serrana, Petrópolis',
      description:
        'Residências vinhedo com produção própria de vinhos e experiências enoturísticas.',
      image: UNSPLASH('1506377247377-2a5b3b417ebb&ixlib=rb-4.0.3'),
      status: 'lancamento',
      highlights: ['Vinhedo residencial', 'Experiências enoturísticas'],
      featured: false,
    },
    {
      id: '16',
      slug: 'oni-araras',
      name: 'Oni Araras',
      location: 'Araras, Petrópolis',
      description:
        'Boutique condomínio em Araras com design minimalista e foco em bem-estar.',
      image: UNSPLASH('1613490493576-7fde63acd811&ixlib=rb-4.0.3'),
      status: 'em_obras',
      highlights: ['Design minimalista', 'Bem-estar'],
      featured: false,
    },
    {
      id: '17',
      slug: 'aralter-sebollas',
      name: 'Aralter Sebollas',
      location: 'Sebollas, Petrópolis',
      description:
        'Empreendimento em área rural de Sebollas com lotes amplos e muita natureza.',
      image: UNSPLASH('1564013799919-ab600027ffc6&ixlib=rb-4.0.3'),
      status: 'pronto',
      highlights: ['Área rural', 'Lotes amplos'],
      featured: false,
    },
  ],

  rentals: [
    {
      id: 'r1',
      type: 'aluguel',
      title: 'Casa com lareira e vista',
      neighborhood: 'Itaipava',
      city: 'Petrópolis',
      price: 'R$ 6.500/mês',
      bedrooms: 3,
      bathrooms: 2,
      area: 180,
      image: UNSPLASH('1570129477492-45c003edd2be&ixlib=rb-4.0.3'),
      featured: true,
    },
    {
      id: 'r2',
      type: 'aluguel',
      title: 'Chalé aconchegante na serra',
      neighborhood: 'Araras',
      city: 'Petrópolis',
      price: 'R$ 4.200/mês',
      bedrooms: 2,
      bathrooms: 2,
      area: 120,
      image: UNSPLASH('1449824913935-59a10b8d2000&ixlib=rb-4.0.3'),
    },
    {
      id: 'r3',
      type: 'aluguel',
      title: 'Casa de campo com pomar',
      neighborhood: 'Nogueira',
      city: 'Petrópolis',
      price: 'R$ 5.800/mês',
      bedrooms: 4,
      bathrooms: 3,
      area: 240,
      image: UNSPLASH('1560448204-e02f11c3d0e2&ixlib=rb-4.0.3'),
    },
  ],

  sales: [
    {
      id: 's1',
      type: 'venda',
      title: 'Residência premium em condomínio',
      neighborhood: 'Itaipava',
      city: 'Petrópolis',
      price: 'R$ 2.890.000',
      bedrooms: 4,
      bathrooms: 4,
      area: 320,
      image: UNSPLASH('1512917774080-9991f1c4c750&ixlib=rb-4.0.3'),
      featured: true,
    },
    {
      id: 's2',
      type: 'venda',
      title: 'Terreno com vista do vale',
      neighborhood: 'Valparaíso',
      city: 'Petrópolis',
      price: 'R$ 680.000',
      bedrooms: 0,
      bathrooms: 0,
      area: 1200,
      image: UNSPLASH('1500382017468-9049fed747ef&ixlib=rb-4.0.3'),
    },
    {
      id: 's3',
      type: 'venda',
      title: 'Casa contemporânea com piscina',
      neighborhood: 'Araras',
      city: 'Petrópolis',
      price: 'R$ 1.750.000',
      bedrooms: 3,
      bathrooms: 3,
      area: 280,
      image: UNSPLASH('1580587771525-78b9dba3b914&ixlib=rb-4.0.3'),
    },
  ],

  about: {
    title: 'Construindo Excelência na Serra',
    paragraphs: [
      'A Teto & Terra Real Estate é especializada em empreendimentos residenciais premium em Petrópolis e Região Serrana. Com portfólio diversificado, representamos um novo padrão de excelência na Serra.',
      'Nosso portfólio abrange desde empreendimentos boutique até grandes condomínios fechados, cada um projetado com atenção à excelência arquitetônica, integração ambiental e valorização do estilo de vida.',
    ],
    pillars: [
      { title: 'Excelência', description: 'Padrão superior em cada detalhe' },
      { title: 'Confiança', description: 'Transparência e segurança' },
      { title: 'Qualidade', description: 'Acabamentos premium' },
      { title: 'Valorização', description: 'Investimento inteligente' },
    ],
    image: UNSPLASH('1464822759023-fed622ff2c3b&ixlib=rb-4.0.3'),
  },

  investment: {
    title: 'Oportunidades de Investimento',
    intro:
      'O mercado imobiliário de Petrópolis oferece oportunidades excepcionais para investidores que buscam valorização, renda de aluguel e diversificação de portfólio em uma das regiões serranas mais prestigiadas do Brasil.',
    bullets: [
      {
        title: 'Valorização Consistente',
        description:
          'Região com histórico de valorização imobiliária superior à média nacional, impulsionada pela demanda crescente por qualidade de vida.',
      },
      {
        title: 'Renda de Aluguel',
        description:
          'Mercado de locação aquecido, com demanda de executivos, turistas e famílias buscando morar na serra.',
      },
      {
        title: 'Segurança Jurídica',
        description:
          'Todos os empreendimentos com documentação regularizada e registro em cartório, garantindo tranquilidade ao investidor.',
      },
    ],
    ctaLabel: 'Falar com Especialista',
    ctaHref: '#contato',
    image: UNSPLASH('1500382017468-9049fed747ef&ixlib=rb-4.0.3'),
  },

  contact: {
    whatsapp: '(24) 00000-0000',
    whatsappLink: 'https://wa.me/5524000000000',
    email: 'contato@tetoeterrarealstate.com.br',
    address: 'Petrópolis e Região Serrana - RJ',
    instagram: 'https://instagram.com/tetoeterrarealstate',
    formspreeUrl: '', // preencher com endpoint Formspree/Getform/etc
  },
}
