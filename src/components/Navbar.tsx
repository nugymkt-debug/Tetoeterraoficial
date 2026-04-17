import { useEffect, useState } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import Logo from './Logo'
import type { Project } from '../types/content'

interface NavbarProps {
  projects: Project[]
}

const links = [
  { href: '#alugar',   label: 'Alugar' },
  { href: '#comprar',  label: 'Comprar' },
  { href: '#sobre',    label: 'Sobre' },
  { href: '#investir', label: 'Investir' },
  { href: '#contato',  label: 'Contato' },
]

export default function Navbar({ projects }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [openMobile, setOpenMobile] = useState(false)
  const [openEmpreend, setOpenEmpreend] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-navy-800/95 backdrop-blur shadow-soft' : 'bg-gradient-to-b from-navy-900/70 to-transparent'
      }`}
    >
      <div className="container-custom flex items-center justify-between py-4">
        <a href="#" className="shrink-0" aria-label="Ir para o topo">
          <Logo />
        </a>

        {/* Desktop */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-white">
          <div
            className="relative"
            onMouseEnter={() => setOpenEmpreend(true)}
            onMouseLeave={() => setOpenEmpreend(false)}
          >
            <button
              className="flex items-center gap-1 hover:text-brand-300 transition"
              aria-haspopup="menu"
              aria-expanded={openEmpreend}
            >
              Empreendimentos
              <ChevronDown className="h-4 w-4" />
            </button>
            {openEmpreend && (
              <div
                role="menu"
                className="absolute left-0 top-full mt-2 w-72 rounded-xl bg-white text-navy-800 shadow-soft overflow-hidden"
              >
                <div className="max-h-96 overflow-y-auto py-2">
                  {projects.map(p => (
                    <a
                      key={p.id}
                      href={`/empreendimentos/${p.slug}`}
                      className="block px-4 py-2 text-sm hover:bg-brand-50 transition"
                      role="menuitem"
                    >
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-navy-800/60">{p.location}</div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          {links.map(l => (
            <a key={l.href} href={l.href} className="hover:text-brand-300 transition">
              {l.label}
            </a>
          ))}
        </nav>

        <a href="#contato" className="hidden lg:inline-flex btn-primary">
          Agendar Visita
        </a>

        <button
          className="lg:hidden text-white p-2 -mr-2"
          aria-label="Abrir menu"
          aria-expanded={openMobile}
          onClick={() => setOpenMobile(v => !v)}
        >
          {openMobile ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {openMobile && (
        <div className="lg:hidden bg-navy-800 border-t border-white/10">
          <nav className="container-custom py-4 flex flex-col gap-3 text-white">
            <details className="group">
              <summary className="flex cursor-pointer items-center justify-between py-2">
                <span>Empreendimentos</span>
                <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
              </summary>
              <div className="mt-1 flex flex-col gap-1 pl-2 max-h-60 overflow-y-auto">
                {projects.map(p => (
                  <a
                    key={p.id}
                    href={`/empreendimentos/${p.slug}`}
                    className="py-1.5 text-sm text-white/80 hover:text-brand-300"
                    onClick={() => setOpenMobile(false)}
                  >
                    {p.name}
                  </a>
                ))}
              </div>
            </details>
            {links.map(l => (
              <a
                key={l.href}
                href={l.href}
                className="py-2 border-b border-white/5 hover:text-brand-300"
                onClick={() => setOpenMobile(false)}
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contato"
              className="btn-primary mt-2 w-full"
              onClick={() => setOpenMobile(false)}
            >
              Agendar Visita
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
