import { Instagram, Mail, Phone, MapPin } from 'lucide-react'
import Logo from './Logo'
import type { SiteContent } from '../types/content'

export default function Footer({ content }: { content: SiteContent }) {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-navy-900 text-white/80">
      <div className="container-custom py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-white/60">
            {content.brand.tagline}
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Navegação</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#empreendimentos" className="hover:text-white">Empreendimentos</a></li>
            <li><a href="#alugar" className="hover:text-white">Alugar</a></li>
            <li><a href="#comprar" className="hover:text-white">Comprar</a></li>
            <li><a href="#sobre" className="hover:text-white">Sobre</a></li>
            <li><a href="#investir" className="hover:text-white">Investir</a></li>
            <li><a href="#contato" className="hover:text-white">Contato</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Fale com a gente</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0" />
              <a href={content.contact.whatsappLink} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                {content.contact.whatsapp}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0" />
              <a href={`mailto:${content.contact.email}`} className="hover:text-white">
                {content.contact.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{content.contact.address}</span>
            </li>
            {content.contact.instagram && (
              <li className="flex items-center gap-2">
                <Instagram className="h-4 w-4 shrink-0" />
                <a href={content.contact.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  @tetoeterrarealstate
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-custom flex flex-col sm:flex-row items-center justify-between gap-3 py-5 text-xs text-white/50">
          <p>© {year} Teto &amp; Terra Real Estate. Todos os direitos reservados.</p>
          <a href="/admin" className="hover:text-white">Painel administrativo</a>
        </div>
      </div>
    </footer>
  )
}
