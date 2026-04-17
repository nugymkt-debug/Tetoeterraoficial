/**
 * Tipos que descrevem todo o conteúdo editável do site.
 * O painel admin grava um objeto SiteContent no localStorage.
 */

export type ProjectStatus = 'lancamento' | 'em_obras' | 'pronto' | 'indisponivel'

export interface Project {
  id: string
  slug: string
  name: string
  location: string            // ex.: "Itaipava, Petrópolis"
  description: string
  image: string               // URL (externa ou /assets)
  gallery?: string[]
  status: ProjectStatus
  highlights?: string[]       // bullets curtos
  featured: boolean           // aparece no topo "Empreendimentos em Destaque"
  detailUrl?: string          // link externo se houver
}

export interface Listing {
  id: string
  type: 'aluguel' | 'venda'
  title: string
  neighborhood: string        // ex.: "Itaipava"
  city: string                // ex.: "Petrópolis"
  price: string               // string livre: "R$ 4.500/mês" ou "R$ 1.250.000"
  bedrooms: number
  bathrooms: number
  area: number                // m²
  image: string
  featured?: boolean
}

export interface Hero {
  title: string
  subtitle: string
  tagline: string
  primaryCtaLabel: string
  primaryCtaHref: string
  secondaryCtaLabel: string
  secondaryCtaHref: string
  backgroundImage: string
}

export interface About {
  title: string
  paragraphs: string[]
  pillars: { title: string; description: string }[]
  image: string
}

export interface Investment {
  title: string
  intro: string
  bullets: { title: string; description: string }[]
  ctaLabel: string
  ctaHref: string
  image: string
}

export interface Contact {
  whatsapp: string            // ex.: "(24) 99999-9999"
  whatsappLink: string        // ex.: "https://wa.me/5524999999999"
  email: string
  address: string
  instagram?: string
  formspreeUrl?: string       // endpoint do formulário de contato
}

export interface SiteContent {
  brand: {
    name: string
    tagline: string
    logoUrl?: string
  }
  hero: Hero
  projects: Project[]
  rentals: Listing[]
  sales: Listing[]
  about: About
  investment: Investment
  contact: Contact
}
