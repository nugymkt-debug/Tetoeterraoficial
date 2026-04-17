import { useState } from 'react'
import { MapPin, ChevronDown } from 'lucide-react'
import type { Project } from '../types/content'
import StatusBadge from './StatusBadge'

interface Props {
  projects: Project[]
  initialCount?: number
}

export default function ProjectsGrid({ projects, initialCount = 6 }: Props) {
  const nonFeatured = projects.filter(p => !p.featured)
  const [visible, setVisible] = useState(initialCount)
  const shown = nonFeatured.slice(0, visible)
  const remaining = nonFeatured.length - visible

  return (
    <section className="py-20 sm:py-24 bg-white">
      <div className="container-custom">
        <div className="text-center">
          <h2 className="section-title">Outros Empreendimentos</h2>
          <p className="section-subtitle">
            Todo o portfólio Teto &amp; Terra, com empreendimentos em diferentes fases e regiões da serra.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map(p => (
            <a
              key={p.id}
              href={`/empreendimentos/${p.slug}`}
              className="card block group"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-navy-800">
                <img
                  src={p.image}
                  alt={`Imagem do empreendimento ${p.name}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <StatusBadge status={p.status} />
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-xl font-bold text-navy-800 group-hover:text-brand-600 transition">
                  {p.name}
                </h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-navy-800/60">
                  <MapPin className="h-4 w-4" />
                  {p.location}
                </p>
                <p className="mt-3 text-sm text-navy-800/80 line-clamp-2">{p.description}</p>
                <div className="mt-4 text-sm font-semibold text-brand-600">
                  Ver Detalhes →
                </div>
              </div>
            </a>
          ))}
        </div>

        {remaining > 0 && (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => setVisible(v => v + 6)}
              className="btn-secondary"
            >
              Ver mais empreendimentos ({remaining} restantes)
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
