import { TrendingUp, KeyRound, ShieldCheck, MessageCircle } from 'lucide-react'
import type { Investment } from '../types/content'

const ICONS = [TrendingUp, KeyRound, ShieldCheck]

export default function InvestmentSection({ data }: { data: Investment }) {
  return (
    <section id="investir" className="py-20 sm:py-28 bg-cream">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs tracking-[0.3em] uppercase text-brand-600 font-semibold">
            Investimento
          </span>
          <h2 className="section-title mt-3">{data.title}</h2>
          <p className="section-subtitle">{data.intro}</p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {data.bullets.map((b, i) => {
            const Icon = ICONS[i % ICONS.length]
            return (
              <div key={b.title} className="rounded-3xl bg-white p-8 shadow-soft">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/10 text-brand-600">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-serif text-xl font-bold">{b.title}</h3>
                <p className="mt-3 text-sm text-navy-800/75 leading-relaxed">{b.description}</p>
              </div>
            )
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <a href={data.ctaHref} className="btn-primary">
            <MessageCircle className="h-4 w-4" />
            {data.ctaLabel}
          </a>
        </div>
      </div>
    </section>
  )
}
