import { useState } from 'react'
import { Mail, MapPin, Phone, Instagram, Loader2, CheckCircle2 } from 'lucide-react'
import type { Contact, Project } from '../types/content'

interface Props {
  contact: Contact
  projects: Project[]
}

type Status = 'idle' | 'submitting' | 'ok' | 'error'

export default function ContactSection({ contact, projects }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [form, setForm] = useState({
    name: '', email: '', phone: '', project: '', message: '',
  })

  const handleChange = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')

    // 1) Se tiver endpoint Formspree configurado, envia por lá
    if (contact.formspreeUrl) {
      try {
        const r = await fetch(contact.formspreeUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(form),
        })
        if (r.ok) { setStatus('ok'); return }
        setStatus('error')
      } catch {
        setStatus('error')
      }
      return
    }

    // 2) Fallback: abre WhatsApp com a mensagem pré-preenchida
    const msg =
`Olá, Teto & Terra! Gostaria de mais informações.

Nome: ${form.name}
E-mail: ${form.email}
Telefone: ${form.phone}
Empreendimento de interesse: ${form.project || 'Não especificado'}

${form.message}`
    const url = `${contact.whatsappLink}?text=${encodeURIComponent(msg)}`
    window.open(url, '_blank')
    setStatus('ok')
  }

  return (
    <section id="contato" className="py-20 sm:py-28 bg-navy-800 text-white">
      <div className="container-custom grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        {/* Formulário */}
        <div className="rounded-3xl bg-white p-6 sm:p-10 text-navy-800 shadow-soft">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold">Agende uma Visita</h2>
          <p className="mt-3 text-navy-800/70">
            Entre em contato com nossa equipe para agendar uma visita a qualquer um dos nossos
            empreendimentos ou receber informações detalhadas sobre oportunidades de investimento.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nome Completo" required>
                <input
                  required
                  type="text"
                  placeholder="Seu nome"
                  value={form.name}
                  onChange={handleChange('name')}
                  className="form-input"
                />
              </Field>
              <Field label="E-mail" required>
                <input
                  required
                  type="email"
                  placeholder="seu@email.com"
                  value={form.email}
                  onChange={handleChange('email')}
                  className="form-input"
                />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Telefone / WhatsApp" required>
                <input
                  required
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={form.phone}
                  onChange={handleChange('phone')}
                  className="form-input"
                />
              </Field>
              <Field label="Empreendimento de Interesse">
                <select
                  value={form.project}
                  onChange={handleChange('project')}
                  className="form-input"
                >
                  <option value="">Selecione um projeto</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Mensagem">
              <textarea
                rows={4}
                placeholder="Conte-nos mais sobre seu interesse..."
                value={form.message}
                onChange={handleChange('message')}
                className="form-input resize-y"
              />
            </Field>

            <button type="submit" disabled={status === 'submitting'} className="btn-secondary w-full">
              {status === 'submitting' && <Loader2 className="h-4 w-4 animate-spin" />}
              {status === 'ok'         && <CheckCircle2 className="h-4 w-4" />}
              {status === 'submitting' ? 'Enviando...' : status === 'ok' ? 'Mensagem enviada!' : 'Enviar Mensagem'}
            </button>

            {status === 'error' && (
              <p className="text-sm text-red-600">
                Erro ao enviar. Você pode falar direto pelo WhatsApp abaixo.
              </p>
            )}
          </form>
        </div>

        {/* Info */}
        <div className="text-white lg:pl-6">
          <h3 className="font-serif text-3xl font-bold">Teto &amp; Terra Real Estate</h3>
          <p className="mt-3 text-white/80 max-w-md">
            Especializada em empreendimentos exclusivos na Serra de Petrópolis.
            Atendimento personalizado de corretores locais.
          </p>

          <div className="mt-8 space-y-5">
            <InfoRow icon={<Phone className="h-5 w-5" />} label="WhatsApp" value={contact.whatsapp} href={contact.whatsappLink} />
            <InfoRow icon={<Mail  className="h-5 w-5" />} label="E-mail"   value={contact.email}    href={`mailto:${contact.email}`} />
            <InfoRow icon={<MapPin className="h-5 w-5" />} label="Localização" value={contact.address} />
            {contact.instagram && (
              <InfoRow icon={<Instagram className="h-5 w-5" />} label="Instagram" value="@tetoeterrarealstate" href={contact.instagram} />
            )}
          </div>
        </div>
      </div>

    </section>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-navy-800">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
    </label>
  )
}

function InfoRow({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  const content = (
    <div className="flex items-center gap-4">
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-500/20 text-brand-200">
        {icon}
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-white/60">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  )
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block transition hover:opacity-80">
      {content}
    </a>
  ) : content
}
