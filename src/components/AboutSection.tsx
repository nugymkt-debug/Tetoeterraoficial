import { Award, Shield, Gem, TrendingUp } from 'lucide-react'
import type { About } from '../types/content'

const ICONS = [Award, Shield, Gem, TrendingUp]

export default function AboutSection({ data }: { data: About }) {
  return (
    <section id="sobre" className="py-20 sm:py-28 bg-sand">
      <div className="container-custom grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="text-xs tracking-[0.3em] uppercase text-brand-600 font-semibold">
            Sobre nós
          </span>
          <h2 className="section-title mt-3">{data.title}</h2>
          <div className="mt-6 space-y-4 text-navy-800/80 text-base leading-relaxed">
            {data.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {data.pillars.map((pil, i) => {
              const Icon = ICONS[i % ICONS.length]
              return (
                <div
                  key={pil.title}
                  className="rounded-2xl bg-white p-5 shadow-soft flex items-start gap-3"
                >
                  <div className="rounded-full bg-brand-500/10 p-2 text-brand-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy-800">{pil.title}</h3>
                    <p className="text-sm text-navy-800/70">{pil.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="relative">
          <img
            src={data.image}
            alt="Paisagem da Serra de Petrópolis"
            className="w-full rounded-3xl shadow-soft object-cover aspect-[4/5]"
          />
          <div className="absolute -bottom-6 -left-6 hidden sm:block rounded-2xl bg-brand-500 p-6 text-white shadow-soft max-w-xs">
            <div className="font-serif text-4xl font-bold">17+</div>
            <div className="mt-1 text-sm opacity-90">empreendimentos ativos em Petrópolis e Região Serrana</div>
          </div>
        </div>
      </div>
    </section>
  )
}
