import type { Hero as HeroType } from '../types/content'

interface HeroProps {
  data: HeroType
}

export default function Hero({ data }: HeroProps) {
  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex items-center justify-center overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${data.backgroundImage})` }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-navy-900/75 via-navy-900/55 to-navy-900/85"
      />

      <div className="relative container-custom text-center text-white py-32">
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight drop-shadow-lg">
          {data.title}
          <br />
          <span className="text-brand-200">{data.subtitle}</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
          {data.tagline}
        </p>
        <p className="mt-2 text-sm sm:text-base text-white/70">
          Teto &amp; Terra Real Estate · Especializada em Petrópolis e Região Serrana
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href={data.primaryCtaHref} className="btn-secondary w-full sm:w-auto">
            {data.primaryCtaLabel}
          </a>
          <a href={data.secondaryCtaHref} className="btn-primary w-full sm:w-auto">
            {data.secondaryCtaLabel}
          </a>
        </div>
      </div>

      {/* indicador de scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 text-xs tracking-[0.3em] uppercase animate-bounce">
        Role para descobrir
      </div>
    </section>
  )
}
