import { useMemo, useState } from 'react'
import { Search, MapPin, Bed, Bath, Maximize2 } from 'lucide-react'
import type { Listing } from '../types/content'

interface Props {
  id: string
  kind: 'aluguel' | 'venda'
  title: string
  description: string
  listings: Listing[]
  background?: 'cream' | 'sand'
}

export default function ListingsSection({
  id,
  kind,
  title,
  description,
  listings,
  background = 'cream',
}: Props) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return listings
    const q = query.trim().toLowerCase()
    return listings.filter(l =>
      [l.title, l.neighborhood, l.city].some(v => v.toLowerCase().includes(q))
    )
  }, [query, listings])

  const bg = background === 'sand' ? 'bg-sand' : 'bg-cream'

  return (
    <section id={id} className={`py-20 sm:py-24 ${bg}`}>
      <div className="container-custom">
        <div className="text-center">
          <span className="text-xs tracking-[0.3em] uppercase text-brand-600 font-semibold">
            {kind === 'aluguel' ? 'Locação' : 'Venda'}
          </span>
          <h2 className="section-title mt-3">{title}</h2>
          <p className="section-subtitle">{description}</p>
        </div>

        <form
          className="mx-auto mt-10 flex max-w-2xl gap-2"
          onSubmit={e => e.preventDefault()}
          role="search"
          aria-label={`Buscar ${kind}`}
        >
          <div className="relative flex-1">
            <MapPin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-800/40" />
            <input
              type="search"
              placeholder="Digite o bairro (ex: Itaipava, Araras, Nogueira)"
              className="h-12 w-full rounded-full border border-navy-800/10 bg-white pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-brand-500"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-secondary !px-6">
            <Search className="h-4 w-4" /> Buscar
          </button>
        </form>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(l => (
            <article key={l.id} className="card">
              <div className="relative aspect-[4/3] overflow-hidden bg-navy-800">
                <img
                  src={l.image}
                  alt={l.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />
                <div className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-navy-800">
                  {kind === 'aluguel' ? 'Para alugar' : 'À venda'}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-xl font-bold">{l.title}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-navy-800/60">
                  <MapPin className="h-4 w-4" /> {l.neighborhood}, {l.city}
                </p>
                <p className="mt-3 text-lg font-bold text-brand-700">{l.price}</p>
                <div className="mt-4 flex items-center gap-4 border-t border-navy-800/10 pt-4 text-sm text-navy-800/70">
                  {l.bedrooms > 0 && (
                    <span className="flex items-center gap-1.5"><Bed className="h-4 w-4" /> {l.bedrooms}</span>
                  )}
                  {l.bathrooms > 0 && (
                    <span className="flex items-center gap-1.5"><Bath className="h-4 w-4" /> {l.bathrooms}</span>
                  )}
                  <span className="flex items-center gap-1.5"><Maximize2 className="h-4 w-4" /> {l.area} m²</span>
                </div>
              </div>
            </article>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full text-center text-navy-800/60">
              Nenhum imóvel encontrado para "{query}". Tente outro bairro.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
