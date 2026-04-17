import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Lock, LogOut, Home, Save, Download, Upload, RotateCcw,
  Trash2, Plus, Eye, EyeOff,
} from 'lucide-react'
import { login, isLoggedIn, logout } from '../lib/auth'
import { useSiteContent, clearPreview, hasPreview } from '../lib/content'
import type { SiteContent, Project, Listing } from '../types/content'
import { defaultContent } from '../data/defaultContent'

type Tab = 'brand' | 'hero' | 'projects' | 'rentals' | 'sales' | 'about' | 'investment' | 'contact' | 'backup'

const TABS: { key: Tab; label: string }[] = [
  { key: 'brand',      label: 'Marca' },
  { key: 'hero',       label: 'Topo (Hero)' },
  { key: 'projects',   label: 'Empreendimentos' },
  { key: 'rentals',    label: 'Aluguel' },
  { key: 'sales',      label: 'Venda' },
  { key: 'about',      label: 'Sobre' },
  { key: 'investment', label: 'Investir' },
  { key: 'contact',    label: 'Contato' },
  { key: 'backup',     label: 'Backup' },
]

export default function Admin() {
  const [authed, setAuthed] = useState(isLoggedIn())
  const [content, setContent] = useSiteContent()
  const [tab, setTab] = useState<Tab>('brand')
  const [savedAt, setSavedAt] = useState<string | null>(null)

  useEffect(() => {
    // focus do tab a partir da hash
    const h = window.location.hash.replace('#', '') as Tab
    if (TABS.find(t => t.key === h)) setTab(h)
  }, [])

  const update = (partial: Partial<SiteContent>) => {
    const next = { ...content, ...partial }
    setContent(next)
    setSavedAt(new Date().toLocaleTimeString('pt-BR'))
  }

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />

  return (
    <div className="min-h-screen bg-navy-50 flex flex-col">
      <header className="bg-navy-800 text-white">
        <div className="container-custom flex items-center justify-between py-4">
          <div>
            <h1 className="font-serif text-xl font-bold">Painel Teto &amp; Terra</h1>
            <p className="text-xs text-white/60">Edite o conteúdo do site em tempo real</p>
          </div>
          <div className="flex items-center gap-3">
            {savedAt && (
              <span className="text-xs text-brand-300 hidden sm:inline">
                Salvo às {savedAt}
              </span>
            )}
            <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm hover:bg-white/20">
              <Home className="h-4 w-4" /> Ver site
            </Link>
            <button
              onClick={() => { logout(); setAuthed(false) }}
              className="inline-flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-sm hover:bg-red-600"
            >
              <LogOut className="h-4 w-4" /> Sair
            </button>
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-navy-800/10">
        <div className="container-custom flex overflow-x-auto scrollbar-hide">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); window.location.hash = t.key }}
              className={`shrink-0 px-5 py-4 text-sm font-medium border-b-2 transition ${
                tab === t.key
                  ? 'border-brand-500 text-brand-700'
                  : 'border-transparent text-navy-800/60 hover:text-navy-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1">
        <div className="container-custom py-8">
          {tab === 'brand'      && <BrandTab      content={content} onChange={update} />}
          {tab === 'hero'       && <HeroTab       content={content} onChange={update} />}
          {tab === 'projects'   && <ProjectsTab   content={content} onChange={update} />}
          {tab === 'rentals'    && <ListingsTab   content={content} onChange={update} kind="rentals" />}
          {tab === 'sales'      && <ListingsTab   content={content} onChange={update} kind="sales" />}
          {tab === 'about'      && <AboutTab      content={content} onChange={update} />}
          {tab === 'investment' && <InvestmentTab content={content} onChange={update} />}
          {tab === 'contact'    && <ContactTab    content={content} onChange={update} />}
          {tab === 'backup'     && <BackupTab     content={content} onApply={(c) => setContent(c)} />}
        </div>
      </main>
    </div>
  )
}

/* ---------- Login ---------- */

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (login(password)) onLogin()
    else setError('Senha incorreta')
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-navy-800 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-soft">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/10 text-brand-600 mb-4">
          <Lock className="h-6 w-6" />
        </div>
        <h1 className="font-serif text-2xl font-bold">Acesso restrito</h1>
        <p className="mt-1 text-sm text-navy-800/60">Painel administrativo Teto &amp; Terra</p>

        <label className="mt-6 block text-sm font-medium">Senha</label>
        <div className="relative mt-1.5">
          <input
            type={show ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="form-input pr-11"
            autoFocus
            required
          />
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-800/50 hover:text-navy-800"
            aria-label="Mostrar senha"
          >
            {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        <button type="submit" className="btn-primary mt-5 w-full">Entrar</button>
        <p className="mt-4 text-xs text-navy-800/50">
          A senha padrão é <code>tetoeterra-2026</code> — troque em <code>src/lib/auth.ts</code> ou via variável <code>VITE_ADMIN_PASSWORD</code>.
        </p>
      </form>
    </main>
  )
}

/* ---------- Helpers ---------- */

type TabProps = { content: SiteContent; onChange: (partial: Partial<SiteContent>) => void }

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-navy-800">{label}</span>
      {children}
    </label>
  )
}

function Card({ title, children, actions }: { title: string; children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white shadow-soft">
      <header className="flex items-center justify-between border-b border-navy-800/10 px-6 py-4">
        <h2 className="font-serif text-xl font-bold">{title}</h2>
        <div>{actions}</div>
      </header>
      <div className="p-6 space-y-4">{children}</div>
    </section>
  )
}

/* ---------- Tabs ---------- */

function BrandTab({ content, onChange }: TabProps) {
  return (
    <Card title="Identidade da marca">
      <Field label="Nome">
        <input
          className="form-input"
          value={content.brand.name}
          onChange={e => onChange({ brand: { ...content.brand, name: e.target.value } })}
        />
      </Field>
      <Field label="Tagline / descrição curta">
        <input
          className="form-input"
          value={content.brand.tagline}
          onChange={e => onChange({ brand: { ...content.brand, tagline: e.target.value } })}
        />
      </Field>
    </Card>
  )
}

function HeroTab({ content, onChange }: TabProps) {
  const h = content.hero
  const set = (k: keyof typeof h, v: string) =>
    onChange({ hero: { ...h, [k]: v } })

  return (
    <Card title="Topo da home (Hero)">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Título principal">
          <input className="form-input" value={h.title} onChange={e => set('title', e.target.value)} />
        </Field>
        <Field label="Subtítulo">
          <input className="form-input" value={h.subtitle} onChange={e => set('subtitle', e.target.value)} />
        </Field>
      </div>
      <Field label="Tagline">
        <input className="form-input" value={h.tagline} onChange={e => set('tagline', e.target.value)} />
      </Field>
      <Field label="Imagem de fundo (URL)">
        <input className="form-input" value={h.backgroundImage} onChange={e => set('backgroundImage', e.target.value)} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Texto do botão primário"><input className="form-input" value={h.primaryCtaLabel} onChange={e => set('primaryCtaLabel', e.target.value)} /></Field>
        <Field label="Link do botão primário"><input className="form-input" value={h.primaryCtaHref} onChange={e => set('primaryCtaHref', e.target.value)} /></Field>
        <Field label="Texto do botão secundário"><input className="form-input" value={h.secondaryCtaLabel} onChange={e => set('secondaryCtaLabel', e.target.value)} /></Field>
        <Field label="Link do botão secundário"><input className="form-input" value={h.secondaryCtaHref} onChange={e => set('secondaryCtaHref', e.target.value)} /></Field>
      </div>
    </Card>
  )
}

function ProjectsTab({ content, onChange }: TabProps) {
  const update = (arr: Project[]) => onChange({ projects: arr })
  const addNew = () => {
    const id = Math.random().toString(36).slice(2)
    update([
      ...content.projects,
      {
        id, slug: `novo-${id}`, name: 'Novo empreendimento',
        location: 'Cidade', description: '', image: '',
        status: 'lancamento', featured: false, highlights: [],
      },
    ])
  }
  const remove = (id: string) => update(content.projects.filter(p => p.id !== id))
  const updateOne = (id: string, patch: Partial<Project>) =>
    update(content.projects.map(p => (p.id === id ? { ...p, ...patch } : p)))

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-navy-800/70">
          Total: <strong>{content.projects.length}</strong> · Destaques: <strong>{content.projects.filter(p => p.featured).length}</strong> (recomendado: 3)
        </p>
        <button onClick={addNew} className="btn-primary !py-2">
          <Plus className="h-4 w-4" /> Novo empreendimento
        </button>
      </div>

      {content.projects.map(p => (
        <Card
          key={p.id}
          title={p.name || '(sem nome)'}
          actions={
            <button onClick={() => remove(p.id)} className="text-red-500 hover:text-red-700" aria-label="Excluir">
              <Trash2 className="h-5 w-5" />
            </button>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nome"><input className="form-input" value={p.name} onChange={e => updateOne(p.id, { name: e.target.value })} /></Field>
            <Field label="Slug (URL)"><input className="form-input" value={p.slug} onChange={e => updateOne(p.id, { slug: e.target.value })} /></Field>
            <Field label="Localização"><input className="form-input" value={p.location} onChange={e => updateOne(p.id, { location: e.target.value })} /></Field>
            <Field label="Status">
              <select className="form-input" value={p.status} onChange={e => updateOne(p.id, { status: e.target.value as Project['status'] })}>
                <option value="lancamento">Lançamento</option>
                <option value="em_obras">Em obras</option>
                <option value="pronto">Pronto para morar</option>
                <option value="indisponivel">Indisponível</option>
              </select>
            </Field>
          </div>
          <Field label="Imagem (URL)">
            <input className="form-input" value={p.image} onChange={e => updateOne(p.id, { image: e.target.value })} />
          </Field>
          <Field label="Descrição">
            <textarea className="form-input" rows={3} value={p.description} onChange={e => updateOne(p.id, { description: e.target.value })} />
          </Field>
          <Field label="Destaques (um por linha)">
            <textarea
              className="form-input" rows={3}
              value={(p.highlights || []).join('\n')}
              onChange={e => updateOne(p.id, { highlights: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) })}
            />
          </Field>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={p.featured}
              onChange={e => updateOne(p.id, { featured: e.target.checked })}
            />
            Exibir em <strong>Destaques</strong> (home)
          </label>
        </Card>
      ))}
    </div>
  )
}

function ListingsTab({ content, onChange, kind }: TabProps & { kind: 'rentals' | 'sales' }) {
  const list = content[kind]
  const typeLabel = kind === 'rentals' ? 'Aluguel' : 'Venda'
  const update = (arr: Listing[]) => onChange({ [kind]: arr } as Partial<SiteContent>)
  const addNew = () => {
    update([
      ...list,
      {
        id: Math.random().toString(36).slice(2),
        type: kind === 'rentals' ? 'aluguel' : 'venda',
        title: 'Novo imóvel',
        neighborhood: '', city: 'Petrópolis',
        price: 'R$ 0', bedrooms: 0, bathrooms: 0, area: 0, image: '',
      },
    ])
  }
  const remove = (id: string) => update(list.filter(l => l.id !== id))
  const updateOne = (id: string, patch: Partial<Listing>) =>
    update(list.map(l => (l.id === id ? { ...l, ...patch } : l)))

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-navy-800/70">Total de imóveis para <strong>{typeLabel}</strong>: {list.length}</p>
        <button onClick={addNew} className="btn-primary !py-2">
          <Plus className="h-4 w-4" /> Novo imóvel
        </button>
      </div>
      {list.map(l => (
        <Card
          key={l.id}
          title={l.title || '(sem título)'}
          actions={
            <button onClick={() => remove(l.id)} className="text-red-500 hover:text-red-700" aria-label="Excluir">
              <Trash2 className="h-5 w-5" />
            </button>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Título"><input className="form-input" value={l.title} onChange={e => updateOne(l.id, { title: e.target.value })} /></Field>
            <Field label="Preço"><input className="form-input" value={l.price} onChange={e => updateOne(l.id, { price: e.target.value })} /></Field>
            <Field label="Bairro"><input className="form-input" value={l.neighborhood} onChange={e => updateOne(l.id, { neighborhood: e.target.value })} /></Field>
            <Field label="Cidade"><input className="form-input" value={l.city} onChange={e => updateOne(l.id, { city: e.target.value })} /></Field>
            <Field label="Quartos"><input type="number" min={0} className="form-input" value={l.bedrooms} onChange={e => updateOne(l.id, { bedrooms: Number(e.target.value) })} /></Field>
            <Field label="Banheiros"><input type="number" min={0} className="form-input" value={l.bathrooms} onChange={e => updateOne(l.id, { bathrooms: Number(e.target.value) })} /></Field>
            <Field label="Área (m²)"><input type="number" min={0} className="form-input" value={l.area} onChange={e => updateOne(l.id, { area: Number(e.target.value) })} /></Field>
            <Field label="Imagem (URL)"><input className="form-input" value={l.image} onChange={e => updateOne(l.id, { image: e.target.value })} /></Field>
          </div>
        </Card>
      ))}
    </div>
  )
}

function AboutTab({ content, onChange }: TabProps) {
  const a = content.about
  const set = (patch: Partial<typeof a>) => onChange({ about: { ...a, ...patch } })

  return (
    <div className="space-y-4">
      <Card title="Sobre a empresa">
        <Field label="Título"><input className="form-input" value={a.title} onChange={e => set({ title: e.target.value })} /></Field>
        <Field label="Parágrafos (um por bloco, separados por linha em branco)">
          <textarea
            rows={6}
            className="form-input"
            value={a.paragraphs.join('\n\n')}
            onChange={e => set({ paragraphs: e.target.value.split(/\n\s*\n/).map(s => s.trim()).filter(Boolean) })}
          />
        </Field>
        <Field label="Imagem (URL)">
          <input className="form-input" value={a.image} onChange={e => set({ image: e.target.value })} />
        </Field>
      </Card>

      <Card title="Pilares (4 cards)">
        {a.pillars.map((pil, i) => (
          <div key={i} className="grid gap-3 sm:grid-cols-2">
            <Field label={`Título ${i + 1}`}>
              <input
                className="form-input" value={pil.title}
                onChange={e => set({
                  pillars: a.pillars.map((p, idx) => idx === i ? { ...p, title: e.target.value } : p)
                })}
              />
            </Field>
            <Field label="Descrição">
              <input
                className="form-input" value={pil.description}
                onChange={e => set({
                  pillars: a.pillars.map((p, idx) => idx === i ? { ...p, description: e.target.value } : p)
                })}
              />
            </Field>
          </div>
        ))}
      </Card>
    </div>
  )
}

function InvestmentTab({ content, onChange }: TabProps) {
  const i = content.investment
  const set = (patch: Partial<typeof i>) => onChange({ investment: { ...i, ...patch } })

  return (
    <div className="space-y-4">
      <Card title="Investimento — cabeçalho">
        <Field label="Título"><input className="form-input" value={i.title} onChange={e => set({ title: e.target.value })} /></Field>
        <Field label="Introdução"><textarea rows={3} className="form-input" value={i.intro} onChange={e => set({ intro: e.target.value })} /></Field>
        <Field label="Imagem (URL)"><input className="form-input" value={i.image} onChange={e => set({ image: e.target.value })} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Texto do botão"><input className="form-input" value={i.ctaLabel} onChange={e => set({ ctaLabel: e.target.value })} /></Field>
          <Field label="Link do botão"><input className="form-input" value={i.ctaHref} onChange={e => set({ ctaHref: e.target.value })} /></Field>
        </div>
      </Card>
      <Card title="Pilares (3 cards)">
        {i.bullets.map((b, idx) => (
          <div key={idx} className="space-y-2 border border-navy-800/10 rounded-xl p-4">
            <Field label={`Título ${idx + 1}`}>
              <input
                className="form-input" value={b.title}
                onChange={e => set({
                  bullets: i.bullets.map((x, j) => j === idx ? { ...x, title: e.target.value } : x)
                })}
              />
            </Field>
            <Field label="Descrição">
              <textarea
                rows={2} className="form-input" value={b.description}
                onChange={e => set({
                  bullets: i.bullets.map((x, j) => j === idx ? { ...x, description: e.target.value } : x)
                })}
              />
            </Field>
          </div>
        ))}
      </Card>
    </div>
  )
}

function ContactTab({ content, onChange }: TabProps) {
  const c = content.contact
  const set = (patch: Partial<typeof c>) => onChange({ contact: { ...c, ...patch } })
  return (
    <Card title="Contato">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="WhatsApp (exibido)"><input className="form-input" placeholder="(24) 99999-9999" value={c.whatsapp} onChange={e => set({ whatsapp: e.target.value })} /></Field>
        <Field label="Link do WhatsApp (wa.me/55...)">
          <input className="form-input" placeholder="https://wa.me/5524999999999" value={c.whatsappLink} onChange={e => set({ whatsappLink: e.target.value })} />
        </Field>
        <Field label="E-mail"><input className="form-input" type="email" value={c.email} onChange={e => set({ email: e.target.value })} /></Field>
        <Field label="Endereço / região"><input className="form-input" value={c.address} onChange={e => set({ address: e.target.value })} /></Field>
        <Field label="Instagram (URL)"><input className="form-input" value={c.instagram || ''} onChange={e => set({ instagram: e.target.value })} /></Field>
        <Field label="Formspree endpoint (opcional)"><input className="form-input" placeholder="https://formspree.io/f/xxxx" value={c.formspreeUrl || ''} onChange={e => set({ formspreeUrl: e.target.value })} /></Field>
      </div>
      <p className="text-xs text-navy-800/60">
        Se o endpoint Formspree estiver vazio, o formulário abre o WhatsApp com a mensagem pré-preenchida.
      </p>
    </Card>
  )
}

function BackupTab({ content, onApply }: { content: SiteContent; onApply: (c: SiteContent) => void }) {
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `teto-e-terra-content-${new Date().toISOString().slice(0,10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }
  const importJSON = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    try {
      const parsed = JSON.parse(text) as SiteContent
      onApply(parsed)
      alert('Conteúdo importado com sucesso.')
    } catch {
      alert('Arquivo inválido.')
    }
  }
  const discardPreview = () => {
    if (confirm('Isso vai descartar suas edições em preview local e voltar ao content.json do site. Continuar?')) {
      clearPreview()
      onApply(defaultContent)
      window.location.reload()
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(content, null, 2))
      alert('JSON copiado! Cole no arquivo public/content.json do seu repositório.')
    } catch {
      alert('Não foi possível copiar. Use o botão "Baixar content.json".')
    }
  }

  const previewActive = hasPreview()

  return (
    <div className="space-y-4">
      <Card title="Publicar alterações (via GitHub)">
        <div className="rounded-xl bg-brand-50 border border-brand-200 p-4 text-sm text-brand-900">
          <p className="font-semibold mb-1">Como funciona a publicação</p>
          <ol className="list-decimal list-inside space-y-1 text-brand-900/85">
            <li>Edite livremente nas abas acima — tudo fica em <strong>preview no seu browser</strong>.</li>
            <li>Quando estiver pronta, clique em <strong>Baixar content.json</strong> abaixo.</li>
            <li>No GitHub, abra o arquivo <code>public/content.json</code>, clique no lápis ✏️ e substitua o conteúdo pelo JSON baixado (ou faça upload do arquivo).</li>
            <li>Commit. O site redeploya sozinho em ~1 minuto.</li>
          </ol>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button onClick={exportJSON} className="btn-primary">
            <Download className="h-4 w-4" /> Baixar content.json
          </button>
          <button onClick={copyToClipboard} className="btn-secondary">
            <Upload className="h-4 w-4 rotate-180" /> Copiar JSON
          </button>
          <label className="inline-flex items-center gap-2 rounded-full border border-navy-800/20 px-5 py-2 text-sm font-semibold cursor-pointer hover:bg-navy-50">
            <Upload className="h-4 w-4" /> Importar JSON existente
            <input type="file" accept="application/json" className="hidden" onChange={importJSON} />
          </label>
        </div>

        {previewActive && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900 flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold">Você tem alterações em preview local</p>
              <p className="text-amber-900/80">
                Elas só aparecem para você até serem commitadas no GitHub.
              </p>
            </div>
            <button onClick={discardPreview} className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-white text-amber-700 px-4 py-2 text-sm font-semibold hover:bg-amber-100 shrink-0">
              <RotateCcw className="h-4 w-4" /> Descartar preview
            </button>
          </div>
        )}
      </Card>

      <Card title="JSON atual (clique para ver)">
        <details>
          <summary className="cursor-pointer text-sm font-medium text-navy-800">
            Abrir preview do JSON (útil para copiar trechos específicos)
          </summary>
          <pre className="mt-3 max-h-96 overflow-auto rounded-xl bg-navy-900 p-4 text-xs text-green-300">
{JSON.stringify(content, null, 2)}
          </pre>
        </details>
      </Card>
    </div>
  )
}

// botão save visual só pra feedback (já salva automaticamente ao editar)
export function FloatingSave() {
  return (
    <div className="fixed bottom-6 right-6 rounded-full bg-brand-500 px-5 py-3 text-white shadow-soft">
      <Save className="h-4 w-4 inline-block mr-2" />
      Alterações salvas automaticamente
    </div>
  )
}
