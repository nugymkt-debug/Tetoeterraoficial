interface LogoProps {
  className?: string
  variant?: 'light' | 'dark'
}

export default function Logo({ className = '', variant = 'light' }: LogoProps) {
  const stroke = variant === 'light' ? '#a8b995' : '#1f2b3c'
  const text   = variant === 'light' ? '#e6ebe0' : '#1f2b3c'

  return (
    <div className={`flex items-center gap-3 ${className}`} aria-label="Teto & Terra Real Estate">
      <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden="true">
        <path d="M6 32 L24 14 L42 32 Z" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinejoin="round"/>
        <path d="M12 36 L24 25 L36 36"   fill="none" stroke={stroke} strokeWidth="2.5" strokeLinejoin="round"/>
      </svg>
      <div className="leading-tight">
        <div className="font-serif text-lg font-bold tracking-wide" style={{ color: text }}>
          TETO &amp; TERRA
        </div>
        <div className="text-[10px] tracking-[0.3em]" style={{ color: text, opacity: 0.7 }}>
          REAL ESTATE
        </div>
      </div>
    </div>
  )
}
