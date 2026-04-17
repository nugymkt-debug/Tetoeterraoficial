import { ArrowRight, MapPin } from 'lucide-react'
import type { Project } from '../types/content'
import StatusBadge from './StatusBadge'

interface Props {
  projects: Project[]
}

export default function FeaturedProjects({ projects }: Props) {
  const featured = projects.filter(p => p.featured).slice(0, 3)
  if (featured.length === 0) return null

  return (
    <section id="empreendimentos" className="py-20 sm:py-28 bg-cream">
      <div className="container-custom">
        <div className="text-center">
          <span className="text-xs tracking-[0.3em] uppercase text-brand-600 font-semibold">
            Portfólio
          </span>
          <h2 className="section-title mt-3">Empreendimentos em Destaque</h2>
          <p className="section-subtitle">
            Conheça nossos empreendimentos exclusivos que redefinem o conceito de morar bem na Serra.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featured.map(p => (
            <a
              key={p.id}
              href={`/empreendimentos/${p.slug}`}
              className="group relative block overflow-hidden rounded-3xl shadow-soft"
            >
              <div className="aspect-[4/5] w-full overflow-hidden bg-navy-800">
                <img
                  src={p.image}
                  alt={`Imagem do empreendimento ${p.name}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/95 via-navy-900/40 to-transparent" />

              <div className="absolute top-4 left-4">
                <StatusBadge status={p.status} />
              </div>

              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold">{p.name}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-white/80">
                  <MapPin className="h-4 w-4" />
                  {p.location}
                </p>
                <p className="mt-3 text-sm text-white/85 line-clamp-2">{p.description}</p>

                <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur transition group-hover:bg-brand-500 group-hover:text-white">
                  Explorar Empreendimento
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
