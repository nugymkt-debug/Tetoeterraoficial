import type { ProjectStatus } from '../types/content'

const styles: Record<ProjectStatus, { bg: string; label: string }> = {
  lancamento:   { bg: 'bg-brand-500 text-white',       label: 'Lançamento' },
  em_obras:     { bg: 'bg-amber-500 text-white',       label: 'Em obras' },
  pronto:       { bg: 'bg-emerald-600 text-white',     label: 'Pronto para morar' },
  indisponivel: { bg: 'bg-navy-800/70 text-white',     label: 'Indisponível' },
}

export default function StatusBadge({ status }: { status: ProjectStatus }) {
  const s = styles[status]
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${s.bg}`}>
      {s.label}
    </span>
  )
}
