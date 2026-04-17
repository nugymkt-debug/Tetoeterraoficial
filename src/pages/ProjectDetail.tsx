import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, MessageCircle, Check } from 'lucide-react'
import { useSiteContent } from '../lib/content'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import StatusBadge from '../components/StatusBadge'
import WhatsAppFloat from '../components/WhatsAppFloat'

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [content] = useSiteContent()
  const project = content.projects.find(p => p.slug === slug)

  if (!project) {
    return (
      <>
        <Navbar projects={content.projects} />
        <main className="container-custom py-32 text-center">
          <h1 className="section-title">Empreendimento não encontrado</h1>
          <p className="mt-4 text-navy-800/70">O empreendimento que você procura pode ter sido movido.</p>
          <Link to="/" className="btn-primary mt-8 inline-flex">
            <ArrowLeft className="h-4 w-4" /> Voltar para a home
          </Link>
        </main>
        <Footer content={content} />
      </>
    )
  }

  return (
    <>
      <Navbar projects={content.projects} />
      <main>
        <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
          <img src={project.image} alt={project.name} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/40 to-navy-900/60" />
          <div className="container-custom relative h-full flex items-end pb-14">
            <div className="text-white">
              <StatusBadge status={project.status} />
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold mt-4">{project.name}</h1>
              <p className="mt-3 flex items-center gap-2 text-white/80">
                <MapPin className="h-5 w-5" /> {project.location}
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24 bg-cream">
          <div className="container-custom grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="font-serif text-3xl font-bold">Sobre o empreendimento</h2>
              <p className="mt-4 text-lg text-navy-800/80 leading-relaxed">{project.description}</p>

              {project.highlights && project.highlights.length > 0 && (
                <div className="mt-10">
                  <h3 className="font-serif text-2xl font-bold">Destaques</h3>
                  <ul className="mt-4 space-y-2">
                    {project.highlights.map(h => (
                      <li key={h} className="flex items-center gap-3 text-navy-800/85">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-500/15 text-brand-600">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <aside className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft h-fit sticky top-28">
              <h3 className="font-serif text-2xl font-bold">Interessado?</h3>
              <p className="mt-2 text-sm text-navy-800/70">
                Fale com um de nossos especialistas e agende uma visita exclusiva.
              </p>
              <a href={content.contact.whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-primary mt-5 w-full">
                <MessageCircle className="h-4 w-4" /> Falar no WhatsApp
              </a>
              <Link to="/#contato" className="btn-secondary mt-3 w-full">
                Preencher formulário
              </Link>
            </aside>
          </div>
        </section>
      </main>
      <Footer content={content} />
      <WhatsAppFloat href={content.contact.whatsappLink} />
    </>
  )
}
