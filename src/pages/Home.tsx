import { useSiteContent } from '../lib/content'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import FeaturedProjects from '../components/FeaturedProjects'
import ProjectsGrid from '../components/ProjectsGrid'
import ListingsSection from '../components/ListingsSection'
import AboutSection from '../components/AboutSection'
import InvestmentSection from '../components/InvestmentSection'
import ContactSection from '../components/ContactSection'
import Footer from '../components/Footer'
import WhatsAppFloat from '../components/WhatsAppFloat'

export default function Home() {
  const [content] = useSiteContent()

  return (
    <>
      <Navbar projects={content.projects} />
      <main>
        <Hero data={content.hero} />
        <FeaturedProjects projects={content.projects} />
        <ProjectsGrid projects={content.projects} />
        <ListingsSection
          id="alugar"
          kind="aluguel"
          title="Imóveis para Alugar"
          description="Encontre sua casa dos sonhos na serra. Imóveis selecionados com qualidade e conforto."
          listings={content.rentals}
          background="sand"
        />
        <ListingsSection
          id="comprar"
          kind="venda"
          title="Imóveis à Venda"
          description="Oportunidades únicas de investimento. Terrenos e casas prontas em localizações privilegiadas."
          listings={content.sales}
          background="cream"
        />
        <AboutSection data={content.about} />
        <InvestmentSection data={content.investment} />
        <ContactSection contact={content.contact} projects={content.projects} />
      </main>
      <Footer content={content} />
      <WhatsAppFloat href={content.contact.whatsappLink} />
    </>
  )
}
