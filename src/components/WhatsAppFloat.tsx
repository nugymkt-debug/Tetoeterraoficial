import { MessageCircle } from 'lucide-react'

export default function WhatsAppFloat({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-6 right-6 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-soft transition hover:bg-emerald-600 hover:scale-105"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  )
}
